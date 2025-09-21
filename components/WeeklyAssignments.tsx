import React, { useState, useMemo } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { MOCK_ASSIGNMENT_WEEKS, MOCK_REWARDS } from '../constants';
import { Assignment, AssignmentStatus, SubmissionType } from '../types';
import { ChevronDownIcon, UploadIcon, XIcon, CheckmarkIcon, GiftIcon, LockIcon } from './Icons';

// --- Submission Modal ---
const SubmissionModal: React.FC<{
    assignment: Assignment;
    onClose: () => void;
    onSubmit: (submission: any, imageName?: string) => void;
}> = ({ assignment, onClose, onSubmit }) => {
    const { t } = useI18n();
    const [textSubmission, setTextSubmission] = useState('');
    const [fileSubmission, setFileSubmission] = useState<File | null>(null);

    const handleSubmit = () => {
        if (assignment.submissionType === 'text') {
            onSubmit(textSubmission);
        } else if (fileSubmission) {
            onSubmit(fileSubmission, fileSubmission.name);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('submission_modal_title' as any)}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{t(assignment.titleKey as any)}</p>

                {assignment.submissionType === 'text' ? (
                    <div>
                        <label htmlFor="text-submission" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('or_enter_text' as any)}</label>
                        <textarea
                            id="text-submission"
                            rows={5}
                            value={textSubmission}
                            onChange={(e) => setTextSubmission(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                ) : (
                    <div>
                         <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            <UploadIcon className="w-10 h-10 text-gray-500" />
                            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{fileSubmission ? fileSubmission.name : t('upload_file' as any)}</span>
                            <input type="file" accept="image/*,video/*" onChange={(e) => e.target.files && setFileSubmission(e.target.files[0])} className="hidden" />
                        </label>
                    </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 btn-subtle-interactive">{t('cancel')}</button>
                    <button onClick={handleSubmit} disabled={assignment.submissionType === 'text' ? !textSubmission.trim() : !fileSubmission} className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 btn-hover">{t('submit_proof' as any)}</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Assignments Component ---
const WeeklyAssignments: React.FC = () => {
    const { t } = useI18n();
    const { assignmentProgress, submitAssignment } = useAuth();
    const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);

    const allAssignments = useMemo(() => MOCK_ASSIGNMENT_WEEKS.flatMap(w => w.assignments), []);
    
    const unlockedWeeks = useMemo(() => {
        const unlocked = new Set<number>([1]); // Week 1 is always unlocked
        for (const week of MOCK_ASSIGNMENT_WEEKS) {
            if (week.weekNumber > 1) {
                const prevWeek = MOCK_ASSIGNMENT_WEEKS.find(w => w.weekNumber === week.weekNumber - 1);
                if (prevWeek) {
                    const allPrevAssignments = prevWeek.assignments;
                    const allPrevCompleted = allPrevAssignments.every(a => {
                        const progress = assignmentProgress[a.id];
                        return progress?.status === AssignmentStatus.APPROVED;
                    });
                    if (allPrevCompleted) {
                        unlocked.add(week.weekNumber);
                    }
                }
            }
        }
        return unlocked;
    }, [assignmentProgress]);

    const firstIncompleteWeek = useMemo(() => {
        return MOCK_ASSIGNMENT_WEEKS.find(week => {
            return unlockedWeeks.has(week.weekNumber) && week.assignments.some(a => assignmentProgress[a.id]?.status !== AssignmentStatus.APPROVED);
        })?.weekNumber || 0;
    }, [unlockedWeeks, assignmentProgress]);
    
    const [openWeek, setOpenWeek] = useState(firstIncompleteWeek);

    const completedCount = useMemo(() => Object.values(assignmentProgress).filter(p => p.status === AssignmentStatus.APPROVED).length, [assignmentProgress]);
    const progressPercentage = (completedCount / allAssignments.length) * 100;

    const getStatusInfo = (status: AssignmentStatus) => {
        switch(status) {
            case AssignmentStatus.SUBMITTED:
                return { textKey: 'submission_pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
            case AssignmentStatus.APPROVED:
                return { textKey: 'submission_approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
            case AssignmentStatus.REJECTED:
                return { textKey: 'resubmit', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
            default:
                return { textKey: 'submission_not_started', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
        }
    };

    return (
        <div className="space-y-8">
             {submittingAssignment && (
                <SubmissionModal 
                    assignment={submittingAssignment}
                    onClose={() => setSubmittingAssignment(null)}
                    onSubmit={(submission, imageName) => submitAssignment(submittingAssignment.id, submission, imageName)}
                />
            )}

            {/* Progress & Rewards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('assignment_progress' as any)}</h2>
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        <span>{t('assignments_completed' as any)}</span>
                        <span>{completedCount} / {allAssignments.length}</span>
                    </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full text-center text-white text-xs font-bold transition-all duration-500" style={{ width: `${progressPercentage}%` }}>
                           {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
                        </div>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('rewards_unlocked' as any)}</h2>
                     <div className="flex items-center justify-around">
                        {MOCK_REWARDS.map(reward => (
                            <div key={reward.milestone} className="group relative flex flex-col items-center text-center">
                                <div className={`text-4xl transition-transform duration-300 ${completedCount >= reward.milestone ? 'grayscale-0' : 'grayscale'}`}>{reward.emoji}</div>
                                <p className={`text-xs mt-1 ${completedCount >= reward.milestone ? 'text-gray-700 dark:text-gray-300 font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>{t(reward.nameKey as any)}</p>
                                {completedCount < reward.milestone && (
                                    <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('complete_to_unlock' as any).replace('{milestone}', reward.milestone.toString())}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Accordion */}
            <div className="space-y-4">
                {MOCK_ASSIGNMENT_WEEKS.map(week => {
                    const isUnlocked = unlockedWeeks.has(week.weekNumber);
                    const isOpen = openWeek === week.weekNumber;
                    return (
                        <div key={week.weekNumber} className="relative group">
                            <div className={`border dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all ${!isUnlocked ? 'grayscale opacity-70' : ''}`}>
                                <button
                                    className={`w-full p-4 text-left flex justify-between items-center list-item-interactive ${isUnlocked ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer' : 'cursor-not-allowed'}`}
                                    onClick={() => isUnlocked && setOpenWeek(isOpen ? 0 : week.weekNumber)}
                                    disabled={!isUnlocked}
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{week.themeEmoji}</span>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('week' as any)} {week.weekNumber}</p>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t(week.titleKey as any)}</h3>
                                        </div>
                                    </div>
                                    {isUnlocked ? (
                                        <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    ) : (
                                        <LockIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                    )}
                                </button>
                                {isOpen && isUnlocked && (
                                    <div className="p-4 border-t dark:border-gray-700 space-y-4">
                                        {week.assignments.map(assignment => {
                                            const progress = assignmentProgress[assignment.id];
                                            const status = progress?.status || AssignmentStatus.NOT_STARTED;
                                            const statusInfo = getStatusInfo(status);
                                            const isActionable = status === AssignmentStatus.NOT_STARTED || status === AssignmentStatus.REJECTED;

                                            return (
                                                <div key={assignment.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-bold text-gray-800 dark:text-gray-200">{t(assignment.titleKey as any)}</h4>
                                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.color}`}>{t(statusInfo.textKey as any)}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t(assignment.descriptionKey as any)}</p>
                                                        </div>
                                                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                                            <p className="font-bold text-yellow-500 text-lg">+{assignment.points} {t('points')}</p>
                                                            <button 
                                                                onClick={() => isActionable && setSubmittingAssignment(assignment)}
                                                                disabled={!isActionable}
                                                                className="px-3 py-1.5 text-sm font-semibold text-white bg-brand-primary rounded-md disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-1.5 btn-hover"
                                                            >
                                                            {status === AssignmentStatus.APPROVED ? <><CheckmarkIcon className="w-4 h-4" /> {t('completed')}</> : (status === AssignmentStatus.REJECTED ? t('resubmit') : t('submit_proof' as any))}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                             {!isUnlocked && (
                                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 w-max p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {t('unlock_week_tooltip').replace('{weekNumber}', (week.weekNumber - 1).toString())}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyAssignments;
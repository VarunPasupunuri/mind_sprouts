import React, { useState, useEffect, useRef } from 'react';
import { Challenge, ChallengeCategory } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { BellIcon, XIcon, InfoIcon, CheckmarkIcon, UploadIcon, CameraIcon } from './Icons';

interface Reminder {
    time: Date;
}

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T) {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

const ChallengeCard: React.FC<{ 
    challenge: Challenge;
    reminder: Reminder | undefined;
    onSetReminderClick: () => void;
    onCancelReminder: () => void;
    onAccept: () => void;
}> = ({ challenge, reminder, onSetReminderClick, onCancelReminder, onAccept }) => {
    const { t } = useI18n();
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCompleted = usePrevious(challenge.completed);

    useEffect(() => {
        if (challenge.completed && !prevCompleted) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 1200); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [challenge.completed, prevCompleted]);

    return (
        <div className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-l-4 ${challenge.completed ? 'border-green-500' : 'border-green-300'} flex flex-col ${isAnimating ? 'animate-card-complete' : ''}`}>
            {challenge.completed && (
                <div className={`absolute inset-0 bg-green-500/80 flex items-center justify-center z-10 ${!isAnimating ? 'opacity-100' : 'animate-fade-in'}`}>
                    <CheckmarkIcon className={`w-20 h-20 text-white ${isAnimating ? 'animate-checkmark-draw' : ''}`} />
                </div>
            )}
            <div className={`${challenge.completed ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`}>{t(`category_${challenge.category}` as any)}</span>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-500">{challenge.points}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('points').toUpperCase()}</p>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-3">{t(challenge.titleKey as any)}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-4 flex-grow">{t(challenge.descriptionKey as any)}</p>
                
                {reminder && (
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
                        {t('reminder_set_for').replace('{time}', reminder.time.toLocaleTimeString())}
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    {challenge.completed ? (
                        <button disabled className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                            {t('completed')}
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={onAccept}
                                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">
                                {t('accept_challenge')}
                            </button>
                            <button 
                                onClick={reminder ? onCancelReminder : onSetReminderClick}
                                title={reminder ? t('remove_reminder') : t('set_reminder')}
                                className={`p-2 rounded-lg transition-colors ${reminder ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}
                            >
                                <BellIcon className="w-5 h-5"/>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


const ReminderModal: React.FC<{
    challenge: Challenge;
    onClose: () => void;
    onSetReminder: (timeInMs: number) => void;
}> = ({ challenge, onClose, onSetReminder }) => {
    const { t } = useI18n();
    const options = [
        { label: t('one_hour'), ms: 60 * 60 * 1000 },
        { label: t('two_hours'), ms: 2 * 60 * 60 * 1000 },
        { label: t('tomorrow'), ms: 24 * 60 * 60 * 1000 },
    ];
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-green-200 dark:border-green-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('set_reminder')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{t(challenge.titleKey as any)}</p>
                <div className="space-y-3">
                    {options.map(opt => (
                        <button 
                            key={opt.label}
                            onClick={() => onSetReminder(opt.ms)}
                            className="w-full p-3 text-left bg-gray-100 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-green-900/50 rounded-lg"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                 <button onClick={onClose} className="mt-4 w-full text-center text-gray-600 dark:text-gray-400 font-medium py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
            </div>
        </div>
    )
}

const NotificationToast: React.FC<{
    notification: { title: string; message: string };
    onClose: () => void;
}> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 bg-white dark:bg-gray-700 shadow-2xl rounded-xl p-4 w-full max-w-sm z-50 border-l-4 border-green-500">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <InfoIcon className="w-6 h-6 text-green-500" />
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onClose} className="rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

const ProofSubmissionModal: React.FC<{
    challenge: Challenge;
    onClose: () => void;
    onSubmit: (challengeId: number) => void;
}> = ({ challenge, onClose, onSubmit }) => {
    const { t } = useI18n();
    const [view, setView] = useState<'choice' | 'upload' | 'scan'>('choice');
    
    // Upload state
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scan state
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        stopCamera();
        setCameraError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.error("Camera error:", err);
            setCameraError(t('camera_permission_denied'));
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            setCapturedImage(canvas.toDataURL('image/jpeg'));
            stopCamera();
        }
    };
    
    useEffect(() => {
        if (view === 'scan' && !capturedImage) {
            startCamera();
        } else {
            stopCamera();
        }
        // Cleanup on unmount
        return () => stopCamera();
    }, [view, capturedImage]);

    const renderContent = () => {
        switch (view) {
            case 'scan':
                return (
                    <div className="space-y-4 text-center">
                        {cameraError && <p className="text-red-500">{cameraError}</p>}
                        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured proof" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                    {!stream && !cameraError && <p>{t('starting_camera')}</p>}
                                </>
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                        <div className="flex justify-center gap-4">
                            {capturedImage ? (
                                <>
                                    <button onClick={() => setCapturedImage(null)} className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg">{t('retake')}</button>
                                    <button onClick={() => onSubmit(challenge.id)} className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">{t('submit_and_complete')}</button>
                                </>
                            ) : (
                                <button onClick={handleCapture} disabled={!stream} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-gray-500">{t('capture')}</button>
                            )}
                        </div>
                    </div>
                );
            case 'upload':
                return (
                    <div className="space-y-4 text-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed dark:border-gray-600 cursor-pointer"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Proof preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                                    <UploadIcon className="w-10 h-10" />
                                    <p>{t('click_to_upload')}</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => onSubmit(challenge.id)} disabled={!imagePreview} className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg disabled:bg-gray-500">{t('submit_and_complete')}</button>
                    </div>
                );
            case 'choice':
            default:
                return (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setView('upload')} className="flex-1 flex flex-col items-center justify-center gap-2 p-8 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40">
                            <UploadIcon className="w-10 h-10" />
                            <span className="font-semibold">{t('upload_photo')}</span>
                        </button>
                        <button onClick={() => setView('scan')} className="flex-1 flex flex-col items-center justify-center gap-2 p-8 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40">
                            <CameraIcon className="w-10 h-10" />
                            <span className="font-semibold">{t('scan_photo')}</span>
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-green-200 dark:border-green-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('submit_proof_for').replace('{challengeTitle}', t(challenge.titleKey as any))}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 mb-6">{t(challenge.descriptionKey as any)}</p>
                {renderContent()}
                <button onClick={onClose} className="mt-4 w-full text-center text-gray-600 dark:text-gray-400 font-medium py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
            </div>
        </div>
    )
};

const TasksAndChallenges: React.FC = () => {
    const { t } = useI18n();
    const { challenges, completeChallenge } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
    const [reminders, setReminders] = useState<Record<number, Reminder>>({});
    const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);
    const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);
    const [submittingChallenge, setSubmittingChallenge] = useState<Challenge | null>(null);

    const timeoutIds = useRef<Record<number, NodeJS.Timeout>>({});

    // Effect for cleaning up timeouts when the component unmounts
    useEffect(() => {
        // The returned function is the cleanup function
        return () => {
            Object.values(timeoutIds.current).forEach(clearTimeout);
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    const categories = ['all', ...Object.values(ChallengeCategory)];
    const filteredChallenges = selectedCategory === 'all'
        ? challenges
        : challenges.filter(c => c.category === selectedCategory);
        
    const showNotification = (challengeTitleKey: string) => {
        setNotification({
            title: t('reminder_toast_title'),
            message: t('reminder_toast_message').replace('{challengeTitle}', t(challengeTitleKey as any))
        });
    };
    
    const handleCancelReminder = (challengeId: number) => {
        const timeoutId = timeoutIds.current[challengeId];
        if (timeoutId) {
            clearTimeout(timeoutId);
            delete timeoutIds.current[challengeId];
        }
        setReminders(prev => {
            const newReminders = { ...prev };
            delete newReminders[challengeId];
            return newReminders;
        });
    };

    const handleSetReminder = (timeInMs: number) => {
        if (!modalChallenge) return;
        
        // Always clear any existing reminder before setting a new one
        handleCancelReminder(modalChallenge.id);

        const reminderTime = new Date(Date.now() + timeInMs);
        const timeoutId = setTimeout(() => {
            showNotification(modalChallenge.titleKey);
            handleCancelReminder(modalChallenge.id); // Remove reminder after it fires
        }, timeInMs);
        
        timeoutIds.current[modalChallenge.id] = timeoutId;
        
        setReminders(prev => ({
            ...prev,
            [modalChallenge.id]: { time: reminderTime }
        }));
        
        setModalChallenge(null);
    };
    
    const handleProofSubmit = (challengeId: number) => {
        completeChallenge(challengeId);
        setSubmittingChallenge(null);
    };


    return (
        <>
            <style>{`
                @keyframes cardComplete {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .animate-card-complete {
                    animation: cardComplete 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes checkmarkDraw {
                    0% { stroke-dasharray: 50; stroke-dashoffset: 50; }
                    100% { stroke-dasharray: 50; stroke-dashoffset: 0; }
                }
                .animate-checkmark-draw {
                    animation: checkmarkDraw 0.5s ease-out 0.3s forwards;
                    stroke-dashoffset: 50;
                }
            `}</style>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('tasks_and_challenges')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('tasks_and_challenges_subtitle')}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category.toString()}
                            onClick={() => setSelectedCategory(category as ChallengeCategory | 'all')}
                            className={`px-4 py-2 text-sm font-medium rounded-full ${
                                selectedCategory === category
                                    ? 'bg-green-600 text-white shadow'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {category === 'all' ? t('all') : t(`category_${category}` as any)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChallenges.map(challenge => (
                        <ChallengeCard 
                            key={challenge.id} 
                            challenge={challenge} 
                            reminder={reminders[challenge.id]}
                            onSetReminderClick={() => setModalChallenge(challenge)}
                            onCancelReminder={() => handleCancelReminder(challenge.id)}
                            onAccept={() => setSubmittingChallenge(challenge)}
                        />
                    ))}
                </div>
            </div>

            {modalChallenge && (
                <ReminderModal 
                    challenge={modalChallenge} 
                    onClose={() => setModalChallenge(null)}
                    onSetReminder={handleSetReminder}
                />
            )}
            
            {notification && (
                <NotificationToast 
                    notification={notification}
                    onClose={() => setNotification(null)}
                />
            )}

            {submittingChallenge && (
                <ProofSubmissionModal
                    challenge={submittingChallenge}
                    onClose={() => setSubmittingChallenge(null)}
                    onSubmit={handleProofSubmit}
                />
            )}
        </>
    );
};

export default TasksAndChallenges;
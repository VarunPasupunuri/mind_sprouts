import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { MOCK_LEARN_TOPICS } from '../constants';
import { LearnTopic, QuizQuestion } from '../types';
import WeeklyAssignments from './WeeklyAssignments';
import { 
    XIcon, 
    ClimateChangeIcon, 
    CircularEconomyIcon, 
    SustainableAgricultureIcon, 
    VideoIcon, 
    InfographicIcon, 
    QuizIcon, 
    CheckmarkIcon,
    ChevronDownIcon,
    WaterConservationIcon,
    BiodiversityIcon,
    RenewableEnergyIcon,
    ArticleIcon,
    EbookIcon,
    CaseStudyIcon
} from './Icons';
import { LearnContent, LearnLevel } from '../types';


// --- Video Player Modal Component ---
interface VideoPlayerModalProps {
    url: string;
    onClose: () => void;
}
const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ url, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300" aria-label="Close video">
                    <XIcon className="w-8 h-8" />
                </button>
                <iframe
                    className="w-full h-full rounded-lg"
                    src={url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

// --- Infographic Modal Component ---
interface InfographicModalProps {
    title: string;
    imageUrl?: string;
    onClose: () => void;
}
const InfographicModal: React.FC<InfographicModalProps> = ({ title, imageUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close infographic">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-4 max-h-[75vh] overflow-y-auto">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-auto rounded-md" />
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                            <p>Image not available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Text Content Modal Component ---
interface TextContentModalProps {
    content: LearnContent;
    onClose: () => void;
}
const TextContentModal: React.FC<TextContentModalProps> = ({ content, onClose }) => {
    const { t } = useI18n();
    const isEbook = content.type === 'ebook';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t(content.titleKey as any)}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close content">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 text-gray-700 dark:text-gray-300 overflow-y-auto flex-grow prose dark:prose-invert">
                    <p className="whitespace-pre-wrap">{t(content.contentKey as any)}</p>
                </div>
                {isEbook && (
                    <div className="p-4 border-t dark:border-gray-700 text-right flex-shrink-0">
                        <button 
                            onClick={() => alert('Download started... (This is a demo feature)')}
                            className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                            Download PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Learn Quiz Modal Component ---
interface LearnQuizModalProps {
    quizContent: LearnContent;
    onClose: () => void;
    onComplete: () => void;
}
const LearnQuizModal: React.FC<LearnQuizModalProps> = ({ quizContent, onClose, onComplete }) => {
    const { t } = useI18n();
    const quizData = quizContent.questions || [];
    const totalQuestions = quizData.length;

    const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = quizData[currentQuestionIndex];

    const handleNext = () => {
        if (selectedOption === null) return;

        setShowFeedback(true);
        const updatedAnswers = [...userAnswers, selectedOption];
        setUserAnswers(updatedAnswers);
        
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedOption(null);

            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGameState('finished');
                onComplete();
            }
        }, 1500);
    };
    
    const score = userAnswers.filter((answer, index) => answer === quizData[index].correctOptionIndex).length;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-gray-600 text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-600">
                    <h2 className="text-xl font-bold text-white">{t(quizContent.titleKey as any)}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {gameState === 'playing' ? (
                    <div className="p-6">
                        <p className="text-gray-400 mb-2">{t('question_of').replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', totalQuestions.toString())}</p>
                        <h3 className="text-xl font-semibold mb-6">{t(currentQuestion.questionKey as any)}</h3>
                        
                        <div className="space-y-3">
                            {currentQuestion.optionKeys.map((optionKey, index) => {
                                const isSelected = selectedOption === index;
                                let buttonClass = 'bg-gray-700 hover:bg-blue-500';
                                if (showFeedback) {
                                    if (index === currentQuestion.correctOptionIndex) {
                                        buttonClass = 'bg-green-600'; // Correct
                                    } else if (isSelected && index !== currentQuestion.correctOptionIndex) {
                                        buttonClass = 'bg-red-600'; // Incorrectly selected
                                    } else {
                                        buttonClass = 'bg-gray-700 opacity-50';
                                    }
                                } else if (isSelected) {
                                    buttonClass = 'bg-blue-600';
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !showFeedback && setSelectedOption(index)}
                                        disabled={showFeedback}
                                        className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${buttonClass}`}
                                    >
                                        {t(optionKey as any)}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 text-right">
                             <button 
                                onClick={handleNext} 
                                disabled={selectedOption === null || showFeedback}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {currentQuestionIndex < totalQuestions - 1 ? t('next_question') : t('finish_quiz')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-white p-8">
                        <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('quiz_complete')}</h3>
                        <p className="text-lg mb-4">{t('your_score_is')}: <span className="font-bold text-2xl">{score} / {totalQuestions}</span></p>
                        <p className="text-md mb-6">You earned {quizContent.points} points!</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">
                                {t('exit')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Topic Icon Mapper ---
const TopicIcon: React.FC<{ icon: LearnTopic['icon'], className?: string }> = ({ icon, className }) => {
    const icons: Record<LearnTopic['icon'], React.ReactNode> = {
        ClimateChange: <ClimateChangeIcon className={className} />,
        CircularEconomy: <CircularEconomyIcon className={className} />,
        SustainableAgriculture: <SustainableAgricultureIcon className={className} />,
        WaterConservation: <WaterConservationIcon className={className} />,
        Biodiversity: <BiodiversityIcon className={className} />,
        RenewableEnergy: <RenewableEnergyIcon className={className} />,
    };
    return <>{icons[icon]}</>;
};

// --- Topic Card Component ---
interface TopicCardProps {
    topic: LearnTopic;
    progress: number;
    onClick: () => void;
}
const TopicCard: React.FC<TopicCardProps> = ({ topic, progress, onClick }) => {
    const { t } = useI18n();
    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 group flex flex-col cursor-pointer"
        >
            <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
                    <TopicIcon icon={topic.icon} className="w-8 h-8 text-brand-primary dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t(topic.titleKey as any)}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 flex-grow">{t(topic.descriptionKey as any)}</p>
            <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{t('progress')}</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};


// --- Topic Detail Modal ---
interface TopicDetailModalProps {
    topic: LearnTopic;
    onClose: () => void;
}
const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose }) => {
    const { t } = useI18n();
    const { learningProgress, completeLearnContent } = useAuth();
    const [openLevel, setOpenLevel] = useState<LearnLevel['level'] | null>(topic.levels[0].level);
    const [playingVideo, setPlayingVideo] = useState<LearnContent | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<LearnContent | null>(null);
    const [viewingInfographic, setViewingInfographic] = useState<LearnContent | null>(null);
    const [viewingTextContent, setViewingTextContent] = useState<LearnContent | null>(null);

    const topicProgress = learningProgress[topic.id] || { completedContent: [] };

    const handleContentClick = (content: LearnContent) => {
        if (content.type === 'video' && content.url) {
            setPlayingVideo(content);
        } else if (content.type === 'infographic') {
            setViewingInfographic(content);
        } else if (content.type === 'quiz' && content.questions && content.questions.length > 0) {
            setActiveQuiz(content);
        } else if (['article', 'ebook', 'case_study'].includes(content.type)) {
            setViewingTextContent(content);
        } else {
            // For quizzes without questions or other content types, complete immediately
            completeLearnContent(topic.id, content.id, content.points);
        }
    };

    const handleCloseVideo = () => {
        if (playingVideo) {
            // Mark as complete when the video modal is closed
            completeLearnContent(topic.id, playingVideo.id, playingVideo.points);
            setPlayingVideo(null);
        }
    };

    const handleCloseInfographic = () => {
        if (viewingInfographic) {
            completeLearnContent(topic.id, viewingInfographic.id, viewingInfographic.points);
            setViewingInfographic(null);
        }
    };

    const handleCloseTextContent = () => {
        if (viewingTextContent) {
            completeLearnContent(topic.id, viewingTextContent.id, viewingTextContent.points);
            setViewingTextContent(null);
        }
    };
    
    const handleQuizComplete = () => {
        if (activeQuiz) {
            completeLearnContent(topic.id, activeQuiz.id, activeQuiz.points);
            // The quiz modal will show the final score, and the user can close it manually.
        }
    };

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                         <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                            <TopicIcon icon={topic.icon} className="w-7 h-7 text-brand-primary dark:text-green-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(topic.titleKey as any)}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    {topic.levels.map(level => {
                        const totalContent = level.content.length;
                        const completedCount = level.content.filter(c => topicProgress.completedContent.includes(c.id)).length;
                        const levelProgress = totalContent > 0 ? (completedCount / totalContent) * 100 : 0;
                        const isLevelComplete = completedCount === totalContent;
                        const isOpen = openLevel === level.level;

                        return (
                             <div key={level.level} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                <button 
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 text-left"
                                    onClick={() => setOpenLevel(isOpen ? null : level.level)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {isLevelComplete ? <span className="text-2xl">{level.badgeEmoji}</span> : <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t(level.titleKey as any)}</h4>
                                            {isLevelComplete && <p className="text-xs font-semibold text-green-500">{t('completed_level')}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                                        </div>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="p-4 space-y-3">
                                        {level.content.map(content => {
                                            const isCompleted = topicProgress.completedContent.includes(content.id);
                                            const icons = {
                                                video: <VideoIcon className="w-5 h-5 text-red-500" />,
                                                infographic: <InfographicIcon className="w-5 h-5 text-blue-500" />,
                                                quiz: <QuizIcon className="w-5 h-5 text-purple-500" />,
                                                article: <ArticleIcon className="w-5 h-5 text-indigo-500" />,
                                                ebook: <EbookIcon className="w-5 h-5 text-teal-500" />,
                                                case_study: <CaseStudyIcon className="w-5 h-5 text-orange-500" />,
                                            };
                                            return (
                                                <div key={content.id} className={`flex items-center justify-between p-3 rounded-lg ${isCompleted ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                                    <div className="flex items-center space-x-3">
                                                        {icons[content.type]}
                                                        <p className="font-medium text-gray-700 dark:text-gray-300">{t(content.titleKey as any)}</p>
                                                        <span className="text-xs font-bold text-yellow-500">+{content.points} {t('points')}</span>
                                                    </div>
                                                    {isCompleted ? (
                                                        <div className="flex items-center space-x-2 text-green-600 font-semibold text-sm">
                                                            <CheckmarkIcon className="w-5 h-5" />
                                                            <span>{t('completed')}</span>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleContentClick(content)}
                                                            className="px-3 py-1 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-green-700"
                                                        >
                                                            {content.type === 'quiz' ? t('start_quiz') : t('view_content')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                {playingVideo && playingVideo.url && (
                    <VideoPlayerModal url={playingVideo.url} onClose={handleCloseVideo} />
                )}
                {activeQuiz && (
                    <LearnQuizModal
                        quizContent={activeQuiz}
                        onClose={() => setActiveQuiz(null)}
                        onComplete={handleQuizComplete}
                    />
                )}
                {viewingInfographic && (
                    <InfographicModal 
                        title={t(viewingInfographic.titleKey as any) || 'Infographic'}
                        imageUrl={viewingInfographic.imageUrl} 
                        onClose={handleCloseInfographic} 
                    />
                )}
                {viewingTextContent && (
                    <TextContentModal 
                        content={viewingTextContent} 
                        onClose={handleCloseTextContent} 
                    />
                )}
            </div>
        </div>
    );
};

interface LearnProps {
    pageType: 'library' | 'assignments';
}

// --- Main Learn Component ---
const Learn: React.FC<LearnProps> = ({ pageType }) => {
    const { t } = useI18n();
    const { learningProgress } = useAuth();
    const [selectedTopic, setSelectedTopic] = useState<LearnTopic | null>(null);

    const calculateTopicProgress = (topic: LearnTopic) => {
        const totalContentItems = topic.levels.reduce((acc, level) => acc + level.content.length, 0);
        if (totalContentItems === 0) return 0;

        const progressData = learningProgress[topic.id];
        const completedCount = progressData ? progressData.completedContent.length : 0;
        
        return (completedCount / totalContentItems) * 100;
    };


    if (pageType === 'assignments') {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('learn_title')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('learn_subtitle')}</p>
                </div>
                <WeeklyAssignments />
            </div>
        );
    }

    // Default: pageType === 'library'
    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('learn_title')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('learn_subtitle')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {MOCK_LEARN_TOPICS.map(topic => (
                        <TopicCard 
                            key={topic.id}
                            topic={topic}
                            progress={calculateTopicProgress(topic)}
                            onClick={() => setSelectedTopic(topic)}
                        />
                    ))}
                </div>
            </div>
            
            {selectedTopic && (
                <TopicDetailModal 
                    topic={selectedTopic}
                    onClose={() => setSelectedTopic(null)}
                />
            )}
        </>
    );
};

export default Learn;


import React, { useState, useMemo } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { MOCK_LEARNING_VIDEOS, SUCCESS_SOUND_URL, FAILURE_SOUND_URL } from '../constants';
import { LearningVideo, VideoQuizQuestion } from '../types';
import { XIcon, CheckmarkIcon } from './Icons';

// --- Reusable Confetti Component ---
const Confetti: React.FC = () => {
  const confettiPieces = useMemo(() => Array.from({ length: 100 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 3}s`,
      animationDelay: `${Math.random() * 2}s`,
      backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ffeb3b', '#ffc107', '#ff9800'][Math.floor(Math.random() * 13)],
    };
    return <div key={i} className="confetti-piece" style={style}></div>;
  }), []);

  return <div className="confetti-container">{confettiPieces}</div>;
};

// --- Video Player & Quiz Modal Component ---
interface VideoPlayerQuizModalProps {
    video: LearningVideo;
    onClose: () => void;
}
const VideoPlayerQuizModal: React.FC<VideoPlayerQuizModalProps> = ({ video, onClose }) => {
    const { t } = useI18n();
    const { user, addPoints } = useAuth();
    const [view, setView] = useState<'watching' | 'quizzing' | 'finished'>('watching');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const successAudio = useMemo(() => new Audio(SUCCESS_SOUND_URL), []);
    const failureAudio = useMemo(() => new Audio(FAILURE_SOUND_URL), []);
    const currentQuestion = video.quiz[currentQuestionIndex];

    const handleAnswer = (optionIndex: number) => {
        if (feedback) return;
        setSelectedAnswer(optionIndex);

        if (optionIndex === currentQuestion.correctOptionIndex) {
            setFeedback('correct');
            successAudio.play();
            setShowConfetti(true);
            setTimeout(() => {
                const nextQuestionIndex = currentQuestionIndex + 1;
                if (nextQuestionIndex < video.quiz.length) {
                    setCurrentQuestionIndex(nextQuestionIndex);
                    setFeedback(null);
                    setSelectedAnswer(null);
                    setShowConfetti(false);
                } else {
                    addPoints(video.points);
                    setView('finished');
                }
            }, 2000);
        } else {
            setFeedback('incorrect');
            failureAudio.play();
            setTimeout(() => {
                setFeedback(null);
                setSelectedAnswer(null);
            }, 2000);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t(video.titleKey as any)}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-2 sm:p-6">
                    {view === 'watching' && (
                        <div className="space-y-4">
                             <video className="w-full rounded-lg" controls autoPlay>
                                <source src={video.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <button onClick={() => setView('quizzing')} className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg text-lg">
                                {t('start_quiz')}
                            </button>
                        </div>
                    )}
                    
                    {view === 'quizzing' && currentQuestion && (
                        <div className="space-y-4">
                             <p className="text-sm text-gray-500 dark:text-gray-400">{t('question_of').replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', video.quiz.length.toString())}</p>
                             <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{t(currentQuestion.questionKey as any)}</h4>
                             <div className="space-y-3">
                                {currentQuestion.options.map((optionKey, index) => {
                                    const isSelected = selectedAnswer === index;
                                    let buttonClass = 'bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/40';
                                    if (feedback && isSelected) {
                                        buttonClass = feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                                    } else if (feedback && index === currentQuestion.correctOptionIndex) {
                                        buttonClass = 'bg-green-500 text-white';
                                    }

                                    return (
                                         <button key={index} onClick={() => handleAnswer(index)} disabled={!!feedback} className={`w-full text-left p-4 rounded-lg transition-colors duration-300 font-medium ${buttonClass}`}>
                                            {t(optionKey as any)}
                                        </button>
                                    )
                                })}
                             </div>
                             {feedback === 'incorrect' && (
                                 <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm">
                                    <strong>{t('hint')}:</strong> {t(currentQuestion.hintKey as any)}
                                 </div>
                             )}
                             {showConfetti && <Confetti />}
                        </div>
                    )}
                    
                    {view === 'finished' && (
                        <div className="text-center p-8 space-y-4">
                            <Confetti />
                            <h2 className="text-4xl font-bold text-yellow-400">{t('quiz_complete')}</h2>
                            <p className="text-xl text-gray-700 dark:text-gray-200">
                                {t('congratulations_message').replace('{name}', user?.userId || 'Eco-Champ').replace('{points}', video.points.toString())}
                            </p>
                            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg">
                                {t('close_quiz')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Video Card Component ---
const VideoCard: React.FC<{ video: LearningVideo, onClick: () => void }> = ({ video, onClick }) => {
    const { t } = useI18n();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group">
            <div className="h-48 overflow-hidden">
                 <img src={video.thumbnailUrl} alt={t(video.titleKey as any)} className="w-full h-full object-cover"/>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t(video.titleKey as any)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex-grow">{t(video.descriptionKey as any)}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{video.duration} min watch</span>
                    <span className="font-bold text-yellow-500">+{video.points} {t('points')}</span>
                </div>
                <button onClick={onClick} className="mt-4 w-full bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-lg opacity-90 group-hover:opacity-100">
                    {t('watch_video')}
                </button>
            </div>
        </div>
    );
};


// --- Main Learning Videos Component ---
const LearningVideos: React.FC = () => {
    const { t } = useI18n();
    const [activeVideo, setActiveVideo] = useState<LearningVideo | null>(null);

    return (
        <>
            <style>{`
                .confetti-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 9999; }
                .confetti-piece { position: absolute; width: 8px; height: 16px; opacity: 0; animation: confetti-fall linear infinite; }
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('learning_videos_title')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('learning_videos_subtitle')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {MOCK_LEARNING_VIDEOS.map(video => (
                        <VideoCard 
                            key={video.id}
                            video={video}
                            onClick={() => setActiveVideo(video)}
                        />
                    ))}
                </div>
            </div>
            
            {activeVideo && (
                <VideoPlayerQuizModal 
                    video={activeVideo}
                    onClose={() => setActiveVideo(null)}
                />
            )}
        </>
    );
};

export default LearningVideos;
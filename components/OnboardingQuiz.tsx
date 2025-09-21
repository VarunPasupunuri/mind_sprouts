import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { MOCK_ONBOARDING_QUIZ } from '../constants';
import { LogoIcon } from './Icons';

interface OnboardingQuizProps {
  onComplete: (recommendedTopics: string[]) => void;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
    const { t } = useI18n();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [view, setView] = useState<'quizzing' | 'results'>('quizzing');

    const handleAnswer = (topic: string) => {
        const newAnswers = { ...answers, [currentQuestionIndex]: topic };
        setAnswers(newAnswers);

        if (currentQuestionIndex < MOCK_ONBOARDING_QUIZ.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setView('results');
        }
    };

    const currentQuestion = MOCK_ONBOARDING_QUIZ[currentQuestionIndex];

    const getRecommendation = () => {
        const topicCounts: Record<string, number> = {};
        Object.values(answers).forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });

        const sortedTopics = Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a]);
        return sortedTopics[0] || 'Climate Change'; // Default recommendation
    };

    const renderQuiz = () => (
        <>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-2">{t('question_of').replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', MOCK_ONBOARDING_QUIZ.length.toString())}</p>
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">{t(currentQuestion.questionKey as any)}</h2>
            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(option.topic)}
                        className="w-full text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all transform hover:scale-105"
                    >
                        {t(option.textKey as any)}
                    </button>
                ))}
            </div>
        </>
    );

    const renderResults = () => {
        const recommendation = getRecommendation();
        const score = MOCK_ONBOARDING_QUIZ.length; // Everyone gets a perfect score for participating
        let messageKey: any = 'onboarding_result_message_enthusiast'; // Default message
        
        // A simple logic for different messages
        const topicCounts = Object.values(answers).reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        if(Object.keys(topicCounts).length === 1) messageKey = 'onboarding_result_message_expert';
        if(Object.keys(topicCounts).length === 3) messageKey = 'onboarding_result_message_beginner';

        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('onboarding_result_title')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t(messageKey).replace('{score}', score.toString())}</p>
                <p className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200" dangerouslySetInnerHTML={{ __html: t('onboarding_result_recommendation').replace('{topic}', recommendation) }} />
                <button
                    onClick={() => onComplete([recommendation])}
                    className="mt-6 w-full py-3 px-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:-translate-y-1"
                >
                    {t('start_your_journey')}
                </button>
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="flex flex-col items-center mb-4">
                    <LogoIcon className="w-20 h-20 text-brand-primary" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{t('onboarding_quiz_title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('onboarding_quiz_desc')}</p>
                </div>
                {view === 'quizzing' ? renderQuiz() : renderResults()}
            </div>
        </div>
    );
};

export default OnboardingQuiz;

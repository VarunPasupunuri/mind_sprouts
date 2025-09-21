
import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface Question {
  questionKey: any;
  answers: { textKey: any; points: number }[];
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    questionKey: 'quiz_question_1',
    answers: [
      { textKey: 'quiz_q1_a1', points: 0 },
      { textKey: 'quiz_q1_a2', points: 5 },
      { textKey: 'quiz_q1_a3', points: 15 },
    ],
  },
  {
    questionKey: 'quiz_question_2',
    answers: [
      { textKey: 'quiz_q2_a1', points: 0 },
      { textKey: 'quiz_q2_a2', points: 10 },
      { textKey: 'quiz_q2_a3', points: 20 },
    ],
  },
  {
    questionKey: 'quiz_question_3',
    answers: [
      { textKey: 'quiz_q3_a1', points: 0 },
      { textKey: 'quiz_q3_a2', points: 10 },
      { textKey: 'quiz_q3_a3', points: 20 },
    ],
  },
];

const MAX_FOOTPRINT_SCORE = QUIZ_QUESTIONS.reduce((total, q) => total + Math.max(...q.answers.map(a => a.points)), 0);

const CarbonFootprintQuizGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [footprintScore, setFootprintScore] = useState(0);

    const handleStart = () => {
        setGameState('playing');
        setCurrentQuestionIndex(0);
        setFootprintScore(0);
    };

    const handleAnswer = (points: number) => {
        const newFootprintScore = footprintScore + points;
        setFootprintScore(newFootprintScore);
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameState('finished');
            const scoreMultiplier = difficulty === Difficulty.HARD ? 1500 : difficulty === Difficulty.MEDIUM ? 1000 : 750;
            const gameScore = Math.floor(((MAX_FOOTPRINT_SCORE - newFootprintScore) / MAX_FOOTPRINT_SCORE) * scoreMultiplier);
            onGameEnd(gameScore);
        }
    };
    
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_carbon_footprint_quiz_title')}</h3>
                <p className="text-gray-300 mb-6">{t('carbon_footprint_quiz_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    {t('start_game')}
                </button>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        const getResultMessage = () => {
            const percentage = (footprintScore / MAX_FOOTPRINT_SCORE) * 100;
            if (percentage < 33) return t('quiz_results_low');
            if (percentage < 66) return t('quiz_results_medium');
            return t('quiz_results_high');
        };

        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('quiz_results_title')}</h3>
                <p className="text-lg mb-4">{t('footprint_points')}: <span className="font-bold text-2xl">{footprintScore}</span></p>
                <p className="text-md mb-6">{getResultMessage()}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
                        {t('play_again')}
                    </button>
                    <button onClick={onExit} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">
                        {t('exit')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white p-2 sm:p-4">
            <div className="w-full text-center mb-4">
                <p className="text-gray-400">{t('question_of').replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', QUIZ_QUESTIONS.length.toString())}</p>
                <h3 className="text-xl font-semibold mt-2">{t(currentQuestion.questionKey)}</h3>
            </div>
            <div className="space-y-3">
                {currentQuestion.answers.map((answer) => (
                    <button 
                        key={answer.textKey} 
                        onClick={() => handleAnswer(answer.points)} 
                        className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        {t(answer.textKey)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CarbonFootprintQuizGame;

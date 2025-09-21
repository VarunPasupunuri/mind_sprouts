import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
type Category = 'high' | 'medium' | 'low';
type Feedback = 'correct' | 'incorrect' | null;

interface Item {
  nameKey: any;
  emoji: string;
  category: Category;
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const ITEMS: Item[] = [
    { nameKey: 'item_beef', emoji: '🐄', category: 'high' },
    { nameKey: 'item_cheese', emoji: '🧀', category: 'medium' },
    { nameKey: 'item_chicken', emoji: '🐔', category: 'medium' },
    { nameKey: 'item_fish', emoji: '🐟', category: 'medium' },
    { nameKey: 'item_eggs', emoji: '🥚', category: 'low' },
    { nameKey: 'item_lentils', emoji: '🍲', category: 'low' },
    { nameKey: 'item_potatoes', emoji: '🥔', category: 'low' },
    { nameKey: 'item_rice', emoji: '🍚', category: 'low' },
    { nameKey: 'item_tofu', emoji: '🌱', category: 'low' },
    { nameKey: 'item_almonds', emoji: '🌰', category: 'medium' },
];

const GAME_PARAMS: Record<Difficulty, { duration: number; points: number; penalty: number }> = {
    [Difficulty.EASY]: { duration: 45, points: 10, penalty: 5 },
    [Difficulty.MEDIUM]: { duration: 30, points: 15, penalty: 5 },
    [Difficulty.HARD]: { duration: 20, points: 20, penalty: 10 },
};

const FoodChainChallengeGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [feedback, setFeedback] = useState<Feedback>(null);

    const shuffledItems = useMemo(() => [...ITEMS].sort(() => Math.random() - 0.5), []);
    const currentItem = shuffledItems[currentItemIndex];

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0 || currentItemIndex >= shuffledItems.length) {
            setGameState('finished');
            onGameEnd(score);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, timeLeft, currentItemIndex, score, onGameEnd, shuffledItems.length]);

    const handleStart = () => {
        setScore(0);
        setTimeLeft(gameParams.duration);
        setCurrentItemIndex(0);
        setGameState('playing');
    };

    const handleSort = (selectedCategory: Category) => {
        if (feedback) return; // Prevent multiple clicks

        if (selectedCategory === currentItem.category) {
            setScore(prev => prev + gameParams.points);
            setFeedback('correct');
        } else {
            setScore(prev => Math.max(0, prev - gameParams.penalty)); // Score can't be negative
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            setCurrentItemIndex(prev => prev + 1);
        }, 800);
    };
    
    const getFeedbackClasses = () => {
        if (feedback === 'correct') return 'border-green-500 bg-green-500/20';
        if (feedback === 'incorrect') return 'border-red-500 bg-red-500/20';
        return 'border-gray-600';
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_food_chain_challenge_title')}</h3>
                <p className="text-gray-300 mb-6">{t('food_chain_challenge_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg btn-hover">
                    {t('start_game')}
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{score}</span></p>
                <div className="flex justify-center space-x-4">
                     <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg btn-hover">
                        {t('play_again')}
                    </button>
                    <button onClick={onExit} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg btn-hover">
                        {t('exit')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white flex flex-col items-center p-2 sm:p-4">
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('score')}: <span className="font-bold">{score}</span></div>
                <div className="text-lg">{t('time_left')}: <span className="font-bold">{timeLeft}s</span></div>
            </div>

            <div className={`w-full max-w-sm h-48 flex flex-col items-center justify-center border-2 rounded-lg mb-6 transition-colors duration-300 ${getFeedbackClasses()}`}>
                {feedback ? (
                    <p className={`text-3xl font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {t(feedback)}
                    </p>
                ) : (
                    <>
                        <p className="text-6xl">{currentItem.emoji}</p>
                        <p className="mt-2 text-xl font-semibold">{t(currentItem.nameKey)}</p>
                    </>
                )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg">
                <button onClick={() => handleSort('high')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-transform transform hover:scale-105 active:scale-95">
                    <span className="text-xs sm:text-base">{t('footprint_high')}</span>
                </button>
                <button onClick={() => handleSort('medium')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-transform transform hover:scale-105 active:scale-95">
                     <span className="text-xs sm:text-base">{t('footprint_medium')}</span>
                </button>
                <button onClick={() => handleSort('low')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-transform transform hover:scale-105 active:scale-95">
                    <span className="text-xs sm:text-base">{t('footprint_low')}</span>
                </button>
            </div>
        </div>
    );
};

export default FoodChainChallengeGame;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';
import { CheckmarkCircleIcon, XCircleIcon } from '../Icons';

type GameState = 'ready' | 'playing' | 'finished';
type ActionType = 'do' | 'dont';
type Feedback = 'correct' | 'incorrect' | 'none';

interface Action {
  textKey: any;
  emoji: string;
  type: ActionType;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const ALL_ACTIONS: Action[] = [
    // Easy
    { textKey: 'action_do_lights_off', emoji: '💡', type: 'do', difficulty: 'easy' },
    { textKey: 'action_dont_littering', emoji: '🗑️', type: 'dont', difficulty: 'easy' },
    { textKey: 'action_do_reusable_bottle', emoji: '💧', type: 'do', difficulty: 'easy' },
    { textKey: 'action_dont_long_showers', emoji: '🚿', type: 'dont', difficulty: 'easy' },
    { textKey: 'action_do_plant_tree', emoji: '🌳', type: 'do', difficulty: 'easy' },
    // Medium
    { textKey: 'action_do_recycle', emoji: '♻️', type: 'do', difficulty: 'medium' },
    { textKey: 'action_dont_plastic_straws', emoji: '🥤', type: 'dont', difficulty: 'medium' },
    { textKey: 'action_dont_waste_food', emoji: '🍔', type: 'dont', difficulty: 'medium' },
    { textKey: 'action_do_compost', emoji: '🌱', type: 'do', difficulty: 'medium' },
    { textKey: 'action_dont_ewaste_in_trash', emoji: '📱', type: 'dont', difficulty: 'medium' },
    // Hard
    { textKey: 'action_do_support_local', emoji: '🧑‍🌾', type: 'do', difficulty: 'hard' },
    { textKey: 'action_dont_fast_fashion', emoji: '👕', type: 'dont', difficulty: 'hard' },
    { textKey: 'action_dont_idling_car', emoji: '🚗', type: 'dont', difficulty: 'hard' },
    { textKey: 'action_do_fix_leaks', emoji: '🔧', type: 'do', difficulty: 'hard' },
    { textKey: 'action_dont_overpackage', emoji: '📦', type: 'dont', difficulty: 'hard' },
];

const GAME_PARAMS: Record<Difficulty, { duration: number; actionCount: number; penalty: number }> = {
    [Difficulty.EASY]: { duration: 60, actionCount: 8, penalty: 5 },
    [Difficulty.MEDIUM]: { duration: 45, actionCount: 10, penalty: 10 },
    [Difficulty.HARD]: { duration: 30, actionCount: 12, penalty: 15 },
};

const EcoDosDontsGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);
    const [actions, setActions] = useState<Action[]>([]);
    const [currentActionIndex, setCurrentActionIndex] = useState(0);
    const [feedback, setFeedback] = useState<Feedback>('none');
    
    const gameActions = useMemo(() => {
        const difficultyMap = {
            [Difficulty.EASY]: ['easy'],
            [Difficulty.MEDIUM]: ['easy', 'medium'],
            [Difficulty.HARD]: ['easy', 'medium', 'hard'],
        };
        const validDifficulties = difficultyMap[difficulty];
        return ALL_ACTIONS.filter(a => validDifficulties.includes(a.difficulty));
    }, [difficulty]);

    const handleStart = useCallback(() => {
        const shuffled = [...gameActions].sort(() => 0.5 - Math.random());
        setActions(shuffled.slice(0, gameParams.actionCount));
        setCurrentActionIndex(0);
        setScore(0);
        setTimeLeft(gameParams.duration);
        setFeedback('none');
        setGameState('playing');
    }, [gameActions, gameParams.actionCount, gameParams.duration]);

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('finished');
                    onGameEnd(score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, score, onGameEnd]);
    
    const handleChoice = (choice: ActionType) => {
        if (feedback !== 'none') return;

        const currentAction = actions[currentActionIndex];
        if (currentAction.type === choice) {
            setScore(prev => prev + (choice === 'do' ? 5 : 10));
            setFeedback('correct');
        } else {
            setScore(prev => Math.max(0, prev - gameParams.penalty));
            setFeedback('incorrect');
        }

        setTimeout(() => {
            const nextIndex = currentActionIndex + 1;
            if (nextIndex >= actions.length) {
                setGameState('finished');
                onGameEnd(score);
            } else {
                setCurrentActionIndex(nextIndex);
                setFeedback('none');
            }
        }, 1200);
    };
    
    const getCardClasses = () => {
        if (feedback === 'correct') return 'border-green-500 bg-green-900/50 animate-pulse';
        if (feedback === 'incorrect') return 'border-red-500 bg-red-900/50 animate-shake';
        return 'border-gray-600';
    };

    const currentAction = actions[currentActionIndex];

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_eco_dos_donts_title')}</h3>
                <p className="text-gray-300 mb-6">{t('eco_dos_donts_instructions')}</p>
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
            <style>{`
                @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('score')}: <span className="font-bold">{score}</span></div>
                <div className="text-lg">{t('time_left')}: <span className="font-bold">{timeLeft}s</span></div>
            </div>

            <div className={`relative w-full max-w-sm h-64 flex flex-col items-center justify-center border-4 rounded-lg mb-6 transition-colors duration-300 text-center p-4 ${getCardClasses()}`}>
                <span className="text-5xl mb-4">{currentAction.emoji}</span>
                <p className="text-xl font-semibold">{t(currentAction.textKey)}</p>
                {feedback !== 'none' && (
                    <p className={`absolute bottom-2 text-sm font-bold ${feedback === 'correct' ? 'text-green-300' : 'text-red-300'}`}>
                        {feedback === 'correct' 
                            ? (currentAction.type === 'do' ? t('feedback_do_correct') : t('feedback_dont_correct')) 
                            : t('feedback_incorrect')}
                    </p>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <button onClick={() => handleChoice('do')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50" disabled={feedback !== 'none'}>
                    <CheckmarkCircleIcon className="w-8 h-8"/>
                    <span className="text-xl">Do</span>
                </button>
                 <button onClick={() => handleChoice('dont')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50" disabled={feedback !== 'none'}>
                    <XCircleIcon className="w-8 h-8"/>
                    <span className="text-xl">Don't</span>
                </button>
            </div>
        </div>
    );
};

export default EcoDosDontsGame;
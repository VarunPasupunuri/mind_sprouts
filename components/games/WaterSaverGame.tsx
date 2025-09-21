import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const GRID_SIZE = 25; // 5x5 grid

const GAME_PARAMS: Record<Difficulty, { duration: number; interval: number }> = {
    [Difficulty.EASY]: { duration: 30, interval: 1000 },
    [Difficulty.MEDIUM]: { duration: 20, interval: 800 },
    [Difficulty.HARD]: { duration: 15, interval: 600 },
};

const WaterSaverGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [leaks, setLeaks] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);

    const handleStart = () => {
        setGameState('playing');
        setLeaks([]);
        setScore(0);
        setTimeLeft(gameParams.duration);
    };

    const addLeak = useCallback(() => {
        if (leaks.length >= 10) return; // Max leaks on screen
        const newLeakIndex = Math.floor(Math.random() * GRID_SIZE);
        if (!leaks.includes(newLeakIndex)) {
            setLeaks(prev => [...prev, newLeakIndex]);
        }
    }, [leaks]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            setGameState('finished');
            onGameEnd(score * 10);
            return;
        }

        const gameTimer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        const leakTimer = setInterval(addLeak, gameParams.interval);

        return () => {
            clearInterval(gameTimer);
            clearInterval(leakTimer);
        };
    }, [gameState, timeLeft, score, addLeak, onGameEnd, gameParams.interval]);

    const fixLeak = (index: number) => {
        setLeaks(prev => prev.filter(leakIndex => leakIndex !== index));
        setScore(prev => prev + 1);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_water_saver_title')}</h3>
                <p className="text-gray-300 mb-6">{t('water_saver_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    {t('start_game')}
                </button>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{score * 10}</span></p>
                <p className="text-md mb-4">{t('leaks_fixed')}: {score}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
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
        <div className="text-white flex flex-col items-center p-2 sm:p-4">
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('leaks_fixed')}: <span className="font-bold">{score}</span></div>
                <div className="text-lg">{t('time_left')}: <span className="font-bold">{timeLeft}s</span></div>
            </div>
            <div className="grid grid-cols-5 gap-2 w-full max-w-md mx-auto aspect-square">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                    <div 
                        key={i} 
                        onClick={() => leaks.includes(i) && fixLeak(i)} 
                        className="w-full h-full bg-gray-700 rounded-md flex items-center justify-center cursor-pointer"
                    >
                        {leaks.includes(i) && <span className="text-3xl animate-drip">💧</span>}
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes drip {
                    0% { transform: translateY(-20%); opacity: 1; }
                    100% { transform: translateY(30%); opacity: 0; }
                }
                .animate-drip {
                    animation: drip 1s infinite;
                }
            `}</style>
        </div>
    );
};

export default WaterSaverGame;
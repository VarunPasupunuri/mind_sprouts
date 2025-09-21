// FIX: Import 'useRef' from react to resolve 'Cannot find name' error.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'waiting' | 'active' | 'finished';
// FIX: Add 'as const' to ensure nameKey has a literal type for the t() function.
const ANIMALS = [{ nameKey: 'dolphin', emoji: '🐬' }, { nameKey: 'bird', emoji: '🐦' }] as const;

const GAME_PARAMS: Record<Difficulty, { rounds: number; minWait: number; maxWait: number }> = {
    [Difficulty.EASY]: { rounds: 5, minWait: 1500, maxWait: 4000 },
    [Difficulty.MEDIUM]: { rounds: 7, minWait: 1000, maxWait: 3000 },
    [Difficulty.HARD]: { rounds: 10, minWait: 500, maxWait: 2000 },
};

const WildlifeRescueGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [message, setMessage] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRound = useCallback(() => {
        setMessage('');
        setGameState('waiting');
        const waitTime = Math.random() * (gameParams.maxWait - gameParams.minWait) + gameParams.minWait;
        timerRef.current = setTimeout(() => {
            setGameState('active');
        }, waitTime);
    }, [gameParams]);
    
    const handleStart = () => {
        setScore(0);
        setRound(0);
        setGameState('waiting');
        startRound();
    };

    const handleClick = () => {
        if (gameState === 'waiting') {
            setMessage('Too soon!');
            if (timerRef.current) clearTimeout(timerRef.current);
            setTimeout(nextRound, 1000);
        }
        if (gameState === 'active') {
            setScore(prev => prev + 1);
            setMessage('Rescued!');
            setTimeout(nextRound, 1000);
        }
    };
    
    const nextRound = () => {
        const newRound = round + 1;
        if (newRound >= gameParams.rounds) {
            setGameState('finished');
            onGameEnd((score / gameParams.rounds) * 1000);
        } else {
            setRound(newRound);
            startRound();
        }
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_wildlife_rescue_title')}</h3>
                <p className="text-gray-300 mb-6">{t('wildlife_rescue_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    {t('start_game')}
                </button>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        return (
             <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{Math.floor((score / gameParams.rounds) * 1000)}</span></p>
                <p className="text-md mb-4">{t('animals_rescued')}: {score}/{gameParams.rounds}</p>
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
    
    const animal = ANIMALS[round % ANIMALS.length];

    return (
        <div className="text-white p-4 text-center">
            <p className="mb-4">{t('animals_rescued')}: {score}/{gameParams.rounds}</p>
            <div onClick={handleClick} className={`h-64 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${gameState === 'active' ? 'bg-green-500' : 'bg-blue-800'}`}>
                {message ? (
                    <p className="text-3xl font-bold">{message}</p>
                ) : (
                    <>
                        <p className="text-6xl">{animal.emoji}</p>
                        <p className="text-xl mt-2">{t('rescue_the')} {t(animal.nameKey)}</p>
                        {gameState === 'waiting' && <p className="mt-4">Wait for the signal...</p>}
                        {gameState === 'active' && <p className="mt-4 text-2xl font-bold animate-pulse">RESCUE NOW!</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default WildlifeRescueGame;
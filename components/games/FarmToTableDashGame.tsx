import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
type Veggie = 'carrot' | 'tomato' | 'lettuce';
const VEGGIES: {nameKey: Veggie, emoji: string}[] = [{nameKey: 'carrot', emoji: '🥕'}, {nameKey: 'tomato', emoji: '🍅'}, {nameKey: 'lettuce', emoji: '🥬'}];

const GAME_PARAMS: Record<Difficulty, { duration: number, orderTime: number }> = {
    [Difficulty.EASY]: { duration: 60, orderTime: 8000 },
    [Difficulty.MEDIUM]: { duration: 45, orderTime: 6000 },
    [Difficulty.HARD]: { duration: 30, orderTime: 4000 },
};

const FarmToTableDashGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);
    const [order, setOrder] = useState<Veggie | null>(null);
    // FIX: Initialize useRef with null to provide the expected initial argument.
    const orderTimer = React.useRef<NodeJS.Timeout | null>(null);

    const generateOrder = useCallback(() => {
        const nextVeggie = VEGGIES[Math.floor(Math.random() * VEGGIES.length)].nameKey;
        setOrder(nextVeggie);
        
        if (orderTimer.current) clearTimeout(orderTimer.current);
        orderTimer.current = setTimeout(() => {
            if(gameState === 'playing') {
               setGameState('finished');
               onGameEnd(score);
            }
        }, gameParams.orderTime);
    }, [score, onGameEnd, gameParams.orderTime, gameState]);
    
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (!order) generateOrder();

        if (timeLeft <= 0) {
            setGameState('finished');
            onGameEnd(score);
            return;
        }
        const gameTimer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => {
            clearInterval(gameTimer);
            if (orderTimer.current) clearTimeout(orderTimer.current);
        }
    }, [gameState, timeLeft, score, onGameEnd, order, generateOrder]);

    const handleHarvest = (veggie: Veggie) => {
        if (veggie === order) {
            setScore(s => s + 10);
            generateOrder();
        } else {
            setGameState('finished');
            onGameEnd(score);
        }
    };

    const handleStart = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(gameParams.duration);
        setOrder(null);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_farm_to_table_dash_title')}</h3>
                <p className="text-gray-300 mb-6">{t('farm_to_table_dash_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{score}</span></p>
                <p className="text-md mb-4">{t('orders_filled')}: {score/10}</p>
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
        <div className="text-white flex flex-col items-center p-2 sm:p-4">
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('score')}: <span className="font-bold">{score}</span></div>
                <div className="text-lg">{t('time_left')}: <span className="font-bold">{timeLeft}s</span></div>
            </div>
            <div className="w-full text-center p-4 bg-gray-700 rounded-lg mb-4">
                <p className="text-lg">{t('new_order')}: <span className="font-bold text-2xl">{VEGGIES.find(v => v.nameKey === order)?.emoji} {t(order as any)}</span></p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                {VEGGIES.map(veg => (
                    <button key={veg.nameKey} onClick={() => handleHarvest(veg.nameKey)} className="p-4 bg-yellow-800/50 rounded-lg text-5xl hover:bg-green-700/50">
                        {veg.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default FarmToTableDashGame;

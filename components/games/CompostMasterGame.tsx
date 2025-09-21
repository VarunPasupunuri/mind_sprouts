import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
type Material = 'green' | 'brown';
interface FallingItem { id: number; type: Material; emoji: string; }

const MATERIALS: Record<Material, string[]> = {
    green: ['🥬', '🍎', '🍌'],
    brown: ['🍂', '📦', '🗞️'],
};
const GAME_PARAMS: Record<Difficulty, { duration: number; pointsPerLayer: number }> = {
    [Difficulty.EASY]: { duration: 45, pointsPerLayer: 50 },
    [Difficulty.MEDIUM]: { duration: 30, pointsPerLayer: 75 },
    [Difficulty.HARD]: { duration: 20, pointsPerLayer: 100 },
};

const CompostMasterGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);
    const [pile, setPile] = useState<Material[]>([]);
    const [nextItem, setNextItem] = useState<FallingItem | null>(null);

    const generateNewItem = () => {
        const type = Math.random() > 0.5 ? 'green' : 'brown';
        const emoji = MATERIALS[type][Math.floor(Math.random() * MATERIALS[type].length)];
        setNextItem({ id: Date.now(), type, emoji });
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (!nextItem) generateNewItem();

        if (timeLeft <= 0) {
            setGameState('finished');
            onGameEnd(score);
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, score, nextItem, onGameEnd]);
    
    const handleAdd = (type: Material) => {
        if (!nextItem || gameState !== 'playing') return;
        
        if (nextItem.type === type) {
            const newPile = [...pile, type];
            // Check for a complete layer (green then brown, or vice versa if pile was empty)
            if (newPile.length >= 2) {
                const lastTwo = newPile.slice(-2);
                if (lastTwo[0] !== lastTwo[1]) {
                    setScore(s => s + gameParams.pointsPerLayer);
                    setPile([]); // Clear pile after successful layer
                } else {
                    setPile(newPile);
                }
            } else {
                setPile(newPile);
            }
        } else {
            // Penalty or game over for wrong sort
            setGameState('finished');
            onGameEnd(score);
        }
        generateNewItem();
    };
    
    const handleStart = () => {
        setGameState('playing');
        setScore(0);
        setPile([]);
        setTimeLeft(gameParams.duration);
        generateNewItem();
    };
    
    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_compost_master_title')}</h3>
                <p className="text-gray-300 mb-6">{t('compost_master_instructions')}</p>
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
                 <p className="text-md mb-4">{t('layers_cleared')}: {score / gameParams.pointsPerLayer}</p>
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
            <div className="h-24 text-center">
                <p>Next Item:</p>
                <p className="text-5xl">{nextItem?.emoji}</p>
            </div>
            <div className="w-48 h-48 bg-yellow-900/50 rounded-lg flex flex-col-reverse items-center overflow-hidden">
                {pile.map((layer, i) => (
                    <div key={i} className={`w-full h-8 ${layer === 'green' ? 'bg-green-700' : 'bg-yellow-700'}`}></div>
                ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button onClick={() => handleAdd('green')} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg">{t('green_material')}</button>
                <button onClick={() => handleAdd('brown')} className="bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg">{t('brown_material')}</button>
            </div>
        </div>
    );
};
export default CompostMasterGame;

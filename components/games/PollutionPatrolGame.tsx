import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface GameObject {
  id: number;
  type: 'trash' | 'obstacle';
  emoji: string;
  x: number;
  y: number;
}

const GAME_PARAMS: Record<Difficulty, { duration: number; interval: number; points: number; penalty: number }> = {
    [Difficulty.EASY]: { duration: 45, interval: 1200, points: 20, penalty: 10 },
    [Difficulty.MEDIUM]: { duration: 30, interval: 900, points: 25, penalty: 15 },
    [Difficulty.HARD]: { duration: 20, interval: 600, points: 30, penalty: 20 },
};

const TRASH_EMOJIS = ['🛍️', '🍾', '🥫'];
const OBSTACLE_EMOJIS = ['🐟', '🦆', '🦢'];

const PollutionPatrolGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameParams.duration);
    const [objects, setObjects] = useState<GameObject[]>([]);

    const addObject = useCallback(() => {
        const type = Math.random() > 0.3 ? 'trash' : 'obstacle';
        const newObject: GameObject = {
            id: Date.now() + Math.random(),
            type,
            emoji: type === 'trash' ? TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)] : OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)],
            x: Math.random() * 90,
            y: Math.random() * 90,
        };
        setObjects(prev => [...prev.slice(-10), newObject]);
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (timeLeft <= 0) {
            setGameState('finished');
            onGameEnd(score);
            return;
        }
        const gameTimer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        const objectTimer = setInterval(addObject, gameParams.interval);
        return () => {
            clearInterval(gameTimer);
            clearInterval(objectTimer);
        };
    }, [gameState, timeLeft, score, addObject, onGameEnd, gameParams.interval]);
    
    const handleObjectClick = (object: GameObject) => {
        if (object.type === 'trash') {
            setScore(prev => prev + gameParams.points);
        } else {
            setScore(prev => Math.max(0, prev - gameParams.penalty));
        }
        setObjects(prev => prev.filter(o => o.id !== object.id));
    };
    
    const handleStart = () => {
        setGameState('playing');
        setScore(0);
        setObjects([]);
        setTimeLeft(gameParams.duration);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_pollution_patrol_title')}</h3>
                <p className="text-gray-300 mb-6">{t('pollution_patrol_instructions')}</p>
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
            <div className="relative w-full h-80 bg-blue-800/50 rounded-lg overflow-hidden border-2 border-blue-400">
                 {objects.map(obj => (
                    <div 
                        key={obj.id} 
                        onClick={() => handleObjectClick(obj)}
                        className="absolute text-2xl cursor-pointer"
                        style={{ left: `${obj.x}%`, top: `${obj.y}%`, animation: 'float 3s ease-in-out infinite' }}
                    >
                        {obj.emoji}
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};
export default PollutionPatrolGame;
import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
interface GasMolecule { id: number; x: number; y: number; }

const PLAYER_WIDTH = 40;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

const GAME_PARAMS: Record<Difficulty, { speed: number; interval: number }> = {
    [Difficulty.EASY]: { speed: 3, interval: 1000 },
    [Difficulty.MEDIUM]: { speed: 4, interval: 700 },
    [Difficulty.HARD]: { speed: 5, interval: 500 },
};

const GhgDodgerGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    const [molecules, setMolecules] = useState<GasMolecule[]>([]);
    const [time, setTime] = useState(0);
    // FIX: Initialize useRef with null to provide the expected initial argument.
    const gameLoopRef = useRef<number | null>(null);

    const gameLoop = () => {
        // Move molecules
        setMolecules(prev => {
            const newMolecules = prev.map(m => ({ ...m, y: m.y + gameParams.speed })).filter(m => m.y < GAME_HEIGHT);

            // Check for collision
            for (const m of newMolecules) {
                if (m.y > GAME_HEIGHT - 40 && m.x > playerX && m.x < playerX + PLAYER_WIDTH) {
                    setGameState('finished');
                    onGameEnd(time);
                    return prev;
                }
            }
            return newMolecules;
        });

        setTime(t => t + 1);
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') setPlayerX(x => Math.max(0, x - 20));
            if (e.key === 'ArrowRight') setPlayerX(x => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 20));
        };
        window.addEventListener('keydown', handleKeyDown);

        let moleculeInterval: NodeJS.Timeout;
        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            moleculeInterval = setInterval(() => {
                setMolecules(prev => [...prev, { id: Date.now(), x: Math.random() * (GAME_WIDTH - 20), y: 0 }]);
            }, gameParams.interval);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            if (moleculeInterval) clearInterval(moleculeInterval);
        };
    }, [gameState]);

    const handleStart = () => {
        setGameState('playing');
        setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
        setMolecules([]);
        setTime(0);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_ghg_dodger_title')}</h3>
                <p className="text-gray-300 mb-6">{t('ghg_dodger_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{time}</span></p>
                <p className="text-md mb-4">{t('time_survived')}: {(time / 60).toFixed(1)}s</p>
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
            <div className="w-full text-center mb-2">{t('time_survived')}: <span className="font-bold">{(time / 60).toFixed(1)}s</span></div>
            <div className="relative bg-sky-900 overflow-hidden" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
                <div className="absolute text-3xl" style={{ bottom: 0, left: playerX }}>🌍</div>
                {molecules.map(m => (
                    <div key={m.id} className="absolute text-xl" style={{ left: m.x, top: m.y }}>💨</div>
                ))}
            </div>
        </div>
    );
};
export default GhgDodgerGame;

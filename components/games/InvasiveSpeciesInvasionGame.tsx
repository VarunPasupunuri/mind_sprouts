import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
interface Invader { id: number; emoji: string; nameKey: any; }

const INVADERS = [{ emoji: '🐸', nameKey: 'cane_toad' }, { emoji: '🐌', nameKey: 'zebra_mussel' }] as const;
const GAME_PARAMS: Record<Difficulty, { waves: number; interval: number; health: number }> = {
    [Difficulty.EASY]: { waves: 5, interval: 2000, health: 100 },
    [Difficulty.MEDIUM]: { waves: 8, interval: 1500, health: 80 },
    [Difficulty.HARD]: { waves: 10, interval: 1000, health: 60 },
};

const InvasiveSpeciesInvasionGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [health, setHealth] = useState(gameParams.health);
    const [wave, setWave] = useState(0);
    const [activeInvaders, setActiveInvaders] = useState<Invader[]>([]);
    
    const handleStart = () => {
        setGameState('playing');
        setHealth(gameParams.health);
        setWave(0);
        setActiveInvaders([]);
    };

    const spawnInvader = useCallback(() => {
        if (wave >= gameParams.waves) return;
        const invaderType = INVADERS[Math.floor(Math.random() * INVADERS.length)];
        const newInvader = { ...invaderType, id: Date.now() };
        setActiveInvaders(prev => {
            const newActives = [...prev, newInvader];
            if (newActives.length > 5) {
                setHealth(h => h - 10); // Damage if too many invaders
                return newActives.slice(1);
            }
            return newActives;
        });
    }, [wave, gameParams.waves]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (health <= 0) {
            setGameState('finished');
            onGameEnd(wave * 50);
            return;
        }
        if (wave >= gameParams.waves) {
             setGameState('finished');
             onGameEnd(wave * 50 + health);
             return;
        }

        const spawnInterval = setInterval(() => {
            spawnInvader();
            if(activeInvaders.length === 0) setWave(w => w + 1);
        }, gameParams.interval);

        return () => clearInterval(spawnInterval);
    }, [gameState, health, wave, spawnInvader, gameParams, activeInvaders.length, onGameEnd]);

    const handleInvaderClick = (id: number) => {
        setActiveInvaders(prev => prev.filter(inv => inv.id !== id));
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_invasive_species_invasion_title')}</h3>
                <p className="text-gray-300 mb-6">{t('invasive_species_invasion_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{wave * 50 + health}</span></p>
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
                <div className="text-lg">{t('ecosystem_health')}: <span className="font-bold">{health}</span></div>
                <div className="text-lg">{t('wave')}: <span className="font-bold">{wave}/{gameParams.waves}</span></div>
            </div>
            <div className="w-full h-64 bg-green-800/50 rounded-lg p-4 flex flex-wrap gap-4 justify-center items-center">
                {activeInvaders.map(inv => (
                    <div key={inv.id} onClick={() => handleInvaderClick(inv.id)} className="text-4xl cursor-pointer animate-pulse">
                        {inv.emoji}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvasiveSpeciesInvasionGame;
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

const GRID_SIZE = 36; // 6x6

const GAME_PARAMS: Record<Difficulty, { moves: number }> = {
    [Difficulty.EASY]: { moves: 20 },
    [Difficulty.MEDIUM]: { moves: 15 },
    [Difficulty.HARD]: { moves: 10 },
};

const AfforestationAdventureGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [grid, setGrid] = useState<(string|null)[]>(Array(GRID_SIZE).fill(null));
    const [movesLeft, setMovesLeft] = useState(gameParams.moves);
    const [health, setHealth] = useState(0);

    const calculateHealth = (currentGrid: (string|null)[]) => {
        let newHealth = 0;
        for (let i = 0; i < GRID_SIZE; i++) {
            if (currentGrid[i]) {
                newHealth += 10; // Base health for a tree
                // Check neighbors for synergy (simplified)
                const neighbors = [i-1, i+1, i-6, i+6].filter(n => n >= 0 && n < GRID_SIZE);
                neighbors.forEach(n => {
                    if (currentGrid[n]) newHealth += 5;
                });
            }
        }
        return newHealth;
    };

    const handleCellClick = (index: number) => {
        if (gameState !== 'playing' || grid[index] || movesLeft <= 0) return;
        
        const newGrid = [...grid];
        newGrid[index] = '🌳';
        setGrid(newGrid);

        const newHealth = calculateHealth(newGrid);
        setHealth(newHealth);

        const newMovesLeft = movesLeft - 1;
        setMovesLeft(newMovesLeft);
        
        if (newMovesLeft === 0) {
            setGameState('finished');
            onGameEnd(newHealth);
        }
    };
    
    const handleStart = () => {
        setGameState('playing');
        setGrid(Array(GRID_SIZE).fill(null));
        setMovesLeft(gameParams.moves);
        setHealth(0);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_afforestation_adventure_title')}</h3>
                <p className="text-gray-300 mb-6">{t('afforestation_adventure_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{health}</span></p>
                <p className="text-md mb-4">{t('forest_health')}: {health}</p>
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
                <div className="text-lg">{t('trees_planted')}: <span className="font-bold">{gameParams.moves - movesLeft}/{gameParams.moves}</span></div>
                <div className="text-lg">{t('forest_health')}: <span className="font-bold">{health}</span></div>
            </div>
            <div className="grid grid-cols-6 gap-1 w-full max-w-sm mx-auto aspect-square bg-yellow-900/50 p-1 rounded">
                {grid.map((cell, i) => (
                    <div key={i} onClick={() => handleCellClick(i)} className="w-full h-full bg-yellow-800/70 flex items-center justify-center cursor-pointer hover:bg-green-700/50">
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AfforestationAdventureGame;

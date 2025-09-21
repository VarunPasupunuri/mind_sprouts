import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const GAME_PARAMS: Record<Difficulty, { speed: number }> = {
    [Difficulty.EASY]: { speed: 200 },
    [Difficulty.MEDIUM]: { speed: 150 },
    [Difficulty.HARD]: { speed: 100 },
};

const OceanCleanupGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [boat, setBoat] = useState([{ x: 10, y: 10 }]);
    const [plastic, setPlastic] = useState({ x: 15, y: 15 });
    const [animals, setAnimals] = useState([{ x: 5, y: 5 }]);
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [score, setScore] = useState(0);

    const generateRandomPos = (currentBoat: {x:number, y:number}[]) => {
        let pos;
        do {
            pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
        } while (currentBoat.some(segment => segment.x === pos.x && segment.y === pos.y));
        return pos;
    };
    
    const moveBoat = useCallback(() => {
        setBoat(prevBoat => {
            const newBoat = [...prevBoat];
            const head = { ...newBoat[0] };

            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Check for collisions
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || 
                newBoat.some(segment => segment.x === head.x && segment.y === head.y) ||
                animals.some(animal => animal.x === head.x && animal.y === head.y)) {
                setGameState('finished');
                onGameEnd(score);
                return prevBoat;
            }

            newBoat.unshift(head);

            if (head.x === plastic.x && head.y === plastic.y) {
                setScore(s => s + 10);
                setPlastic(generateRandomPos(newBoat));
                // Add new animal on score
                if ((score + 10) % 50 === 0) {
                    setAnimals(prev => [...prev, generateRandomPos(newBoat)]);
                }
            } else {
                newBoat.pop();
            }

            return newBoat;
        });
    }, [direction, plastic, score, onGameEnd, animals]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': if(direction !== 'DOWN') setDirection('UP'); break;
                case 'ArrowDown': if(direction !== 'UP') setDirection('DOWN'); break;
                case 'ArrowLeft': if(direction !== 'RIGHT') setDirection('LEFT'); break;
                case 'ArrowRight': if(direction !== 'LEFT') setDirection('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const gameInterval = setInterval(moveBoat, gameParams.speed);
        return () => clearInterval(gameInterval);
    }, [gameState, moveBoat, gameParams.speed]);

    const handleStart = () => {
        setGameState('playing');
        setBoat([{ x: 10, y: 10 }]);
        setPlastic({ x: 15, y: 15 });
        setAnimals([{ x: 5, y: 5 }]);
        setDirection('RIGHT');
        setScore(0);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_ocean_cleanup_title')}</h3>
                <p className="text-gray-300 mb-6">{t('ocean_cleanup_instructions')}</p>
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
            <div className="w-full text-center mb-2">{t('plastic_collected')}: <span className="font-bold">{score}</span></div>
            <div className="bg-blue-800/80" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE, position: 'relative' }}>
                {boat.map((segment, index) => (
                    <div key={index} className="bg-gray-400" style={{ position: 'absolute', width: CELL_SIZE, height: CELL_SIZE, left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }}>
                        {index === 0 ? '⛵' : ''}
                    </div>
                ))}
                <div style={{ position: 'absolute', width: CELL_SIZE, height: CELL_SIZE, left: plastic.x * CELL_SIZE, top: plastic.y * CELL_SIZE }}>
                    🛍️
                </div>
                {animals.map((animal, index) => (
                     <div key={index} style={{ position: 'absolute', width: CELL_SIZE, height: CELL_SIZE, left: animal.x * CELL_SIZE, top: animal.y * CELL_SIZE }}>
                        🐢
                    </div>
                ))}
            </div>
        </div>
    );
};
export default OceanCleanupGame;

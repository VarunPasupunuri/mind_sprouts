import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const GRID_SIZE = 13;
// FIX: Added 'as const' to ensure clueKey properties have literal types for type-safe use with the t() function.
const CROSSWORD_DATA = {
    // WORD: { clueKey, row, col, direction }
    SOLAR: { clueKey: 'clue_3_across', row: 2, col: 8, direction: 'across' },
    RECYCLE: { clueKey: 'clue_2_down', row: 3, col: 2, direction: 'down' },
    FOREST: { clueKey: 'clue_4_down', row: 5, col: 10, direction: 'down' },
    BIODIVERSITY: { clueKey: 'clue_5_across', row: 8, col: 0, direction: 'across' },
    GREENHOUSEGAS: { clueKey: 'clue_1_across', row: 10, col: 0, direction: 'across' },
} as const;

const EcoCrosswordGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [grid, setGrid] = useState<Array<Array<string | null>>>([]);
    const [userGrid, setUserGrid] = useState<Array<Array<string>>>([]);
    const [finalScore, setFinalScore] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
    
    useEffect(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        const newUserGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
        inputRefs.current = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

        for (const word in CROSSWORD_DATA) {
            const { row, col, direction } = CROSSWORD_DATA[word as keyof typeof CROSSWORD_DATA];
            for (let i = 0; i < word.length; i++) {
                if (direction === 'across') {
                    newGrid[row][col + i] = word[i];
                } else {
                    newGrid[row + i][col] = word[i];
                }
            }
        }
        setGrid(newGrid);
        setUserGrid(newUserGrid);
    }, []);

    const handleStart = () => setGameState('playing');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) => {
        const val = e.target.value.toUpperCase().slice(-1);
        const newUserGrid = userGrid.map(row => [...row]);
        newUserGrid[r][c] = val;
        setUserGrid(newUserGrid);

        // Auto-focus next input
        if (val !== '') {
            // A simple forward movement. A real crossword would move along the word's direction.
            const nextC = (c + 1) % GRID_SIZE;
            const nextR = nextC === 0 ? r + 1 : r;
            if (nextR < GRID_SIZE && grid[nextR][nextC]) {
                 inputRefs.current[nextR][nextC]?.focus();
            }
        }
    };
    
    const checkAnswers = () => {
        let correctWords = 0;
        for (const word in CROSSWORD_DATA) {
            const { row, col, direction } = CROSSWORD_DATA[word as keyof typeof CROSSWORD_DATA];
            let isCorrect = true;
            for (let i = 0; i < word.length; i++) {
                if (direction === 'across') {
                    if (userGrid[row][col + i] !== word[i]) isCorrect = false;
                } else {
                    if (userGrid[row + i][col] !== word[i]) isCorrect = false;
                }
            }
            if (isCorrect) correctWords++;
        }
        const score = correctWords * 100;
        setFinalScore(score);
        setGameState('finished');
        onGameEnd(score);
    };


    if (gameState === 'ready') {
         return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_eco_crossword_title')}</h3>
                <p className="text-gray-300 mb-6">{t('eco_crossword_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{finalScore}</span></p>
                <p className="text-md mb-4">{`${t('correct_words')}: ${finalScore / 100} / ${Object.keys(CROSSWORD_DATA).length}`}</p>
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
        <div className="text-white flex flex-col md:flex-row items-center md:items-start p-2 gap-4">
            <div className="grid-container flex-shrink-0">
                 {grid.map((row, r) => (
                    <div key={r} className="flex">
                        {row.map((cell, c) => (
                            <div key={`${r}-${c}`} className="relative w-7 h-7 sm:w-8 sm:h-8">
                                {cell ? (
                                    <input
                                        // FIX: Corrected ref assignment to have a void return type.
                                        ref={el => { inputRefs.current[r][c] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={userGrid[r][c]}
                                        onChange={(e) => handleInputChange(e, r, c)}
                                        className="w-full h-full text-center bg-gray-200 text-gray-900 font-bold uppercase rounded-sm"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 rounded-sm"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex-grow text-sm space-y-4">
                <div>
                    <h4 className="font-bold text-yellow-400">{t('across')}</h4>
                    <p>1. {t(CROSSWORD_DATA.BIODIVERSITY.clueKey)}</p>
                    <p>2. {t(CROSSWORD_DATA.SOLAR.clueKey)}</p>
                    <p>3. {t(CROSSWORD_DATA.GREENHOUSEGAS.clueKey)}</p>
                </div>
                <div>
                    <h4 className="font-bold text-yellow-400">{t('down')}</h4>
                     <p>1. {t(CROSSWORD_DATA.RECYCLE.clueKey)}</p>
                     <p>2. {t(CROSSWORD_DATA.FOREST.clueKey)}</p>
                </div>
                 <button onClick={checkAnswers} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    {t('check_answers')}
                </button>
            </div>
        </div>
    );
};

export default EcoCrosswordGame;
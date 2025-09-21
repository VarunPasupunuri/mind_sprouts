import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

// FIX: Add 'as const' to ensure nameKey has a literal type for the t() function.
const RECIPES = [
    { nameKey: 'bird_feeder', emoji: '🐦🏠', ingredients: ['plastic_bottle', 'sticks', 'twine'] },
] as const;
const ALL_INGREDIENTS = [
    { nameKey: 'plastic_bottle', emoji: '🍾' },
    { nameKey: 'sticks', emoji: '🥢' },
    { nameKey: 'twine', emoji: '🧵' },
    { nameKey: 'item_apple_core', emoji: '🍎' },
    { nameKey: 'item_newspaper', emoji: '📰' },
];

const UpcycleWorkshopGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [score, setScore] = useState(0);
    const [workbench, setWorkbench] = useState<string[]>([]);
    const [recipe, setRecipe] = useState(RECIPES[0]);

    const handleStart = () => {
        setGameState('playing');
        setScore(0);
        setWorkbench([]);
    };
    
    const handleDrop = (ingredientKey: string) => {
        if(workbench.includes(ingredientKey)) return;
        setWorkbench(prev => [...prev, ingredientKey]);
    };

    useEffect(() => {
        if (workbench.length === recipe.ingredients.length) {
            const isCorrect = recipe.ingredients.every(ing => workbench.includes(ing));
            if (isCorrect) {
                const newScore = score + 100;
                setScore(newScore);
                setGameState('finished');
                onGameEnd(newScore);
            } else {
                setGameState('finished');
                onGameEnd(score);
            }
        }
    }, [workbench, recipe, score, onGameEnd]);
    

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_upcycle_workshop_title')}</h3>
                <p className="text-gray-300 mb-6">{t('upcycle_workshop_instructions')}</p>
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
        <div className="text-white p-2 sm:p-4 text-center">
            <h4 className="text-lg font-bold">{t('craft_item')}: {t(recipe.nameKey)} {recipe.emoji}</h4>
            <div className="my-4 h-32 bg-yellow-800/50 rounded-lg flex items-center justify-center space-x-4 p-4" >
                {workbench.map(key => (
                    <span key={key} className="text-4xl">{ALL_INGREDIENTS.find(i => i.nameKey === key)?.emoji}</span>
                ))}
            </div>
            <p className="mb-4">Drag items to the workbench:</p>
            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-700 rounded-lg">
                {ALL_INGREDIENTS.map(ing => (
                    <div key={ing.nameKey} draggable onDragEnd={() => handleDrop(ing.nameKey)} className="text-4xl cursor-grab">
                        {ing.emoji}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcycleWorkshopGame;

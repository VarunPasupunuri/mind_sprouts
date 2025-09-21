import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface Choice {
    textKey: any;
    ecoPoints: number;
    cost: number;
}

interface ShoppingItem {
    nameKey: any;
    choices: Choice[];
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const SHOPPING_LIST: ShoppingItem[] = [
    {
        nameKey: 'item_milk',
        choices: [
            { textKey: 'choice_milk_1', ecoPoints: 15, cost: 4 },
            { textKey: 'choice_milk_2', ecoPoints: 5, cost: 3 },
            { textKey: 'choice_milk_3', ecoPoints: 0, cost: 2 },
        ]
    },
    {
        nameKey: 'item_eggs',
        choices: [
            { textKey: 'choice_eggs_1', ecoPoints: 15, cost: 5 },
            { textKey: 'choice_eggs_2', ecoPoints: 5, cost: 3 },
            { textKey: 'choice_eggs_3', ecoPoints: 0, cost: 2 },
        ]
    },
    {
        nameKey: 'item_bread',
        choices: [
            { textKey: 'choice_bread_1', ecoPoints: 15, cost: 6 },
            { textKey: 'choice_bread_2', ecoPoints: 5, cost: 4 },
            { textKey: 'choice_bread_3', ecoPoints: 0, cost: 3 },
        ]
    }
];

const GAME_PARAMS: Record<Difficulty, { budget: number }> = {
    [Difficulty.EASY]: { budget: 20 },
    [Difficulty.MEDIUM]: { budget: 15 },
    [Difficulty.HARD]: { budget: 12 },
};

const EcoShopperGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [budget, setBudget] = useState(gameParams.budget);
    const [ecoScore, setEcoScore] = useState(0);
    const [error, setError] = useState('');

    const handleStart = () => {
        setGameState('playing');
        setCurrentItemIndex(0);
        setBudget(gameParams.budget);
        setEcoScore(0);
        setError('');
    };
    
    const handleChoice = (choice: Choice) => {
        if (choice.cost > budget) {
            setError('Not enough budget for this item!');
            setTimeout(() => setError(''), 2000);
            return;
        }

        setError('');
        const newEcoScore = ecoScore + choice.ecoPoints;
        setBudget(prev => prev - choice.cost);
        setEcoScore(newEcoScore);

        if (currentItemIndex < SHOPPING_LIST.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        } else {
            setGameState('finished');
            onGameEnd(newEcoScore);
        }
    };
    
    const currentItem = SHOPPING_LIST[currentItemIndex];

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_eco_shopper_title')}</h3>
                <p className="text-gray-300 mb-6">{t('eco_shopper_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    {t('start_game')}
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('shopping_complete')}</h3>
                <p className="text-lg mb-4">{t('final_eco_score')}: <span className="font-bold text-2xl">{ecoScore}</span></p>
                <p className="text-md mb-4">{t('budget')} left: ${budget.toFixed(2)}</p>
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
        <div className="text-white p-2 sm:p-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('budget')}: <span className="font-bold text-green-400">${budget.toFixed(2)}</span></div>
                <div className="text-lg">{t('eco_points')}: <span className="font-bold text-yellow-400">{ecoScore}</span></div>
            </div>
            <div className="w-full text-center mb-6">
                <p className="text-gray-400">{`${t('shopping_list')}: ${currentItemIndex + 1} / ${SHOPPING_LIST.length}`}</p>
                <h4 className="text-xl font-semibold mt-1">Buy: {t(currentItem.nameKey)}</h4>
            </div>
            <div className="space-y-3">
                 {currentItem.choices.map((choice) => (
                    <button 
                        key={choice.textKey} 
                        onClick={() => handleChoice(choice)} 
                        className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                        disabled={choice.cost > budget}
                    >
                        {t(choice.textKey)}
                    </button>
                ))}
            </div>
            {error && <p className="text-center text-red-400 mt-4">{error}</p>}
        </div>
    );
};

export default EcoShopperGame;
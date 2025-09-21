import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const SOURCES = {
    solar: { cost: 150, power: 20 },
    wind: { cost: 250, power: 35 },
};

const GAME_PARAMS: Record<Difficulty, { budget: number; demand: number }> = {
    [Difficulty.EASY]: { budget: 1500, demand: 80 },
    [Difficulty.MEDIUM]: { budget: 1000, demand: 100 },
    [Difficulty.HARD]: { budget: 800, demand: 120 },
};

const RenewableEnergyBuilderGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const gameParams = GAME_PARAMS[difficulty];
    const [gameState, setGameState] = useState<GameState>('ready');
    const [budget, setBudget] = useState(gameParams.budget);
    const [supply, setSupply] = useState(0);
    const [placements, setPlacements] = useState({ solar: 0, wind: 0 });
    const [winMessage, setWinMessage] = useState('');
    
    const handleStart = () => {
        setGameState('playing');
        setBudget(gameParams.budget);
        setSupply(0);
        setPlacements({ solar: 0, wind: 0 });
        setWinMessage('');
    };

    const addSource = (type: 'solar' | 'wind') => {
        if (gameState !== 'playing') return;
        
        const source = SOURCES[type];
        if (budget < source.cost) return;

        setBudget(prev => prev - source.cost);
        setSupply(prev => prev + source.power);
        setPlacements(prev => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const finishGame = () => {
        if (supply >= gameParams.demand) {
            setWinMessage(t('win_message'));
            const score = budget * 2 + supply; // Bonus for leftover budget
            onGameEnd(score);
        } else {
            setWinMessage(t('lose_message_power'));
            onGameEnd(0);
        }
        setGameState('finished');
    };

    if (gameState === 'ready') {
         return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_renewable_energy_title')}</h3>
                <p className="text-gray-300 mb-6">{t('renewable_energy_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    {t('start_game')}
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        const finalScore = budget * 2 + supply;
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{winMessage}</p>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{supply >= gameParams.demand ? finalScore : 0}</span></p>
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
    
    const supplyPercentage = Math.min(100, (supply / gameParams.demand) * 100);

    return (
        <div className="text-white p-2 sm:p-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('budget')}: <span className="font-bold text-green-400">${budget}</span></div>
            </div>

            <div className="my-6">
                <h4 className="text-center font-semibold">{`${t('power_supply')} (${supply}) vs ${t('power_demand')} (${gameParams.demand})`}</h4>
                <div className="w-full bg-gray-600 rounded-full h-8 mt-2">
                    <div className="bg-yellow-400 h-8 rounded-full" style={{ width: `${supplyPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-5xl">☀️</p>
                    <h5 className="font-bold">{t('solar_panel')} ({placements.solar})</h5>
                    <p>{t('cost')}: ${SOURCES.solar.cost}</p>
                    <p>{t('power')}: {SOURCES.solar.power}</p>
                    <button onClick={() => addSource('solar')} disabled={budget < SOURCES.solar.cost} className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                        {t('place_solar')}
                    </button>
                </div>
                 <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-5xl">💨</p>
                    <h5 className="font-bold">{t('wind_turbine')} ({placements.wind})</h5>
                    <p>{t('cost')}: ${SOURCES.wind.cost}</p>
                    <p>{t('power')}: {SOURCES.wind.power}</p>
                    <button onClick={() => addSource('wind')} disabled={budget < SOURCES.wind.cost} className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                        {t('place_wind')}
                    </button>
                </div>
            </div>

            <button onClick={finishGame} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
                Finish & Check Power
            </button>
        </div>
    );
};

export default RenewableEnergyBuilderGame;
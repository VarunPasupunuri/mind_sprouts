import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface CityStats {
    pop: number;
    env: number;
    treas: number;
}

// FIX: Add 'as const' to ensure eventKey and textKey have literal types for the t() function.
const EVENTS = [
    { eventKey: 'sim_event_1', choices: [
        { textKey: 'sim_choice_1a', effects: { pop: 10, env: -10, treas: -5 } },
        { textKey: 'sim_choice_1b', effects: { pop: 5, env: 5, treas: -10 } },
    ]},
    { eventKey: 'sim_event_2', choices: [
        { textKey: 'sim_choice_2a', effects: { pop: 2, env: 15, treas: -15 } },
        { textKey: 'sim_choice_2b', effects: { pop: 0, env: -5, treas: 10 } },
    ]},
] as const;

const SustainableCitySimGame: React.FC<{ onGameEnd: (score: number) => void; onExit: () => void; difficulty: Difficulty; }> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [turn, setTurn] = useState(0);
    const [stats, setStats] = useState<CityStats>({ pop: 50, env: 50, treas: 50 });
    const [message, setMessage] = useState('');
    
    const handleStart = () => {
        setGameState('playing');
        setTurn(0);
        setStats({ pop: 50, env: 50, treas: 50 });
        setMessage('');
    };
    
    const handleChoice = (effects: Partial<CityStats>) => {
        const newStats = {
            pop: stats.pop + (effects.pop || 0),
            env: Math.min(100, stats.env + (effects.env || 0)),
            treas: stats.treas + (effects.treas || 0),
        };
        setStats(newStats);

        const nextTurn = turn + 1;
        if (nextTurn >= EVENTS.length || newStats.treas < 0) {
            setGameState('finished');
            const finalScore = newStats.pop + newStats.env + newStats.treas;
            if(newStats.treas < 0 || newStats.env < 20) {
                setMessage(t('sim_lose'));
                onGameEnd(0);
            } else {
                 setMessage(t('sim_win'));
                 onGameEnd(finalScore);
            }
        } else {
            setTurn(nextTurn);
        }
    };
    
    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_sustainable_city_sim_title')}</h3>
                <p className="text-gray-300 mb-6">{t('sustainable_city_sim_instructions')}</p>
                <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    {t('start_game')}
                </button>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        const finalScore = stats.pop + stats.env + stats.treas;
        return (
             <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{message}</p>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{stats.treas < 0 || stats.env < 20 ? 0 : finalScore}</span></p>
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
    
    const currentEvent = EVENTS[turn];

    return (
        <div className="text-white p-2 sm:p-4">
            <div className="flex justify-around items-center mb-6 text-center">
                <div><p className="text-xs">{t('population')}</p><p className="font-bold text-lg">{stats.pop}K</p></div>
                <div><p className="text-xs">{t('environment')}</p><p className="font-bold text-lg">{stats.env}%</p></div>
                <div><p className="text-xs">{t('treasury')}</p><p className="font-bold text-lg">${stats.treas}M</p></div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold mb-4 text-center">{t('year')} {turn + 1}</p>
                <p className="mb-4">{t(currentEvent.eventKey)}</p>
                <div className="space-y-2">
                    {currentEvent.choices.map(choice => (
                        <button key={choice.textKey} onClick={() => handleChoice(choice.effects)} className="w-full text-left p-3 bg-blue-600 hover:bg-blue-500 rounded">
                            {t(choice.textKey)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SustainableCitySimGame;

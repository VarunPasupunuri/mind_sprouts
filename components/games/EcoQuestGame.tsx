import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';
import { UploadIcon, CheckmarkIcon, ChevronDownIcon } from '../Icons';

type GameState = 'ready' | 'playing' | 'finished';

interface Quest {
  id: number;
  titleKey: any;
  descriptionKey: any;
  points: number;
  completed: boolean;
  proofImageName?: string;
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const ALL_QUESTS: Omit<Quest, 'completed' | 'proofImageName'>[] = [
    { id: 1, titleKey: 'quest_refill_station_title', descriptionKey: 'quest_refill_station_desc', points: 50 },
    { id: 2, titleKey: 'quest_bike_rack_title', descriptionKey: 'quest_bike_rack_desc', points: 50 },
    { id: 3, titleKey: 'quest_sustainability_poster_title', descriptionKey: 'quest_sustainability_poster_desc', points: 75 },
    { id: 4, titleKey: 'quest_native_plant_title', descriptionKey: 'quest_native_plant_desc', points: 100 },
    { id: 5, titleKey: 'quest_solar_panel_title', descriptionKey: 'quest_solar_panel_desc', points: 125 },
    { id: 6, titleKey: 'quest_ev_charger_title', descriptionKey: 'quest_ev_charger_desc', points: 150 },
];

const QUESTS_BY_DIFFICULTY: Record<Difficulty, number> = {
    [Difficulty.EASY]: 3,
    [Difficulty.MEDIUM]: 4,
    [Difficulty.HARD]: 6,
};

const QuestItem: React.FC<{ quest: Quest; onComplete: (id: number, file: File) => void; }> = ({ quest, onComplete }) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            onComplete(quest.id, selectedFile);
        }
    };

    return (
        <div className="border border-gray-600 rounded-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-gray-700 hover:bg-gray-600 text-left">
                <div className="flex items-center space-x-3">
                    {quest.completed ? <CheckmarkIcon className="w-5 h-5 text-green-400"/> : <div className="w-5 h-5 border-2 border-gray-400 rounded-full"/>}
                    <span className={`${quest.completed ? 'line-through text-gray-400' : ''}`}>{t(quest.titleKey)}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="font-bold text-yellow-400">+{quest.points} {t('points')}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-800 space-y-3">
                    <p className="text-sm text-gray-300">{t(quest.descriptionKey)}</p>
                    {quest.completed ? (
                        <div className="text-sm text-green-400 font-semibold p-2 bg-green-900/50 rounded-md">
                            {t('proof_uploaded')}: {quest.proofImageName}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                             <label className="flex-grow w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-500 rounded-md cursor-pointer hover:bg-gray-700">
                                <UploadIcon className="w-5 h-5" />
                                <span className="text-sm truncate">{selectedFile?.name || t('upload_proof')}</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <button type="submit" disabled={!selectedFile} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed">
                                {t('submit_proof')}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

const EcoQuestGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [quests, setQuests] = useState<Quest[]>([]);
    const [score, setScore] = useState(0);

    const initialQuests = useMemo(() => {
        const numQuests = QUESTS_BY_DIFFICULTY[difficulty];
        return ALL_QUESTS.slice(0, numQuests).map(q => ({ ...q, completed: false }));
    }, [difficulty]);
    
    useEffect(() => {
        const completedQuests = quests.filter(q => q.completed).length;
        if (quests.length > 0 && completedQuests === quests.length) {
            setGameState('finished');
            onGameEnd(score);
        }
    }, [quests, score, onGameEnd]);

    const handleStart = () => {
        setQuests(initialQuests);
        setScore(0);
        setGameState('playing');
    };

    const handleCompleteQuest = (id: number, file: File) => {
        const quest = quests.find(q => q.id === id);
        if (quest && !quest.completed) {
            setScore(prev => prev + quest.points);
            setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true, proofImageName: file.name } : q));
        }
    };
    
    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_eco_quest_title')}</h3>
                <p className="text-gray-300 mb-6">{t('eco_quest_instructions')}</p>
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
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{score}</span></p>
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

    const completedCount = quests.filter(q => q.completed).length;

    return (
        <div className="text-white p-2 sm:p-4">
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="text-lg">{t('score')}: <span className="font-bold">{score}</span></div>
                <div className="text-lg">{t('quests_completed')}: <span className="font-bold">{completedCount} / {quests.length}</span></div>
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-xl mb-2">{t('quest_log')}</h4>
                {quests.map(q => (
                    <QuestItem key={q.id} quest={q} onComplete={handleCompleteQuest} />
                ))}
            </div>
        </div>
    );
};

export default EcoQuestGame;
import React, { useState } from 'react';
import { PuzzleIcon, RapidFireIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import GamePlayer from './GamePlayer';
import { Difficulty } from '../types';
import DifficultySelectionModal from './DifficultySelectionModal';
import { useAuth } from '../hooks/useAuth';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
  onClick: () => void;
}

const GameCard: React.FC<Omit<GameCardProps, 'darkBgColor' | 'darkTextColor'> & { darkBgColor?: string, darkTextColor?: string }> = ({ title, description, icon, bgColor, textColor, darkBgColor, darkTextColor, onClick }) => {
    const { t } = useI18n();
    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 group flex flex-col">
        <div className={`rounded-lg w-12 h-12 flex items-center justify-center ${bgColor} ${darkBgColor}`}>
            {icon}
        </div>
        <h3 className={`text-lg font-bold text-gray-800 dark:text-gray-100 mt-4`}>{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex-grow">{description}</p>
        <button 
            onClick={onClick}
            className={`mt-4 w-full ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor} font-semibold py-2 px-4 rounded-lg opacity-80 group-hover:opacity-100`}
        >
            {t('play_now')}
        </button>
    </div>
    )
};


const InteractiveQuizzes: React.FC = () => {
    const { t } = useI18n();
    const { highScores } = useAuth();
    const [gameForDifficultySelection, setGameForDifficultySelection] = useState<string | null>(null);
    const [activeGame, setActiveGame] = useState<{ id: string; difficulty: Difficulty } | null>(null);

    const quizList = [
        { titleKey: 'game_recycling_sort_title', descriptionKey: 'game_recycling_sort_desc', icon: <PuzzleIcon className="w-6 h-6 text-blue-800" />, bgColor: 'bg-blue-100', textColor: 'text-blue-800', darkBgColor: 'dark:bg-blue-900/50', darkTextColor: 'dark:text-blue-300' },
        { titleKey: 'game_biodiversity_match_title', descriptionKey: 'game_biodiversity_match_desc', icon: <PuzzleIcon className="w-6 h-6 text-purple-800" />, bgColor: 'bg-purple-100', textColor: 'text-purple-800', darkBgColor: 'dark:bg-purple-900/50', darkTextColor: 'dark:text-purple-300' },
        { titleKey: 'game_carbon_footprint_quiz_title', descriptionKey: 'game_carbon_footprint_quiz_desc', icon: <PuzzleIcon className="w-6 h-6 text-red-800" />, bgColor: 'bg-red-100', textColor: 'text-red-800', darkBgColor: 'dark:bg-red-900/50', darkTextColor: 'dark:text-red-300' },
        { titleKey: 'game_eco_crossword_title', descriptionKey: 'game_eco_crossword_desc', icon: <PuzzleIcon className="w-6 h-6 text-green-800" />, bgColor: 'bg-green-100', textColor: 'text-green-800', darkBgColor: 'dark:bg-green-900/50', darkTextColor: 'dark:text-green-300' },
        { titleKey: 'game_eco_dos_donts_title', descriptionKey: 'game_eco_dos_donts_desc', icon: <RapidFireIcon className="w-6 h-6 text-orange-800" />, bgColor: 'bg-orange-100', textColor: 'text-orange-800', darkBgColor: 'dark:bg-orange-900/50', darkTextColor: 'dark:text-orange-300' },
        { titleKey: 'game_water_saver_title', descriptionKey: 'game_water_saver_desc', icon: <PuzzleIcon className="w-6 h-6 text-indigo-800" />, bgColor: 'bg-indigo-100', textColor: 'text-indigo-800', darkBgColor: 'dark:bg-indigo-900/50', darkTextColor: 'dark:text-indigo-300' },
    ];
    
    const handleStartGame = (difficulty: Difficulty) => {
        if (gameForDifficultySelection) {
            setActiveGame({ id: gameForDifficultySelection, difficulty });
            setGameForDifficultySelection(null);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('interactive_quizzes')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('interactive_quizzes_subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quizList.map(game => (
                        <GameCard 
                            key={game.titleKey} 
                            title={t(game.titleKey as any)} 
                            description={t(game.descriptionKey as any)} 
                            icon={game.icon}
                            bgColor={game.bgColor}
                            textColor={game.textColor}
                            darkBgColor={game.darkBgColor}
                            darkTextColor={game.darkTextColor}
                            onClick={() => setGameForDifficultySelection(game.titleKey)}
                        />
                    ))}
                </div>
            </div>

            {gameForDifficultySelection && (
                <DifficultySelectionModal
                    gameId={gameForDifficultySelection}
                    gameTitle={t(gameForDifficultySelection as any)}
                    highScores={highScores[gameForDifficultySelection] || {}}
                    onStart={handleStartGame}
                    onClose={() => setGameForDifficultySelection(null)}
                />
            )}

            {activeGame && (
                <GamePlayer 
                    gameId={activeGame.id}
                    difficulty={activeGame.difficulty}
                    onClose={() => setActiveGame(null)}
                />
            )}
        </>
    );
};

export default InteractiveQuizzes;
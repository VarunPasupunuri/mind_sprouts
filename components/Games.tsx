
import React, { useState } from 'react';
import { PuzzleIcon, MapIcon, RapidFireIcon } from './Icons';
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 group flex flex-col border border-green-200 dark:border-green-800">
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

const Games: React.FC = () => {
    const { t } = useI18n();
    const { highScores } = useAuth();
    const [gameForDifficultySelection, setGameForDifficultySelection] = useState<string | null>(null);
    const [activeGame, setActiveGame] = useState<{ id: string; difficulty: Difficulty } | null>(null);

    const gameList = [
        { titleKey: 'game_eco_dos_donts_title', descriptionKey: 'game_eco_dos_donts_desc', icon: <RapidFireIcon className="w-6 h-6 text-orange-800" />, bgColor: 'bg-orange-100', textColor: 'text-orange-800', darkBgColor: 'dark:bg-orange-900/50', darkTextColor: 'dark:text-orange-300' },
        { titleKey: 'game_eco_quest_title', descriptionKey: 'game_eco_quest_desc', icon: <MapIcon className="w-6 h-6 text-green-800" />, bgColor: 'bg-green-100', textColor: 'text-green-800', darkBgColor: 'dark:bg-green-900/50', darkTextColor: 'dark:text-green-300' },
        { titleKey: 'game_recycling_sort_title', descriptionKey: 'game_recycling_sort_desc', icon: <PuzzleIcon className="w-6 h-6 text-blue-800" />, bgColor: 'bg-blue-100', textColor: 'text-blue-800', darkBgColor: 'dark:bg-blue-900/50', darkTextColor: 'dark:text-blue-300' },
        { titleKey: 'game_eco_crossword_title', descriptionKey: 'game_eco_crossword_desc', icon: <PuzzleIcon className="w-6 h-6 text-green-800" />, bgColor: 'bg-green-100', textColor: 'text-green-800', darkBgColor: 'dark:bg-green-900/50', darkTextColor: 'dark:text-green-300' },
        { titleKey: 'game_water_saver_title', descriptionKey: 'game_water_saver_desc', icon: <PuzzleIcon className="w-6 h-6 text-indigo-800" />, bgColor: 'bg-indigo-100', textColor: 'text-indigo-800', darkBgColor: 'dark:bg-indigo-900/50', darkTextColor: 'dark:text-indigo-300' },
        { titleKey: 'game_carbon_footprint_quiz_title', descriptionKey: 'game_carbon_footprint_quiz_desc', icon: <PuzzleIcon className="w-6 h-6 text-red-800" />, bgColor: 'bg-red-100', textColor: 'text-red-800', darkBgColor: 'dark:bg-red-900/50', darkTextColor: 'dark:text-red-300' },
        { titleKey: 'game_biodiversity_match_title', descriptionKey: 'game_biodiversity_match_desc', icon: <PuzzleIcon className="w-6 h-6 text-purple-800" />, bgColor: 'bg-purple-100', textColor: 'text-purple-800', darkBgColor: 'dark:bg-purple-900/50', darkTextColor: 'dark:text-purple-300' },
        { titleKey: 'game_renewable_energy_title', descriptionKey: 'game_renewable_energy_desc', icon: <PuzzleIcon className="w-6 h-6 text-yellow-800" />, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', darkBgColor: 'dark:bg-yellow-900/50', darkTextColor: 'dark:text-yellow-300' },
        { titleKey: 'game_eco_shopper_title', descriptionKey: 'game_eco_shopper_desc', icon: <PuzzleIcon className="w-6 h-6 text-pink-800" />, bgColor: 'bg-pink-100', textColor: 'text-pink-800', darkBgColor: 'dark:bg-pink-900/50', darkTextColor: 'dark:text-pink-300' },
        { titleKey: 'game_pollution_patrol_title', descriptionKey: 'game_pollution_patrol_desc', icon: <PuzzleIcon className="w-6 h-6 text-teal-800" />, bgColor: 'bg-teal-100', textColor: 'text-teal-800', darkBgColor: 'dark:bg-teal-900/50', darkTextColor: 'dark:text-teal-300' },
        { titleKey: 'game_afforestation_adventure_title', descriptionKey: 'game_afforestation_adventure_desc', icon: <PuzzleIcon className="w-6 h-6 text-lime-800" />, bgColor: 'bg-lime-100', textColor: 'text-lime-800', darkBgColor: 'dark:bg-lime-900/50', darkTextColor: 'dark:text-lime-300' },
        { titleKey: 'game_sustainable_city_sim_title', descriptionKey: 'game_sustainable_city_sim_desc', icon: <PuzzleIcon className="w-6 h-6 text-cyan-800" />, bgColor: 'bg-cyan-100', textColor: 'text-cyan-800', darkBgColor: 'dark:bg-cyan-900/50', darkTextColor: 'dark:text-cyan-300' },
        { titleKey: 'game_ocean_cleanup_title', descriptionKey: 'game_ocean_cleanup_desc', icon: <PuzzleIcon className="w-6 h-6 text-sky-800" />, bgColor: 'bg-sky-100', textColor: 'text-sky-800', darkBgColor: 'dark:bg-sky-900/50', darkTextColor: 'dark:text-sky-300' },
        { titleKey: 'game_upcycle_workshop_title', descriptionKey: 'game_upcycle_workshop_desc', icon: <PuzzleIcon className="w-6 h-6 text-orange-800" />, bgColor: 'bg-orange-100', textColor: 'text-orange-800', darkBgColor: 'dark:bg-orange-900/50', darkTextColor: 'dark:text-orange-300' },
        { titleKey: 'game_wildlife_rescue_title', descriptionKey: 'game_wildlife_rescue_desc', icon: <PuzzleIcon className="w-6 h-6 text-amber-800" />, bgColor: 'bg-amber-100', textColor: 'text-amber-800', darkBgColor: 'dark:bg-amber-900/50', darkTextColor: 'dark:text-amber-300' },
        { titleKey: 'game_invasive_species_invasion_title', descriptionKey: 'game_invasive_species_invasion_desc', icon: <PuzzleIcon className="w-6 h-6 text-rose-800" />, bgColor: 'bg-rose-100', textColor: 'text-rose-800', darkBgColor: 'dark:bg-rose-900/50', darkTextColor: 'dark:text-rose-300' },
        { titleKey: 'game_compost_master_title', descriptionKey: 'game_compost_master_desc', icon: <PuzzleIcon className="w-6 h-6 text-stone-800" />, bgColor: 'bg-stone-100', textColor: 'text-stone-800', darkBgColor: 'dark:bg-stone-700', darkTextColor: 'dark:text-stone-300' },
        { titleKey: 'game_farm_to_table_dash_title', descriptionKey: 'game_farm_to_table_dash_desc', icon: <PuzzleIcon className="w-6 h-6 text-emerald-800" />, bgColor: 'bg-emerald-100', textColor: 'text-emerald-800', darkBgColor: 'dark:bg-emerald-900/50', darkTextColor: 'dark:text-emerald-300' },
        { titleKey: 'game_ghg_dodger_title', descriptionKey: 'game_ghg_dodger_desc', icon: <PuzzleIcon className="w-6 h-6 text-gray-800" />, bgColor: 'bg-gray-200', textColor: 'text-gray-800', darkBgColor: 'dark:bg-gray-700', darkTextColor: 'dark:text-gray-300' },
        { titleKey: 'game_food_chain_challenge_title', descriptionKey: 'game_food_chain_challenge_desc', icon: <PuzzleIcon className="w-6 h-6 text-fuchsia-800" />, bgColor: 'bg-fuchsia-100', textColor: 'text-fuchsia-800', darkBgColor: 'dark:bg-fuchsia-900/50', darkTextColor: 'dark:text-fuchsia-300' },
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
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('games_and_puzzles')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('games_subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gameList.map(game => (
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

export default Games;
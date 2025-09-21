
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from './Icons';
import RecyclingSortGame from './games/RecyclingSortGame';
import CarbonFootprintQuizGame from './games/CarbonFootprintQuizGame';
import BiodiversityMatchGame from './games/BiodiversityMatchGame';
import WaterSaverGame from './games/WaterSaverGame';
import EcoCrosswordGame from './games/EcoCrosswordGame';
import RenewableEnergyBuilderGame from './games/RenewableEnergyBuilderGame';
import EcoShopperGame from './games/EcoShopperGame';
import { Difficulty } from '../types';
import PollutionPatrolGame from './games/PollutionPatrolGame';
import AfforestationAdventureGame from './games/AfforestationAdventureGame';
import SustainableCitySimGame from './games/SustainableCitySimGame';
import OceanCleanupGame from './games/OceanCleanupGame';
import UpcycleWorkshopGame from './games/UpcycleWorkshopGame';
import WildlifeRescueGame from './games/WildlifeRescueGame';
import InvasiveSpeciesInvasionGame from './games/InvasiveSpeciesInvasionGame';
import CompostMasterGame from './games/CompostMasterGame';
import FarmToTableDashGame from './games/FarmToTableDashGame';
import GhgDodgerGame from './games/GhgDodgerGame';
import EcoQuestGame from './games/EcoQuestGame';
import EcoDosDontsGame from './games/EcoDosDontsGame';
import FoodChainChallengeGame from './games/FoodChainChallengeGame';


interface GamePlayerProps {
    gameId: string;
    difficulty: Difficulty;
    onClose: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ gameId, difficulty, onClose }) => {
    const { addPoints, updateHighScore } = useAuth();
    const { t } = useI18n();

    const handleGameEnd = (score: number) => {
        updateHighScore(gameId, difficulty, score);
        // Award a portion of the game score as platform points.
        // e.g., 1 platform point for every 10 game points.
        const pointsEarned = Math.floor(score / 10);
        if (pointsEarned > 0) {
            addPoints(pointsEarned);
        }
    };

    const gameTitle = `${t(gameId)} - ${t(`difficulty_${difficulty.toLowerCase()}`)}`;

    const renderGame = () => {
        const commonProps = {
            onGameEnd: handleGameEnd,
            onExit: onClose,
            difficulty,
        };
        switch(gameId) {
            case 'game_eco_dos_donts_title':
                return <EcoDosDontsGame {...commonProps} />;
            case 'game_eco_quest_title':
                return <EcoQuestGame {...commonProps} />;
            case 'game_recycling_sort_title':
                return <RecyclingSortGame {...commonProps} />;
            case 'game_carbon_footprint_quiz_title':
                return <CarbonFootprintQuizGame {...commonProps} />;
            case 'game_biodiversity_match_title':
                return <BiodiversityMatchGame {...commonProps} />;
            case 'game_water_saver_title':
                return <WaterSaverGame {...commonProps} />;
             case 'game_eco_crossword_title':
                return <EcoCrosswordGame {...commonProps} />;
            case 'game_renewable_energy_title':
                return <RenewableEnergyBuilderGame {...commonProps} />;
            case 'game_eco_shopper_title':
                return <EcoShopperGame {...commonProps} />;
            case 'game_pollution_patrol_title':
                return <PollutionPatrolGame {...commonProps} />;
            case 'game_afforestation_adventure_title':
                return <AfforestationAdventureGame {...commonProps} />;
            case 'game_sustainable_city_sim_title':
                return <SustainableCitySimGame {...commonProps} />;
            case 'game_ocean_cleanup_title':
                return <OceanCleanupGame {...commonProps} />;
            case 'game_upcycle_workshop_title':
                return <UpcycleWorkshopGame {...commonProps} />;
            case 'game_wildlife_rescue_title':
                return <WildlifeRescueGame {...commonProps} />;
            case 'game_invasive_species_invasion_title':
                return <InvasiveSpeciesInvasionGame {...commonProps} />;
            case 'game_compost_master_title':
                return <CompostMasterGame {...commonProps} />;
            case 'game_farm_to_table_dash_title':
                return <FarmToTableDashGame {...commonProps} />;
            case 'game_ghg_dodger_title':
                return <GhgDodgerGame {...commonProps} />;
            case 'game_food_chain_challenge_title':
                return <FoodChainChallengeGame {...commonProps} />;
            default:
                return (
                    <div className="text-center text-white p-8">
                        <h3 className="text-2xl font-bold mb-2">{t('coming_soon_title')}</h3>
                        <p>{t('coming_soon_desc')}</p>
                    </div>
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
            onClick={onClose}
        >
            <div 
                className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-gray-600"
                style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-600">
                    <h2 className="text-xl font-bold text-white">{gameTitle}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-1 sm:p-4 md:p-6">
                    {renderGame()}
                </div>
            </div>
             <style>{`
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default GamePlayer;
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { Difficulty } from '../types';
import { XIcon } from './Icons';

interface DifficultySelectionModalProps {
    gameTitle: string;
    gameId: string;
    highScores: Partial<Record<Difficulty, number>>;
    onStart: (difficulty: Difficulty) => void;
    onClose: () => void;
}

const DifficultyButton: React.FC<{
    difficulty: Difficulty;
    highScore: number;
    onClick: () => void;
}> = ({ difficulty, highScore, onClick }) => {
    const { t } = useI18n();
    const difficultyKey = `difficulty_${difficulty.toLowerCase()}` as any;
    const colors = {
        [Difficulty.EASY]: 'bg-green-500 hover:bg-green-600',
        [Difficulty.MEDIUM]: 'bg-yellow-500 hover:bg-yellow-600',
        [Difficulty.HARD]: 'bg-red-500 hover:bg-red-600',
    };

    return (
        <button onClick={onClick} className={`w-full p-4 rounded-lg text-white font-bold transition-transform transform hover:scale-105 active:scale-100 ${colors[difficulty]}`}>
            <p className="text-xl">{t(difficultyKey)}</p>
            <p className="text-sm font-normal">{t('high_score')}: {highScore}</p>
        </button>
    )
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({ gameTitle, highScores, onStart, onClose }) => {
    const { t } = useI18n();

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border-2 border-gray-600 p-6 text-center"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white btn-subtle-interactive" aria-label="Close modal">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">{gameTitle}</h2>
                <p className="text-gray-300 mb-6">{t('select_difficulty')}</p>
                <div className="space-y-4">
                    <DifficultyButton difficulty={Difficulty.EASY} highScore={highScores[Difficulty.EASY] || 0} onClick={() => onStart(Difficulty.EASY)} />
                    <DifficultyButton difficulty={Difficulty.MEDIUM} highScore={highScores[Difficulty.MEDIUM] || 0} onClick={() => onStart(Difficulty.MEDIUM)} />
                    <DifficultyButton difficulty={Difficulty.HARD} highScore={highScores[Difficulty.HARD] || 0} onClick={() => onStart(Difficulty.HARD)} />
                </div>
            </div>
        </div>
    );
};

export default DifficultySelectionModal;
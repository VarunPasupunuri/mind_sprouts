
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Difficulty } from '../../types';

type GameState = 'ready' | 'playing' | 'finished';

interface Card {
  id: number;
  nameKey: any;
  emoji: string;
}

interface GameProps {
    onGameEnd: (score: number) => void;
    onExit: () => void;
    difficulty: Difficulty;
}

const ANIMALS_ALL: Omit<Card, 'id'>[] = [
    { nameKey: 'animal_panda', emoji: '🐼' },
    { nameKey: 'animal_tiger', emoji: '🐯' },
    { nameKey: 'animal_gorilla', emoji: '🦍' },
    { nameKey: 'animal_rhino', emoji: '🦏' },
    { nameKey: 'animal_sea_turtle', emoji: '🐢' },
    { nameKey: 'animal_polar_bear', emoji: '🐻‍❄️' },
    { nameKey: 'animal_axolotl', emoji: '🦎' },
    { nameKey: 'animal_red_panda', emoji: '🐼' },
];

const CARDS_BY_DIFFICULTY: Record<Difficulty, Omit<Card, 'id'>[]> = {
    [Difficulty.EASY]: ANIMALS_ALL.slice(0, 4), // 4 pairs, 8 cards
    [Difficulty.MEDIUM]: ANIMALS_ALL.slice(0, 6), // 6 pairs, 12 cards
    [Difficulty.HARD]: ANIMALS_ALL.slice(0, 8), // 8 pairs, 16 cards
};

const BiodiversityMatchGame: React.FC<GameProps> = ({ onGameEnd, onExit, difficulty }) => {
    const { t } = useI18n();
    const [gameState, setGameState] = useState<GameState>('ready');
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const gameAnimals = CARDS_BY_DIFFICULTY[difficulty];

    const initializeGame = () => {
        const gameCards = [...gameAnimals, ...gameAnimals]
            .map((animal, index) => ({ ...animal, id: index }))
            .sort(() => Math.random() - 0.5);
        setCards(gameCards);
        setGameState('playing');
        setFlippedIndices([]);
        setMatchedPairs([]);
        setMoves(0);
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices;
            if (cards[firstIndex].nameKey === cards[secondIndex].nameKey) {
                setMatchedPairs(prev => [...prev, cards[firstIndex].nameKey]);
            }
            setTimeout(() => setFlippedIndices([]), 1000);
        }
    }, [flippedIndices, cards]);
    
    useEffect(() => {
        if (matchedPairs.length === gameAnimals.length && gameState === 'playing') {
            setGameState('finished');
            const scorePenalty = difficulty === Difficulty.HARD ? 20 : difficulty === Difficulty.MEDIUM ? 15 : 10;
            const score = Math.max(0, 1000 - moves * scorePenalty); 
            onGameEnd(score);
        }
    }, [matchedPairs, moves, onGameEnd, gameAnimals.length, difficulty, gameState]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].nameKey)) {
            return;
        }
        if (flippedIndices.length === 0) {
            setMoves(prev => prev + 1);
        }
        setFlippedIndices(prev => [...prev, index]);
    };

    if (gameState === 'ready') {
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-2xl font-bold mb-2">{t('game_biodiversity_match_title')}</h3>
                <p className="text-gray-300 mb-6">{t('biodiversity_match_instructions')}</p>
                <button onClick={initializeGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    {t('start_game')}
                </button>
            </div>
        );
    }
    
     if (gameState === 'finished') {
        const scorePenalty = difficulty === Difficulty.HARD ? 20 : difficulty === Difficulty.MEDIUM ? 15 : 10;
        const score = Math.max(0, 1000 - moves * scorePenalty);
        return (
            <div className="text-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2 text-yellow-400">{t('game_over')}</h3>
                <p className="text-lg mb-4">{t('final_score')}: <span className="font-bold text-2xl">{score}</span></p>
                <p className="text-md mb-4">{t('moves')}: {moves}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={initializeGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
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
        <div className="text-white flex flex-col items-center p-2 sm:p-4">
             <div className="w-full text-center mb-4 px-2">
                <div className="text-lg">{t('moves')}: <span className="font-bold">{moves}</span></div>
            </div>
            <div className={`grid ${difficulty === Difficulty.HARD ? 'grid-cols-4' : 'grid-cols-4'} gap-2 sm:gap-4 w-full max-w-md mx-auto`}>
                {cards.map((card, index) => {
                    const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.nameKey);
                    return (
                        <div key={card.id} onClick={() => handleCardClick(index)} className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                           <div className={`absolute w-full h-full backface-hidden rounded-lg ${isFlipped ? 'z-0' : 'z-10'} ${!isFlipped ? 'bg-blue-500 hover:bg-blue-400' : ''}`}></div>
                           <div className={`absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center rotate-y-180 ${isFlipped ? 'z-10' : 'z-0'} ${matchedPairs.includes(card.nameKey) ? 'bg-green-600' : 'bg-gray-700'}`}>
                                <span className="text-4xl">{card.emoji}</span>
                           </div>
                        </div>
                    );
                })}
            </div>
            <style>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

export default BiodiversityMatchGame;

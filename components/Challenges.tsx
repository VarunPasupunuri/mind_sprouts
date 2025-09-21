import React, { useState } from 'react';
import { MOCK_CHALLENGES } from '../constants';
import { Challenge, ChallengeCategory } from '../types';
import { useI18n } from '../hooks/useI18n';

const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
    const { t } = useI18n();
    return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${challenge.completed ? 'border-green-500 opacity-70' : 'border-yellow-500'} transition-transform duration-300 hover:scale-105 hover:shadow-lg`}>
        <div className="flex justify-between items-start">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700`}>{t(`category_${challenge.category}` as any)}</span>
            <div className="text-right">
                <p className="text-2xl font-bold text-yellow-500">{challenge.points}</p>
                <p className="text-xs text-gray-500">{t('points').toUpperCase()}</p>
            </div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mt-3">{t(challenge.titleKey as any)}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-4">{t(challenge.descriptionKey as any)}</p>
        {challenge.completed ? (
            <button disabled className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                {t('completed')}
            </button>
        ) : (
            <button className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300">
                {t('accept_challenge')}
            </button>
        )}
    </div>
    )
};

const Challenges: React.FC = () => {
    const { t } = useI18n();
    const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');

    const categories = ['all', ...Object.values(ChallengeCategory)];
    const filteredChallenges = selectedCategory === 'all'
        ? MOCK_CHALLENGES
        : MOCK_CHALLENGES.filter(c => c.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Challenges</h1>
                <p className="mt-1 text-gray-600">Complete challenges to earn points and climb the leaderboard.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        // FIX: Explicitly cast category to string for the key prop.
                        key={category.toString()}
                        onClick={() => setSelectedCategory(category as ChallengeCategory | 'all')}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                            selectedCategory === category
                                ? 'bg-green-600 text-white shadow'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {category === 'all' ? t('all') : t(`category_${category}` as any)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </div>
    );
};

export default Challenges;
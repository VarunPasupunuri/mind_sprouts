
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MOCK_LEADERBOARD } from '../constants';
import { LeaderboardUser } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { GiftIcon, ArrowUpIcon, ArrowDownIcon, TrophyIcon } from './Icons';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const PlayerSpotlight: React.FC<{ player: LeaderboardUser }> = ({ player }) => (
    <div className="bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-500 dark:to-orange-600 p-6 rounded-2xl shadow-2xl text-center text-white relative overflow-hidden card-hover">
        <TrophyIcon className="absolute -top-4 -left-4 w-24 h-24 text-white/10" />
        <TrophyIcon className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 transform rotate-12" />
        <img className="h-24 w-24 rounded-full object-cover mx-auto ring-4 ring-white/50" src={player.avatar} alt={`${player.name}'s avatar`} />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Top Performer</h2>
        <p className="text-xl font-semibold">{player.name}</p>
        <div className="mt-2 text-3xl font-extrabold">{player.points.toLocaleString()} PTS</div>
    </div>
);

const LeaderboardRow: React.FC<{ user: LeaderboardUser & { previousRank?: number }, isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
    const { t } = useI18n();
    const [animationClass, setAnimationClass] = useState('');
    const rankChange = user.previousRank ? user.previousRank - user.rank : 0; // Positive is up

    useEffect(() => {
        if (rankChange > 0) {
            setAnimationClass('animate-rank-up');
        } else if (rankChange < 0) {
            setAnimationClass('animate-rank-down');
        }
        const timer = setTimeout(() => setAnimationClass(''), 1500);
        return () => clearTimeout(timer);
    }, [user.rank, rankChange]);

    return (
        <tr className={`${isCurrentUser ? 'bg-green-100 dark:bg-green-900/50 scale-105 shadow-lg' : 'bg-white dark:bg-gray-800'} transition-all duration-300 ${animationClass} hover:bg-gray-50 dark:hover:bg-gray-700/30`}>
            <td data-label={t('rank')} className="px-6 py-4 whitespace-nowrap text-lg font-bold text-center text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-center md:justify-center gap-2">
                    <span>{user.rank}</span>
                    {/* FIX: Removed the 'title' prop from icon components to resolve a TypeScript compilation error. */}
                    {rankChange > 0 && <ArrowUpIcon className="w-5 h-5 text-green-500" />}
                    {rankChange < 0 && <ArrowDownIcon className="w-5 h-5 text-red-500" />}
                </div>
            </td>
            <td data-label={t('player')} className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                        <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt={`${user.name}'s avatar`} />
                    </div>
                    <div className="ml-4">
                        <div className="text-md font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.school}</div>
                    </div>
                </div>
            </td>
            <td data-label={t('points')} className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold text-yellow-600 dark:text-yellow-400">{user.points.toLocaleString()}</td>
        </tr>
    );
};

const Leaderboard: React.FC = () => {
    const { t } = useI18n();
    const { user, stats, gainPoints } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<(LeaderboardUser & { previousRank?: number })[]>([]);

    const fullLeaderboard = useMemo(() => {
        const otherPlayers = MOCK_LEADERBOARD.filter(u => u.name !== 'You');
        const currentUserEntry = {
            rank: 0, // Will be recalculated
            name: user?.userId || 'You',
            avatar: user?.avatar || 'https://picsum.photos/id/237/100/100',
            points: stats.points,
            school: user?.school || 'Your School',
        };

        const allPlayers = [...otherPlayers, currentUserEntry];
        return allPlayers
            .sort((a, b) => b.points - a.points)
            .map((p, index) => ({ ...p, rank: index + 1 }));

    }, [user, stats.points]);

    const prevLeaderboard = usePrevious(fullLeaderboard);

    useEffect(() => {
        const combinedData = fullLeaderboard.map(currentUser => {
            const prevUser = prevLeaderboard?.find(p => p.name === currentUser.name);
            return {
                ...currentUser,
                previousRank: prevUser?.rank
            };
        });
        setLeaderboardData(combinedData);
    }, [fullLeaderboard, prevLeaderboard]);

    const topPlayer = leaderboardData[0];

    return (
        <div className="space-y-6">
            <style>{`
                @media (max-width: 768px) {
                    .responsive-table thead {
                        display: none;
                    }
                    .responsive-table tr {
                        display: block;
                        margin-bottom: 1rem;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                        border: 1px solid #e5e7eb;
                    }
                    .dark .responsive-table tr {
                        border-color: #374151;
                    }
                    .responsive-table td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.75rem 1rem;
                        text-align: right;
                        border-bottom: 1px solid #e5e7eb;
                    }
                     .dark .responsive-table td {
                        border-bottom-color: #374151;
                    }
                    .responsive-table td:last-child {
                        border-bottom: 0;
                    }
                    .responsive-table td::before {
                        content: attr(data-label);
                        font-weight: 600;
                        text-align: left;
                        margin-right: 1rem;
                    }
                }
            `}</style>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('leaderboard')}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{t('leaderboard_subtitle')}</p>
                </div>
                <button
                    onClick={() => gainPoints(50)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg btn-hover"
                >
                    Simulate +50 Points
                </button>
            </div>
            
            {topPlayer && <PlayerSpotlight player={topPlayer} />}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 responsive-table">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('rank')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('player')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('points')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 md:divide-y-0">
                        {leaderboardData.map((u) => (
                            <LeaderboardRow key={u.name} user={u} isCurrentUser={user ? u.name === user.userId : false} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;

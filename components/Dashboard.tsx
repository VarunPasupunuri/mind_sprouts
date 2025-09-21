import React, { useState, useEffect, useCallback } from 'react';
import { TrophyIcon, LeafIcon, ChartBarIcon, FireIcon, GlobeAltIcon, ShareIcon, LightBulbIcon, RefreshIcon, XCircleIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { Page, CommunityHighlight } from '../types';
import { MOCK_BADGES, MOCK_COMMUNITY_HIGHLIGHTS } from '../constants';
import InteractiveTour from './InteractiveTour';
import ReferFriendModal from './ReferFriendModal';
import { getPersonalizedTip } from '../services/geminiService';


const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgClasses: string;
  textClasses: string;
  iconWrapperBgClasses: string;
  id?: string;
}> = ({ id, icon, title, value, bgClasses, textClasses, iconWrapperBgClasses }) => (
    <div id={id} className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 card-hover ${bgClasses}`}>
        <div className={`rounded-full p-3 ${iconWrapperBgClasses}`}>
            {icon}
        </div>
        <div className={textClasses}>
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);

const FirstMissionCard: React.FC = () => {
    const { t } = useI18n();
    const { completeFirstMission } = useAuth();
    const [goal, setGoal] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) return;
        completeFirstMission(goal);
        setSubmitted(true);
    };

    if (submitted) {
        return (
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-2 border-green-400 dark:border-green-600 text-center animate-fade-in-up">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('first_mission_success')}</h2>
                <p className="text-gray-600 dark:text-gray-400">Your goal has been set. Now let's achieve it!</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg card-hover">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('first_mission_title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('first_mission_desc')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t('first_mission_placeholder')}
                    className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" disabled={!goal.trim()} className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 btn-hover">
                    {t('first_mission_button')}
                </button>
            </form>
        </div>
    );
};

const EcoWorldPreviewCard: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const { t } = useI18n();
    const { unlockedEcoItems } = useAuth();

    const latestItem = unlockedEcoItems.length > 0 ? unlockedEcoItems[unlockedEcoItems.length - 1] : null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full card-hover">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('eco_world_preview_title')}</h2>
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-800 text-center">
                {latestItem ? (
                    <>
                        <div className="text-6xl mb-3 animate-bounce">{latestItem.emoji}</div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('unlocked_new_item').replace('{itemName}', t(latestItem.nameKey as any))}</h3>
                        <button 
                            onClick={() => setCurrentPage(Page.PROFILE)}
                            className="mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 btn-hover"
                        >
                            {t('go_to_eco_world')}
                        </button>
                    </>
                ) : (
                    <>
                         <GlobeAltIcon className="w-16 h-16 text-green-500 mx-auto mb-3" />
                         <p className="text-gray-600 dark:text-gray-400">{t('start_your_world')}</p>
                    </>
                )}
            </div>
        </div>
    );
}

const Dashboard: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const { t } = useI18n();
    const { stats, challenges, user, unlockedBadges, dashboardWidgetOrder, setDashboardWidgetOrder, hasCompletedFirstMission, hasSeenTour, setHasSeenTour, ecoGoal } = useAuth();
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [dragOverWidget, setDragOverWidget] = useState<string | null>(null);
    const [showTour, setShowTour] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);

    useEffect(() => {
        if (hasCompletedFirstMission && !hasSeenTour) {
            setTimeout(() => setShowTour(true), 500);
        }
    }, [hasCompletedFirstMission, hasSeenTour]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData('widgetId', id);
        setDraggedWidget(id);
    };

    const handleDragEnd = () => {
        setDraggedWidget(null);
        setDragOverWidget(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        if (draggedWidget !== id) {
            setDragOverWidget(id);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOverWidget(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('widgetId');

        if (draggedId === dropId) {
            setDragOverWidget(null);
            return;
        }

        const newOrder = [...dashboardWidgetOrder];
        const draggedIndex = newOrder.indexOf(draggedId);
        newOrder.splice(draggedIndex, 1);

        const dropIndex = newOrder.indexOf(dropId);
        newOrder.splice(dropIndex, 0, draggedId);
        
        setDashboardWidgetOrder(newOrder);
        setDraggedWidget(null);
        setDragOverWidget(null);
    };

    const JourneyCard = () => {
        const nextChallenge = challenges.find(c => !c.completed);
        return (
            <div id="journey-card" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full card-hover">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('continue_your_journey')}</h2>
                {nextChallenge ? (
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300`}>{t(`category_${nextChallenge.category}` as any)}</span>
                                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mt-2">{t(nextChallenge.titleKey as any)}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t(nextChallenge.descriptionKey as any)}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-3xl font-bold text-yellow-500">{nextChallenge.points}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('points').toUpperCase()}</p>
                            </div>
                        </div>
                        <button 
                            className="mt-4 w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 shadow-md btn-hover"
                            onClick={() => setCurrentPage(Page.TASKS_AND_CHALLENGES)}
                        >
                            {t('view_challenge')}
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">{t('all_challenges_completed')}</p>
                )}
            </div>
        );
    };

    const MilestoneCard = () => {
        const nextBadge = MOCK_BADGES.find(b => !unlockedBadges.some(ub => ub.id === b.id));
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full card-hover">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('next_milestone')}</h2>
                {nextBadge ? (
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-6xl mb-3">{nextBadge.emoji}</div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t(nextBadge.nameKey as any)}</h3>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 my-2">
                            {t('challenges_to_go').replace('{count}', (nextBadge.milestone - stats.challengesCompleted).toString())}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <div className="bg-green-500 h-4 rounded-full text-center text-white text-xs font-bold transition-all duration-500" style={{ width: `${(stats.challengesCompleted / nextBadge.milestone) * 100}%` }}>
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 text-center">
                        <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{t('all_badges_earned')}</h3>
                    </div>
                )}
            </div>
        );
    };

    const CommunitySpotlightCard = () => {
        const [highlight, setHighlight] = useState<CommunityHighlight | null>(null);

        useEffect(() => {
            const randomIndex = Math.floor(Math.random() * MOCK_COMMUNITY_HIGHLIGHTS.length);
            setHighlight(MOCK_COMMUNITY_HIGHLIGHTS[randomIndex]);
        }, []);

        if (!highlight) return null;

        const message = t(highlight.contentKey)
            .replace('{badgeName}', highlight.badgeNameKey ? t(highlight.badgeNameKey) : '')
            .replace('{challengeTitle}', highlight.challengeTitleKey ? t(highlight.challengeTitleKey as any) : '');

        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex flex-col card-hover">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('community_spotlight')}</h2>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-3 flex-grow flex flex-col">
                    <div className="flex items-center gap-3">
                        <img src={highlight.userAvatar} alt={highlight.userName} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-indigo-800 dark:text-indigo-200">{highlight.userName}</p>
                            <p className="text-sm text-indigo-600 dark:text-indigo-300">{message}</p>
                        </div>
                    </div>
                    {highlight.imageUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden">
                            <img src={highlight.imageUrl} alt={t(highlight.challengeTitleKey as any)} className="w-full h-auto object-cover" />
                        </div>
                    )}
                    <div className="mt-auto pt-3">
                        <button className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 btn-hover">
                            {t('give_kudos')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const PersonalizedTipCard = () => {
        const { t } = useI18n();
        const { challenges, ecoGoal } = useAuth();
        const [tip, setTip] = useState('');
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const fetchTip = useCallback(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const completedChallenges = challenges.filter(c => c.completed);
                const completedChallengeTitles = completedChallenges.map(c => t(c.titleKey as any));
                const tipContext = { completedChallengeTitles, ecoGoal };
                const generatedTip = await getPersonalizedTip(tipContext);
                setTip(generatedTip);
            } catch (e) {
                setError(t('tip_error'));
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }, [challenges, ecoGoal, t]);

        useEffect(() => {
            fetchTip();
        }, [fetchTip]);

        return (
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-800 dark:to-blue-900 p-6 rounded-2xl shadow-lg h-full flex flex-col card-hover">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <LightBulbIcon className="w-7 h-7 text-white/90" />
                        <h2 className="text-2xl font-semibold text-white">{t('personalized_tip_title')}</h2>
                    </div>
                    <button onClick={fetchTip} disabled={isLoading} className="p-2 rounded-full text-white/80 hover:bg-white/20 btn-subtle-interactive" title={t('new_tip_button')}>
                        <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <div className="flex-grow flex items-center justify-center text-white/90 text-center">
                    {isLoading ? (
                        <div className="space-y-2 animate-pulse w-full">
                            <div className="h-4 bg-white/30 rounded-full w-3/4 mx-auto"></div>
                            <div className="h-4 bg-white/30 rounded-full w-full mx-auto"></div>
                            <div className="h-4 bg-white/30 rounded-full w-5/6 mx-auto"></div>
                        </div>
                    ) : error ? (
                         <div className="flex items-center gap-2 text-white/80">
                            <XCircleIcon className="w-6 h-6"/>
                            <p>{error}</p>
                         </div>
                    ) : (
                        <p className="text-lg">{tip}</p>
                    )}
                </div>
            </div>
        );
    };

    const ReferralCard = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex flex-col card-hover">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <ShareIcon className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                     <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{t('refer_a_friend_title')}</h2>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 flex-grow">{t('refer_a_friend_desc')}</p>
            <button
                onClick={() => setShowReferralModal(true)}
                className="mt-4 w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 btn-hover"
            >
                {t('refer_now')}
            </button>
        </div>
    );

    const widgets: Record<string, React.ReactNode> = {
        journey: <JourneyCard />,
        milestone: <MilestoneCard />,
        community: <CommunitySpotlightCard />,
        referral: <ReferralCard />,
        ecoworld: <EcoWorldPreviewCard setCurrentPage={setCurrentPage} />,
        personalizedTip: <PersonalizedTipCard />,
    };
    
    return (
        <div className="space-y-8">
            {showTour && <InteractiveTour onComplete={() => {
                setShowTour(false);
                setHasSeenTour(true);
            }} />}

            {showReferralModal && <ReferFriendModal onClose={() => setShowReferralModal(false)} />}

            <div className="text-left animate-fade-in-up">
                <h1 id="welcome-header" className="text-4xl font-bold text-gray-800 dark:text-gray-100">{t('welcome_back').replace('{name}', user?.userId || 'Eco-Champ')}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-lg">{t('ready_to_make_a_difference')}</p>
            </div>

            {!hasCompletedFirstMission && <FirstMissionCard />}

            <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    id="points-card"
                    icon={<TrophyIcon className="w-7 h-7 text-yellow-300"/>} 
                    title={t('total_points')} 
                    value={stats.points} 
                    bgClasses="bg-green-900"
                    textClasses="text-white"
                    iconWrapperBgClasses="bg-white/20"
                />
                <StatCard 
                    icon={<LeafIcon className="w-7 h-7 text-green-800 dark:text-green-200"/>} 
                    title={t('challenges_done')} 
                    value={stats.challengesCompleted} 
                    bgClasses="bg-green-100 dark:bg-green-500/20"
                    textClasses="text-green-900 dark:text-green-200"
                    iconWrapperBgClasses="bg-green-200 dark:bg-green-400/20"
                />
                <StatCard 
                    icon={<ChartBarIcon className="w-7 h-7 text-white"/>} 
                    title={t('current_rank')} 
                    value={`#${stats.rank}`} 
                    bgClasses="bg-gradient-to-br from-blue-400 to-indigo-500"
                    textClasses="text-white"
                    iconWrapperBgClasses="bg-white/20"
                />
                <StatCard 
                    icon={<FireIcon className="w-7 h-7 text-white"/>} 
                    title={t('daily_streak')} 
                    value={`${stats.streak} ${t('days')}`} 
                    bgClasses="bg-gradient-to-br from-red-500 to-orange-500"
                    textClasses="text-white"
                    iconWrapperBgClasses="bg-white/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {dashboardWidgetOrder.map(widgetId => {
                    const isDragging = draggedWidget === widgetId;
                    const isDragOver = dragOverWidget === widgetId;
                    return (
                        <div
                            key={widgetId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, widgetId)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, widgetId)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, widgetId)}
                            className={`transition-all duration-300 rounded-2xl ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                            style={{ cursor: 'grab' }}
                        >
                            {widgets[widgetId]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
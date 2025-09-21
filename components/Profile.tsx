import React, { useRef, useState, useEffect } from 'react';
import { TrophyIcon, LeafIcon, ChartBarIcon, LogoutIcon, GlobeAltIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { UserRole } from '../types';

const Toggle: React.FC<{ label: string, description: string, isEnabled: boolean, onToggle: () => void }> = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isEnabled} onChange={onToggle} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        </label>
    </div>
);


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center space-x-3">
        <div className={`rounded-full p-2.5 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const TeacherProfileView: React.FC = () => {
    const { t } = useI18n();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    type NotificationSettings = {
        newChallenges: boolean;
        leaderboard: boolean;
        weeklySummary: boolean;
    };

    const [notifications, setNotifications] = useState<NotificationSettings>({
        newChallenges: true,
        leaderboard: false,
        weeklySummary: true,
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem('mindsprouts-notifications');
        if (storedSettings) {
            setNotifications(JSON.parse(storedSettings));
        }
    }, []);

    const handleToggle = (key: keyof NotificationSettings) => {
        setNotifications(prev => {
            const newSettings = { ...prev, [key]: !prev[key] };
            localStorage.setItem('mindsprouts-notifications', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('profile')} &amp; {t('settings')}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('settings_subtitle')}</p>
            </div>
            
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-8 border border-green-200 dark:border-green-800">
                <img
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-green-200 dark:ring-green-800"
                    src={user?.avatar}
                    alt="User Avatar"
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user?.userId || 'User'}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.school || t('your_school')}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-6 divide-y divide-gray-200 dark:divide-gray-700 border border-green-200 dark:border-green-800">
                <div className='space-y-4'>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('notifications')}</h2>
                    <Toggle 
                        label={t('new_challenge_alerts')} 
                        description={t('new_challenge_alerts_desc')}
                        isEnabled={notifications.newChallenges}
                        onToggle={() => handleToggle('newChallenges')}
                    />
                    <Toggle 
                        label={t('leaderboard_updates')} 
                        description={t('leaderboard_updates_desc')}
                        isEnabled={notifications.leaderboard}
                        onToggle={() => handleToggle('leaderboard')}
                    />
                    <Toggle 
                        label={t('weekly_summary')} 
                        description={t('weekly_summary_desc')}
                        isEnabled={notifications.weeklySummary}
                        onToggle={() => handleToggle('weeklySummary')}
                    />
                </div>
                
                <div className="pt-6 space-y-4">
                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('appearance')}</h2>
                     <Toggle 
                        label={t('dark_mode')} 
                        description={t('dark_mode_desc')}
                        isEnabled={theme === 'dark'}
                        onToggle={toggleTheme}
                    />
                </div>
                
                <div className="pt-6 space-y-4">
                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('account')}</h2>
                     <div className='flex flex-col sm:flex-row gap-4'>
                        <button 
                            onClick={() => alert(t('feature_not_implemented_desc'))}
                            className="w-full sm:w-auto flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80">
                            {t('change_password')}
                        </button>
                        <button 
                            onClick={() => alert(t('feature_not_implemented_desc'))}
                            className="w-full sm:w-auto flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80">
                            {t('delete_account')}
                        </button>
                     </div>
                     <div className='pt-4'>
                         <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg py-3">
                            <LogoutIcon className="w-5 h-5" />
                            {t('logout')}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

const StudentEcoWorldView: React.FC = () => {
    const { t } = useI18n();
    const { user, stats, unlockedEcoItems, placeEcoItem, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const worldRef = useRef<HTMLDivElement>(null);

    type NotificationSettings = {
        newChallenges: boolean;
        leaderboard: boolean;
        weeklySummary: boolean;
    };

    const [notifications, setNotifications] = useState<NotificationSettings>({
        newChallenges: true,
        leaderboard: false,
        weeklySummary: true,
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem('mindsprouts-notifications');
        if (storedSettings) {
            setNotifications(JSON.parse(storedSettings));
        }
    }, []);

    const handleToggle = (key: keyof NotificationSettings) => {
        setNotifications(prev => {
            const newSettings = { ...prev, [key]: !prev[key] };
            localStorage.setItem('mindsprouts-notifications', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const unplacedItems = unlockedEcoItems.filter(item => !item.isPlaced);
    const placedItems = unlockedEcoItems.filter(item => item.isPlaced);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
        e.dataTransfer.setData("application/eco-item-id", itemId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("application/eco-item-id");
        if (!itemId || !worldRef.current) return;

        const worldRect = worldRef.current.getBoundingClientRect();
        const x = e.clientX - worldRect.left;
        const y = e.clientY - worldRect.top;
        
        // Normalize coordinates to be a percentage of the world's dimensions
        const xPercent = (x / worldRect.width) * 100;
        const yPercent = (y / worldRect.height) * 100;

        placeEcoItem(itemId, xPercent, yPercent);
    };


    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                     <GlobeAltIcon className="w-9 h-9 text-green-600" />
                     <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('my_eco_world')}</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{t('eco_world_subtitle')}</p>
                     </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Eco-World Grid */}
                    <div 
                        ref={worldRef}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="lg:col-span-2 h-96 lg:h-auto bg-green-100 dark:bg-green-900/40 rounded-2xl shadow-inner relative overflow-hidden bg-[linear-gradient(45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%),_linear-gradient(-45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_rgba(255,255,255,0.05)_75%),_linear-gradient(-45deg,_transparent_75%,_rgba(255,255,255,0.05)_75%)] bg-[length:20px_20px]"
                    >
                        {placedItems.map(item => (
                            <div 
                                key={item.id} 
                                className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                                title={t(item.nameKey as any)}
                            >
                                {item.emoji}
                            </div>
                        ))}
                    </div>

                    {/* Stats & Inventory */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <StatCard icon={<TrophyIcon className="w-5 h-5 text-yellow-600"/>} title={t('total_points')} value={stats.points} color="bg-yellow-100 dark:bg-yellow-900/50" />
                            <StatCard icon={<ChartBarIcon className="w-5 h-5 text-blue-600"/>} title={t('current_rank')} value={`#${stats.rank}`} color="bg-blue-100 dark:bg-blue-900/50" />
                            <StatCard icon={<LeafIcon className="w-5 h-5 text-green-600"/>} title={t('challenges_done')} value={stats.challengesCompleted} color="bg-green-100 dark:bg-green-900/50" />
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('unlocked_items')}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('drag_and_drop_items')}</p>
                            <div className="grid grid-cols-4 gap-2">
                                {unplacedItems.map(item => (
                                    <div 
                                        key={item.id} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item.id)}
                                        className="bg-gray-100 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing"
                                        title={t(item.nameKey as any)}
                                    >
                                        {item.emoji}
                                    </div>
                                ))}
                                {unplacedItems.length === 0 && (
                                    <p className="col-span-4 text-center text-sm text-gray-500 dark:text-gray-400 py-4">{t('no_challenges_completed')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Settings Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-6 divide-y divide-gray-200 dark:divide-gray-700 border border-green-200 dark:border-green-800">
                <div className='space-y-4'>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('settings')}</h2>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 pt-2">{t('notifications')}</h3>
                    <Toggle 
                        label={t('new_challenge_alerts')} 
                        description={t('new_challenge_alerts_desc')}
                        isEnabled={notifications.newChallenges}
                        onToggle={() => handleToggle('newChallenges')}
                    />
                    <Toggle 
                        label={t('leaderboard_updates')} 
                        description={t('leaderboard_updates_desc')}
                        isEnabled={notifications.leaderboard}
                        onToggle={() => handleToggle('leaderboard')}
                    />
                    <Toggle 
                        label={t('weekly_summary')} 
                        description={t('weekly_summary_desc')}
                        isEnabled={notifications.weeklySummary}
                        onToggle={() => handleToggle('weeklySummary')}
                    />
                </div>
                
                <div className="pt-6 space-y-4">
                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('appearance')}</h2>
                     <Toggle 
                        label={t('dark_mode')} 
                        description={t('dark_mode_desc')}
                        isEnabled={theme === 'dark'}
                        onToggle={toggleTheme}
                    />
                </div>
                
                <div className="pt-6 space-y-4">
                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('account')}</h2>
                     <div className='flex flex-col sm:flex-row gap-4'>
                        <button 
                            onClick={() => alert(t('feature_not_implemented_desc'))}
                            className="w-full sm:w-auto flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80">
                            {t('change_password')}
                        </button>
                        <button 
                            onClick={() => alert(t('feature_not_implemented_desc'))}
                            className="w-full sm:w-auto flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80">
                            {t('delete_account')}
                        </button>
                     </div>
                     <div className='pt-4'>
                         <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg py-3">
                            <LogoutIcon className="w-5 h-5" />
                            {t('logout')}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

const Profile: React.FC = () => {
    const { user } = useAuth();
    if (user?.role === UserRole.TEACHER) {
        return <TeacherProfileView />;
    }
    return <StudentEcoWorldView />;
};

export default Profile;
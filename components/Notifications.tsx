import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, TrophyIcon, ClipboardListIcon, LightBulbIcon, CalendarDaysIcon, ChartBarIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { Notification, NotificationType, Page } from '../types';
import { MOCK_CHALLENGES } from '../constants';

interface NotificationsProps {
    setCurrentPage: (page: Page) => void;
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `just now`;
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconClass = "w-6 h-6";
    const icons: Record<NotificationType, React.ReactNode> = {
        [NotificationType.CHALLENGE]: <TrophyIcon className={`${iconClass} text-yellow-500`} />,
        [NotificationType.ASSIGNMENT]: <ClipboardListIcon className={`${iconClass} text-blue-500`} />,
        [NotificationType.LEADERBOARD]: <ChartBarIcon className={`${iconClass} text-indigo-500`} />,
        [NotificationType.TIP]: <LightBulbIcon className={`${iconClass} text-green-500`} />,
        [NotificationType.EVENT]: <CalendarDaysIcon className={`${iconClass} text-purple-500`} />,
    };
    return <>{icons[type]}</>;
};

const Notifications: React.FC<NotificationsProps> = ({ setCurrentPage }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useAuth();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        if (notification.type === NotificationType.CHALLENGE) {
            setCurrentPage(Page.TASKS_AND_CHALLENGES);
        } else if (notification.type === NotificationType.ASSIGNMENT) {
            setCurrentPage(Page.WEEKLY_ASSIGNMENTS);
        }
        setIsOpen(false);
    };

    const getNotificationMessage = (notification: Notification): string => {
        let message = t(notification.messageKey as any);
        if (notification.type === NotificationType.CHALLENGE && notification.relatedId) {
            const challenge = MOCK_CHALLENGES.find(c => c.id === notification.relatedId);
            if (challenge) {
                // FIX: Use `t(challenge.titleKey)` to get the translated challenge title instead of the non-existent `challenge.title` property.
                message = message
                    .replace('{challengeTitle}', t(challenge.titleKey as any))
                    .replace('{points}', challenge.points.toString());
            }
        }
        if (notification.type === NotificationType.LEADERBOARD && notification.relatedId) {
            message = message.replace('{rank}', notification.relatedId.toString());
        }
        return message;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 btn-subtle-interactive"
                aria-label="Toggle notifications"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 z-50 overflow-hidden animate-fade-in-down">
                    <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('notifications_panel_title')}</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllNotificationsAsRead} className="text-xs font-semibold text-blue-600 hover:underline active:opacity-75">
                                {t('mark_all_as_read')}
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {sortedNotifications.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('no_notifications')}</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {sortedNotifications.map(notification => (
                                    <li
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-3 flex items-start gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer list-item-interactive ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <NotificationIcon type={notification.type} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t(notification.titleKey as any)}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{getNotificationMessage(notification)}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeSince(new Date(notification.timestamp))}</p>
                                        </div>
                                        {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {sortedNotifications.filter(n => n.read).length > 0 && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
                            <button onClick={clearNotifications} className="w-full text-center text-sm font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400 active:opacity-75">
                               {t('clear_all')}
                            </button>
                        </div>
                    )}
                </div>
            )}
             <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Notifications;
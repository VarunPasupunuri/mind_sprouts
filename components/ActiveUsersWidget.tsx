import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UsersIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

const ActiveUsersWidget: React.FC = () => {
    const { getActiveUsersCount } = useAuth();
    const [activeUsers, setActiveUsers] = useState(0);
    const [prevUsers, setPrevUsers] = useState(0);
    const [animation, setAnimation] = useState('');
    const { t } = useI18n();


    useEffect(() => {
        const fetchActiveUsers = () => {
            const count = getActiveUsersCount();
            setPrevUsers(activeUsers);
            setActiveUsers(count);
        };
        fetchActiveUsers();
        const intervalId = setInterval(fetchActiveUsers, 5000); // Poll every 5 seconds
        return () => clearInterval(intervalId);
    }, [getActiveUsersCount]);

    useEffect(() => {
        if (activeUsers !== prevUsers) {
            setAnimation('animate-ping-once');
            const timer = setTimeout(() => setAnimation(''), 500);
            return () => clearTimeout(timer);
        }
    }, [activeUsers, prevUsers]);

    return (
        <>
            <style>{`
                @keyframes ping-once {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .animate-ping-once {
                    animation: ping-once 0.5s cubic-bezier(0, 0, 0.2, 1);
                }
            `}</style>
            <div 
                className="fixed bottom-4 left-4 sm:bottom-6 sm:left-auto sm:right-24 z-50 flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border dark:border-gray-700"
                title={`${t('analytics_active_users_desc' as any)}`}
            >
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className={`absolute h-3 w-3 bg-green-500 rounded-full ${animation}`}></div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-none">{activeUsers}</span>
                    <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
            </div>
        </>
    );
};

export default ActiveUsersWidget;

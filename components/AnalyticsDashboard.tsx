import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { AnalyticsData } from '../types';
import { UsersIcon, ArrowUpIcon, ChartBarIcon } from './Icons';

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
            {icon}
        </div>
        <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);

const AnalyticsDashboard: React.FC = () => {
    const { t } = useI18n();
    const { getAnalyticsData } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const fetchData = () => {
            setData(getAnalyticsData());
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000); // Refresh data every 5 seconds

        return () => clearInterval(intervalId);
    }, [getAnalyticsData]);

    if (!data) {
        return <div className="text-center p-8">{t('loading' as any)}...</div>;
    }
    
    const maxChartUsers = Math.max(...data.chartData.map(d => d.users), 10); // Ensure a minimum height for the chart

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('analytics_title' as any)}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('analytics_subtitle' as any)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title={t('analytics_active_users' as any)}
                    value={data.activeUsers}
                    description={t('analytics_active_users_desc' as any)}
                    icon={<UsersIcon className="w-6 h-6 text-green-500" />}
                />
                <StatCard 
                    title={t('analytics_peak_concurrent' as any)}
                    value={data.peakConcurrent}
                    description={t('analytics_peak_concurrent_desc' as any)}
                    icon={<ArrowUpIcon className="w-6 h-6 text-blue-500" />}
                />
                <StatCard 
                    title={t('analytics_total_visitors' as any)}
                    value={data.totalUniqueVisitors}
                    description={t('analytics_total_visitors_desc' as any)}
                    icon={<ChartBarIcon className="w-6 h-6 text-indigo-500" />}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('analytics_chart_title' as any)}</h3>
                <div className="mt-4 h-64 flex items-end gap-2 sm:gap-4 border-l border-b border-gray-200 dark:border-gray-700 p-2">
                    {data.chartData.map((entry, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                            <div 
                                className="w-full bg-green-500 rounded-t-md hover:bg-green-400 transition-all duration-300"
                                style={{ height: `${(entry.users / maxChartUsers) * 100}%` }}
                            >
                               <div className="opacity-0 group-hover:opacity-100 text-center text-xs font-bold text-white p-1 bg-gray-900/50 rounded-md -mt-8">
                                   {entry.users}
                               </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

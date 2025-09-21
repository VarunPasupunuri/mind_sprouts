import React from 'react';
import { LogoIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

const About: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('about')}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('about_subtitle')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-gray-700 dark:text-gray-300 space-y-4 border border-green-200 dark:border-green-800">
                <div className="flex justify-center">
                    <LogoIcon className="w-24 h-24 text-brand-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">{t('our_mission')}</h2>
                <p className="text-center max-w-2xl mx-auto">
                    {t('mission_paragraph_1')}
                </p>
                <p className="text-center max-w-2xl mx-auto">
                    {t('mission_paragraph_2')}
                </p>
            </div>
        </div>
    );
};

export default About;
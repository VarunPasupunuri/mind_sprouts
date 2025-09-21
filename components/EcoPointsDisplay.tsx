import React from 'react';
import { SparklesIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

interface EcoPointsDisplayProps {
    points: number;
}

const EcoPointsDisplay: React.FC<EcoPointsDisplayProps> = ({ points }) => {
    const { t } = useI18n();
    return (
        <div 
            className="flex items-center gap-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
            title={`${points.toLocaleString()} ${t('points')}`}
        >
            <SparklesIcon className="w-6 h-6 text-yellow-500" />
            <span className="font-bold text-gray-800 dark:text-gray-100 text-sm pr-2">
                {points.toLocaleString()}
            </span>
        </div>
    );
};

export default EcoPointsDisplay;

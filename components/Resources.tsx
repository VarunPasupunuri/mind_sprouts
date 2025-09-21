import React from 'react';
import { MOCK_RESOURCES } from '../constants';
import { Resource, ResourceType } from '../types';
import { useI18n } from '../hooks/useI18n';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
    const { t } = useI18n();
    
    const typeStyles: Record<ResourceType, string> = {
        [ResourceType.ARTICLE]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        [ResourceType.VIDEO]: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
        [ResourceType.GUIDE]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group border border-green-200 dark:border-green-800">
            <div className="h-48 overflow-hidden">
                <img 
                    src={resource.imageUrl} 
                    alt={t(resource.titleKey as any)} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-6">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeStyles[resource.type]}`}>
                    {t(`resource_type_${resource.type}` as any)}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-3">{t(resource.titleKey as any)}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t(resource.summaryKey as any)}</p>
            </div>
        </div>
    );
};


const Resources: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('resources')}</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('resources_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_RESOURCES.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
        </div>
    );
};

export default Resources;
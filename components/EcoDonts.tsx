import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { TrashIcon, LightBulbIcon, WaterConservationIcon, InfoIcon, XCircleIcon } from './Icons';

interface Dont {
    titleKey: string;
    points: number;
    descKey: string;
    proofKey: string;
}

interface SectionData {
    icon: React.ReactNode;
    titleKey: string;
    impactValueKey: string;
    impactDescKey: string;
    donts: Dont[];
}

interface GuideItem {
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
}

const sections: SectionData[] = [
    {
        icon: <TrashIcon className="w-8 h-8 text-orange-800 dark:text-orange-300" />,
        titleKey: 'section_plastic_waste_title',
        impactValueKey: 'impact_plastic_waste_value',
        impactDescKey: 'impact_plastic_waste_desc',
        donts: [
            { titleKey: 'dont_plastic_bottle_title', points: 30, descKey: 'dont_plastic_bottle_desc', proofKey: 'dont_plastic_bottle_proof' },
            { titleKey: 'dont_plastic_bags_title', points: 20, descKey: 'dont_plastic_bags_desc', proofKey: 'dont_plastic_bags_proof' },
            { titleKey: 'dont_wrapper_snack_title', points: 15, descKey: 'dont_wrapper_snack_desc', proofKey: 'dont_wrapper_snack_proof' },
        ]
    },
    {
        icon: <LightBulbIcon className="w-8 h-8 text-yellow-800 dark:text-yellow-300" />,
        titleKey: 'section_energy_title',
        impactValueKey: 'impact_energy_value',
        impactDescKey: 'impact_energy_desc',
        donts: [
            { titleKey: 'dont_empty_room_light_title', points: 10, descKey: 'dont_empty_room_light_desc', proofKey: 'dont_empty_room_light_proof' },
            { titleKey: 'dont_waste_lunch_title', points: 25, descKey: 'dont_waste_lunch_desc', proofKey: 'dont_waste_lunch_proof' },
            { titleKey: 'dont_single_use_cutlery_title', points: 20, descKey: 'dont_single_use_cutlery_desc', proofKey: 'dont_single_use_cutlery_proof' },
        ]
    },
    {
        icon: <WaterConservationIcon className="w-8 h-8 text-blue-800 dark:text-blue-300" />,
        titleKey: 'section_water_title',
        impactValueKey: 'impact_water_value',
        impactDescKey: 'impact_water_desc',
        donts: [
            { titleKey: 'dont_running_tap_title', points: 15, descKey: 'dont_running_tap_desc', proofKey: 'dont_running_tap_proof' },
            { titleKey: 'dont_vehicle_day_title', points: 40, descKey: 'dont_vehicle_day_desc', proofKey: 'dont_vehicle_day_proof' },
            { titleKey: 'dont_fast_fashion_title', points: 25, descKey: 'dont_fast_fashion_desc', proofKey: 'dont_fast_fashion_proof' },
        ]
    },
    {
        icon: <InfoIcon className="w-8 h-8 text-indigo-800 dark:text-indigo-300" />,
        titleKey: 'section_awareness_title',
        impactValueKey: 'impact_awareness_value',
        impactDescKey: 'impact_awareness_desc',
        donts: [
            { titleKey: 'dont_litter_pledge_title', points: 10, descKey: 'dont_litter_pledge_desc', proofKey: 'dont_litter_pledge_proof' },
            { titleKey: 'dont_digital_waste_title', points: 15, descKey: 'dont_digital_waste_desc', proofKey: 'dont_digital_waste_proof' },
            { titleKey: 'dont_noise_pollution_title', points: 20, descKey: 'dont_noise_pollution_desc', proofKey: 'dont_noise_pollution_proof' },
        ]
    },
];

const guideItems: GuideItem[] = [
    { icon: <XCircleIcon className="w-10 h-10 text-red-500" />, titleKey: 'guide_plastics_title', descKey: 'guide_plastics_desc' },
    { icon: <XCircleIcon className="w-10 h-10 text-red-500" />, titleKey: 'guide_wildlife_title', descKey: 'guide_wildlife_desc' },
    { icon: <XCircleIcon className="w-10 h-10 text-red-500" />, titleKey: 'guide_trails_title', descKey: 'guide_trails_desc' },
    { icon: <XCircleIcon className="w-10 h-10 text-red-500" />, titleKey: 'guide_litter_title', descKey: 'guide_litter_desc' },
]

const DontCard: React.FC<{ dont: Dont }> = ({ dont }) => {
    const { t } = useI18n();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-orange-500 transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 flex-grow">{t(dont.titleKey as any)}</h4>
                <div className="flex-shrink-0 text-right">
                    <p className="text-xl font-bold text-yellow-500">+{dont.points}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('points').toUpperCase()}</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t(dont.descKey as any)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">{t(dont.proofKey as any)}</p>
        </div>
    );
};

const EcoDonts: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('eco_donts_subtitle')}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{t('eco_donts_main_desc')}</p>
            </div>
            
            <div className="space-y-10">
                {sections.map(section => (
                    <div key={section.titleKey} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-sm">{section.icon}</div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(section.titleKey as any)}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/50 dark:to-orange-900/50 p-6 rounded-xl flex flex-col justify-center text-center shadow-inner">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-800 dark:text-red-200">{t('negative_impact_title')}</h3>
                                <p className="text-4xl font-extrabold text-red-600 dark:text-red-300 my-2">{t(section.impactValueKey as any)}</p>
                                <p className="text-sm text-red-700 dark:text-red-200/90">{t(section.impactDescKey as any)}</p>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                {section.donts.map(dont => <DontCard key={dont.titleKey} dont={dont} />)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{t('guide_title')}</h2>
                <p className="text-center mt-1 text-gray-600 dark:text-gray-400">{t('guide_subtitle')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {guideItems.map(item => (
                        <div key={item.titleKey} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex justify-center mb-3">{item.icon}</div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t(item.titleKey as any)}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t(item.descKey as any)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EcoDonts;
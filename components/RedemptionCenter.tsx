import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { MOCK_REDEMPTION_ITEMS } from '../constants';
import { RedemptionItem, RewardCategory, User } from '../types';
import { GiftIcon, TagIcon, HeartIcon, XIcon, CheckmarkIcon, SparklesIcon, SwatchIcon } from './Icons';

// --- Confirmation Modal ---
const ConfirmationModal: React.FC<{
    item: RedemptionItem;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ item, onConfirm, onCancel }) => {
    const { t } = useI18n();
    const itemName = t(item.titleKey as any);
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={onCancel}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('confirm_redemption_title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6" dangerouslySetInnerHTML={{ __html: t('confirm_redemption_desc').replace('{cost}', `<strong class="text-yellow-500">${item.cost}</strong>`).replace('{itemName}', `<strong class="text-gray-800 dark:text-white">${itemName}</strong>`) }} />
                <div className="flex gap-4">
                    <button onClick={onCancel} className="w-full py-2 px-4 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold btn-subtle-interactive">{t('cancel')}</button>
                    <button onClick={onConfirm} className="w-full py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold btn-hover">{t('confirm')}</button>
                </div>
            </div>
        </div>
    );
};

// --- Success Toast ---
const SuccessToast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 bg-green-600 text-white shadow-2xl rounded-xl p-4 w-full max-w-sm z-50 flex items-center gap-3">
            <CheckmarkIcon className="w-6 h-6" />
            <p className="font-semibold">{message}</p>
        </div>
    );
};

// --- Reward Card ---
const RewardCard: React.FC<{
    item: RedemptionItem;
    onRedeem: (item: RedemptionItem) => void;
    onEquip: (avatarUrl: string) => void;
    isRedeemed: boolean;
    user: User | null;
}> = ({ item, onRedeem, onEquip, isRedeemed, user }) => {
    const { t } = useI18n();
    const { stats } = useAuth();
    const canAfford = stats.points >= item.cost;
    const isAvatarItem = item.category === RewardCategory.AVATAR;
    const isEquipped = isAvatarItem && user?.avatar === item.imageUrl;

    const icons: Record<RedemptionItem['icon'], React.ReactNode> = {
        'Badge': <GiftIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />,
        'Coupon': <TagIcon className="w-8 h-8 text-orange-600 dark:text-orange-300" />,
        'Donation': <HeartIcon className="w-8 h-8 text-red-600 dark:text-red-300" />,
        'Gift': <GiftIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />,
    };
    
    const renderButton = () => {
        if (isEquipped) {
            return <button disabled className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400">{t('equipped')}</button>;
        }
        if (isRedeemed && isAvatarItem && item.imageUrl) {
            return <button onClick={() => onEquip(item.imageUrl!)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 btn-hover">{t('set_as_avatar')}</button>;
        }
        if (isRedeemed) {
            return <button disabled className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400">{t('redeemed')}</button>;
        }
        if (canAfford) {
            return <button onClick={() => onRedeem(item)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-green-700 btn-hover">{t('redeem')}</button>;
        }
        return <button disabled className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">{t('not_enough_points')}</button>;
    }


    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex flex-col ${isRedeemed ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {item.imageUrl ? <img src={item.imageUrl} alt={t(item.titleKey as any)} className="w-full h-full object-cover rounded-lg" /> : icons[item.icon]}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{t(item.titleKey as any)}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t(item.descriptionKey as any)}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                <p className="font-bold text-lg text-yellow-500 flex items-center gap-1.5"><SparklesIcon className="w-5 h-5"/>{item.cost.toLocaleString()}</p>
                {renderButton()}
            </div>
        </div>
    );
};

// --- Main Redemption Center Component ---
const RedemptionCenter: React.FC = () => {
    const { t } = useI18n();
    const { user, stats, redeemedItems, redeemItem, equipAvatar } = useAuth();
    const [activeCategory, setActiveCategory] = useState<RewardCategory>(RewardCategory.VIRTUAL);
    const [confirmingItem, setConfirmingItem] = useState<RedemptionItem | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredItems = useMemo(() => MOCK_REDEMPTION_ITEMS.filter(item => item.category === activeCategory), [activeCategory]);
    
    const handleRedeem = () => {
        if (confirmingItem) {
            const success = redeemItem(confirmingItem.id, confirmingItem.cost);
            if (success) {
                setShowSuccess(true);
            }
            setConfirmingItem(null);
        }
    };
    
    const categories: { key: RewardCategory, icon: React.ReactNode, nameKey: any }[] = [
        { key: RewardCategory.VIRTUAL, icon: <GiftIcon className="w-5 h-5"/>, nameKey: 'category_virtual_goods' },
        { key: RewardCategory.AVATAR, icon: <SwatchIcon className="w-5 h-5"/>, nameKey: 'category_avatar' },
        { key: RewardCategory.DISCOUNT, icon: <TagIcon className="w-5 h-5"/>, nameKey: 'category_partner_discounts' },
        { key: RewardCategory.DONATION, icon: <HeartIcon className="w-5 h-5"/>, nameKey: 'category_charity_donations' },
    ];

    return (
        <>
            {confirmingItem && (
                <ConfirmationModal 
                    item={confirmingItem}
                    onConfirm={handleRedeem}
                    onCancel={() => setConfirmingItem(null)}
                />
            )}
            {showSuccess && (
                <SuccessToast 
                    message={t('redemption_successful')}
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('redemption_center')}</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{t('redemption_center_subtitle')}</p>
                    </div>
                    <div className="flex-shrink-0 bg-white dark:bg-gray-700/50 p-3 rounded-xl shadow-md">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('your_points')}</p>
                        <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1.5"><SparklesIcon className="w-5 h-5"/>{stats.points.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category.key}
                            onClick={() => setActiveCategory(category.key)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-2 btn-subtle-interactive ${
                                activeCategory === category.key
                                    ? 'bg-brand-primary text-white shadow'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {category.icon}
                            {t(category.nameKey)}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <RewardCard 
                            key={item.id} 
                            item={item}
                            onRedeem={setConfirmingItem}
                            onEquip={equipAvatar}
                            isRedeemed={redeemedItems.includes(item.id)}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default RedemptionCenter;

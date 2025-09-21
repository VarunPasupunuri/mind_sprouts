import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { XIcon, ClipboardCopyIcon, CheckmarkIcon } from './Icons';

interface ReferFriendModalProps {
    onClose: () => void;
}

const ReferFriendModal: React.FC<ReferFriendModalProps> = ({ onClose }) => {
    const { t } = useI18n();
    const { user, addPoints } = useAuth();
    const [copied, setCopied] = useState(false);

    const referralLink = `https://mindsprouts.eco/join?ref=${user?.userId || 'friend'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClaim = () => {
        addPoints(100);
        // In a real app, this would be triggered by a backend event
        // For now, we simulate it and close the modal.
        alert(t('referral_reward_message' as any));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('referral_modal_title')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('referral_modal_desc')}</p>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('your_referral_link')}</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            readOnly
                            value={referralLink}
                            className="flex-1 block w-full rounded-none rounded-l-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                        />
                        <button
                            onClick={handleCopy}
                            className={`relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-r-md transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
                        >
                            {copied ? <CheckmarkIcon className="w-5 h-5" /> : <ClipboardCopyIcon className="w-5 h-5" />}
                            <span>{copied ? t('copied') : t('copy_link')}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <button
                        onClick={handleClaim}
                        className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700"
                    >
                        {t('claim_reward')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferFriendModal;
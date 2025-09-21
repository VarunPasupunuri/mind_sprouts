import React, { useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { FireIcon, SparklesIcon, XIcon } from './Icons';

interface LoginRewardToastProps {
    streak: number;
    points: number;
    onClose: () => void;
}

const LoginRewardToast: React.FC<LoginRewardToastProps> = ({ streak, points, onClose }) => {
    const { t } = useI18n();

    useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl rounded-xl p-4 w-full max-w-sm z-[999] animate-fade-in-down-toast">
            <style>{`
                @keyframes fade-in-down-toast {
                    0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-down-toast { animation: fade-in-down-toast 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            `}</style>
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <FireIcon className="w-7 h-7 text-orange-300" />
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-bold">Streak Maintained!</p>
                    <p className="mt-1 text-sm">
                        You've earned <strong className="font-extrabold">{points}</strong> <SparklesIcon className="w-4 h-4 inline-block -mt-1 text-yellow-300"/> points. 
                        Your streak is now <strong className="font-extrabold">{streak}</strong> {t('days')}!
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onClose} className="rounded-md inline-flex text-white/70 hover:text-white focus:outline-none">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRewardToast;

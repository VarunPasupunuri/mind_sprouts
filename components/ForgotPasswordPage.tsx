import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, CheckmarkCircleIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
  onRequestReset: (userId: string, token: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin, onRequestReset }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const { t } = useI18n();

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError(t('user_id_password_required'));
      return;
    }
    
    // In a real app, this would only return success.
    // The token would be sent via email. For simulation, we get it back directly.
    const result = forgotPassword(userId);
    
    if (result.success && result.token) {
        setIsSubmitted(true);
        // Simulate clicking the link in the email after a short delay
        setTimeout(() => {
            onRequestReset(userId, result.token!);
        }, 2000);
    } else {
        // This case is primarily for debugging; production should always show success
        setError('An unexpected error occurred.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl animate-fade-in-up">
            <CheckmarkCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('reset_link_sent_title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('reset_link_sent_desc')}</p>
             <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-20 h-20 text-brand-primary" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('forgot_password_title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">{t('forgot_password_desc')}</p>
        </div>
        <form onSubmit={handleRequest} className="space-y-6">
          <div>
            <label htmlFor="userid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('user_id')}
            </label>
            <div className="mt-1">
              <input
                id="userid"
                name="userid"
                type="text"
                autoComplete="username"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., alex_green"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-green-700"
            >
              {t('reset_password_button')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand-primary hover:text-green-500 focus:outline-none">
            {t('back_to_login')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

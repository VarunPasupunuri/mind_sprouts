import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, CheckmarkCircleIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

interface ResetPasswordPageProps {
  onSwitchToLogin: () => void;
  token: string | null;
  userId: string | null;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSwitchToLogin, token, userId }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useI18n();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError(t('user_id_password_required'));
      return;
    }
    if (password.length < 8) {
      setError(t('password_length_error'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwords_no_match'));
      return;
    }
    if (!token || !userId) {
        setError(t('invalid_reset_token'));
        return;
    }

    const success = resetPassword(userId, token, password);

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } else {
      setError(t('invalid_reset_token'));
    }
  };
  
  if (isSuccess) {
    return (
        <div className="flex items-center justify-center h-full p-4">
        <div className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl animate-fade-in-up">
            <CheckmarkCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('password_reset_success_title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('password_reset_success_desc')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-20 h-20 text-brand-primary" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('reset_password_title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">{t('reset_password_desc')}</p>
        </div>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('new_password')}
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('confirm_new_password')}
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-green-700"
            >
              {t('update_password_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

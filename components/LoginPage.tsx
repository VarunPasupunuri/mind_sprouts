import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onForgotPassword }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useI18n();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password.trim()) {
      setError(t('user_id_password_required'));
      return;
    }

    const result = login(userId, password);

    if (result !== 'success') {
       setError(t(result === 'not_found' ? 'user_not_found' : 'invalid_password_error'));
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 animate-fade-in-up">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-24 h-24 text-brand-primary" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">Mind Sprouts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('login_welcome')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="userid"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                placeholder="e.g., alex_green"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('password')}
              </label>
               <button type="button" onClick={onForgotPassword} className="text-xs font-medium text-brand-primary hover:text-green-500 focus:outline-none">
                 {t('forgot_password_link')}
               </button>
            </div>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                placeholder="••••••••"
              />
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                {t('login_hint')}
             </p>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 btn-hover"
            >
              {t('login_button')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('dont_have_account')}{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-brand-primary hover:text-green-500 focus:outline-none"
          >
            {t('sign_up')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
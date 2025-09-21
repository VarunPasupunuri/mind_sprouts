import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, UserIcon, XCircleIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import OnboardingQuiz from './OnboardingQuiz';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, addPoints } = useAuth();
  const { t } = useI18n();
  const [showQuiz, setShowQuiz] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError(t('user_id_password_required'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwords_no_match'));
      return;
    }
    setError('');
    setNewUserId(userId);
    setNewUserPassword(password);
    setShowQuiz(true);
  };

  const handleQuizComplete = (topics: string[]) => {
    const success = signup(newUserId, newUserPassword);
    if (success) {
      // Give some bonus points for completing the quiz
      addPoints(15);
    } else {
      setError(`User ID "${newUserId}" is already taken. Please choose another.`);
      setShowQuiz(false); // Send user back to the signup form
    }
  };


  if (showQuiz) {
    return <OnboardingQuiz onComplete={handleQuizComplete} />;
  }

  return (
    <div className="flex items-center justify-center h-full px-4">
       <style>{`
          @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-up {
              animation: fadeIn 0.4s ease-out forwards;
          }
      `}</style>
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
        <div className="flex flex-col items-center text-center">
          <LogoIcon className="w-20 h-20 text-brand-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 mt-4">{t('create_account')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-sm">{t('signup_join')}</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="userid" className="sr-only">{t('user_id')}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="userid"
                name="userid"
                type="text"
                autoComplete="username"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t('user_id')}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">{t('password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('password')}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">{t('confirm_password')}</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('confirm_password')}
            />
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg">
                <XCircleIcon className="w-5 h-5 flex-shrink-0"/>
                <span>{error}</span>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-green-500"
            >
              {t('sign_up')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('already_have_account')}{' '}
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand-primary dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:underline">
            {t('log_in')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
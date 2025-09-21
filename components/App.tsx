import React, { useState, useEffect } from 'react';
import { Page, UserRole, AuthView } from './types';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider } from './hooks/useI18n';
import { ThemeProvider } from './hooks/useTheme';
import { XIcon } from './components/Icons'; // Assuming MenuIcon is also in Icons.tsx

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksAndChallenges from './components/TasksAndChallenges';
import Leaderboard from './components/Leaderboard';
import Resources from './components/Resources';
import AiAssistant from './components/AiAssistant';
import EcoWorld from './components/EcoWorld';
import About from './components/About';
import Games from './components/Games';
import Learn from './components/Learn';
import WeeklyAssignments from './components/WeeklyAssignments';
import Notifications from './components/Notifications';
import LearningVideos from './components/LearningVideos';
import StudentRoster from './components/StudentRoster';
import CommunityHub from './components/CommunityHub';
import EcoDonts from './components/EcoDonts';
import InteractiveQuizzes from './components/InteractiveQuizzes';
import RedemptionCenter from './components/Profile';
import EcoPointsDisplay from './components/EcoPointsDisplay';
import LoginRewardToast from './components/LoginRewardToast';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ActiveUsersWidget from './components/ActiveUsersWidget';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);


const AppContent: React.FC = () => {
  const { user, stats, loginReward, clearLoginReward, logVisit } = useAuth();
  const [authView, setAuthView] = useState<AuthView>(AuthView.LOGIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [userIdForReset, setUserIdForReset] = useState<string | null>(null);

  const initialPage = user?.role === UserRole.TEACHER ? Page.STUDENT_ROSTER : Page.HOME;
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);

  // When user logs in or out, reset the page to the default for their role.
  useEffect(() => {
    if (user) {
      logVisit(); // Log a visit every time the user is confirmed.
      setCurrentPage(user.role === UserRole.TEACHER ? Page.STUDENT_ROSTER : Page.HOME);
    }
  }, [user]);
  
  const handleRequestReset = (userId: string, token: string) => {
      setUserIdForReset(userId);
      setResetToken(token);
      setAuthView(AuthView.RESET_PASSWORD);
  };

  if (!user) {
    return (
      <div className="h-screen font-sans">
        {authView === AuthView.LOGIN && <LoginPage onSwitchToSignup={() => setAuthView(AuthView.SIGNUP)} onForgotPassword={() => setAuthView(AuthView.FORGOT_PASSWORD)} />}
        {authView === AuthView.SIGNUP && <SignupPage onSwitchToLogin={() => setAuthView(AuthView.LOGIN)} />}
        {authView === AuthView.FORGOT_PASSWORD && <ForgotPasswordPage onSwitchToLogin={() => setAuthView(AuthView.LOGIN)} onRequestReset={handleRequestReset} />}
        {authView === AuthView.RESET_PASSWORD && <ResetPasswordPage onSwitchToLogin={() => setAuthView(AuthView.LOGIN)} token={resetToken} userId={userIdForReset} />}
      </div>
    );
  }

  const renderStudentPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case Page.TASKS_AND_CHALLENGES:
        return <TasksAndChallenges />;
      case Page.LEADERBOARD:
        return <Leaderboard />;
      case Page.RESOURCES:
        return <Resources />;
      case Page.AI_ASSISTANT:
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case Page.PROFILE:
        return <EcoWorld />;
      case Page.ABOUT:
        return <About />;
      case Page.GAMES:
        return <Games />;
      case Page.EVENTS:
        return <CommunityHub />;
      case Page.ECO_LIBRARY:
        return <Learn pageType="library" />;
      case Page.LEARNING_VIDEOS:
        return <LearningVideos />;
      case Page.WEEKLY_ASSIGNMENTS:
        return <WeeklyAssignments />;
      case Page.ECO_DONTS:
        return <EcoDonts />;
      case Page.INTERACTIVE_QUIZZES:
        return <InteractiveQuizzes />;
      case Page.REDEMPTION_CENTER:
        return <RedemptionCenter />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };
  
  const renderTeacherPage = () => {
    switch (currentPage) {
        case Page.STUDENT_ROSTER:
            return <StudentRoster />;
        case Page.ANALYTICS:
            return <AnalyticsDashboard />;
        case Page.PROFILE:
            return <EcoWorld />;
        case Page.ABOUT:
            return <About />;
        default:
            return <StudentRoster />;
    }
  }

  return (
    <div className="flex h-screen font-sans">
      {loginReward && (
        <LoginRewardToast 
          streak={loginReward.streak}
          points={loginReward.points}
          onClose={clearLoginReward}
        />
      )}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen} 
      />
      <div className={`relative flex-1 flex flex-col overflow-y-auto transition-all duration-300 lg:ml-64`}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-30 flex items-center justify-between p-4 border-b dark:border-gray-700">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 active:scale-95 transition-all">
              <MenuIcon className="w-6 h-6" />
           </button>
           <div className="flex items-center space-x-2">
             {user.role === UserRole.STUDENT && <EcoPointsDisplay points={stats.points} />}
             <Notifications setCurrentPage={setCurrentPage} />
           </div>
        </header>

        {/* Desktop Header Items */}
        {user.role === UserRole.STUDENT && (
          <div className="absolute top-6 right-8 z-30 hidden lg:flex items-center space-x-4">
            <EcoPointsDisplay points={stats.points} />
            <Notifications setCurrentPage={setCurrentPage} />
          </div>
        )}
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {user.role === UserRole.TEACHER ? renderTeacherPage() : renderStudentPage()}
        </main>
      </div>
      <AiAssistant />
      {user.role === UserRole.TEACHER && <ActiveUsersWidget />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
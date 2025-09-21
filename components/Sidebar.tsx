// FIX: Import `useState` to resolve "Cannot find name 'useState'" error.
import React, { useState } from 'react';
import { Page, UserRole } from '../types';
import { BookOpenIcon, ChartBarIcon, CogIcon, InfoIcon, GraduationCapIcon, UserIcon, FolderIcon, ClipboardListIcon, ChevronDownIcon, VideoIcon, UsersIcon, LogoIcon, XCircleIcon, RapidFireIcon, GiftIcon, XIcon, HomeIcon, FlagIcon, SparklesIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  page?: Page;
  onClick?: () => void;
  currentPage?: Page;
  setCurrentPage?: (page: Page) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, icon, children, onClick }) => {
  const isActive = page && currentPage === page;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (page && setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative btn-subtle-interactive ${
        isActive
          ? 'bg-white text-green-700 shadow-md dark:bg-gray-900/70 dark:text-white'
          : 'text-gray-200 hover:bg-white/20 hover:text-white'
      }`}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full"></div>}
      {icon}
      <span>{children}</span>
    </button>
  );
};

const SubNavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, icon, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center w-full space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 btn-subtle-interactive ${
        isActive
          ? 'text-white bg-white/20'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};


const LearnDropdown: React.FC<Pick<SidebarProps, 'currentPage' | 'setCurrentPage'>> = ({ currentPage, setCurrentPage }) => {
  const { t } = useI18n();
  const learnPages = [Page.ECO_LIBRARY, Page.WEEKLY_ASSIGNMENTS, Page.RESOURCES, Page.LEARNING_VIDEOS, Page.ECO_DONTS, Page.INTERACTIVE_QUIZZES];
  const isLearnSectionActive = learnPages.includes(currentPage);
  const [isOpen, setIsOpen] = useState(isLearnSectionActive);
  
  React.useEffect(() => {
    if (isLearnSectionActive) {
      setIsOpen(true);
    }
  }, [isLearnSectionActive]);

  return (
    <div>
      <NavItem
        onClick={() => setIsOpen(!isOpen)}
        icon={<GraduationCapIcon className="w-5 h-5" />}
        currentPage={isLearnSectionActive ? currentPage : undefined}
      >
        <span className="flex-grow text-left">{t('learn')}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </NavItem>
      <div className={`pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80' : 'max-h-0'}`}>
        <SubNavItem page={Page.LEARNING_VIDEOS} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<VideoIcon className="w-4 h-4" />}>{t('learning_videos')}</SubNavItem>
        <SubNavItem page={Page.INTERACTIVE_QUIZZES} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<RapidFireIcon className="w-4 h-4" />}>{t('interactive_quizzes')}</SubNavItem>
        <SubNavItem page={Page.WEEKLY_ASSIGNMENTS} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ClipboardListIcon className="w-4 h-4" />}>{t('weekly_assignments')}</SubNavItem>
        <SubNavItem page={Page.ECO_DONTS} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<XCircleIcon className="w-4 h-4" />}>{t('eco_donts')}</SubNavItem>
        <SubNavItem page={Page.ECO_LIBRARY} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<BookOpenIcon className="w-4 h-4" />}>{t('eco_library')}</SubNavItem>
        <SubNavItem page={Page.RESOURCES} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<FolderIcon className="w-4 h-4" />}>{t('resources')}</SubNavItem>
      </div>
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  
  const handleSetPage = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  }
  
  const studentNavItems = [
    { page: Page.HOME, icon: <HomeIcon className="w-5 h-5" />, text: t('home') },
    { page: Page.TASKS_AND_CHALLENGES, icon: <FlagIcon className="w-5 h-5" />, text: t('tasks_and_challenges') },
    { page: Page.GAMES, icon: <SparklesIcon className="w-5 h-5" />, text: t('games_and_puzzles') },
    { page: Page.LEADERBOARD, icon: <ChartBarIcon className="w-5 h-5" />, text: t('leaderboard') },
    { page: Page.REDEMPTION_CENTER, icon: <GiftIcon className="w-5 h-5" />, text: t('redemption_center') },
    { page: Page.EVENTS, icon: <UsersIcon className="w-5 h-5" />, text: t('events') },
  ];

  const teacherNavItems = [
    { page: Page.STUDENT_ROSTER, icon: <UsersIcon className="w-5 h-5" />, text: t('student_roster') },
    { page: Page.ANALYTICS, icon: <ChartBarIcon className="w-5 h-5" />, text: t('analytics' as any) },
  ];
  
  const personalItems = [
    { page: Page.PROFILE, icon: <UserIcon className="w-5 h-5" />, text: t('profile') },
    { page: Page.ABOUT, icon: <InfoIcon className="w-5 h-5" />, text: t('about') },
  ];

  const renderNavItems = () => {
    if (user?.role === UserRole.TEACHER) {
      return (
        <>
            {teacherNavItems.map(item => <NavItem key={item.page} page={item.page} currentPage={currentPage} setCurrentPage={handleSetPage} icon={item.icon}>{item.text}</NavItem>)}
            <hr className="my-3 border-t border-white/20" />
            {personalItems.map(item => <NavItem key={item.page} page={item.page} currentPage={currentPage} setCurrentPage={handleSetPage} icon={item.icon}>{item.text}</NavItem>)}
        </>
      )
    }
    // Default to student view
    return (
        <>
            {studentNavItems.map(item => <NavItem key={item.page} page={item.page} currentPage={currentPage} setCurrentPage={handleSetPage} icon={item.icon}>{item.text}</NavItem>)}
            <LearnDropdown 
                currentPage={currentPage}
                setCurrentPage={handleSetPage}
            />
            <hr className="my-3 border-t border-white/20" />
            {personalItems.map(item => <NavItem key={item.page} page={item.page} currentPage={currentPage} setCurrentPage={handleSetPage} icon={item.icon}>{item.text}</NavItem>)}
        </>
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`bg-brand-primary backdrop-blur-md shadow-lg fixed top-0 left-0 h-full w-64 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-20 border-b border-white/20 px-4">
          <div className="flex items-center">
            <LogoIcon className="w-10 h-10 text-white" />
            <span className="ml-2 text-2xl font-bold text-white">Mind Sprouts</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-white/80 hover:text-white btn-subtle-interactive">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {renderNavItems()}
        </nav>
        
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center">
              <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user?.avatar}
                  alt="User Avatar"
              />
              <div className='ml-3 overflow-hidden'>
                  <p className="text-sm font-semibold text-white truncate">{user?.userId || 'User'}</p>
                  <p className='text-xs text-gray-300 truncate'>{user?.school || 'Your School'}</p>
              </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
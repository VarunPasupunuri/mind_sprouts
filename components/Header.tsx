

import React from 'react';
import { Page } from '../types';
import { LeafIcon, TrophyIcon, BookOpenIcon, ChartBarIcon, SparklesIcon } from './Icons';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
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
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-green-100 text-green-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LeafIcon className="w-8 h-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">EcoChamps</span>
          </div>
          <nav className="hidden md:flex md:space-x-4">
            <NavItem page={Page.HOME} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ChartBarIcon className="w-5 h-5" />}>
              Home
            </NavItem>
            {/* FIX: Corrected Page enum from Page.CHALLENGES to Page.TASKS_AND_CHALLENGES */}
            <NavItem page={Page.TASKS_AND_CHALLENGES} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<TrophyIcon className="w-5 h-5" />}>
              Challenges
            </NavItem>
            <NavItem page={Page.LEADERBOARD} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ChartBarIcon className="w-5 h-5" />}>
              Leaderboard
            </NavItem>
            <NavItem page={Page.RESOURCES} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<BookOpenIcon className="w-5 h-5" />}>
              Resources
            </NavItem>
            {/* FIX: Corrected Page enum from Page.ECO_HELPER to Page.AI_ASSISTANT */}
            <NavItem page={Page.AI_ASSISTANT} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<SparklesIcon className="w-5 h-5" />}>
              Eco Helper
            </NavItem>
          </nav>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3 hidden sm:block">Welcome, Alex!</span>
            <img
              className="h-9 w-9 rounded-full object-cover"
              src="https://picsum.photos/id/237/100/100"
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
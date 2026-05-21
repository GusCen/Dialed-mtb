'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TopBarProps {
  onSignInClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSignInClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const bg    = isDarkMode ? 'bg-canvas/80 border-border-strong' : 'bg-surface-light/70 border-border-light';

  return (
    <header className={`md:hidden sticky top-0 z-30 border-b backdrop-blur-xl ${bg}`}>
      <div className="h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="w-6 h-6 text-brand" strokeWidth={2.5} />
          <span className={`text-lg font-bold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dialed</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full"
            aria-label="Toggle theme"
          >
            <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-white bg-white' : 'border-gray-400'}`} />
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>
              <div className={`absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${isDarkMode ? 'bg-surface border border-border-strong' : 'bg-surface-light border border-border-light'}`}>
                <div className={`px-4 py-2 text-sm border-b ${isDarkMode ? 'border-border-strong text-zinc-400' : 'border-border-light text-gray-500'}`}>
                  Signed in as <br />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500 transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onSignInClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand text-white text-sm font-medium"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

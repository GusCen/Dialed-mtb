'use client';

import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const muted   = isDarkMode ? 'text-zinc-400' : 'text-gray-500';
  const surface = isDarkMode ? 'bg-surface border-border-strong' : 'bg-surface-light border-border-light';

  return (
    <div className="container mx-auto px-5 py-8 max-w-2xl">
      <h1 className={`text-2xl font-bold font-display tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Profile
      </h1>

      {isAuthenticated ? (
        <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${surface}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</div>
              <div className={`text-sm ${muted}`}>{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="self-start flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center py-24 text-center ${muted}`}>
          <UserIcon className="w-16 h-16 mb-4 stroke-1" />
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Not signed in
          </h2>
          <p className="max-w-sm">
            Sign in from the avatar in the header to sync your setups across devices.
          </p>
        </div>
      )}
    </div>
  );
}

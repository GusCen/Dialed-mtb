'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Briefcase,
  BarChart3,
  User,
  Mountain,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  onSignInClick: () => void;
}

const NAV_ITEMS = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/setups',   label: 'Setups',   icon: Sparkles },
  { href: '/garage',   label: 'Garage',   icon: Briefcase },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/profile',  label: 'Profile',  icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ onSignInClick }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const bg       = isDarkMode ? 'bg-canvas border-border-strong' : 'bg-surface-light border-border-light';
  const label    = isDarkMode ? 'text-zinc-400' : 'text-gray-500';
  const active   = 'text-brand';
  const activeBg = isDarkMode ? 'bg-surface' : 'bg-canvas-light';
  const hoverBg  = isDarkMode ? 'hover:bg-surface' : 'hover:bg-canvas-light';

  return (
    <aside className={`hidden md:flex fixed inset-y-0 left-0 z-30 w-[88px] flex-col items-center justify-between border-r ${bg} py-5`}>
      <div className="flex flex-col items-center gap-6">
        <Link href="/" className="flex flex-col items-center gap-1">
          <Mountain className="w-7 h-7 text-brand" strokeWidth={2.5} />
          <span className={`text-[10px] font-display font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dialed</span>
        </Link>

        <nav className="flex flex-col items-stretch gap-1 w-full px-2">
          {NAV_ITEMS.map(({ href, label: lbl, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-colors ${isActive ? `${active} ${activeBg}` : `${label} ${hoverBg}`}`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-[10px] font-medium">{lbl}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${label} ${hoverBg}`}
          aria-label="Toggle theme"
          title={isDarkMode ? 'Switch to light' : 'Switch to dark'}
        >
          <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-white bg-white' : 'border-gray-400'}`} />
        </button>

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className={`p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors ${label}`}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignInClick}
            className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center"
            aria-label="Sign in"
            title="Sign in"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

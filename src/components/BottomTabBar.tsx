'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Briefcase, BarChart3, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const NAV_ITEMS = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/setups',   label: 'Setups',   icon: Sparkles },
  { href: '/garage',   label: 'Garage',   icon: Briefcase },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/profile',  label: 'Profile',  icon: User },
];

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  const bg    = isDarkMode ? 'bg-canvas/95 border-border-strong' : 'bg-surface-light/95 border-border-light';
  const muted = isDarkMode ? 'text-zinc-400' : 'text-gray-500';

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl ${bg}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2 transition-colors ${isActive ? 'text-brand' : muted}`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

'use client';

import React from 'react';
import { Briefcase } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function GaragePage() {
  const { isDarkMode } = useTheme();
  const muted = isDarkMode ? 'text-zinc-400' : 'text-gray-500';

  return (
    <div className="container mx-auto px-5 py-8 max-w-4xl">
      <div className={`flex flex-col items-center justify-center py-24 text-center ${muted}`}>
        <Briefcase className="w-16 h-16 mb-4 stroke-1" />
        <h1 className={`text-2xl font-bold font-display tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Your garage
        </h1>
        <p className="max-w-sm">
          Multi-bike support is coming soon. You&apos;ll be able to save bikes, switch between them,
          and link setups to a specific frame.
        </p>
      </div>
    </div>
  );
}

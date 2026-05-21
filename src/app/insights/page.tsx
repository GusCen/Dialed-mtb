'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function InsightsPage() {
  const { isDarkMode } = useTheme();
  const muted = isDarkMode ? 'text-zinc-400' : 'text-gray-500';

  return (
    <div className="container mx-auto px-5 py-8 max-w-4xl">
      <div className={`flex flex-col items-center justify-center py-24 text-center ${muted}`}>
        <BarChart3 className="w-16 h-16 mb-4 stroke-1" />
        <h1 className={`text-2xl font-bold font-display tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Insights
        </h1>
        <p className="max-w-sm">
          Setup-history trends, AI-driven tuning recommendations, and feedback patterns
          are on the way.
        </p>
      </div>
    </div>
  );
}

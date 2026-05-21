'use client';

import React from 'react';
import { SavedSetupsList } from '@/components/SavedSetupsList';
import { useTheme } from '@/contexts/ThemeContext';
import { useSetups } from '@/contexts/SetupsContext';

export default function SetupsPage() {
  const { isDarkMode } = useTheme();
  const { savedSetups, handleLoadSetup, handleDeleteSetup, handleRateSetup } = useSetups();

  return (
    <div className="container mx-auto px-5 py-8 max-w-7xl">
      <SavedSetupsList
        setups={savedSetups}
        onLoad={handleLoadSetup}
        onDelete={handleDeleteSetup}
        onRate={handleRateSetup}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

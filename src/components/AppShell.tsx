'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TopBar } from '@/components/TopBar';
import { LoginModal } from '@/components/LoginModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { AddToHomeScreen } from '@/components/AddToHomeScreen';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [showLoginModal, setShowLoginModal]       = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const canvas = isDarkMode ? 'bg-canvas text-white' : 'bg-canvas-light text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${canvas}`}>
      <Sidebar onSignInClick={() => setShowLoginModal(true)} />
      <TopBar  onSignInClick={() => setShowLoginModal(true)} />

      <main className="md:ml-[88px] min-h-screen pb-24 md:pb-0">
        {children}
      </main>

      <BottomTabBar />

      <button
        onClick={() => setShowFeedbackModal(true)}
        className={`fixed right-5 z-40 p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 bottom-24 md:bottom-6 ${isDarkMode ? 'bg-surface text-zinc-400 hover:text-white hover:bg-surface-2' : 'bg-surface-light text-gray-400 hover:text-brand'}`}
        aria-label="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <LoginModal    isOpen={showLoginModal}    onClose={() => setShowLoginModal(false)}    isDarkMode={isDarkMode} />
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} isDarkMode={isDarkMode} />
      <AddToHomeScreen isDarkMode={isDarkMode} />
    </div>
  );
};

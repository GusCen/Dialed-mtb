'use client';

import React, { useState } from 'react';
import { SuspensionForm } from '@/components/SuspensionForm';
import { ResultsView } from '@/components/ResultsView';
import { useTheme } from '@/contexts/ThemeContext';
import { useSetups } from '@/contexts/SetupsContext';

// Technical Wireframe Background Component
const ShockBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
    <svg
      className={`w-[140%] h-[140%] md:w-full md:h-full max-w-[1200px] opacity-[0.03] ${isDarkMode ? 'stroke-white' : 'stroke-black'}`}
      viewBox="0 0 800 1200"
      fill="none"
      strokeWidth="1.5"
      style={{ transform: 'rotate(-5deg)' }}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <line x1="400" y1="50" x2="400" y2="1150" strokeDasharray="15 15" opacity="0.4" />
      <circle cx="400" cy="150" r="35" />
      <circle cx="400" cy="150" r="15" />
      <path d="M360 180 L360 230 L440 230 L440 180 Z" />
      <line x1="360" y1="210" x2="440" y2="210" opacity="0.5" />
      <rect x="330" y="230" width="140" height="420" rx="8" />
      <line x1="330" y1="280" x2="470" y2="280" opacity="0.3" />
      <line x1="330" y1="600" x2="470" y2="600" opacity="0.3" />
      <rect x="380" y="350" width="40" height="150" rx="2" strokeDasharray="4 4" opacity="0.5" />
      <path d="M470 260 L540 260 L540 520 L470 520" />
      <path d="M540 260 A 25 25 0 0 1 565 285 L 565 495 A 25 25 0 0 1 540 520" />
      <circle cx="550" cy="290" r="12" />
      <circle cx="550" cy="490" r="12" />
      <rect x="530" y="350" width="35" height="100" rx="4" opacity="0.6" />
      <rect x="320" y="650" width="160" height="50" rx="4" />
      <circle cx="335" cy="675" r="5" />
      <circle cx="465" cy="675" r="5" />
      <rect x="370" y="700" width="60" height="280" />
      <g opacity="0.7" style={{ fontFamily: 'monospace', fontSize: '14px' }} fill="currentColor" stroke="none">
        <rect x="430" y="740" width="30" height="1" fill="currentColor" />
        <text x="470" y="745">15%</text>
        <rect x="430" y="796" width="30" height="1" fill="currentColor" />
        <text x="470" y="801">30%</text>
      </g>
      <rect x="365" y="790" width="70" height="8" rx="4" fill="currentColor" opacity="0.1" stroke="currentColor" />
      <path d="M370 980 L360 1020 L440 1020 L430 980 Z" />
      <circle cx="400" cy="1055" r="35" />
      <circle cx="400" cy="1055" r="15" />
      <circle cx="400" cy="1100" r="12" strokeWidth="2" />
      <path d="M390 1100 L410 1100" />
      <path d="M400 1090 L400 1110" />
    </svg>
  </div>
);

export default function HomePage() {
  const [view, setView]                 = useState<'input' | 'results'>('input');
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const { isDarkMode }                  = useTheme();
  const { formData, setFormData, userPreferences, savedSetups, handleSaveSetup } = useSetups();

  return (
    <div className="relative">
      <ShockBackground isDarkMode={isDarkMode} />

      <div className="container mx-auto px-5 py-8 max-w-7xl relative z-10">
        {view === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-slide-up">
              <h1 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Perfect suspension.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Every ride.</span>
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} max-w-xl mx-auto`}>
                AI-powered calculator for mountain bike suspension. Get the perfect base tune for your weight, bike, and riding style.
              </p>
            </div>
            <SuspensionForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => setView('results')}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
        {view === 'results' && (
          <ResultsView
            formData={formData}
            setFormData={setFormData}
            onBack={() => { setView('input'); setShowQuickEdit(false); }}
            isDarkMode={isDarkMode}
            showQuickEdit={showQuickEdit}
            setShowQuickEdit={setShowQuickEdit}
            onSave={handleSaveSetup}
            userPreferences={userPreferences}
            savedSetups={savedSetups}
          />
        )}
      </div>
    </div>
  );
}

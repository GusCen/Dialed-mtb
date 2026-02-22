'use client';

import React, { useState, useEffect } from 'react';
import { Mountain, Bookmark, User, LogOut, MessageSquare } from 'lucide-react';
import { FormData, SavedSetup, UserPreferences } from '@/types';
import { SuspensionForm } from '@/components/SuspensionForm';
import { ResultsView } from '@/components/ResultsView';
import { SavedSetupsList } from '@/components/SavedSetupsList';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { AddToHomeScreen } from '@/components/AddToHomeScreen';

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

export default function App() {
  const [view, setView] = useState<'input' | 'results' | 'saved'>('input');
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    pressureModifier: 1.0,
    reboundModifier: 0
  });

  const [formData, setFormData] = useState<FormData>({
    weight: '',
    bikeType: 'muscle',
    bikeCategory: 'trail',
    bikeModel: '',
    frontSuspension: '',
    rearShock: '',
    rideType: 'Trail',
    terrain: 'Mixed'
  });

  useEffect(() => {
    const theme = localStorage.getItem('mtb-theme');
    if (theme) setIsDarkMode(theme === 'dark');
    const prefs = localStorage.getItem('mtb-preferences');
    if (prefs) setUserPreferences(JSON.parse(prefs));
    const localSetups = localStorage.getItem('mtb-saved-setups');
    if (localSetups) setSavedSetups(JSON.parse(localSetups));
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`/api/setups/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const localSetups = JSON.parse(localStorage.getItem('mtb-saved-setups') || '[]');
          const merged = [...data];
          localSetups.forEach((ls: SavedSetup) => {
            if (!merged.find((ms: SavedSetup) => ms.id === ls.id)) {
              fetch('/api/setups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ls, userId: user.id })
              });
              merged.push(ls);
            }
          });
          setSavedSetups(merged);
        })
        .catch(err => console.error('Failed to fetch setups', err));
    }
  }, [isAuthenticated, user]);

  const saveSetupsToStorage = (setups: SavedSetup[]) => {
    setSavedSetups(setups);
    localStorage.setItem('mtb-saved-setups', JSON.stringify(setups));
  };

  const savePreferences = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    localStorage.setItem('mtb-preferences', JSON.stringify(prefs));
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('mtb-theme', newMode ? 'dark' : 'light');
  };

  const handleSaveSetup = async (name: string) => {
    const newSetup: SavedSetup = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      formData: { ...formData },
    };
    const updatedSetups = [newSetup, ...savedSetups];
    saveSetupsToStorage(updatedSetups);
    if (isAuthenticated && user) {
      try {
        await fetch('/api/setups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newSetup, userId: user.id })
        });
      } catch (e) {
        console.error('Failed to save to server', e);
      }
    }
  };

  const handleDeleteSetup = async (id: string) => {
    const updatedSetups = savedSetups.filter(s => s.id !== id);
    saveSetupsToStorage(updatedSetups);
    if (isAuthenticated) {
      try {
        await fetch(`/api/setups/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to delete from server', e);
      }
    }
  };

  const handleRateSetup = async (id: string, rating: number, feedback: SavedSetup['feedback']) => {
    const updatedSetups = savedSetups.map(s =>
      s.id === id ? { ...s, rating, feedback } : s
    );
    saveSetupsToStorage(updatedSetups);
    if (isAuthenticated) {
      try {
        await fetch(`/api/setups/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, feedback })
        });
      } catch (e) {
        console.error('Failed to update rating on server', e);
      }
    }
    let newPrefs = { ...userPreferences };
    if (feedback === 'Too Soft')  newPrefs.pressureModifier += 0.03;
    else if (feedback === 'Too Hard')  newPrefs.pressureModifier -= 0.03;
    else if (feedback === 'Too Fast')  newPrefs.reboundModifier -= 1;
    else if (feedback === 'Too Slow')  newPrefs.reboundModifier += 1;
    newPrefs.pressureModifier = Math.max(0.8, Math.min(1.3, newPrefs.pressureModifier));
    savePreferences(newPrefs);
  };

  const handleLoadSetup = (setup: SavedSetup) => {
    setFormData(setup.formData);
    setView('results');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-gray-900'} relative`}>
      <ShockBackground isDarkMode={isDarkMode} />

      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-black/80 border-zinc-800' : 'bg-white/70 border-gray-200'}`}>
        <div className="container mx-auto px-5 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity" onClick={() => setView('input')}>
            <Mountain className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
            <span className="text-xl font-bold font-orbitron tracking-tight">Dialed</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-sm font-medium transition-colors cursor-pointer select-none hidden sm:block">
              <span className={`${isDarkMode ? 'text-white font-semibold' : 'text-gray-400'}`}>Dark</span>
              <span className={`mx-2 ${isDarkMode ? 'text-zinc-700' : 'text-gray-300'}`}>|</span>
              <span className={`${!isDarkMode ? 'text-black font-semibold' : 'text-zinc-600'}`}>Light</span>
            </button>
            <button onClick={toggleTheme} className="sm:hidden p-2 rounded-full transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-white bg-white' : 'border-gray-400'}`} />
            </button>
            <button
              onClick={() => setView(view === 'saved' ? 'input' : 'saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${view === 'saved' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-gray-500 hover:text-black shadow-sm'}`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Saved</span>
            </button>
            {isAuthenticated ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-2 py-1 rounded-full transition-all ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className={`absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}>
                  <div className={`px-4 py-2 text-sm border-b ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-gray-100 text-gray-500'}`}>
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
                onClick={() => setShowLoginModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 font-medium text-sm ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

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
        {view === 'saved' && (
          <SavedSetupsList
            setups={savedSetups}
            onLoad={handleLoadSetup}
            onDelete={handleDeleteSetup}
            onRate={handleRateSetup}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      <button
        onClick={() => setShowFeedbackModal(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-40 ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-white text-gray-400 hover:text-orange-500 hover:bg-gray-50'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} isDarkMode={isDarkMode} />
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} isDarkMode={isDarkMode} />
      <AddToHomeScreen isDarkMode={isDarkMode} />
    </div>
  );
}
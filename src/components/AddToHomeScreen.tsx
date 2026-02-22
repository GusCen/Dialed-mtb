import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

export const AddToHomeScreen: React.FC<Props> = ({ isDarkMode }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Detect User Agent
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // Show prompt only on mobile devices
    if (isIosDevice || isAndroidDevice) {
      // Check if we've shown it recently
      const lastShown = localStorage.getItem('pwa-prompt-shown');
      const now = Date.now();
      
      if (!lastShown || (now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000)) { // Show once a week
        // Delay slightly for better UX
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-10 duration-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
      <button 
        onClick={handleClose}
        className={`absolute top-2 right-2 p-1 rounded-full ${isDarkMode ? 'text-zinc-500 hover:bg-zinc-800' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
           <span className="text-white font-bold text-xl font-orbitron">D</span>
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">Install Dialed App</h3>
          <p className={`text-xs leading-relaxed mb-3 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
            Add to your home screen for the best fullscreen experience.
          </p>
          
          {isIOS && (
            <div className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
              <span>Tap</span>
              <Share className="w-4 h-4 text-blue-500" />
              <span>then select <strong>Add to Home Screen</strong></span>
              <PlusSquare className="w-4 h-4 text-zinc-500" />
            </div>
          )}

          {isAndroid && (
            <div className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
              <span>Tap menu</span>
              <span className="font-bold">⋮</span>
              <span>then select <strong>Install App</strong> or <strong>Add to Home screen</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

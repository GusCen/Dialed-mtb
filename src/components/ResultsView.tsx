
import React, { useState, useEffect } from 'react';
import { Settings, ChevronLeft, Bookmark, Zap, CircleDashed } from 'lucide-react';
import { FormData, UserPreferences, SavedSetup } from '../types';
import { calculateSettings } from '../utils';
import { suspensionDatabase } from '../constants';

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onBack: () => void;
  isDarkMode: boolean;
  showQuickEdit: boolean;
  setShowQuickEdit: (show: boolean) => void;
  onSave: (name: string) => void;
  userPreferences: UserPreferences;
  savedSetups: SavedSetup[];
}

export const ResultsView: React.FC<Props> = ({ 
  formData, setFormData, onBack, isDarkMode, showQuickEdit, setShowQuickEdit, onSave, userPreferences, savedSetups
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [setupName, setSetupName] = useState(`${formData.bikeModel || 'Custom'} - ${formData.rideType}`);
  const isEBike = formData.bikeType === 'ebike';

  // Automatically check if this setup is already in the saved list
  useEffect(() => {
    const exists = savedSetups.some(s => 
      s.formData.weight === formData.weight &&
      s.formData.bikeModel === formData.bikeModel &&
      s.formData.rideType === formData.rideType &&
      s.formData.frontSuspension === formData.frontSuspension &&
      s.formData.rearShock === formData.rearShock &&
      s.formData.bikeType === formData.bikeType
    );
    setIsSaved(exists);
  }, [formData, savedSetups]);

  const forkResults = calculateSettings(
    parseFloat(formData.weight),
    formData.rideType,
    formData.frontSuspension,
    'fork',
    userPreferences,
    formData.bikeType as 'muscle' | 'ebike'
  );
  
  const shockResults = calculateSettings(
    parseFloat(formData.weight),
    formData.rideType,
    formData.rearShock,
    'shock',
    userPreferences,
    formData.bikeType as 'muscle' | 'ebike'
  );
  
  const forkData = suspensionDatabase.forks[formData.frontSuspension];
  const shockData = suspensionDatabase.shocks[formData.rearShock];

  // UI Helpers
  const cardClass = `rounded-3xl p-6 mb-4 ${isDarkMode ? 'bg-zinc-900 border border-zinc-800/50' : 'bg-white border border-gray-100 shadow-lg shadow-gray-200/50'}`;
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-gray-500';

  const renderAdjustmentCard = (key: string, value: string | number, spec: any) => {
    // Style by tuning function first (so "Open Mode Adjust" — a low-speed
    // compression dial — is coloured as compression), falling back to the
    // display name. Never rename the label itself; it must match the fork.
    const isRebound = spec?.func === 'lsr' || spec?.func === 'hsr' || key.includes('Rebound');
    const isCompression = spec?.func === 'lsc' || spec?.func === 'hsc' || key.includes('Compression');
    const isAir = spec?.func === 'airSpring' || spec?.func === 'rampUp' || key.includes('Air') || key.includes('Spring');

    let accentColor = isDarkMode ? 'text-zinc-300' : 'text-zinc-700';
    let labelColor = isDarkMode ? 'bg-zinc-800' : 'bg-gray-100';

    if (isRebound) {
      accentColor = 'text-red-500';
      labelColor = isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600';
    } else if (isCompression) {
      accentColor = 'text-blue-500';
      labelColor = isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600';
    } else if (isAir) {
      accentColor = 'text-orange-500';
      labelColor = isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
    }

    let displayValue = value;
    let subText = "";

    if (spec.setting === 'clicks from closed' || spec.setting === 'clicks from open') {
       subText = spec.setting === 'clicks from closed' ? "From fully closed" : "From fully open";
       if (typeof value === 'number') displayValue = `${value} clicks`;
    }

    // Standard damping function code (if this control is a damping knob).
    const funcCodeMap: Record<string, string> = { lsc: 'LSC', hsc: 'HSC', lsr: 'LSR', hsr: 'HSR' };
    const funcCode = spec?.func ? funcCodeMap[spec.func] : undefined;

    // Primary label keeps the manufacturer's naming. The four standard damping
    // names collapse to their own acronym (their natural short form); any other
    // manufacturer-specific name (e.g. "Open Mode Adjust") is shown verbatim.
    const standardLabel =
      /low-speed rebound/i.test(key) ? 'LSR' :
      /high-speed rebound/i.test(key) ? 'HSR' :
      /low-speed compression/i.test(key) ? 'LSC' :
      /high-speed compression/i.test(key) ? 'HSC' :
      null;
    const displayLabel = standardLabel ?? key;

    // Show the function code as a reference only when the manufacturer name
    // doesn't already convey it (i.e. the label isn't the code itself).
    const showFuncRef = !!funcCode && displayLabel !== funcCode;

    return (
      <div key={key} className={`rounded-2xl p-4 flex flex-col justify-between h-full relative overflow-hidden ${isDarkMode ? 'bg-zinc-800/40' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-1.5 flex-wrap min-w-0">
             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${labelColor}`}>
               {displayLabel}
             </span>
             {showFuncRef && (
               <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-1 rounded-md ${isDarkMode ? 'bg-white/5 text-zinc-400' : 'bg-black/5 text-gray-500'}`}>
                 {funcCode}
               </span>
             )}
           </div>
           {spec.type === 'knob' && <CircleDashed className={`w-4 h-4 ${accentColor} opacity-50 shrink-0`} />}
        </div>
        
        <div className="my-2">
          <div className={`text-2xl font-bold tracking-tight ${accentColor}`}>
            {displayValue}
          </div>
          {subText && <div className={`text-[11px] font-medium opacity-80 ${isRebound ? 'text-red-500' : isCompression ? 'text-blue-500' : textSecondary}`}>{subText}</div>}
        </div>

        <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
           <p className={`text-[10px] leading-tight ${textSecondary}`}>
             <span className="font-semibold opacity-70">Loc:</span> {spec.location}
           </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      
      <div className="flex items-center justify-between mb-6 pt-2">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-[15px] font-medium ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors pl-2`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex gap-2">
          <button 
             onClick={() => !isSaved && setShowSaveDialog(true)}
             className={`p-2.5 rounded-full active:scale-95 transition-all duration-300 ${
               isSaved 
                 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                 : isDarkMode ? 'bg-zinc-800 text-orange-400' : 'bg-orange-50 text-orange-600'
             }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {showSaveDialog && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6 animate-in fade-in duration-200">
            <div className={`w-full max-w-sm p-6 rounded-[32px] ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-2xl'} transform transition-all`}>
               <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>Name your setup</h3>
               <p className={`text-sm ${textSecondary} mb-5`}>Save this configuration for later.</p>
               
               <input 
                  type="text" 
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  className={`w-full p-4 rounded-2xl mb-4 text-[17px] ${isDarkMode ? 'bg-zinc-800 text-white placeholder-zinc-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'} outline-none focus:ring-2 focus:ring-orange-500/50 transition-all`}
                  autoFocus
               />
               <div className="flex gap-3">
                  <button onClick={() => setShowSaveDialog(false)} className={`flex-1 py-3.5 rounded-2xl font-semibold text-[15px] ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
                  <button onClick={() => { onSave(setupName); setShowSaveDialog(false); }} className="flex-1 py-3.5 rounded-2xl font-semibold text-[15px] bg-orange-500 text-white shadow-lg">Save</button>
               </div>
            </div>
         </div>
      )}
      
      <div className={`${cardClass} relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
             <div>
               <h2 className={`text-3xl font-bold mb-1 ${textPrimary} tracking-tight`}>Your setup</h2>
               <p className={`text-[15px] ${textSecondary} mb-8`}>Optimized for <span className="font-medium text-orange-500">{formData.rideType}</span></p>
             </div>
             {isEBike && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                  <Zap className="w-3 h-3 fill-current" /> E-MTB Tuned
                </div>
             )}
          </div>
          
          <div className="flex gap-12">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Target Sag</p>
              <p className={`text-2xl font-semibold text-orange-500 tracking-tight`}>{forkResults.recommendedSag}</p>
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Bike</p>
              <p className={`text-2xl font-semibold ${textPrimary} tracking-tight truncate max-w-[150px]`}>{formData.bikeModel || 'Custom'}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowQuickEdit(!showQuickEdit)}
          className={`mt-8 w-full py-3 rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
          <Settings className="w-4 h-4" />
          Tune inputs
        </button>
      </div>
      
      {showQuickEdit && (
        <div className={`animate-in slide-in-from-top-4 fade-in duration-300 ${cardClass}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${textSecondary}`}>Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className={`w-full p-3 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900'} outline-none`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-2 ${textSecondary}`}>Style</label>
              <select
                value={formData.rideType}
                onChange={(e) => setFormData({...formData, rideType: e.target.value})}
                className={`w-full p-3 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900'} outline-none`}
              >
                {['XC', 'Trail', 'Enduro', 'Bike Park', 'Downhill'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {forkData && (
          <div className={`${cardClass} h-full`}>
            <div className="flex items-center gap-3 mb-5">
               <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
               <div className="flex-1 min-w-0">
                 <h3 className={`text-lg font-bold ${textPrimary}`}>Fork</h3>
                 <p className={`text-xs ${textSecondary} truncate`}>{formData.frontSuspension}</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              {forkResults.settings['Air Pressure'] && <div className="col-span-2">{renderAdjustmentCard('Air Pressure', forkResults.settings['Air Pressure'], forkData.adjustments['Air Pressure'])}</div>}
              {Object.keys(forkResults.settings).map(key => key !== 'Air Pressure' && forkData.adjustments[key] && renderAdjustmentCard(key, forkResults.settings[key], forkData.adjustments[key]))}
            </div>
          </div>
        )}
        
        {shockData && (
          <div className={`${cardClass} h-full`}>
             <div className="flex items-center gap-3 mb-5">
               <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
               <div className="flex-1 min-w-0">
                 <h3 className={`text-lg font-bold ${textPrimary}`}>Shock</h3>
                 <p className={`text-xs ${textSecondary} truncate`}>{formData.rearShock}</p>
               </div>
            </div>
             <div className="grid grid-cols-2 gap-3 mb-2">
              {shockResults.settings['Air Pressure'] && <div className="col-span-2">{renderAdjustmentCard('Air Pressure', shockResults.settings['Air Pressure'], shockData.adjustments['Air Pressure'])}</div>}
              {Object.keys(shockResults.settings).map(key => key !== 'Air Pressure' && shockData.adjustments[key] && renderAdjustmentCard(key, shockResults.settings[key], shockData.adjustments[key]))}
            </div>
          </div>
        )}
      </div>

      {(userPreferences.pressureModifier !== 1.0 || userPreferences.reboundModifier !== 0) && (
         <div className="flex justify-center mb-6">
           <span className={`text-[11px] font-medium px-4 py-1.5 rounded-full border ${isDarkMode ? 'border-zinc-800 text-zinc-500 bg-zinc-900' : 'border-gray-200 text-gray-500 bg-white'}`}>✨ Personalized AI tuning active</span>
         </div>
      )}
    </div>
  );
};

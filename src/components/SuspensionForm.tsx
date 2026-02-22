
import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, ZapOff, BookOpen, X } from 'lucide-react';
import { FormData } from '../types';
import { bikeDatabase, eBikeDatabase, suspensionDatabase } from '../constants';

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  isDarkMode: boolean;
}

export const SuspensionForm: React.FC<Props> = ({ 
  formData, setFormData, onSubmit, isDarkMode 
}) => {
  const [showResearch, setShowResearch] = useState(false);
  
  // Fork Selection State
  const [forkModel, setForkModel] = useState('');
  const [forkSeries, setForkSeries] = useState('');
  const [forkDamper, setForkDamper] = useState('');
  
  // Shock Selection State
  const [shockModel, setShockModel] = useState('');
  const [shockSeries, setShockSeries] = useState('');
  const [shockDamper, setShockDamper] = useState('');

  // Determine active database based on bike type
  const activeBikeDB = formData.bikeType === 'ebike' ? eBikeDatabase : bikeDatabase;

  useEffect(() => {
    if (formData.frontSuspension && suspensionDatabase.forks[formData.frontSuspension]) {
      const f = suspensionDatabase.forks[formData.frontSuspension];
      setForkModel(f.model);
      setForkSeries(f.series);
      setForkDamper(f.damper);
    } else if (!formData.frontSuspension) {
      setForkModel('');
      setForkSeries('');
      setForkDamper('');
    }
  }, [formData.frontSuspension]);

  useEffect(() => {
    if (formData.rearShock && suspensionDatabase.shocks[formData.rearShock]) {
      const s = suspensionDatabase.shocks[formData.rearShock];
      setShockModel(s.model);
      setShockSeries(s.series);
      setShockDamper(s.damper);
    } else if (!formData.rearShock) {
      setShockModel('');
      setShockSeries('');
      setShockDamper('');
    }
  }, [formData.rearShock]);

  const getAllBikes = () => {
    const allBikes: { model: string; category: string }[] = [];
    Object.entries(activeBikeDB).forEach(([category, bikes]) => {
      Object.keys(bikes).forEach(model => {
        allBikes.push({ model, category });
      });
    });
    return allBikes.sort((a, b) => a.model.localeCompare(b.model));
  };

  const handleBikeTypeChange = (type: 'muscle' | 'ebike') => {
    setFormData({
      ...formData,
      bikeType: type,
      bikeModel: '', // Reset model when switching databases
      frontSuspension: '',
      rearShock: ''
    });
    // Internal state resets are handled by useEffects watching formData
  };

  const handleBikeSelect = (model: string) => {
    if (model === 'other') {
      setFormData({ 
        ...formData, 
        bikeModel: 'other',
        frontSuspension: '',
        rearShock: ''
      });
      return;
    }
    
    for (const [category, bikes] of Object.entries(activeBikeDB)) {
      if (bikes[model]) {
        setFormData({
          ...formData,
          bikeCategory: category,
          bikeModel: model,
          frontSuspension: bikes[model].fork,
          rearShock: bikes[model].shock
        });
        return;
      }
    }
  };

  const findKey = (db: any, m: string, s: string, d: string) => {
    return Object.keys(db).find(k => {
      const entry = db[k];
      return entry.model === m && entry.series === s && entry.damper === d;
    }) || '';
  };

  const handleForkModelChange = (val: string) => {
    setForkModel(val); setForkSeries(''); setForkDamper(''); setFormData({ ...formData, frontSuspension: '' });
  };
  const handleForkSeriesChange = (val: string) => {
    setForkSeries(val); setForkDamper(''); setFormData({ ...formData, frontSuspension: '' });
  };
  const handleForkDamperChange = (val: string) => {
    setForkDamper(val);
    const key = findKey(suspensionDatabase.forks, forkModel, forkSeries, val);
    if (key) setFormData({ ...formData, frontSuspension: key });
  };

  const handleShockModelChange = (val: string) => {
    setShockModel(val); setShockSeries(''); setShockDamper(''); setFormData({ ...formData, rearShock: '' });
  };
  const handleShockSeriesChange = (val: string) => {
    setShockSeries(val); setShockDamper(''); setFormData({ ...formData, rearShock: '' });
  };
  const handleShockDamperChange = (val: string) => {
    setShockDamper(val);
    const key = findKey(suspensionDatabase.shocks, shockModel, shockSeries, val);
    if (key) setFormData({ ...formData, rearShock: key });
  };

  const getForkModels = () => [...new Set(Object.values(suspensionDatabase.forks).map(f => f.model))].sort();
  const getForkSeries = () => forkModel ? [...new Set(Object.values(suspensionDatabase.forks).filter(f => f.model === forkModel).map(f => f.series))].sort() : [];
  const getForkDampers = () => (forkModel && forkSeries) ? [...new Set(Object.values(suspensionDatabase.forks).filter(f => f.model === forkModel && f.series === forkSeries).map(f => f.damper))].sort() : [];

  const getShockModels = () => [...new Set(Object.values(suspensionDatabase.shocks).map(s => s.model))].sort();
  const getShockSeries = () => shockModel ? [...new Set(Object.values(suspensionDatabase.shocks).filter(s => s.model === shockModel).map(s => s.series))].sort() : [];
  const getShockDampers = () => (shockModel && shockSeries) ? [...new Set(Object.values(suspensionDatabase.shocks).filter(s => s.model === shockModel && s.series === shockSeries).map(s => s.damper))].sort() : [];

  // iOS-style Input Classes
  const inputClass = `w-full px-4 py-3.5 rounded-2xl text-[17px] font-medium transition-all duration-200 ${
            isDarkMode 
              ? 'bg-zinc-800/80 text-white placeholder-zinc-500 focus:bg-zinc-800' 
              : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-100 shadow-sm focus:border-orange-500/30'
          } outline-none`;

  const miniSelectClass = `w-full px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
            isDarkMode 
               ? 'bg-zinc-900 text-white border border-zinc-700 focus:border-orange-500/50' 
               : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-orange-500/50'
          } outline-none appearance-none disabled:opacity-30 disabled:cursor-not-allowed`;
          
  const labelClass = `block text-[13px] font-medium mb-2 ml-1 tracking-tight ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`;
  const subLabelClass = `block text-[11px] font-medium mb-1.5 ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`;
  
  // Grouped container style
  const containerClass = `p-5 rounded-3xl ${isDarkMode ? 'bg-zinc-800/40 border border-zinc-800' : 'bg-white border border-gray-100 shadow-sm'}`;

  const isFormComplete = formData.weight && formData.frontSuspension && formData.rearShock;

  return (
    <div className="space-y-6 w-full pb-10 relative">

      {/* Market Research Modal */}
      {showResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in">
          <div className={`w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl p-6 relative ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'} shadow-2xl no-scrollbar`}>
            <button onClick={() => setShowResearch(false)} className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-orange-500" />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>E-MTB Market Research</h2>
            </div>
            
            <div className={`space-y-6 text-sm ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
              <section>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Why E-Bikes Need Different Tunes?</h3>
                <p>E-MTBs are typically 8-10kg heavier than muscle bikes (21-24kg vs 13-15kg). The added mass and motor torque significantly impact suspension dynamics.</p>
              </section>
              
              <section className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Tuning Principles</h3>
                <ul className="space-y-2 list-disc pl-4">
                  <li><strong>Pressure (PSI):</strong> Requires ~18% higher pressure to support the heavier chassis and prevent diving.</li>
                  <li><strong>Rebound:</strong> Needs to be faster (1-2 clicks) to keep the suspension active and ready for repetitive hits.</li>
                  <li><strong>Compression:</strong> Needs to be firmer (1-2 clicks) to control chassis pitch under braking and acceleration.</li>
                  <li><strong>Sag:</strong> Often runs slightly deeper (28-30% vs 25%) to absorb high-speed chatter.</li>
                </ul>
              </section>

              <section>
                 <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Included Models (2025-2026)</h3>
                 <p className="mb-2">Our database now includes specs for market leaders:</p>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>Santa Cruz Heckler</div>
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>Santa Cruz Bullit</div>
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>Trek Fuel EXe</div>
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>Trek Rail</div>
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>YT Decoy & MX</div>
                   <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>Radon Render</div>
                 </div>
              </section>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weight Input */}
        <div className="animate-slide-up stagger-1">
          <label className={labelClass}>Rider weight (kg)</label>
          <div className="relative">
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              placeholder="e.g. 75"
              className={inputClass}
              inputMode="decimal"
            />
          </div>
        </div>

        {/* Muscle / E-Bike Toggle (Segmented Control) */}
        <div className="animate-slide-up stagger-2">
           <div className="flex justify-between items-end mb-2">
              <label className={`${labelClass} mb-0`}>Bike type</label>
              <button 
                onClick={() => setShowResearch(true)}
                className={`text-[11px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
              >
                <BookOpen className="w-3 h-3" />
                Market Insights
              </button>
           </div>
           <div className={`p-1 rounded-xl flex ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-200'}`}>
              <button
                 onClick={() => handleBikeTypeChange('muscle')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                   formData.bikeType !== 'ebike' 
                     ? `${isDarkMode ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'}` 
                     : `${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-900'}`
                 }`}
              >
                 <ZapOff className="w-4 h-4" />
                 Muscle
              </button>
              <button
                 onClick={() => handleBikeTypeChange('ebike')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                   formData.bikeType === 'ebike' 
                     ? `${isDarkMode ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'}` 
                     : `${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-900'}`
                 }`}
              >
                 <Zap className="w-4 h-4 text-orange-500" fill={formData.bikeType === 'ebike' ? "currentColor" : "none"} />
                 E-Bike
              </button>
           </div>
        </div>
      </div>

      {/* Bike Model */}
      <div className="animate-slide-up stagger-2">
        <label className={labelClass}>Bike model ({formData.bikeType === 'ebike' ? 'Electric' : 'Muscle'})</label>
        <div className="relative">
          <select
            value={formData.bikeModel}
            onChange={(e) => handleBikeSelect(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select your bike...</option>
            {getAllBikes().map(({ model, category }) => (
              <option key={model} value={model}>
                {model} ({category})
              </option>
            ))}
            <option value="other">Other / Custom Build</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
             <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
        {formData.bikeModel && formData.bikeModel !== 'other' && activeBikeDB[formData.bikeCategory]?.[formData.bikeModel] && (
          <p className="text-xs text-green-500 mt-2 ml-1 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
            Specs loaded: {activeBikeDB[formData.bikeCategory][formData.bikeModel].travel}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Suspension Cascade */}
        <div className={`animate-slide-up stagger-3 ${containerClass} h-full`}>
          <div className="flex justify-between items-center mb-4 border-b border-dashed border-gray-500/20 pb-2">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Front fork</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>Step 1</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className={subLabelClass}>Model</label>
              <select value={forkModel} onChange={(e) => handleForkModelChange(e.target.value)} className={miniSelectClass}>
                <option value="">Select Model</option>
                {getForkModels().map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={subLabelClass}>Series</label>
                <select value={forkSeries} onChange={(e) => handleForkSeriesChange(e.target.value)} className={miniSelectClass} disabled={!forkModel}>
                  <option value="">Select Series</option>
                  {getForkSeries().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={subLabelClass}>Damper</label>
                <select value={forkDamper} onChange={(e) => handleForkDamperChange(e.target.value)} className={miniSelectClass} disabled={!forkSeries}>
                  <option value="">Select Damper</option>
                  {getForkDampers().map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rear Shock Cascade */}
        <div className={`animate-slide-up stagger-4 ${containerClass} h-full`}>
          <div className="flex justify-between items-center mb-4 border-b border-dashed border-gray-500/20 pb-2">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rear shock</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>Step 2</span>
          </div>
          <div className="space-y-3">
             <div>
              <label className={subLabelClass}>Model</label>
              <select value={shockModel} onChange={(e) => handleShockModelChange(e.target.value)} className={miniSelectClass}>
                <option value="">Select Model</option>
                {getShockModels().map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={subLabelClass}>Series</label>
                <select value={shockSeries} onChange={(e) => handleShockSeriesChange(e.target.value)} className={miniSelectClass} disabled={!shockModel}>
                  <option value="">Select Series</option>
                  {getShockSeries().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={subLabelClass}>Damper</label>
                <select value={shockDamper} onChange={(e) => handleShockDamperChange(e.target.value)} className={miniSelectClass} disabled={!shockSeries}>
                  <option value="">Select Damper</option>
                  {getShockDampers().map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Type */}
      <div className="animate-slide-up stagger-5">
        <label className={labelClass}>Ride style</label>
        <div className="flex flex-wrap gap-2">
          {['XC', 'Trail', 'Enduro', 'Bike Park', 'Downhill'].map((type) => (
            <button
              key={type}
              onClick={() => setFormData({...formData, rideType: type})}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                formData.rideType === type
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : isDarkMode
                    ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isFormComplete}
        className={`w-full py-4.5 rounded-2xl text-[17px] font-bold tracking-tight transition-all duration-300 shadow-xl ${
          isFormComplete
            ? 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95'
            : isDarkMode 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Calculate settings
      </button>
    </div>
  );
};

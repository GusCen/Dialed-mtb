import React, { useState } from 'react';
import { ChevronRight, Star, Trash2, Sliders } from 'lucide-react';
import { SavedSetup } from '../types';

interface Props {
  setups: SavedSetup[];
  onLoad: (setup: SavedSetup) => void;
  onDelete: (id: string) => void;
  onRate: (id: string, rating: number, feedback: SavedSetup['feedback']) => void;
  isDarkMode: boolean;
}

export const SavedSetupsList: React.FC<Props> = ({ setups, onLoad, onDelete, onRate, isDarkMode }) => {
  const [ratingId, setRatingId] = useState<string | null>(null);

  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-gray-500';
  const cardClass = `p-5 rounded-3xl mb-4 transition-all duration-200 ${isDarkMode ? 'bg-zinc-900 active:bg-zinc-800' : 'bg-white shadow-sm hover:shadow-md border border-gray-100 active:bg-gray-50'}`;

  if (setups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 opacity-40">
        <Sliders className="w-16 h-16 mb-4 stroke-1" />
        <p className="font-medium text-lg">No saved setups yet</p>
        <p className="text-sm mt-1">Calculate a setup to save it here</p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4">
      <h2 className={`text-2xl font-bold mb-6 px-1 ${textPrimary} tracking-tight`}>Saved setups</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setups.map(setup => (
          <div key={setup.id} className={`${cardClass} mb-0 h-full flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => onLoad(setup)}>
              <div>
                <h3 className={`font-bold text-[17px] ${textPrimary} mb-1`}>{setup.name}</h3>
                <div className="flex items-center gap-2">
                   <span className={`text-[13px] font-medium px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>{setup.formData.rideType}</span>
                   <span className={`text-[13px] ${textSecondary}`}>{setup.formData.bikeModel}</span>
                </div>
              </div>
              <button 
                 onClick={(e) => { e.stopPropagation(); onLoad(setup); }}
                 className={`p-2 rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-400'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Rating Section */}
            <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
              {setup.rating ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= setup.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    {setup.feedback && <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>{setup.feedback}</span>}
                  </div>
                  <button onClick={() => onDelete(setup.id)} className="text-zinc-500 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                ratingId === setup.id ? (
                  <div className="animate-in slide-in-from-top-2 fade-in">
                    <p className={`text-xs font-semibold mb-3 ${textPrimary}`}>How did it feel?</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Too Soft', 'Perfect', 'Too Hard', 'Too Fast', 'Too Slow'].map((fb) => (
                        <button
                          key={fb}
                          onClick={() => {
                            const rating = fb === 'Perfect' ? 5 : 3;
                            onRate(setup.id, rating, fb as any);
                            setRatingId(null);
                          }}
                          className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-700 text-zinc-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                          {fb}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                   <div className="flex justify-between items-center">
                      <button 
                        onClick={() => setRatingId(setup.id)}
                        className={`text-[13px] font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} hover:opacity-80 transition-opacity`}
                      >
                        Rate this setup
                      </button>
                      <button onClick={() => onDelete(setup.id)} className="text-zinc-500 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
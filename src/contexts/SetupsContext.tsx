'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData, SavedSetup, UserPreferences } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_FORM_DATA: FormData = {
  weight: '',
  bikeType: 'muscle',
  bikeCategory: 'trail',
  bikeModel: '',
  frontSuspension: '',
  rearShock: '',
  rideType: 'Trail',
  terrain: 'Mixed',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  pressureModifier: 1.0,
  reboundModifier: 0,
};

interface SetupsContextType {
  savedSetups: SavedSetup[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  userPreferences: UserPreferences;
  handleSaveSetup: (name: string) => Promise<void>;
  handleDeleteSetup: (id: string) => Promise<void>;
  handleRateSetup: (id: string, rating: number, feedback: SavedSetup['feedback']) => Promise<void>;
  handleLoadSetup: (setup: SavedSetup) => void;
}

const SetupsContext = createContext<SetupsContextType | undefined>(undefined);

export const SetupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>([]);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (isLoading) return;
    const loadPreferences = async () => {
      try {
        const res = await fetch(`/api/preferences?userId=${user?.id ?? 'guest'}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data: UserPreferences | null = await res.json();
        if (data) {
          const prefs: UserPreferences = {
            pressureModifier: data.pressureModifier ?? 1.0,
            reboundModifier:  data.reboundModifier  ?? 0,
          };
          setUserPreferences(prefs);
          localStorage.setItem('mtb-preferences', JSON.stringify(prefs));
          return;
        }
        const local = localStorage.getItem('mtb-preferences');
        if (local) setUserPreferences(JSON.parse(local));
      } catch {
        const local = localStorage.getItem('mtb-preferences');
        if (local) setUserPreferences(JSON.parse(local));
      }
    };
    loadPreferences();
  }, [user?.id, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const loadSetups = async () => {
      try {
        const res = await fetch(`/api/setups?userId=${user?.id ?? 'guest'}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data: SavedSetup[] = await res.json();
        setSavedSetups(data);
        localStorage.setItem('mtb-saved-setups', JSON.stringify(data));
      } catch {
        const local = localStorage.getItem('mtb-saved-setups');
        if (local) setSavedSetups(JSON.parse(local));
      }
    };
    loadSetups();
  }, [user?.id, isLoading]);

  const saveSetupsLocally = useCallback((setups: SavedSetup[]) => {
    setSavedSetups(setups);
    localStorage.setItem('mtb-saved-setups', JSON.stringify(setups));
  }, []);

  const savePreferences = useCallback((prefs: UserPreferences) => {
    setUserPreferences(prefs);
    localStorage.setItem('mtb-preferences', JSON.stringify(prefs));
  }, []);

  const handleSaveSetup = useCallback(async (name: string) => {
    const optimisticSetup: SavedSetup = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      formData: { ...formData },
    };
    const optimisticList = [optimisticSetup, ...savedSetups];
    saveSetupsLocally(optimisticList);
    try {
      const res = await fetch('/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...optimisticSetup, userId: user?.id ?? 'guest' }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const saved: SavedSetup = await res.json();
      const confirmedList = optimisticList.map((s) =>
        s.id === optimisticSetup.id ? saved : s,
      );
      saveSetupsLocally(confirmedList);
    } catch {
      console.error('Failed to save setup to API; stored locally as fallback');
    }
  }, [formData, savedSetups, saveSetupsLocally, user?.id]);

  const handleDeleteSetup = useCallback(async (id: string) => {
    const updated = savedSetups.filter((s) => s.id !== id);
    saveSetupsLocally(updated);
    try {
      const res = await fetch(`/api/setups?id=${id}&userId=${user?.id ?? 'guest'}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`${res.status}`);
    } catch {
      console.error('Failed to delete setup from API; removed locally as fallback');
    }
  }, [savedSetups, saveSetupsLocally, user?.id]);

  const handleRateSetup = useCallback(async (id: string, rating: number, feedback: SavedSetup['feedback']) => {
    const updated = savedSetups.map((s) =>
      s.id === id ? { ...s, rating, feedback } : s,
    );
    saveSetupsLocally(updated);
    try {
      const res = await fetch(`/api/setups?id=${id}&userId=${user?.id ?? 'guest'}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
    } catch {
      console.error('Failed to update rating on API; updated locally as fallback');
    }
    const newPrefs = { ...userPreferences };
    if (feedback === 'Too Soft')      newPrefs.pressureModifier += 0.03;
    else if (feedback === 'Too Hard') newPrefs.pressureModifier -= 0.03;
    else if (feedback === 'Too Fast') newPrefs.reboundModifier -= 1;
    else if (feedback === 'Too Slow') newPrefs.reboundModifier += 1;
    newPrefs.pressureModifier = Math.max(0.8, Math.min(1.3, newPrefs.pressureModifier));
    savePreferences(newPrefs);
    try {
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id ?? 'guest', ...newPrefs }),
      });
    } catch {
      console.error('Failed to persist preferences to API; kept locally as fallback');
    }
  }, [savedSetups, userPreferences, saveSetupsLocally, savePreferences, user?.id]);

  const handleLoadSetup = useCallback((setup: SavedSetup) => {
    setFormData(setup.formData);
    router.push('/');
  }, [router]);

  return (
    <SetupsContext.Provider
      value={{
        savedSetups,
        formData,
        setFormData,
        userPreferences,
        handleSaveSetup,
        handleDeleteSetup,
        handleRateSetup,
        handleLoadSetup,
      }}
    >
      {children}
    </SetupsContext.Provider>
  );
};

export const useSetups = () => {
  const ctx = useContext(SetupsContext);
  if (ctx === undefined) {
    throw new Error('useSetups must be used within a SetupsProvider');
  }
  return ctx;
};

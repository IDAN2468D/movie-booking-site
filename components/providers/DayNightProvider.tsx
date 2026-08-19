'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDayNight, TimeBand, BandInfo } from '@/hooks/useDayNight';

interface DayNightContextType {
  band: TimeBand;
  info: BandInfo;
  isManualOverride: boolean;
  setManualBand: (band: TimeBand | null) => void;
  bands: BandInfo[];
}

const DayNightContext = createContext<DayNightContextType | undefined>(undefined);

export function DayNightProvider({ children }: { children: React.ReactNode }) {
  const dayNightState = useDayNight();
  const { band } = dayNightState;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-band', band);
    }
  }, [band]);

  return (
    <DayNightContext.Provider value={dayNightState}>
      {children}
    </DayNightContext.Provider>
  );
}

export function useDayNightContext() {
  const context = useContext(DayNightContext);
  if (!context) {
    throw new Error('useDayNightContext must be used within a DayNightProvider');
  }
  return context;
}

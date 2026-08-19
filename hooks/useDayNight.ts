import { useState, useEffect, useCallback } from 'react';

export type TimeBand = 'dawn' | 'day' | 'sunset' | 'night';

export interface BandInfo {
  id: TimeBand;
  labelHe: string;
  subLabelHe: string;
  hoursLabel: string;
  iconName: 'SunMedium' | 'Sun' | 'Sunset' | 'Moon';
  accentColor: string;
  glowClass: string;
}

export const BAND_METADATA: Record<TimeBand, BandInfo> = {
  dawn: {
    id: 'dawn',
    labelHe: 'זריחת שחר',
    subLabelHe: 'תאורת שחר חמימה ואורגנית',
    hoursLabel: '05:00 - 07:59',
    iconName: 'SunMedium',
    accentColor: '#FF9A3C',
    glowClass: 'shadow-[0_0_20px_rgba(255,154,60,0.35)]',
  },
  day: {
    id: 'day',
    labelHe: 'תאורת יום',
    subLabelHe: 'קולנוע באור יום וניגודיות גבוהה',
    hoursLabel: '08:00 - 17:59',
    iconName: 'Sun',
    accentColor: '#38BDF8',
    glowClass: 'shadow-[0_0_20px_rgba(56,189,248,0.35)]',
  },
  sunset: {
    id: 'sunset',
    labelHe: 'שקיעת זהב',
    subLabelHe: 'גווני שקיעה מג\'נטה וסגול עמוק',
    hoursLabel: '18:00 - 20:59',
    iconName: 'Sunset',
    accentColor: '#EC4899',
    glowClass: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
  },
  night: {
    id: 'night',
    labelHe: 'תאורת לילה',
    subLabelHe: 'חוויית OLED ואולם חשוך אולטימטיבי',
    hoursLabel: '21:00 - 04:59',
    iconName: 'Moon',
    accentColor: '#818CF8',
    glowClass: 'shadow-[0_0_20px_rgba(129,140,248,0.35)]',
  },
};

export function getBandForHour(hour: number): TimeBand {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 21) return 'sunset';
  return 'night';
}

export function useDayNight() {
  const [activeBand, setActiveBand] = useState<TimeBand>(() => {
    if (typeof window === 'undefined') return 'night';
    return getBandForHour(new Date().getHours());
  });
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  const syncTimeBand = useCallback(() => {
    if (!isManualOverride) {
      const currentBand = getBandForHour(new Date().getHours());
      setActiveBand(currentBand);
    }
  }, [isManualOverride]);

  useEffect(() => {
    syncTimeBand();
    const intervalId = setInterval(syncTimeBand, 60_000);
    return () => clearInterval(intervalId);
  }, [syncTimeBand]);

  const setManualBand = useCallback((band: TimeBand | null) => {
    if (band === null) {
      setIsManualOverride(false);
      const autoBand = getBandForHour(new Date().getHours());
      setActiveBand(autoBand);
    } else {
      setIsManualOverride(true);
      setActiveBand(band);
    }
  }, []);

  return {
    band: activeBand,
    info: BAND_METADATA[activeBand],
    isManualOverride,
    setManualBand,
    bands: Object.values(BAND_METADATA),
  };
}

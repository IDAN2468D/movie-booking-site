import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDayNight, getBandForHour, BAND_METADATA } from '../useDayNight';

describe('useDayNight Hook & Time Bands', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getBandForHour logic', () => {
    it('returns dawn between 05:00 and 07:59', () => {
      expect(getBandForHour(5)).toBe('dawn');
      expect(getBandForHour(6)).toBe('dawn');
      expect(getBandForHour(7)).toBe('dawn');
    });

    it('returns day between 08:00 and 17:59', () => {
      expect(getBandForHour(8)).toBe('day');
      expect(getBandForHour(12)).toBe('day');
      expect(getBandForHour(17)).toBe('day');
    });

    it('returns sunset between 18:00 and 20:59', () => {
      expect(getBandForHour(18)).toBe('sunset');
      expect(getBandForHour(19)).toBe('sunset');
      expect(getBandForHour(20)).toBe('sunset');
    });

    it('returns night between 21:00 and 04:59', () => {
      expect(getBandForHour(21)).toBe('night');
      expect(getBandForHour(23)).toBe('night');
      expect(getBandForHour(0)).toBe('night');
      expect(getBandForHour(4)).toBe('night');
    });
  });

  describe('BAND_METADATA localized content', () => {
    it('provides valid Hebrew metadata for all 4 bands', () => {
      expect(BAND_METADATA.dawn.labelHe).toBe('זריחת שחר');
      expect(BAND_METADATA.day.labelHe).toBe('תאורת יום');
      expect(BAND_METADATA.sunset.labelHe).toBe('שקיעת זהב');
      expect(BAND_METADATA.night.labelHe).toBe('תאורת לילה');
    });
  });

  describe('useDayNight hook runtime', () => {
    it('initializes with current hour band', () => {
      vi.setSystemTime(new Date('2026-08-19T06:30:00'));
      const { result } = renderHook(() => useDayNight());
      expect(result.current.band).toBe('dawn');
      expect(result.current.isManualOverride).toBe(false);
    });

    it('allows manual band override and resetting to auto', () => {
      vi.setSystemTime(new Date('2026-08-19T14:00:00'));
      const { result } = renderHook(() => useDayNight());
      expect(result.current.band).toBe('day');

      act(() => {
        result.current.setManualBand('night');
      });
      expect(result.current.band).toBe('night');
      expect(result.current.isManualOverride).toBe(true);

      act(() => {
        result.current.setManualBand(null);
      });
      expect(result.current.band).toBe('day');
      expect(result.current.isManualOverride).toBe(false);
    });
  });
});

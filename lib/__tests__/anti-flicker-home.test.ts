import { describe, it, expect } from 'vitest';
import { getBandForHour, BAND_METADATA, DEFAULT_TIME_BAND, TimeBand } from '@/hooks/useDayNight';

describe('Anti-Flicker & Zero-Strobe Suite (Sprint 170)', () => {
  it('correctly maps 24 hours into the 4 distinct cinema time bands without gaps', () => {
    // Dawn (05:00 - 07:59)
    expect(getBandForHour(5)).toBe('dawn');
    expect(getBandForHour(7)).toBe('dawn');

    // Day (08:00 - 17:59)
    expect(getBandForHour(8)).toBe('day');
    expect(getBandForHour(12)).toBe('day');
    expect(getBandForHour(17)).toBe('day');

    // Sunset (18:00 - 20:59)
    expect(getBandForHour(18)).toBe('sunset');
    expect(getBandForHour(20)).toBe('sunset');

    // Night (21:00 - 04:59)
    expect(getBandForHour(21)).toBe('night');
    expect(getBandForHour(23)).toBe('night');
    expect(getBandForHour(0)).toBe('night');
    expect(getBandForHour(4)).toBe('night');
  });

  it('verifies all 4 time bands have defined metadata and valid CSS tokens', () => {
    const bands: TimeBand[] = ['dawn', 'day', 'sunset', 'night'];
    bands.forEach((b) => {
      const meta = BAND_METADATA[b];
      expect(meta).toBeDefined();
      expect(meta.labelHe).toBeTruthy();
      expect(meta.accentColor).toMatch(/^#/);
      expect(meta.glowClass).toContain('shadow-');
    });
  });

  it('ensures DEFAULT_TIME_BAND is stable and defaults to night', () => {
    expect(DEFAULT_TIME_BAND).toBe('night');
  });
});

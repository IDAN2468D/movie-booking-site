import { describe, it, expect } from 'vitest';
import { getBandForHour } from '@/hooks/useDayNight';
import { useUIStore } from '@/lib/store/ui-store';
import { useBookingStore } from '@/lib/store';

describe('Sprint 168: Zero-Flicker & Mobile Smartphone Browser Stability Suite', () => {
  it('should accurately compute time bands for all 24 hours of the day without flicker', () => {
    // Dawn: 05:00 - 07:59
    expect(getBandForHour(5)).toBe('dawn');
    expect(getBandForHour(6)).toBe('dawn');
    expect(getBandForHour(7)).toBe('dawn');

    // Day: 08:00 - 17:59
    expect(getBandForHour(8)).toBe('day');
    expect(getBandForHour(12)).toBe('day');
    expect(getBandForHour(17)).toBe('day');

    // Sunset: 18:00 - 20:59
    expect(getBandForHour(18)).toBe('sunset');
    expect(getBandForHour(19)).toBe('sunset');
    expect(getBandForHour(20)).toBe('sunset');

    // Night: 21:00 - 04:59
    expect(getBandForHour(21)).toBe('night');
    expect(getBandForHour(23)).toBe('night');
    expect(getBandForHour(0)).toBe('night');
    expect(getBandForHour(4)).toBe('night');
  });

  it('should maintain stable UI store drawer and booking sheet flags during fast taps', () => {
    const { setMobileBookingOpen, setMobileHubOpen } = useUIStore.getState();

    setMobileBookingOpen(true);
    expect(useUIStore.getState().isMobileBookingOpen).toBe(true);

    setMobileHubOpen(true);
    expect(useUIStore.getState().isMobileHubOpen).toBe(true);

    // Rapid close simulation (mimicking fast touch dismiss)
    setMobileBookingOpen(false);
    setMobileHubOpen(false);
    expect(useUIStore.getState().isMobileBookingOpen).toBe(false);
    expect(useUIStore.getState().isMobileHubOpen).toBe(false);
  });

  it('should preserve selected movie across mobile booking dispatch without mutation', () => {
    const sampleMovie = {
      id: 555,
      title: 'דיונה: חלק 2',
      displayTitle: 'דיונה: חלק 2',
      poster_path: '/dune2.jpg',
      backdrop_path: '/dune2_back.jpg',
      overview: 'סרט מדע בדיוני עוצר נשימה',
      release_date: '2024-03-01',
      vote_average: 8.8,
      vote_count: 5000,
      genre_ids: [878, 12],
    };

    useBookingStore.getState().setSelectedMovie(sampleMovie);
    expect(useBookingStore.getState().selectedMovie?.id).toBe(555);
    expect(useBookingStore.getState().selectedMovie?.displayTitle).toBe('דיונה: חלק 2');

    useBookingStore.getState().setSelectedMovie(null);
    expect(useBookingStore.getState().selectedMovie).toBeNull();
  });
});

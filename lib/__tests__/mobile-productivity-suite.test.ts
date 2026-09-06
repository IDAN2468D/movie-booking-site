import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/lib/store/ui-store';
import { useBookingStore } from '@/lib/store';
import { SHOWTIMES } from '@/lib/constants';

describe('Sprint 167: Mobile Productivity & Architecture Suite', () => {
  beforeEach(() => {
    useUIStore.setState({
      isMobileBookingOpen: false,
      isMobileHubOpen: false,
    });
    useBookingStore.setState({
      selectedMovie: null,
      selectedSeats: [],
      selectedShowtime: null,
    });
  });

  it('should toggle and manage mobile booking state in UI store', () => {
    expect(useUIStore.getState().isMobileBookingOpen).toBe(false);

    useUIStore.getState().setMobileBookingOpen(true);
    expect(useUIStore.getState().isMobileBookingOpen).toBe(true);

    useUIStore.getState().setMobileBookingOpen(false);
    expect(useUIStore.getState().isMobileBookingOpen).toBe(false);
  });

  it('should toggle and manage mobile hub drawer state in UI store', () => {
    expect(useUIStore.getState().isMobileHubOpen).toBe(false);

    useUIStore.getState().setMobileHubOpen(true);
    expect(useUIStore.getState().isMobileHubOpen).toBe(true);

    useUIStore.getState().setMobileHubOpen(false);
    expect(useUIStore.getState().isMobileHubOpen).toBe(false);
  });

  it('should correctly calculate total price for mobile booking showtimes and seats', () => {
    const showtime = SHOWTIMES[0];
    expect(showtime.price).toBe(45);

    useBookingStore.setState({
      selectedSeats: ['A1', 'A2', 'A3'],
      selectedShowtime: showtime.time,
    });

    const currentSeats = useBookingStore.getState().selectedSeats;
    expect(currentSeats.length).toBe(3);

    const calculatedTotal = currentSeats.length * showtime.price;
    expect(calculatedTotal).toBe(135);
  });

  it('should support movie selection and state persistence for mobile bottom dock', () => {
    const mockMovie = {
      id: 999,
      title: 'גלדיאטור 2',
      displayTitle: 'גלדיאטור 2',
      poster_path: '/gladiator.jpg',
      backdrop_path: '/gladiator_bg.jpg',
      vote_average: 8.8,
      overview: 'קרב אפי בקולוסאום',
      release_date: '2024-11-15',
      genre_ids: [28, 18],
    };

    useBookingStore.getState().setSelectedMovie(mockMovie);
    expect(useBookingStore.getState().selectedMovie?.displayTitle).toBe('גלדיאטור 2');

    useBookingStore.getState().setSelectedMovie(null);
    expect(useBookingStore.getState().selectedMovie).toBeNull();
  });
});

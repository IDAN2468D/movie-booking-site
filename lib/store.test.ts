import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from '@/lib/store';
import { Movie } from '@/lib/tmdb';

describe('Booking Store', () => {
  beforeEach(() => {
    useBookingStore.setState({
      selectedMovie: null,
      selectedShowtime: null,
      selectedSeats: [],
      selectedFood: [],
      favorites: [],
      location: 'Cineplex Tel Aviv'
    });
  });

  it('should toggle favorites', () => {
    const movie: Movie = { 
      id: 1, 
      title: 'Inception',
      poster_path: '/path.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.8,
      release_date: '2010-07-16',
      overview: 'Test overview',
      genre_ids: [1]
    };
    useBookingStore.getState().toggleFavorite(movie);
    expect(useBookingStore.getState().favorites).toContainEqual(movie);
    
    useBookingStore.getState().toggleFavorite(movie);
    expect(useBookingStore.getState().favorites).toHaveLength(0);
  });

  it('should update selected movie', () => {
    const movie: Movie = { 
      id: 1, 
      title: 'Inception',
      poster_path: '/path.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.8,
      release_date: '2010-07-16',
      overview: 'Test overview',
      genre_ids: [1]
    };
    useBookingStore.getState().setSelectedMovie(movie);
    expect(useBookingStore.getState().selectedMovie).toEqual(movie);
  });

  it('should toggle seats', () => {
    const seat = 'A1';
    useBookingStore.getState().toggleSeat(seat);
    expect(useBookingStore.getState().selectedSeats).toContain(seat);
    
    useBookingStore.getState().toggleSeat(seat);
    expect(useBookingStore.getState().selectedSeats).not.toContain(seat);
  });

  it('should update food quantity', () => {
    const foodId = 1;
    useBookingStore.getState().updateFoodQuantity(foodId, 2);
    const item = useBookingStore.getState().selectedFood.find(f => f.id === foodId);
    expect(item?.quantity).toBe(2);
    
    useBookingStore.getState().updateFoodQuantity(foodId, -2);
    const removedItem = useBookingStore.getState().selectedFood.find(f => f.id === foodId);
    expect(removedItem).toBeUndefined();
  });
});

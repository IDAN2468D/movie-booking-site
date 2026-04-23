import { create } from 'zustand';
import { Movie } from './tmdb';

interface BookingState {
  selectedMovie: Movie | null;
  selectedShowtime: string | null;
  selectedSeats: string[];
  selectedFood: { id: number; quantity: number }[];
  favorites: Movie[];
  location: string;
  draggingMovieName: string | null;
  
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedShowtime: (time: string) => void;
  setSeats: (seatIds: string[]) => void;
  toggleSeat: (seatId: string) => void;
  updateFoodQuantity: (foodId: number, delta: number) => void;
  toggleFavorite: (movie: Movie) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    genre: string;
    rating: number;
    year: string;
  };
  setFilters: (filters: Partial<{ genre: string; rating: number; year: string }>) => void;
  setLocation: (location: string) => void;
  setDraggingMovieName: (name: string | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedMovie: null,
  selectedShowtime: '19:30',
  selectedSeats: [],
  selectedFood: [],
  favorites: [],
  location: 'תל אביב',
  activeCategory: 'all',
  searchQuery: '',
  filters: {
    genre: 'הכל',
    rating: 0,
    year: 'הכל',
  },
  draggingMovieName: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),

  setDraggingMovieName: (name) => set({ draggingMovieName: name }),

  toggleFavorite: (movie) => set((state) => ({
    favorites: state.favorites.find(m => m.id === movie.id)
      ? state.favorites.filter((m) => m.id !== movie.id)
      : [...state.favorites, movie]
  })),

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie, activeCategory: 'all', selectedSeats: [] }), 
  setSelectedShowtime: (time) => set({ selectedShowtime: time }),
  setSeats: (seatIds) => set({ selectedSeats: seatIds }),
  
  toggleSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.includes(seatId)
      ? state.selectedSeats.filter((id) => id !== seatId)
      : [...state.selectedSeats, seatId]
  })),

  updateFoodQuantity: (foodId, delta) => set((state) => {
    const existing = state.selectedFood.find((f) => f.id === foodId);
    if (existing) {
      const newQuantity = Math.max(0, existing.quantity + delta);
      if (newQuantity === 0) {
        return { selectedFood: state.selectedFood.filter((f) => f.id !== foodId) };
      }
      return {
        selectedFood: state.selectedFood.map((f) => 
          f.id === foodId ? { ...f, quantity: newQuantity } : f
        )
      };
    }
    if (delta > 0) {
      return { selectedFood: [...state.selectedFood, { id: foodId, quantity: delta }] };
    }
    return state;
  }),

  setLocation: (loc: string) => set({ location: loc }),
  
  resetBooking: () => set({
    selectedMovie: null,
    selectedShowtime: '19:30',
    selectedSeats: [],
    selectedFood: [],
    searchQuery: '',
    filters: {
      genre: 'הכל',
      rating: 0,
      year: 'הכל',
    },
  }),
}));

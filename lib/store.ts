import { create } from 'zustand';
import { Movie } from './tmdb';
import { getPaletteForMovie } from './utils/color-sync';

interface BookingState {
  selectedMovie: Movie | null;
  selectedShowtime: string | null;
  selectedDate: string | null;
  selectedHall: string | null;
  selectedSeats: string[];
  selectedFood: { id: number; quantity: number }[];
  favorites: Movie[];
  location: string;
  draggingMovieName: string | null;
  selectedBranchId: string | null;
  allMovies: Movie[];
  
  setSelectedMovie: (movie: Movie | null) => void;
  setAllMovies: (movies: Movie[]) => void;
  setSelectedBranchId: (id: string | null) => void;
  setSelectedShowtime: (time: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedHall: (hall: string) => void;
  setSeats: (seatIds: string[]) => void;
  toggleSeat: (seatId: string) => void;
  updateFoodQuantity: (foodId: number, delta: number) => void;
  toggleFavorite: (movie: Movie) => Promise<void>;
  syncFavorites: (userId: string) => Promise<void>;
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
  auraColor: string;
  setAuraColor: (color: string) => void;
  lobbyUsers: { id: string; name: string; x: number; y: number; seat?: string }[];
  setLobbyUsers: (users: { id: string; name: string; x: number; y: number; seat?: string }[]) => void;
  activeMoods: string[];
  setActiveMoods: (moods: string[]) => void;
  hoveredSeat: string | null;
  setHoveredSeat: (seatId: string | null) => void;
  isTransactionCompleted: boolean;
  setTransactionCompleted: (completed: boolean) => void;
  activeSubtitles: { time: number; text: string }[];
  setActiveSubtitles: (subs: { time: number; text: string }[]) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedMovie: null,
  selectedShowtime: '19:30',
  isTransactionCompleted: false,
  activeSubtitles: [],
  selectedDate: new Date().toLocaleDateString('he-IL'),
  selectedHall: 'אולם 1',
  selectedSeats: [],
  selectedFood: [],
  favorites: [],
  location: 'תל אביב',
  selectedBranchId: null,
  allMovies: [],
  activeCategory: 'all',
  searchQuery: '',
  filters: {
    genre: 'הכל',
    rating: 0,
    year: 'הכל',
  },
  draggingMovieName: null,
  auraColor: '#FF1464',
  lobbyUsers: [],
  activeMoods: [],
  hoveredSeat: null,

  setAllMovies: (movies) => set({ allMovies: movies }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),

  setDraggingMovieName: (name) => set({ draggingMovieName: name }),
  setAuraColor: (color) => set({ auraColor: color }),
  setLobbyUsers: (users) => set({ lobbyUsers: users }),
  setActiveMoods: (moods) => set({ activeMoods: moods }),
  setHoveredSeat: (seatId) => set({ hoveredSeat: seatId }),
  setTransactionCompleted: (completed) => set({ isTransactionCompleted: completed }),
  setActiveSubtitles: (subs) => set({ activeSubtitles: subs }),

  toggleFavorite: async (movie) => {
    set((state) => ({
      favorites: state.favorites.some((m) => m.id === movie.id)
        ? state.favorites.filter((m) => m.id !== movie.id)
        : [...state.favorites, movie]
    }));

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      if (session?.user?.id) {
        const { toggleFavoriteInDb } = await import('./actions/favorites');
        await toggleFavoriteInDb(session.user.id, movie);
      }
    } catch (err) {
      console.error('Failed to sync favorite to DB:', err);
    }
  },

  syncFavorites: async (userId) => {
    try {
      const { getFavorites } = await import('./actions/favorites');
      const result = await getFavorites(userId);
      if (result.success && result.data) {
        set({ favorites: result.data });
      }
    } catch (err) {
      console.error('Failed to sync favorites from DB:', err);
    }
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedMovie: (movie) => {
    const palette = getPaletteForMovie(movie?.genre_ids || []);
    set({ 
      selectedMovie: movie, 
      activeCategory: 'all', 
      selectedSeats: [], 
      selectedBranchId: null,
      auraColor: palette.primary
    });
  },
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  setSelectedShowtime: (time) => set({ selectedShowtime: time }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedHall: (hall) => set({ selectedHall: hall }),
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
    selectedDate: new Date().toLocaleDateString('he-IL'),
    selectedHall: 'אולם 1',
    selectedSeats: [],
    selectedFood: [],
    selectedBranchId: null,
    searchQuery: '',
    filters: {
      genre: 'הכל',
      rating: 0,
      year: 'הכל',
    },
  }),
}));

import { create } from 'zustand';

export interface FloatingTrailerState {
  isOpen: boolean;
  isMinimized: boolean;
  movieId: string;
  movieTitle: string;
  trailerKey: string;
  ambientGlow: boolean;
  spatialAudio: boolean;
  openTrailer: (params: { movieId: string; movieTitle: string; trailerKey: string }) => void;
  closeTrailer: () => void;
  toggleMinimize: () => void;
  toggleAmbientGlow: () => void;
  toggleSpatialAudio: () => void;
  setTrailerKey: (key: string) => void;
}

export const useTrailerStore = create<FloatingTrailerState>((set) => ({
  isOpen: false,
  isMinimized: false,
  movieId: '',
  movieTitle: '',
  trailerKey: '',
  ambientGlow: true,
  spatialAudio: true,

  openTrailer: ({ movieId, movieTitle, trailerKey }) =>
    set({
      isOpen: true,
      isMinimized: false,
      movieId,
      movieTitle,
      trailerKey,
    }),

  closeTrailer: () =>
    set({
      isOpen: false,
      isMinimized: false,
      movieId: '',
      movieTitle: '',
      trailerKey: '',
    }),

  toggleMinimize: () =>
    set((state) => ({ isMinimized: !state.isMinimized })),

  toggleAmbientGlow: () =>
    set((state) => ({ ambientGlow: !state.ambientGlow })),

  toggleSpatialAudio: () =>
    set((state) => ({ spatialAudio: !state.spatialAudio })),

  setTrailerKey: (trailerKey: string) =>
    set({ trailerKey }),
}));

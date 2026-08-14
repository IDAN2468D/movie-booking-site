import { create } from 'zustand';

export interface TrailerVideoItem {
  id: string;
  key: string;
  name: string;
  type?: string;
}

export type AudioEnhanceMode = 'balanced' | 'spatial-3d' | 'sub-bass';

export interface FloatingTrailerState {
  isOpen: boolean;
  isMinimized: boolean;
  movieId: string;
  movieTitle: string;
  trailerKey: string;
  videoList: TrailerVideoItem[];
  activeVideoIndex: number;
  ambientGlow: boolean;
  spatialAudio: boolean;
  audioEnhanceMode: AudioEnhanceMode;
  openTrailer: (params: {
    movieId: string;
    movieTitle: string;
    trailerKey: string;
    videoList?: TrailerVideoItem[];
  }) => void;
  closeTrailer: () => void;
  toggleMinimize: () => void;
  toggleAmbientGlow: () => void;
  toggleSpatialAudio: () => void;
  setAudioEnhanceMode: (mode: AudioEnhanceMode) => void;
  setTrailerKey: (key: string) => void;
  selectVideoIndex: (index: number) => void;
}

export const useTrailerStore = create<FloatingTrailerState>((set) => ({
  isOpen: false,
  isMinimized: false,
  movieId: '',
  movieTitle: '',
  trailerKey: '',
  videoList: [],
  activeVideoIndex: 0,
  ambientGlow: true,
  spatialAudio: true,
  audioEnhanceMode: 'spatial-3d',

  openTrailer: ({ movieId, movieTitle, trailerKey, videoList }) => {
    const list = videoList && videoList.length > 0 ? videoList : [{ id: trailerKey, key: trailerKey, name: 'טריילר רשמי', type: 'Trailer' }];
    const initialIndex = Math.max(0, list.findIndex((v) => v.key === trailerKey));
    set({
      isOpen: true,
      isMinimized: false,
      movieId,
      movieTitle,
      trailerKey,
      videoList: list,
      activeVideoIndex: initialIndex >= 0 ? initialIndex : 0,
    });
  },

  closeTrailer: () =>
    set({
      isOpen: false,
      isMinimized: false,
      movieId: '',
      movieTitle: '',
      trailerKey: '',
      videoList: [],
      activeVideoIndex: 0,
    }),

  toggleMinimize: () =>
    set((state) => ({ isMinimized: !state.isMinimized })),

  toggleAmbientGlow: () =>
    set((state) => ({ ambientGlow: !state.ambientGlow })),

  toggleSpatialAudio: () =>
    set((state) => ({ spatialAudio: !state.spatialAudio })),

  setAudioEnhanceMode: (audioEnhanceMode: AudioEnhanceMode) =>
    set({ audioEnhanceMode }),

  setTrailerKey: (trailerKey: string) =>
    set({ trailerKey }),

  selectVideoIndex: (index: number) =>
    set((state) => {
      const item = state.videoList[index];
      if (!item) return state;
      return {
        activeVideoIndex: index,
        trailerKey: item.key,
      };
    }),
}));


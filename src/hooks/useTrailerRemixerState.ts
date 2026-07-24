import { create } from 'zustand';
import { EraType, RemixResponse } from '../lib/validations/trailer-remixer.schema';

interface TrailerRemixerState {
  activeEra: EraType;
  remixData: RemixResponse | null;
  isLoading: boolean;
  isPlayingAudio: boolean;
  setActiveEra: (era: EraType) => void;
  setRemixData: (data: RemixResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsPlayingAudio: (playing: boolean) => void;
}

export const useTrailerRemixerState = create<TrailerRemixerState>((set) => ({
  activeEra: '80s_synthwave',
  remixData: null,
  isLoading: false,
  isPlayingAudio: false,
  setActiveEra: (activeEra) => set({ activeEra }),
  setRemixData: (remixData) => set({ remixData }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsPlayingAudio: (isPlayingAudio) => set({ isPlayingAudio }),
}));

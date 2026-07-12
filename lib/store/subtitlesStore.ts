import { create } from 'zustand';

export interface SubtitlesState {
  currentSubtitle: string | null;
  amplitude: number;
  frequencies: number[];
  setCurrentSubtitle: (text: string | null) => void;
  setAudioTelemetry: (amplitude: number, frequencies: number[]) => void;
}

export const useSubtitlesStore = create<SubtitlesState>((set) => ({
  currentSubtitle: null,
  amplitude: 0,
  frequencies: [],
  setCurrentSubtitle: (currentSubtitle) => set({ currentSubtitle }),
  setAudioTelemetry: (amplitude, frequencies) => set({ amplitude, frequencies }),
}));

// Flat, atomic selectors for optimal renders
export const useCurrentSubtitle = () => useSubtitlesStore((state) => state.currentSubtitle);
export const useAudioAmplitude = () => useSubtitlesStore((state) => state.amplitude);
export const useAudioFrequencies = () => useSubtitlesStore((state) => state.frequencies);

export const useSetCurrentSubtitle = () => useSubtitlesStore((state) => state.setCurrentSubtitle);
export const useSetAudioTelemetry = () => useSubtitlesStore((state) => state.setAudioTelemetry);

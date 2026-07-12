import { create } from 'zustand';

export interface AudioState {
  isSpeaking: boolean;
  volume: number;
  isMuted: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isSpeaking: false,
  volume: 1.0,
  isMuted: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setVolume: (volume) => set({ volume }),
  setMuted: (isMuted) => set({ isMuted }),
}));

// Flat, atomic selectors for optimal renders
export const useIsSpeaking = () => useAudioStore((state) => state.isSpeaking);
export const useAudioVolume = () => useAudioStore((state) => state.volume);
export const useAudioMuted = () => useAudioStore((state) => state.isMuted);

export const useSetSpeaking = () => useAudioStore((state) => state.setSpeaking);
export const useSetVolume = () => useAudioStore((state) => state.setVolume);
export const useSetMuted = () => useAudioStore((state) => state.setMuted);

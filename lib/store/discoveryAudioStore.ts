import { create } from 'zustand';

export interface DiscoveryAudioState {
  isOverTarget: boolean;
  currentFocalScale: number;
  activeGenreId: string | null;
  setOverTarget: (over: boolean) => void;
  setCurrentFocalScale: (scale: number) => void;
  setActiveGenreId: (genreId: string | null) => void;
}

export const useDiscoveryAudioStore = create<DiscoveryAudioState>((set) => ({
  isOverTarget: false,
  currentFocalScale: 1.0,
  activeGenreId: null,
  setOverTarget: (isOverTarget) => set({ isOverTarget }),
  setCurrentFocalScale: (currentFocalScale) => set({ currentFocalScale }),
  setActiveGenreId: (activeGenreId) => set({ activeGenreId }),
}));

// Flat, atomic selectors for optimal renders
export const useDiscoveryIsOverTarget = () => useDiscoveryAudioStore((state) => state.isOverTarget);
export const useDiscoveryFocalScale = () => useDiscoveryAudioStore((state) => state.currentFocalScale);
export const useDiscoveryActiveGenreId = () => useDiscoveryAudioStore((state) => state.activeGenreId);

export const useSetDiscoveryOverTarget = () => useDiscoveryAudioStore((state) => state.setOverTarget);
export const useSetDiscoveryFocalScale = () => useDiscoveryAudioStore((state) => state.setCurrentFocalScale);
export const useSetDiscoveryActiveGenreId = () => useDiscoveryAudioStore((state) => state.setActiveGenreId);

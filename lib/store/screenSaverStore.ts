import { create } from 'zustand';

export interface ScreenSaverState {
  isScreenSaverActive: boolean;
  inactivityTimeout: number; // in milliseconds (default 30000 = 30s)
  isPlaying: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  activeIndex: number;
  isSettingsOpen: boolean;
  
  setIsScreenSaverActive: (active: boolean) => void;
  setInactivityTimeout: (ms: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  setIsSettingsOpen: (open: boolean) => void;
  toggleScreenSaver: () => void;
}

export const useScreenSaverStore = create<ScreenSaverState>((set) => ({
  isScreenSaverActive: false,
  inactivityTimeout: 30000,
  isPlaying: true,
  soundEnabled: true,
  soundVolume: 0.08,
  activeIndex: 0,
  isSettingsOpen: false,

  setIsScreenSaverActive: (active) => set({ isScreenSaverActive: active }),
  setInactivityTimeout: (inactivityTimeout) => set({ inactivityTimeout }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setSoundVolume: (soundVolume) => set({ soundVolume }),
  setActiveIndex: (updater) =>
    set((state) => ({
      activeIndex: typeof updater === 'function' ? updater(state.activeIndex) : updater,
    })),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  toggleScreenSaver: () => set((state) => ({ isScreenSaverActive: !state.isScreenSaverActive })),
}));

export const selectIsScreenSaverActive = (state: ScreenSaverState) => state.isScreenSaverActive;
export const selectSetIsScreenSaverActive = (state: ScreenSaverState) => state.setIsScreenSaverActive;

import { create } from 'zustand';

interface ScreenSaverState {
  isScreenSaverActive: boolean;
  setIsScreenSaverActive: (active: boolean) => void;
}

export const useScreenSaverStore = create<ScreenSaverState>((set) => ({
  isScreenSaverActive: false,
  setIsScreenSaverActive: (active: boolean) => set({ isScreenSaverActive: active }),
}));

export const selectIsScreenSaverActive = (state: ScreenSaverState) => state.isScreenSaverActive;
export const selectSetIsScreenSaverActive = (state: ScreenSaverState) => state.setIsScreenSaverActive;

import { create } from 'zustand';

interface HapticState {
  tension: number;
  offsetX: number;
  offsetY: number;
  isResonating: boolean;
  setTension: (tension: number) => void;
  setOffsets: (x: number, y: number) => void;
  setIsResonating: (val: boolean) => void;
}

export const useHapticStore = create<HapticState>((set) => ({
  tension: 0,
  offsetX: 0,
  offsetY: 0,
  isResonating: false,
  setTension: (tension) => set({ tension }),
  setOffsets: (x, y) => set({ offsetX: x, offsetY: y }),
  setIsResonating: (val) => set({ isResonating: val }),
}));

// Flat atomic selectors
export const useHapticTension = () => useHapticStore((s) => s.tension);
export const useHapticOffsetX = () => useHapticStore((s) => s.offsetX);
export const useHapticOffsetY = () => useHapticStore((s) => s.offsetY);
export const useHapticIsResonating = () => useHapticStore((s) => s.isResonating);
export const useHapticSetTension = () => useHapticStore((s) => s.setTension);
export const useHapticSetOffsets = () => useHapticStore((s) => s.setOffsets);
export const useHapticSetIsResonating = () => useHapticStore((s) => s.setIsResonating);

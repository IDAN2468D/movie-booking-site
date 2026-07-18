import { create } from "zustand";

interface VortexState {
  activeEmotion: string | null;
  setActiveEmotion: (emotion: string | null) => void;
  isSwallowed: boolean;
  setSwallowed: (status: boolean) => void;
}

export const useVortexStore = create<VortexState>((set) => ({
  activeEmotion: null,
  setActiveEmotion: (emotion) => set({ activeEmotion: emotion }),
  isSwallowed: false,
  setSwallowed: (status) => set({ isSwallowed: status }),
}));

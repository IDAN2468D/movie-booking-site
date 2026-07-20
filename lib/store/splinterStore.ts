import { create } from 'zustand';

interface Splinter {
  id: string;
  isDetached: boolean;
  claimToken?: string;
  x: number;
  y: number;
}

interface SplinterState {
  splinters: Record<string, Splinter>;
  initializeSplinters: (count: number) => void;
  detachSplinter: (id: string, token: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

export const useSplinterStore = create<SplinterState>((set) => ({
  splinters: {},
  initializeSplinters: (count) => {
    const initial: Record<string, Splinter> = {};
    for (let i = 0; i < count; i++) {
      const id = `splinter-${i}`;
      initial[id] = { id, isDetached: false, x: 0, y: 0 };
    }
    set({ splinters: initial });
  },
  detachSplinter: (id, token) => set((state) => ({
    splinters: {
      ...state.splinters,
      [id]: { ...state.splinters[id], isDetached: true, claimToken: token }
    }
  })),
  updatePosition: (id, x, y) => set((state) => ({
    splinters: {
      ...state.splinters,
      [id]: { ...state.splinters[id], x, y }
    }
  }))
}));

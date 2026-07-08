import { create } from 'zustand';

export interface ThemeState {
  colorCache: Record<string, { ambientColor: string; ambientShadow: string; luminance: number }>;
  activeColor: string;
  activeShadow: string;
  luminance: number;
  setColors: (url: string, ambientColor: string, ambientShadow: string, luminance: number) => void;
  getColors: (url: string) => { ambientColor: string; ambientShadow: string; luminance: number } | undefined;
  setActiveColor: (ambientColor: string, ambientShadow: string, luminance: number) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colorCache: {},
  activeColor: 'rgba(20, 20, 20, 1)',
  activeShadow: 'rgba(0, 0, 0, 0.8)',
  luminance: 0.1,
  setColors: (url, ambientColor, ambientShadow, luminance) => {
    set((state) => ({
      colorCache: {
        ...state.colorCache,
        [url]: { ambientColor, ambientShadow, luminance }
      }
    }));
  },
  getColors: (url) => get().colorCache[url],
  setActiveColor: (ambientColor, ambientShadow, luminance) => set({ activeColor: ambientColor, activeShadow: ambientShadow, luminance }),
}));

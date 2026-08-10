import { create } from "zustand";

interface SensoryState {
  hapticIntensity: number;
  subBassFrequency: number;
  ambientLightingColor: string;
  pulsePattern: "soft" | "rhythmic" | "intense" | "sub-bass-heavy";
  isResonating: boolean;
  setHapticIntensity: (intensity: number) => void;
  setSubBassFrequency: (freq: number) => void;
  setAmbientColor: (color: string) => void;
  setPulsePattern: (pattern: "soft" | "rhythmic" | "intense" | "sub-bass-heavy") => void;
  setResonating: (status: boolean) => void;
  resetSensorySettings: () => void;
}

export const useSensoryStore = create<SensoryState>((set) => ({
  hapticIntensity: 75,
  subBassFrequency: 45,
  ambientLightingColor: "#8B5CF6",
  pulsePattern: "rhythmic",
  isResonating: false,
  setHapticIntensity: (hapticIntensity) => set({ hapticIntensity }),
  setSubBassFrequency: (subBassFrequency) => set({ subBassFrequency }),
  setAmbientColor: (ambientLightingColor) => set({ ambientLightingColor }),
  setPulsePattern: (pulsePattern) => set({ pulsePattern }),
  setResonating: (isResonating) => set({ isResonating }),
  resetSensorySettings: () =>
    set({
      hapticIntensity: 75,
      subBassFrequency: 45,
      ambientLightingColor: "#8B5CF6",
      pulsePattern: "rhythmic",
      isResonating: false,
    }),
}));

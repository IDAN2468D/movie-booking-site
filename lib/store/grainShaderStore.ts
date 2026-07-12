import { create } from 'zustand';
import { GrainShaderConfig } from '../validations/grainShader';

export interface GrainShaderState {
  genre: string;
  grainDensity: number;
  particleSize: number;
  speedCoefficient: number;
  setGenre: (genre: string) => void;
  updateConfig: (config: Omit<GrainShaderConfig, 'genre'>) => void;
}

export const useGrainShaderStore = create<GrainShaderState>((set) => ({
  genre: 'Noir',
  grainDensity: 0.15,
  particleSize: 1.2,
  speedCoefficient: 1.0,
  setGenre: (genre) => set({ genre }),
  updateConfig: (config) => set({ ...config }),
}));

// Flat, atomic selectors for optimal renders
export const useGrainGenre = () => useGrainShaderStore((state) => state.genre);
export const useGrainDensity = () => useGrainShaderStore((state) => state.grainDensity);
export const useGrainParticleSize = () => useGrainShaderStore((state) => state.particleSize);
export const useGrainSpeedCoefficient = () => useGrainShaderStore((state) => state.speedCoefficient);

export const useSetGrainGenre = () => useGrainShaderStore((state) => state.setGenre);
export const useUpdateGrainConfig = () => useGrainShaderStore((state) => state.updateConfig);

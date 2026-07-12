import { create } from 'zustand';
import { SightlineMatrix } from '../validations/sightline';

export interface SightlineState {
  hoveredSeatId: string | null;
  calculationMatrix: SightlineMatrix | null;
  isVisible: boolean;
  setHoveredSeatId: (id: string | null) => void;
  setCalculationMatrix: (matrix: SightlineMatrix | null) => void;
  setVisible: (visible: boolean) => void;
}

export const useSightlineStore = create<SightlineState>((set) => ({
  hoveredSeatId: null,
  calculationMatrix: null,
  isVisible: false,
  setHoveredSeatId: (hoveredSeatId) => set({ hoveredSeatId }),
  setCalculationMatrix: (calculationMatrix) => set({ calculationMatrix }),
  setVisible: (isVisible) => set({ isVisible }),
}));

// Flat, atomic selectors for performance
export const useHoveredSeatId = () => useSightlineStore((state) => state.hoveredSeatId);
export const useSightlineMatrix = () => useSightlineStore((state) => state.calculationMatrix);
export const useSightlineVisible = () => useSightlineStore((state) => state.isVisible);

export const useSetHoveredSeatId = () => useSightlineStore((state) => state.setHoveredSeatId);
export const useSetSightlineMatrix = () => useSightlineStore((state) => state.setCalculationMatrix);
export const useSetSightlineVisible = () => useSightlineStore((state) => state.setVisible);

import { create } from 'zustand';

export type RoulettePhase = 'idle' | 'spinning' | 'decelerating' | 'locked';

export interface RouletteState {
  phase: RoulettePhase;
  isPlaying: boolean;
  currentIndex: number;
  targetSeat: string | null;
  availableSeats: string[];
  winningSeatCoords: { row: number; col: number } | null;
  rippleTriggerId: number;
  kineticTicketVisible: boolean;
  
  setPhase: (phase: RoulettePhase) => void;
  startRoulette: (seats: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setTargetSeat: (seatId: string | null) => void;
  stopRoulette: () => void;
  triggerRipple: (row: number, col: number) => void;
  showKineticTicket: (visible: boolean) => void;
}

export const useRouletteStore = create<RouletteState>((set) => ({
  phase: 'idle',
  isPlaying: false,
  currentIndex: -1,
  targetSeat: null,
  availableSeats: [],
  winningSeatCoords: null,
  rippleTriggerId: 0,
  kineticTicketVisible: false,

  setPhase: (phase) => set({ phase }),
  startRoulette: (seats) => set({
    phase: 'spinning',
    isPlaying: true,
    availableSeats: seats,
    currentIndex: -1,
    targetSeat: null,
    winningSeatCoords: null,
    kineticTicketVisible: false
  }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTargetSeat: (seatId) => set({ targetSeat: seatId }),
  stopRoulette: () => set({ isPlaying: false, phase: 'idle' }),
  triggerRipple: (row, col) => set((state) => ({
    winningSeatCoords: { row, col },
    rippleTriggerId: state.rippleTriggerId + 1
  })),
  showKineticTicket: (visible) => set({ kineticTicketVisible: visible })
}));

// Flat, atomic selectors for optimal renders
export const useRoulettePhase = () => useRouletteStore((state) => state.phase);
export const useRouletteIsPlaying = () => useRouletteStore((state) => state.isPlaying);
export const useRouletteCurrentIndex = () => useRouletteStore((state) => state.currentIndex);
export const useRouletteTargetSeat = () => useRouletteStore((state) => state.targetSeat);
export const useRouletteAvailableSeats = () => useRouletteStore((state) => state.availableSeats);
export const useRouletteWinningCoords = () => useRouletteStore((state) => state.winningSeatCoords);
export const useRouletteRippleTrigger = () => useRouletteStore((state) => state.rippleTriggerId);
export const useRouletteKineticVisible = () => useRouletteStore((state) => state.kineticTicketVisible);

export const useSetRoulettePhase = () => useRouletteStore((state) => state.setPhase);
export const useStartRoulette = () => useRouletteStore((state) => state.startRoulette);
export const useSetRouletteCurrentIndex = () => useRouletteStore((state) => state.setCurrentIndex);
export const useSetRouletteTargetSeat = () => useRouletteStore((state) => state.setTargetSeat);
export const useStopRoulette = () => useRouletteStore((state) => state.stopRoulette);
export const useTriggerRouletteRipple = () => useRouletteStore((state) => state.triggerRipple);
export const useShowKineticTicket = () => useRouletteStore((state) => state.showKineticTicket);

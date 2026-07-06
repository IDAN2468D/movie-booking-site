import { create } from 'zustand';

export interface RouletteState {
  isPlaying: boolean;
  currentIndex: number;
  targetSeat: string | null;
  availableSeats: string[];
  winningSeatCoords: { row: number; col: number } | null;
  rippleTriggerId: number;
  kineticTicketVisible: boolean;
  
  startRoulette: (seats: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setTargetSeat: (seatId: string | null) => void;
  stopRoulette: () => void;
  triggerRipple: (row: number, col: number) => void;
  showKineticTicket: (visible: boolean) => void;
}

export const useRouletteStore = create<RouletteState>((set) => ({
  isPlaying: false,
  currentIndex: -1,
  targetSeat: null,
  availableSeats: [],
  winningSeatCoords: null,
  rippleTriggerId: 0,
  kineticTicketVisible: false,

  startRoulette: (seats) => set({
    isPlaying: true,
    availableSeats: seats,
    currentIndex: -1,
    targetSeat: null,
    winningSeatCoords: null,
    kineticTicketVisible: false
  }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTargetSeat: (seatId) => set({ targetSeat: seatId }),
  stopRoulette: () => set({ isPlaying: false }),
  triggerRipple: (row, col) => set((state) => ({
    winningSeatCoords: { row, col },
    rippleTriggerId: state.rippleTriggerId + 1
  })),
  showKineticTicket: (visible) => set({ kineticTicketVisible: visible })
}));

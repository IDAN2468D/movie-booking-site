import { create } from 'zustand';

export type CoViewingStatus = 'idle' | 'inviting' | 'pending' | 'locked' | 'expired';

interface CoViewingState {
  status: CoViewingStatus;
  targetSeatId: string | null;
  sessionId: string | null;
  timeLeft: number; // in seconds (300 = 5 minutes)
  
  // Actions
  initiateInvite: (seatId: string) => void;
  setPending: (sessionId: string) => void;
  confirmInvite: () => void;
  cancelInvite: () => void;
  tickTimer: () => void;
}

export const useCoViewingStore = create<CoViewingState>((set, get) => ({
  status: 'idle',
  targetSeatId: null,
  sessionId: null,
  timeLeft: 0,

  initiateInvite: (seatId) => set({ status: 'inviting', targetSeatId: seatId, timeLeft: 300 }),
  
  setPending: (sessionId) => set({ status: 'pending', sessionId }),
  
  confirmInvite: () => set({ status: 'locked', timeLeft: 0 }),
  
  cancelInvite: () => set({ status: 'idle', targetSeatId: null, sessionId: null, timeLeft: 0 }),
  
  tickTimer: () => {
    const { status, timeLeft } = get();
    if ((status === 'pending' || status === 'inviting') && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if ((status === 'pending' || status === 'inviting') && timeLeft === 0) {
      set({ status: 'expired' });
      // Reset after a short delay
      setTimeout(() => {
        get().cancelInvite();
      }, 3000);
    }
  }
}));

// Atomic Selectors to prevent re-renders
export const useCoViewingStatus = () => useCoViewingStore((state) => state.status);
export const useCoViewingTargetSeat = () => useCoViewingStore((state) => state.targetSeatId);
export const useCoViewingTimeLeft = () => useCoViewingStore((state) => state.timeLeft);
export const useCoViewingActions = () => useCoViewingStore((state) => ({
  initiateInvite: state.initiateInvite,
  setPending: state.setPending,
  confirmInvite: state.confirmInvite,
  cancelInvite: state.cancelInvite,
  tickTimer: state.tickTimer
}));

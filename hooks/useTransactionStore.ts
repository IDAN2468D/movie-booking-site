import { create } from 'zustand';

export type TransactionState = 'IDLE' | 'SEAT_SELECT' | 'PAYMENT_PENDING' | 'SUCCESS' | 'FAILED';

interface TransactionStore {
  status: TransactionState;
  selectedSeats: string[];
  errorMsg: string | null;
  setStatus: (status: TransactionState) => void;
  setSelectedSeats: (seats: string[]) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  status: 'IDLE',
  selectedSeats: [],
  errorMsg: null,
  setStatus: (status) => set({ status }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setError: (errorMsg) => set({ errorMsg, status: 'FAILED' }),
  reset: () => set({ status: 'IDLE', selectedSeats: [], errorMsg: null }),
}));

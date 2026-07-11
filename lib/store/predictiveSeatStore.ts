import { create } from 'zustand';

export interface FlashOffer {
  seats: string[];
  price: number;
  originalPrice: number;
  expiresAt: number;
  signature: string;
}

interface PredictiveSeatState {
  predictedSeats: string[];
  activeOffer: FlashOffer | null;
  setPredictedSeats: (seats: string[]) => void;
  setActiveOffer: (offer: FlashOffer | null) => void;
}

export const usePredictiveSeatStore = create<PredictiveSeatState>((set) => ({
  predictedSeats: [],
  activeOffer: null,
  setPredictedSeats: (seats) => set({ predictedSeats: seats }),
  setActiveOffer: (offer) => set({ activeOffer: offer }),
}));

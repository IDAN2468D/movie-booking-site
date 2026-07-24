import { create } from 'zustand';
import { AcousticProfileResult } from '../lib/validations/biometric-seat.schema';

interface BiometricSeatState {
  bassPreference: number;
  clarityPreference: number;
  selectedSeatId: string | null;
  acousticProfile: AcousticProfileResult | null;
  isLoading: boolean;
  setBassPreference: (val: number) => void;
  setClarityPreference: (val: number) => void;
  setSelectedSeatId: (seatId: string | null) => void;
  setAcousticProfile: (profile: AcousticProfileResult | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useBiometricSeatState = create<BiometricSeatState>((set) => ({
  bassPreference: 65,
  clarityPreference: 80,
  selectedSeatId: 'F-8',
  acousticProfile: {
    sweetSpotScore: 95,
    dbBoost: 96.2,
    surroundResonance: 88,
    vibeTag: 'THX Acoustic Gold',
  },
  isLoading: false,
  setBassPreference: (bassPreference) => set({ bassPreference }),
  setClarityPreference: (clarityPreference) => set({ clarityPreference }),
  setSelectedSeatId: (selectedSeatId) => set({ selectedSeatId }),
  setAcousticProfile: (acousticProfile) => set({ acousticProfile }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

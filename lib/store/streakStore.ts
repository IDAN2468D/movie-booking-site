import { create } from "zustand";
import { StreakData } from "@/lib/validations/streakValidation";

interface StreakState {
  streakData: StreakData | null;
  isLoading: boolean;
  error: string | null;
  checkInResult: { streak: number; points: number } | null;

  setStreakData: (data: StreakData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCheckInResult: (result: { streak: number; points: number } | null) => void;
  reset: () => void;
}

export const useStreakStore = create<StreakState>((set) => ({
  streakData: null,
  isLoading: false,
  error: null,
  checkInResult: null,

  setStreakData: (data) => set({ streakData: data, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setCheckInResult: (result) => set({ checkInResult: result }),
  reset: () =>
    set({
      streakData: null,
      isLoading: false,
      error: null,
      checkInResult: null,
    }),
}));

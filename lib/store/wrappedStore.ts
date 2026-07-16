import { create } from "zustand";
import { WrappedData } from "@/lib/validations/wrappedValidation";

interface WrappedState {
  wrappedData: WrappedData | null;
  isLoading: boolean;
  error: string | null;
  currentSlide: number;

  setWrappedData: (data: WrappedData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSlide: (slide: number) => void;
  nextSlide: () => void;
  reset: () => void;
}

export const useWrappedStore = create<WrappedState>((set, get) => ({
  wrappedData: null,
  isLoading: false,
  error: null,
  currentSlide: 0,

  setWrappedData: (data) => set({ wrappedData: data, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setSlide: (slide) => set({ currentSlide: slide }),
  nextSlide: () => set({ currentSlide: get().currentSlide + 1 }),
  reset: () =>
    set({
      wrappedData: null,
      isLoading: false,
      error: null,
      currentSlide: 0,
    }),
}));

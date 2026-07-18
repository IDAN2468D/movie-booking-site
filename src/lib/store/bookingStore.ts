import { create } from 'zustand';

interface Drink {
  id: string;
  size: 'S' | 'M' | 'L';
  type: string;
}

interface BookingState {
  selectedDrinks: Drink[];
  addDrink: (drink: Drink) => void;
  removeDrink: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedDrinks: [],
  addDrink: (drink) => set((state) => ({ selectedDrinks: [...state.selectedDrinks, drink] })),
  removeDrink: (id) => set((state) => ({
    selectedDrinks: state.selectedDrinks.filter((d) => d.id !== id)
  })),
}));

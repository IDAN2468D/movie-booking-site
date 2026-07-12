import { create } from 'zustand';

export interface CartItem {
  itemId: string;
  quantity: number;
}

export interface CateringState {
  cart: CartItem[];
  predictionsCache: string[];
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setPredictionsCache: (predictions: string[]) => void;
}

export const useCateringStore = create<CateringState>((set) => ({
  cart: [],
  predictionsCache: [],
  addToCart: (itemId) => set((state) => {
    const existing = state.cart.find((item) => item.itemId === itemId);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { itemId, quantity: 1 }] };
  }),
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.itemId !== itemId),
  })),
  clearCart: () => set({ cart: [] }),
  setPredictionsCache: (predictionsCache) => set({ predictionsCache }),
}));

// Flat, atomic selectors for performance
export const useCateringCart = () => useCateringStore((state) => state.cart);
export const useCateringPredictions = () => useCateringStore((state) => state.predictionsCache);

export const useAddToCart = () => useCateringStore((state) => state.addToCart);
export const useRemoveFromCart = () => useCateringStore((state) => state.removeFromCart);
export const useClearCart = () => useCateringStore((state) => state.clearCart);
export const useSetPredictionsCache = () => useCateringStore((state) => state.setPredictionsCache);

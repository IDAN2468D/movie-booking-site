import { create } from 'zustand';

export interface CateringCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  phase: 'Trailers' | 'Act 1' | 'Climax';
  allergens: string[];
}

interface CateringState {
  cart: CateringCartItem[];
  biometricAllergyTokens: string[];
  deliveryPhases: Record<string, 'Trailers' | 'Act 1' | 'Climax'>;
  groupSeats: string[];
  
  addToCart: (item: Omit<CateringCartItem, 'quantity' | 'phase'> & { phase?: 'Trailers' | 'Act 1' | 'Climax' }) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemPhase: (itemId: string, phase: 'Trailers' | 'Act 1' | 'Climax') => void;
  setAllergyTokens: (tokens: string[]) => void;
  setGroupSeats: (seats: string[]) => void;
  resetCatering: () => void;
}

const useCateringStoreBase = create<CateringState>((set) => ({
  cart: [],
  biometricAllergyTokens: [],
  deliveryPhases: {},
  groupSeats: [],

  addToCart: (item) => set((state) => {
    const existing = state.cart.find((c) => c.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((c) => 
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      };
    }
    return {
      cart: [...state.cart, { ...item, quantity: 1, phase: item.phase || 'Trailers' }]
    };
  }),

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((c) => c.id !== itemId)
  })),

  updateCartItemPhase: (itemId, phase) => set((state) => ({
    cart: state.cart.map((c) => c.id === itemId ? { ...c, phase } : c),
    deliveryPhases: { ...state.deliveryPhases, [itemId]: phase }
  })),

  setAllergyTokens: (tokens) => set({ biometricAllergyTokens: tokens }),
  setGroupSeats: (seats) => set({ groupSeats: seats }),
  
  resetCatering: () => set({
    cart: [],
    biometricAllergyTokens: [],
    deliveryPhases: {},
    groupSeats: []
  })
}));

// Strict, shallow-baked selectors to eliminate cascading parent-to-child renders
export const useCateringCart = () => useCateringStoreBase((state) => state.cart);
export const useCateringAllergies = () => useCateringStoreBase((state) => state.biometricAllergyTokens);
export const useCateringPhases = () => useCateringStoreBase((state) => state.deliveryPhases);
export const useCateringGroupSeats = () => useCateringStoreBase((state) => state.groupSeats);

export const useCateringActions = () => {
  const addToCart = useCateringStoreBase((state) => state.addToCart);
  const removeFromCart = useCateringStoreBase((state) => state.removeFromCart);
  const updateCartItemPhase = useCateringStoreBase((state) => state.updateCartItemPhase);
  const setAllergyTokens = useCateringStoreBase((state) => state.setAllergyTokens);
  const setGroupSeats = useCateringStoreBase((state) => state.setGroupSeats);
  const resetCatering = useCateringStoreBase((state) => state.resetCatering);

  return {
    addToCart,
    removeFromCart,
    updateCartItemPhase,
    setAllergyTokens,
    setGroupSeats,
    resetCatering
  };
};

import { create } from 'zustand';
import {
  DietaryTag,
  DeliveryMode,
  SpiceOption,
  DrinkOption,
  CustomizedCartItem,
  ProductiveConcessionItem,
  ExpressBundle,
} from '@/lib/types/concession-productive';
import { PRODUCTIVE_CONCESSION_ITEMS } from '@/lib/data/productiveConcessionCatalog';

const playSubBassPulse = (freq = 42) => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  } catch {
    // Audio fallback
  }
};

interface ProductiveConcessionState {
  cart: CustomizedCartItem[];
  activeDietaryTag: DietaryTag;
  searchQuery: string;
  deliveryMode: DeliveryMode;
  customizerItem: ProductiveConcessionItem | null;
  isCustomizerOpen: boolean;
  isTrayOpen: boolean;
  setDietaryTag: (tag: DietaryTag) => void;
  setSearchQuery: (query: string) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  addItem: (item: ProductiveConcessionItem, spice?: SpiceOption, drink?: DrinkOption) => void;
  addBundle: (bundle: ExpressBundle) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  openCustomizer: (item: ProductiveConcessionItem) => void;
  closeCustomizer: () => void;
  setTrayOpen: (open: boolean) => void;
}

export const useProductiveConcessionStore = create<ProductiveConcessionState>((set, get) => ({
  cart: [],
  activeDietaryTag: 'ALL',
  searchQuery: '',
  deliveryMode: 'COUNTER_EXPRESS',
  customizerItem: null,
  isCustomizerOpen: false,
  isTrayOpen: false,

  setDietaryTag: (tag) => set({ activeDietaryTag: tag }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDeliveryMode: (mode) => set({ deliveryMode: mode }),

  addItem: (item, spice, drink) => {
    playSubBassPulse(45);
    const cartId = `${item.id}-${spice || 'none'}-${drink || 'none'}`;
    const current = get().cart;
    const existing = current.find((i) => i.cartId === cartId);

    if (existing) {
      set({
        cart: current.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        cart: [
          ...current,
          {
            cartId,
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            selectedSpice: spice,
            selectedDrink: drink,
            calories: item.calories,
          },
        ],
      });
    }
  },

  addBundle: (bundle) => {
    playSubBassPulse(55);
    bundle.itemIds.forEach((itemId) => {
      const catalogItem = PRODUCTIVE_CONCESSION_ITEMS.find((c) => c.id === itemId);
      if (catalogItem) {
        get().addItem(catalogItem);
      }
    });
  },

  updateQuantity: (cartId, delta) => {
    playSubBassPulse(38);
    const current = get().cart;
    const updated = current
      .map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    set({ cart: updated });
  },

  removeItem: (cartId) => {
    playSubBassPulse(30);
    set({ cart: get().cart.filter((item) => item.cartId !== cartId) });
  },

  clearCart: () => set({ cart: [] }),
  openCustomizer: (item) => set({ customizerItem: item, isCustomizerOpen: true }),
  closeCustomizer: () => set({ customizerItem: null, isCustomizerOpen: false }),
  setTrayOpen: (open) => set({ isTrayOpen: open }),
}));

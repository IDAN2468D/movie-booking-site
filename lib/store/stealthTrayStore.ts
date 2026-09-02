import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IStealthOrderItem {
  id: string;
  name: string;
  category: 'popcorn' | 'drink' | 'snack';
  price: number;
  quantity: number;
  icon: string;
}

interface StealthTrayState {
  isStealthActive: boolean;
  nightVisionTint: 'amber' | 'red' | 'monochrome';
  screenDimLevel: number; // 1 to 10
  stealthItems: IStealthOrderItem[];
  isSubmitting: boolean;
  orderCompleted: boolean;
  
  // Actions
  toggleStealthMode: (active?: boolean) => void;
  setNightVisionTint: (tint: 'amber' | 'red' | 'monochrome') => void;
  setScreenDimLevel: (level: number) => void;
  addStealthItem: (item: Omit<IStealthOrderItem, 'quantity'>) => void;
  removeStealthItem: (itemId: string) => void;
  updateStealthQuantity: (itemId: string, delta: number) => void;
  clearStealthOrder: () => void;
  submitStealthOrder: () => Promise<boolean>;
}

export const useStealthTrayStore = create<StealthTrayState>()(
  persist(
    (set, get) => ({
      isStealthActive: false,
      nightVisionTint: 'amber',
      screenDimLevel: 8,
      stealthItems: [],
      isSubmitting: false,
      orderCompleted: false,

      toggleStealthMode: (active) => {
        const current = get().isStealthActive;
        const nextState = active !== undefined ? active : !current;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(nextState ? [40, 60, 40] : [20]);
        }
        set({ isStealthActive: nextState, orderCompleted: false });
      },

      setNightVisionTint: (tint) => set({ nightVisionTint: tint }),
      setScreenDimLevel: (level) => set({ screenDimLevel: Math.max(1, Math.min(10, level)) }),

      addStealthItem: (item) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(25);
        }
        const current = get().stealthItems;
        const existing = current.find((i) => i.id === item.id);
        if (existing) {
          set({
            stealthItems: current.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          });
        } else {
          set({ stealthItems: [...current, { ...item, quantity: 1 }] });
        }
      },

      removeStealthItem: (itemId) => {
        set({ stealthItems: get().stealthItems.filter((i) => i.id !== itemId) });
      },

      updateStealthQuantity: (itemId, delta) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(15);
        }
        const current = get().stealthItems;
        set({
          stealthItems: current
            .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0)
        });
      },

      clearStealthOrder: () => set({ stealthItems: [], orderCompleted: false }),

      submitStealthOrder: async () => {
        const { stealthItems } = get();
        if (stealthItems.length === 0) return false;

        set({ isSubmitting: true });
        // Simulate silent in-seat express delivery request
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([30, 40, 80, 40, 30]); // Silent haptic delivery heartbeat
        }

        set({ 
          isSubmitting: false, 
          orderCompleted: true,
          stealthItems: [] 
        });
        return true;
      }
    }),
    {
      name: 'cinepulse-stealth-tray-store',
      partialize: (state) => ({ 
        nightVisionTint: state.nightVisionTint, 
        screenDimLevel: state.screenDimLevel 
      }),
    }
  )
);

import { create } from 'zustand';

interface ExchangeState {
  totalAmountUsd: number;
  
  // Percentages (0 to 1) that sum up to exactly 1.0
  fiatAllocation: number;
  cryptoAllocation: number;
  loyaltyAllocation: number;
  
  // Selected currencies
  fiatCurrency: 'USD' | 'ILS';
  cryptoCurrency: 'BTC' | 'ETH';

  // Actions
  setTotalAmount: (amount: number) => void;
  setFiatCurrency: (currency: 'USD' | 'ILS') => void;
  setCryptoCurrency: (currency: 'BTC' | 'ETH') => void;
  
  // Handlers for sliders to keep balance at 1.0
  updateFiatAllocation: (val: number) => void;
  updateCryptoAllocation: (val: number) => void;
  updateLoyaltyAllocation: (val: number) => void;
}

// Helper to safely clamp values between 0 and 1
const clamp = (val: number) => Math.max(0, Math.min(1, val));

export const useExchangeStore = create<ExchangeState>((set) => ({
  totalAmountUsd: 0,
  fiatAllocation: 1.0,
  cryptoAllocation: 0.0,
  loyaltyAllocation: 0.0,
  
  fiatCurrency: 'USD',
  cryptoCurrency: 'BTC',

  setTotalAmount: (amount) => set({ totalAmountUsd: Math.max(0, amount) }),
  setFiatCurrency: (currency) => set({ fiatCurrency: currency }),
  setCryptoCurrency: (currency) => set({ cryptoCurrency: currency }),

  updateFiatAllocation: (val) => set((state) => {
    const newVal = clamp(val);
    const diff = newVal - state.fiatAllocation;
    
    // Distribute diff to others to maintain sum = 1.0
    // Try taking from crypto first, then loyalty
    let newCrypto = state.cryptoAllocation;
    let newLoyalty = state.loyaltyAllocation;
    
    if (diff > 0) {
      // fiat increased, others must decrease
      if (newCrypto >= diff) {
        newCrypto -= diff;
      } else {
        const remainingDiff = diff - newCrypto;
        newCrypto = 0;
        newLoyalty = Math.max(0, newLoyalty - remainingDiff);
      }
    } else if (diff < 0) {
      // fiat decreased, crypto takes the remainder by default
      newCrypto += Math.abs(diff);
    }
    
    return { fiatAllocation: newVal, cryptoAllocation: newCrypto, loyaltyAllocation: newLoyalty };
  }),

  updateCryptoAllocation: (val) => set((state) => {
    const newVal = clamp(val);
    const diff = newVal - state.cryptoAllocation;
    
    let newFiat = state.fiatAllocation;
    let newLoyalty = state.loyaltyAllocation;
    
    if (diff > 0) {
      if (newFiat >= diff) {
        newFiat -= diff;
      } else {
        const remainingDiff = diff - newFiat;
        newFiat = 0;
        newLoyalty = Math.max(0, newLoyalty - remainingDiff);
      }
    } else if (diff < 0) {
      newFiat += Math.abs(diff);
    }
    
    return { fiatAllocation: newFiat, cryptoAllocation: newVal, loyaltyAllocation: newLoyalty };
  }),

  updateLoyaltyAllocation: (val) => set((state) => {
    const newVal = clamp(val);
    const diff = newVal - state.loyaltyAllocation;
    
    let newFiat = state.fiatAllocation;
    let newCrypto = state.cryptoAllocation;
    
    if (diff > 0) {
      if (newFiat >= diff) {
        newFiat -= diff;
      } else {
        const remainingDiff = diff - newFiat;
        newFiat = 0;
        newCrypto = Math.max(0, newCrypto - remainingDiff);
      }
    } else if (diff < 0) {
      newFiat += Math.abs(diff);
    }
    
    return { fiatAllocation: newFiat, cryptoAllocation: newCrypto, loyaltyAllocation: newVal };
  }),
}));

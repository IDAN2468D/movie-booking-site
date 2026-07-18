import { create } from 'zustand';

interface WalletState {
  balances: {
    BTC: number;
    ETH: number;
    SOL: number;
  };
  addCashback: (currency: 'BTC' | 'ETH' | 'SOL', amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balances: {
    BTC: 0,
    ETH: 0,
    SOL: 0,
  },
  addCashback: (currency, amount) =>
    set((state) => ({
      balances: {
        ...state.balances,
        [currency]: state.balances[currency] + amount,
      },
    })),
}));

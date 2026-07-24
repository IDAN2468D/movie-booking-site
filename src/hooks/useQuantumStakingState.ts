import { create } from 'zustand';
import { StakingVaultData } from '../lib/validations/quantum-staking.schema';

interface QuantumStakingState {
  vaultData: StakingVaultData;
  isStakingLoading: boolean;
  isTouchHolding: boolean;
  setVaultData: (data: Partial<StakingVaultData>) => void;
  setIsStakingLoading: (loading: boolean) => void;
  setIsTouchHolding: (holding: boolean) => void;
}

export const useQuantumStakingState = create<QuantumStakingState>((set) => ({
  vaultData: {
    stakedBalance: 1250,
    yieldApyPercent: 12.4,
    claimablePulsePoints: 145,
    nftPassSignature: 'QUANTUM-NFT-VIP-889X',
    isBiometricsUnlocked: false,
  },
  isStakingLoading: false,
  isTouchHolding: false,
  setVaultData: (data) =>
    set((state) => ({ vaultData: { ...state.vaultData, ...data } })),
  setIsStakingLoading: (isStakingLoading) => set({ isStakingLoading }),
  setIsTouchHolding: (isTouchHolding) => set({ isTouchHolding }),
}));

import { create } from 'zustand';
import { PredictionMarketResult } from '../lib/validations/boxoffice-prediction.schema';

interface BoxOfficePredictionState {
  stakeAmount: number;
  predictionTarget: 'OVER_100M' | 'OVER_250M' | 'BLOCKBUSTER_500M';
  result: PredictionMarketResult | null;
  userBalance: number;
  isLoading: boolean;
  setStakeAmount: (amount: number) => void;
  setPredictionTarget: (target: 'OVER_100M' | 'OVER_250M' | 'BLOCKBUSTER_500M') => void;
  setResult: (res: PredictionMarketResult | null) => void;
  setUserBalance: (balance: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useBoxOfficePredictionState = create<BoxOfficePredictionState>((set) => ({
  stakeAmount: 250,
  predictionTarget: 'OVER_250M',
  result: {
    stakeAmount: 250,
    predictedPayout: 600,
    multiplier: 2.4,
    marketConsensusPercent: 58,
    status: 'Active Position',
  },
  userBalance: 4500,
  isLoading: false,
  setStakeAmount: (stakeAmount) => set({ stakeAmount }),
  setPredictionTarget: (predictionTarget) => set({ predictionTarget }),
  setResult: (result) => set({ result }),
  setUserBalance: (userBalance) => set({ userBalance }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

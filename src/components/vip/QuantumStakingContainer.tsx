'use client';

import React from 'react';
import { useQuantumStakingState } from '@/hooks/useQuantumStakingState';
import { processStakingAction } from '@/lib/actions/quantum-staking.actions';
import { QuantumStakingVaultView } from './QuantumStakingVaultView';

export const QuantumStakingContainer: React.FC = () => {
  const {
    vaultData,
    isStakingLoading,
    isTouchHolding,
    setVaultData,
    setIsStakingLoading,
    setIsTouchHolding,
  } = useQuantumStakingState();

  const handleStake = async (amount: number) => {
    setIsStakingLoading(true);
    const res = await processStakingAction({ amount, stakingDurationDays: 30 });
    if (res.success && res.data) {
      setVaultData(res.data);
    }
    setIsStakingLoading(false);
  };

  return (
    <QuantumStakingVaultView
      vaultData={vaultData}
      isStakingLoading={isStakingLoading}
      isTouchHolding={isTouchHolding}
      onStakeAmount={handleStake}
      onTouchHoldStart={() => {
        setIsTouchHolding(true);
        setTimeout(() => setVaultData({ isBiometricsUnlocked: true }), 1200);
      }}
      onTouchHoldEnd={() => setIsTouchHolding(false)}
    />
  );
};

'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { StakingVaultData } from '@/lib/validations/quantum-staking.schema';

interface QuantumStakingVaultViewProps {
  vaultData: StakingVaultData;
  isStakingLoading: boolean;
  isTouchHolding: boolean;
  onStakeAmount: (amount: number) => void;
  onTouchHoldStart: () => void;
  onTouchHoldEnd: () => void;
}

export const QuantumStakingVaultView: React.FC<QuantumStakingVaultViewProps> = ({
  vaultData,
  isStakingLoading,
  isTouchHolding,
  onStakeAmount,
  onTouchHoldStart,
  onTouchHoldEnd,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBiometricsSubBass = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="relative w-full p-6 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00FFA3] animate-pulse" />
          Quantum Staking & Holographic NFT Pass
        </h3>
        <span className="text-xs text-neutral-400 font-['Inter']">
          APY {vaultData.yieldApyPercent}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-xs text-neutral-400 font-['Inter']">Staked Balance</div>
          <div className="text-2xl font-extrabold text-[#00FFA3] font-['Outfit'] mt-1">
            {vaultData.stakedBalance} PTS
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-xs text-neutral-400 font-['Inter']">Claimable Yield</div>
          <div className="text-2xl font-extrabold text-[#8A5CFF] font-['Outfit'] mt-1">
            +{vaultData.claimablePulsePoints} PTS
          </div>
        </div>
      </div>

      <div className="mb-6">
        <motion.div
          onPointerDown={() => {
            onTouchHoldStart();
            playBiometricsSubBass();
          }}
          onPointerUp={onTouchHoldEnd}
          onPointerLeave={onTouchHoldEnd}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border text-center cursor-pointer transition-all duration-300 ${
            vaultData.isBiometricsUnlocked
              ? 'bg-[#00FFA3]/15 border-[#00FFA3] shadow-[0_0_25px_rgba(0,255,163,0.3)]'
              : isTouchHolding
              ? 'bg-[#8A5CFF]/30 border-[#8A5CFF] scale-102'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="text-sm font-bold text-white font-['Outfit']">
            {vaultData.isBiometricsUnlocked
              ? '🔒 BIOMETRICS VERIFIED // NFT PASS ACTIVE'
              : isTouchHolding
              ? 'HOLD TO AUTHENTICATE PASS...'
              : 'TOUCH & HOLD FOR BIOMETRIC HOLOGRAPHIC PASS'}
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            HASH: {vaultData.nftPassSignature}
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onStakeAmount(250)}
          disabled={isStakingLoading}
          className="flex-1 py-3 rounded-xl bg-[#00FFA3] text-neutral-950 font-bold font-['Outfit'] hover:bg-[#00FFA3]/90 transition-all duration-200"
        >
          Stake +250 PTS
        </button>
        <button
          onClick={() => onStakeAmount(500)}
          disabled={isStakingLoading}
          className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold font-['Outfit'] border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          Stake +500 PTS
        </button>
      </div>
    </div>
  );
};

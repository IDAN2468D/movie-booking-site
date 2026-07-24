'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBoxOfficePredictionState } from '../../hooks/useBoxOfficePredictionState';
import { submitBoxOfficePredictionAction } from '../../lib/actions/boxoffice-prediction.actions';

export const BoxOfficePredictionView: React.FC = () => {
  const {
    stakeAmount,
    predictionTarget,
    result,
    userBalance,
    isLoading,
    setStakeAmount,
    setPredictionTarget,
    setResult,
    setUserBalance,
    setIsLoading,
  } = useBoxOfficePredictionState();

  const triggerSubBassDrop = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  const handleStake = async () => {
    if (stakeAmount > userBalance) return;
    triggerSubBassDrop();
    setIsLoading(true);
    const res = await submitBoxOfficePredictionAction({
      movieId: 'm-101',
      stakeAmount,
      predictionTarget,
    });
    if (res.success && res.data) {
      setResult(res.data);
      setUserBalance(userBalance - stakeAmount);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-emerald-400">
            Box Office Prediction Market
          </h3>
          <p className="text-xs text-neutral-400">Quantum Cine-Token Staking Vault</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-neutral-400">Vault Balance</div>
          <div className="text-sm font-bold font-mono text-emerald-300">{userBalance} P-Tokens</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['OVER_100M', 'OVER_250M', 'BLOCKBUSTER_500M'] as const).map((target) => (
          <motion.button
            key={target}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPredictionTarget(target)}
            className={`p-3 rounded-xl border text-center transition-all ${
              predictionTarget === target
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] uppercase font-mono text-neutral-500">Target</div>
            <div className="text-xs font-bold font-heading">{target.replace('_', ' ')}</div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-2 bg-neutral-900/40 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between text-xs mb-1">
          <span>Stake Tokens</span>
          <span className="font-mono text-emerald-400">{stakeAmount} P-Tokens</span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(Number(e.target.value))}
          className="w-full accent-emerald-400 bg-neutral-800 rounded-lg h-2"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStake}
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-semibold text-sm transition-all shadow-lg"
      >
        {isLoading ? 'Processing Staking...' : `Stake ${stakeAmount} P-Tokens (40Hz Sub-Bass)`}
      </motion.button>

      {result && (
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/10 text-center">
          <div>
            <div className="text-[10px] text-neutral-400">Est. Payout</div>
            <div className="text-lg font-bold font-heading text-emerald-400">
              {result.predictedPayout} P-Tokens
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400">Market Consensus</div>
            <div className="text-lg font-bold font-heading text-cyan-400">
              {result.marketConsensusPercent}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

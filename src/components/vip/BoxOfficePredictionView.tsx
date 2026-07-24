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

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'OVER_100M':
        return 'מעל 100M $';
      case 'OVER_250M':
        return 'מעל 250M $';
      case 'BLOCKBUSTER_500M':
        return 'להיט 500M+$';
      default:
        return target;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-5" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="font-heading text-xl font-bold text-emerald-400 font-['Outfit']">
            שוק תחזיות קופות הקולנוע
          </h3>
          <p className="text-xs text-neutral-400 font-['Inter']">כספת אסימוני קולנוע קוונטיים (P-Tokens)</p>
        </div>
        <div className="text-left font-mono">
          <div className="text-[10px] text-neutral-400">יתרה בכספת</div>
          <div className="text-sm font-bold text-emerald-300">{userBalance} P-Tokens</div>
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
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] uppercase font-mono text-neutral-400 mb-1">יעד תחזית</div>
            <div className="text-xs font-bold font-['Outfit']">{getTargetLabel(target)}</div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-2 bg-neutral-900/40 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between text-xs mb-1 font-['Inter']">
          <span>אסימונים בסיכון (Stake Amount)</span>
          <span className="font-mono text-emerald-400 font-bold">{stakeAmount} P-Tokens</span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(Number(e.target.value))}
          className="w-full accent-emerald-400 bg-neutral-800 rounded-lg h-2 cursor-pointer"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStake}
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-['Outfit'] font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      >
        {isLoading ? 'מעבד הימור קוונטי...' : `בצע הימור קוונטי +${stakeAmount} P-Tokens (תדר סאב-בס 40Hz)`}
      </motion.button>

      {result && (
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/10 text-center font-['Inter']">
          <div>
            <div className="text-[10px] text-neutral-400 mb-1">צפי תשלום משוער</div>
            <div className="text-lg font-bold text-emerald-400 font-['Outfit']">
              {result.predictedPayout} P-Tokens
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 mb-1">קונסנזוס שוק</div>
            <div className="text-lg font-bold text-cyan-400 font-['Outfit']">
              {result.marketConsensusPercent}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

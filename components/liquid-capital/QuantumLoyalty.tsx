'use client';

import React, { useOptimistic, startTransition } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Sparkles, ChevronUp } from 'lucide-react';
import { boostQuantumTier } from '@/lib/actions/loyalty';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const QuantumLoyalty = ({ initialLoyalty }: { initialLoyalty: any[] }) => {
  const defaultLoyalty = { tier: 'observer', points: 0, multiplier: 1, userId: 'demo' };
  const currentUserLoyalty = initialLoyalty && initialLoyalty.length > 0 ? initialLoyalty[0] : defaultLoyalty;

  const [loyalty, addOptimisticBoost] = useOptimistic(
    currentUserLoyalty,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => ({
      ...state,
      points: state.points + 1000,
      multiplier: state.multiplier + 0.1
    })
  );

  const handleBoost = async () => {
    startTransition(() => {
      addOptimisticBoost(null);
    });
    await boostQuantumTier(loyalty.userId);
  };

  const tiers = {
    observer: { color: '#9ca3af', label: 'Observer' },
    quantum: { color: '#3b82f6', label: 'Quantum' },
    singularity: { color: '#8b5cf6', label: 'Singularity' },
    whale: { color: '#f59e0b', label: 'Whale' }
  };

  const currentTier = tiers[loyalty.tier as keyof typeof tiers];

  return (
    <div className="w-full space-y-8 relative mt-4">
      <div className="flex items-center gap-5 mb-6 relative group">
        <motion.div 
          className="relative flex items-center justify-center p-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Activity className="w-10 h-10 text-[#f43f5e] relative z-10 drop-shadow-[0_0_16px_rgba(244,63,94,0.9)]" />
          <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 z-20 animate-pulse drop-shadow-md" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] blur-2xl rounded-full"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="relative">
          <motion.h2 
            className="text-4xl md:text-5xl font-black tracking-tighter font-outfit drop-shadow-lg flex flex-col leading-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#f43f5e] via-[#ffe4e6] to-[#f43f5e] bg-[length:200%_auto] pb-1">
              Quantum Tiers
            </span>
            <span className="text-white/50 font-medium text-sm md:text-base tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.9)]"></span>
              Live Status Ticker
            </span>
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 md:col-span-2 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <TrendingUp className="w-48 h-48" style={{ color: currentTier.color }} />
          </div>

          <div className="z-10 flex flex-col items-start gap-2">
            <span className="text-white/50 text-lg uppercase tracking-widest font-medium">Current Status</span>
            <div className="flex items-end gap-4">
              <motion.span 
                key={loyalty.points}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black font-outfit tracking-tighter"
                style={{ color: currentTier.color, textShadow: `0 0 40px ${currentTier.color}80` }}
              >
                {currentTier.label}
              </motion.span>
            </div>
            
            <div className="flex items-center gap-6 mt-8 w-full">
              <div className="flex flex-col">
                <span className="text-white/40 text-sm">Total Points</span>
                <motion.span 
                  key={`pts-${loyalty.points}`}
                  initial={{ scale: 1.2, color: '#fff' }}
                  animate={{ scale: 1, color: '#f43f5e' }}
                  className="text-3xl font-bold font-mono"
                >
                  {loyalty.points.toLocaleString()}
                </motion.span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-white/40 text-sm">Earn Multiplier</span>
                <motion.span 
                  key={`mult-${loyalty.multiplier}`}
                  initial={{ scale: 1.2, color: '#fff' }}
                  animate={{ scale: 1, color: '#10b981' }}
                  className="text-3xl font-bold font-mono"
                >
                  x{loyalty.multiplier.toFixed(1)}
                </motion.span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f43f5e]/10 pointer-events-none" />
          
          <div className="z-10 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Boost Engine</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Inject points dynamically to simulate live betting wins or high-engagement activity.
            </p>
          </div>

          <button 
            onClick={handleBoost}
            className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_50px_rgba(244,63,94,0.6)] flex justify-center items-center gap-2 z-10"
          >
            <ChevronUp className="w-6 h-6" /> Inject 1,000 Pts
          </button>
        </div>
      </div>
    </div>
  );
};

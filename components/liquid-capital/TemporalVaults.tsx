'use client';

import React, { useOptimistic, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Film, Sparkles, Clock } from 'lucide-react';
import { unlockTemporalVault } from '@/lib/actions/vaults';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TemporalVaults = ({ initialVaults }: { initialVaults: any[] }) => {
  const [vaults, addOptimisticUnlock] = useOptimistic(
    initialVaults,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any[], updatedId: string) => 
      state.map(v => v._id === updatedId ? { ...v, status: 'decrypting', drmToken: 'GENERATING...' } : v)
  );

  const handleUnlock = async (vaultId: string) => {
    startTransition(() => {
      addOptimisticUnlock(vaultId);
    });
    await unlockTemporalVault(vaultId);
  };

  return (
    <div className="w-full space-y-6 relative mt-4">
      <div className="flex items-center gap-5 mb-10 relative group">
        <motion.div 
          className="relative flex items-center justify-center p-2"
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Lock className="w-10 h-10 text-[#a855f7] relative z-10 drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]" />
          <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 z-20 animate-pulse drop-shadow-md" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#a855f7] to-[#d8b4fe] blur-2xl rounded-full"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="relative">
          <motion.h2 
            className="text-4xl md:text-5xl font-black tracking-tighter font-outfit drop-shadow-lg flex flex-col leading-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#a855f7] via-[#f3e8ff] to-[#a855f7] bg-[length:200%_auto] pb-1">
              Temporal Vaults
            </span>
            <span className="text-white/50 font-medium text-sm md:text-base tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.9)]"></span>
              8K Holographic Time-Shift
            </span>
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence>
          {vaults.map((vault) => (
            <motion.div
              key={vault._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-2xl border border-[#a855f7]/30 hover:border-[#a855f7]/70 transition-all flex flex-col gap-4 relative overflow-hidden"
              style={{
                boxShadow: vault.status === 'decrypting' ? '0 0 30px rgba(168,85,247,0.2) inset' : 'none'
              }}
            >
              {vault.status === 'decrypting' && (
                <div className="absolute inset-0 bg-[url('/matrix-rain.png')] opacity-10 animate-pulse pointer-events-none mix-blend-overlay" />
              )}
              
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-outfit text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#a855f7]" /> {vault.movieId}
                  </span>
                  <span className="text-white/50 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> זמין ל: {new Date(vault.scheduledFor).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${vault.status === 'locked' ? 'bg-black/50 border-white/10' : 'bg-[#a855f7]/20 border-[#a855f7]/50'}`}>
                  {vault.status === 'locked' ? <Lock className="w-5 h-5 text-white/50" /> : <Unlock className="w-5 h-5 text-[#a855f7]" />}
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-xs text-[#a855f7] flex justify-between items-center z-10">
                <span>DRM_TOKEN:</span>
                <span>{vault.drmToken || 'ENCRYPTED_*****'}</span>
              </div>

              <div className="flex justify-between items-center mt-2 z-10 border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-white/50">עלות שחרור</span>
                  <span className="font-bold text-xl text-white">{vault.pointsCost.toLocaleString()} Pts</span>
                </div>
                {vault.status === 'locked' ? (
                  <button
                    onClick={() => handleUnlock(vault._id)}
                    className="bg-[#a855f7] text-white hover:bg-[#9333ea] px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  >
                    פצח כספת 8K
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#a855f7] font-bold text-sm bg-[#a855f7]/10 px-4 py-2 rounded-xl border border-[#a855f7]/30">
                    <Unlock className="w-4 h-4 animate-pulse" />
                    {vault.status === 'decrypting' ? 'מפענח...' : 'מוכן להקרנה'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

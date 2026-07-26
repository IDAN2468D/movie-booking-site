'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, ShieldCheck, Zap } from 'lucide-react';

export default function BiometricPassbookCard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometricHoldStart = () => {
    setIsAuthenticating(true);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setIsAuthenticating(false);
      setIsUnlocked(true);
    }, 600);
  };

  return (
    <div className="w-full my-6 p-6 rounded-3xl bg-neutral-950/60 backdrop-blur-[40px] saturate-[250%] border border-amber-500/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-right font-inter">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {isUnlocked ? <ShieldCheck size={22} /> : <Fingerprint size={22} />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-outfit">כרטיס VIP הולוגרפי ביומטרי</h3>
            <p className="text-xs text-neutral-400">
              {isUnlocked ? 'אימות ביומטרי הנגיש את כל הטבות ה-VIP שלך ⚡' : 'לחץ והחזק לאימות ביומטרי 40Hz'}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={handleBiometricHoldStart}
          onTouchStart={handleBiometricHoldStart}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold font-outfit flex items-center gap-2 transition-all ${
            isUnlocked
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : isAuthenticating
              ? 'bg-amber-500/30 border border-amber-500 text-amber-300 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
          }`}
        >
          <Zap size={16} />
          <span>{isUnlocked ? 'מאומת (Unlocked)' : isAuthenticating ? 'מאמת טביעת אצבע...' : 'החזק לאימות'}</span>
        </motion.button>
      </div>

      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">נקודות פולס</span>
            <span className="text-lg font-black text-amber-400 font-outfit">4,850 PTS</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">סטאטוס VIP</span>
            <span className="text-lg font-black text-amber-400 font-outfit">VANGUARD</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">הנחת קולנוע</span>
            <span className="text-lg font-black text-emerald-400 font-outfit">25% OFF</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">מזנון VIP</span>
            <span className="text-lg font-black text-cyan-400 font-outfit">חופשי</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

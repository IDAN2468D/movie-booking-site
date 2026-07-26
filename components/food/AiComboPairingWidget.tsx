'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useBookingStore } from '@/lib/store';

export default function AiComboPairingWidget() {
  const [isGenerated, setIsGenerated] = useState(false);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  const handleRecommendCombo = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(35, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio fallback
    }

    setIsGenerated(true);
    // Add default VIP Combo (numeric IDs 1 and 2)
    updateFoodQuantity(1, 1);
    updateFoodQuantity(2, 1);
  };

  return (
    <div className="p-4 rounded-3xl bg-neutral-950/60 backdrop-blur-[40px] saturate-[250%] border border-cyan-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4 my-2 text-right">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white font-outfit">חבילת קומבו אישית מבוססת AI 🍿</h3>
          <p className="text-xs text-neutral-400 font-inter">
            התאמת פופקורן ענק + שתייה קרה לפי ז'אנר הסרט ומדד האורה האישי
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleRecommendCombo}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
      >
        <ShoppingBag size={16} />
        <span>{isGenerated ? 'קומבו הוסף למגש ⚡' : 'הוסף קומבו AI מוצע'}</span>
      </motion.button>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  movieTitle: string;
}

export default function SpatialAudioCommentaryToggle({ movieTitle }: Props) {
  const [isCommentaryActive, setIsCommentaryActive] = useState(false);

  const toggleSpatialCommentary = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create Spatial Panner and Frequency Filter boost
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createPanner();

      panner.panningModel = 'HRTF';
      panner.positionX.setValueAtTime(0.5, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Graceful fallback
    }

    setIsCommentaryActive(prev => !prev);
  };

  return (
    <div className="my-6 p-4 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-wrap items-center justify-between gap-4 text-right">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <h4 className="text-sm font-black text-white font-display">פרשנות בימוי מרחבית 3D</h4>
        </div>
        <p className="text-xs text-slate-400 font-sans">
          הפעל סאונד מרחבי 3D ופרשנות אקוסטית עבור {movieTitle}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={toggleSpatialCommentary}
        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 font-display ${
          isCommentaryActive
            ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]'
            : 'bg-white/10 text-white border border-white/15 hover:bg-white/20'
        }`}
      >
        {isCommentaryActive ? 'פרשנות מרחבית פעילה (Spatial 3D)' : 'הפעל פרשנות מרחבית'}
      </motion.button>
    </div>
  );
}

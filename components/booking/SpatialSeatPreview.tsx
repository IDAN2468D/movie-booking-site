"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getSeatPerspectiveAction } from '@/app/actions/spatialSeatActions';

interface SpatialSeatPreviewProps {
  seatId: string;
  x: number;
  y: number;
  z: number;
}

export const SpatialSeatPreview: React.FC<SpatialSeatPreviewProps> = ({ seatId, x, y, z }) => {
  const [data, setData] = useState<{
    fov: number;
    panValue: number;
    viewingAngle: number;
    sweetSpotRating: string;
  } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let active = true;
    getSeatPerspectiveAction({ seatId, x, y, z }).then((res) => {
      if (active && res.success && res.data) {
        setData(res.data);
      }
    });
    return () => {
      active = false;
    };
  }, [seatId, x, y, z]);

  const playSpatialTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(40, ctx.currentTime); // 40Hz sub-bass drop
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      if (panner && data) {
        panner.pan.setValueAtTime(data.panValue, ctx.currentTime);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }

      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Graceful fallback for non-supported web audio environments
    }
  };

  return (
    <div className="relative w-full max-w-lg p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="font-['Outfit'] text-xl font-semibold tracking-wide text-cyan-400">
          תצוגת IMAX תלת-ממדית — מושב {seatId}
        </h3>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          {data?.sweetSpotRating || 'מחשב...'}
        </span>
      </div>

      {/* Screen Curvature Simulation Box */}
      <div className="relative h-44 w-full rounded-xl bg-black/60 overflow-hidden flex items-center justify-center border border-white/5 my-4">
        {/* Curved Cinema Screen Visual */}
        <div 
          className="absolute top-3 w-4/5 h-6 rounded-b-[100%] bg-gradient-to-r from-cyan-500 via-white to-cyan-500 shadow-[0_0_20px_rgba(0,209,255,0.6)]"
          style={{ transform: `scaleX(${1 + (data?.viewingAngle || 0) / 100})` }}
        />
        {/* Seat POV Cone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-full border-2 border-cyan-400/80 bg-cyan-500/20 flex flex-col items-center justify-center text-xs font-mono text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.4)]"
          style={{ transform: `translateX(${(data?.panValue || 0) * 60}px)` }}
        >
          <span>FOV</span>
          <span className="font-bold">{data?.fov || 60}°</span>
        </motion.div>
      </div>

      {/* Acoustic Details */}
      <div className="grid grid-cols-2 gap-3 text-sm font-['Inter'] mb-4 text-neutral-300">
        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="block text-xs text-neutral-400">זווית צפייה</span>
          <span className="font-mono text-white text-base">{data?.viewingAngle ?? 0}°</span>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="block text-xs text-neutral-400">איזון אקוסטי (Pan)</span>
          <span className="font-mono text-white text-base">{data?.panValue ?? 0}</span>
        </div>
      </div>

      <button
        onClick={playSpatialTone}
        className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40 transition-all duration-200 transform-gpu active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>🔊 הדמיית תדר אקוסטי (40Hz Sub-Bass)</span>
      </button>
    </div>
  );
};

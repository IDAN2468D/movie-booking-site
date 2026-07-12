"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useHoveredSeatId, useSightlineVisible } from '@/lib/store/sightlineStore';
import { useSightlineCalculations } from '@/hooks/useSightlineCalculations';

export default function SightlinePreview() {
  const hoveredSeatId = useHoveredSeatId();
  const isVisible = useSightlineVisible();
  const calculation = useSightlineCalculations(hoveredSeatId);

  if (!isVisible || !hoveredSeatId || !calculation.success || !calculation.data) {
    return null;
  }

  const { row, col, perspectiveAngle, pitchAngle, distance, visibilityScore } = calculation.data;

  // Compute 3D rotation angles based on seat offsets to screen center
  const rotateX = pitchAngle * 0.5; // pitch look-angle
  const rotateY = -perspectiveAngle; // yaw angle relative to screen center

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute bottom-6 left-6 p-5 rounded-2xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] shadow-2xl flex flex-col gap-3 w-64 transform-gpu z-30"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        willChange: 'transform',
      }}
    >
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h4 className="text-xs font-bold font-outfit text-white uppercase tracking-wider">
          Sightline Preview
        </h4>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          Seat {row}-{col}
        </span>
      </div>

      {/* Virtual Theater Viewport */}
      <div className="relative h-28 w-full bg-black/40 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center transform-gpu">
        <motion.div
          className="w-40 h-10 bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 rounded-sm border border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center transform-gpu"
          style={{
            transform: `perspective(200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
            willChange: 'transform',
          }}
        >
          <span className="text-[8px] font-mono text-cyan-900 font-bold uppercase tracking-widest">
            Screen View
          </span>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/70">
        <div className="bg-white/5 p-2 rounded">
          <span className="text-white/40 block">Pitch / Yaw</span>
          <span>{pitchAngle.toFixed(1)}° / {perspectiveAngle.toFixed(1)}°</span>
        </div>
        <div className="bg-white/5 p-2 rounded">
          <span className="text-white/40 block">Distance</span>
          <span>{distance.toFixed(2)}m</span>
        </div>
        <div className="col-span-2 bg-white/5 p-2 rounded flex justify-between items-center">
          <span className="text-white/40">Visibility Score</span>
          <span className={visibilityScore > 80 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
            {visibilityScore}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

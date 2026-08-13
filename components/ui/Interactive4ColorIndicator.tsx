'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Pause, Zap, RefreshCw } from 'lucide-react';

export type IndicatorMode = 'orbit' | 'bounce' | 'pulse' | 'wave';

export interface Interactive4ColorIndicatorProps {
  size?: number;
  interactive?: boolean;
}

export function Interactive4ColorIndicator({
  size = 120,
  interactive = true,
}: Interactive4ColorIndicatorProps) {
  const [mode, setMode] = useState<IndicatorMode>('orbit');
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const playClickTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio fallback
    }
  };

  const handleCircleClick = (freq: number, modeName: IndicatorMode) => {
    playClickTone(freq);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 20, 40]);
    }
    setMode(modeName);
  };

  const currentDuration = (2 / speed) * (isHovered ? 0.6 : 1);

  return (
    <div dir="rtl" className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-2xl shadow-2xl max-w-sm w-full select-none">
      <div className="flex items-center justify-between w-full border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-sm font-bold text-white tracking-wide">אינדיקטור 4 צבעים אינטראקטיבי</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          120Hz GPU
        </span>
      </div>

      {/* Main Interactive 4-Color Glowing Indicator Stage */}
      <div
        className="relative flex items-center justify-center cursor-pointer my-4 group"
        style={{ width: `${size}px`, height: `${size}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="status"
        aria-label="אינדיקטור טעינה אינטראקטיבי 4 צבעים"
      >
        <motion.div
          animate={
            isPlaying
              ? mode === 'orbit'
                ? { rotate: 360 }
                : mode === 'bounce'
                ? { scale: [0.9, 1.15, 0.9] }
                : mode === 'pulse'
                ? { opacity: [0.6, 1, 0.6] }
                : { rotate: [0, 180, 360], scale: [1, 1.1, 1] }
              : {}
          }
          transition={{
            duration: currentDuration,
            repeat: Infinity,
            ease: mode === 'orbit' ? 'linear' : 'easeInOut',
          }}
          className="relative w-full h-full transform-gpu will-change-transform"
        >
          {/* Top Dot: Orange / Red-Orange */}
          <motion.span
            whileHover={{ scale: 1.4 }}
            onClick={() => handleCircleClick(523.25, 'orbit')}
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-[#ff4500] shadow-[0_0_18px_#ff4500] transition-shadow duration-300 hover:shadow-[0_0_28px_#ff4500]"
            style={{ width: `${size * 0.22}px`, height: `${size * 0.22}px` }}
          />

          {/* Right Dot: Yellow-Orange */}
          <motion.span
            whileHover={{ scale: 1.4 }}
            onClick={() => handleCircleClick(659.25, 'bounce')}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-[#ff9900] shadow-[0_0_18px_#ff9900] transition-shadow duration-300 hover:shadow-[0_0_28px_#ff9900]"
            style={{ width: `${size * 0.22}px`, height: `${size * 0.22}px` }}
          />

          {/* Bottom Dot: Pink / Magenta */}
          <motion.span
            whileHover={{ scale: 1.4 }}
            onClick={() => handleCircleClick(783.99, 'pulse')}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-[#ff007f] shadow-[0_0_18px_#ff007f] transition-shadow duration-300 hover:shadow-[0_0_28px_#ff007f]"
            style={{ width: `${size * 0.22}px`, height: `${size * 0.22}px` }}
          />

          {/* Left Dot: Cyan / Aqua */}
          <motion.span
            whileHover={{ scale: 1.4 }}
            onClick={() => handleCircleClick(1046.5, 'wave')}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#00f0ff] shadow-[0_0_18px_#00f0ff] transition-shadow duration-300 hover:shadow-[0_0_28px_#00f0ff]"
            style={{ width: `${size * 0.22}px`, height: `${size * 0.22}px` }}
          />
        </motion.div>
      </div>

      {interactive && (
        <div className="w-full space-y-3 pt-2 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>מהירות סיבוב: {speed.toFixed(1)}x</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-cyan-400 w-28 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white flex items-center justify-center gap-1.5 font-semibold transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? 'השהה' : 'הפעל'}
            </button>

            <button
              onClick={() => {
                const modes: IndicatorMode[] = ['orbit', 'bounce', 'pulse', 'wave'];
                const next = modes[(modes.indexOf(mode) + 1) % modes.length];
                setMode(next);
                playClickTone(440);
              }}
              className="py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-cyan-300 flex items-center justify-center gap-1.5 font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              מצב: {mode}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

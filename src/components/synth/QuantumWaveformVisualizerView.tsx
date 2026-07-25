'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Play, Pause } from 'lucide-react';

interface QuantumWaveformVisualizerViewProps {
  isPlaying: boolean;
  tempoBpm: number;
  onTogglePlay: () => void;
}

export const QuantumWaveformVisualizerView: React.FC<QuantumWaveformVisualizerViewProps> = ({
  isPlaying,
  tempoBpm,
  onTogglePlay,
}) => {
  const barsCount = 24;

  return (
    <div className="relative w-full p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col items-center gap-6 font-inter overflow-hidden">
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">ויזואלייזר גלים קוונטי (120Hz Waveform)</h3>
            <p className="text-xs text-slate-400">תנועת גלי הסאונד בלייב</p>
          </div>
        </div>

        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg border ${
            isPlaying
              ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>עצור ניגון</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>נגן פסקול</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Waveform Bars */}
      <div className="w-full h-32 flex items-center justify-center gap-1.5 px-4 relative z-10">
        {Array.from({ length: barsCount }).map((_, idx) => {
          const heightMultiplier = Math.sin((idx / barsCount) * Math.PI) * 100;
          return (
            <motion.div
              key={idx}
              animate={{
                height: isPlaying ? [`${Math.max(15, heightMultiplier * 0.3)}%`, `${Math.min(100, heightMultiplier * 1.2)}%`, `${Math.max(15, heightMultiplier * 0.3)}%`] : '15%',
              }}
              transition={{
                duration: 60 / tempoBpm + (idx % 3) * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-2 rounded-full bg-gradient-to-t from-cyan-500 via-blue-400 to-purple-400 transform-gpu"
            />
          );
        })}
      </div>
    </div>
  );
};

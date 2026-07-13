'use client';

import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface ScratchPassDesignProps {
  tiltStyle: React.CSSProperties;
  glareStyle: React.CSSProperties;
  tierName?: string;
}

export function ScratchPassDesign({
  tiltStyle,
  glareStyle,
  tierName = 'NEURAL ELITE',
}: ScratchPassDesignProps) {
  return (
    <div
      style={tiltStyle}
      className="relative w-full h-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0D0F14] to-[#151821] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden select-none"
    >
      {/* Dynamic Specular Glare */}
      <div
        style={glareStyle}
        className="absolute -inset-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(0,240,255,0.08)_25%,rgba(255,20,100,0.08)_50%,transparent_100%)] pointer-events-none opacity-90 mix-blend-overlay transition-transform duration-100 ease-out"
      />

      {/* Cybernetic Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Card Content Layout */}
      <div className="flex flex-col justify-between h-full p-6 z-10 relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Crown className="w-4.5 h-4.5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white/40 text-[8px] font-bold tracking-[0.25em] font-inter">
                VIP MEMBERSHIP
              </span>
              <span className="text-white text-sm font-black tracking-wide font-outfit uppercase">
                {tierName}
              </span>
            </div>
          </div>
          <span className="text-cyan-400/80 text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border border-cyan-400/20 bg-cyan-400/5">
            LOCKED
          </span>
        </div>

        {/* Central Spinning Target */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative w-16 h-16 rounded-full border border-dashed border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1),inset_0_0_10px_rgba(6,182,212,0.1)]">
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 animate-spin [animation-duration:10s]" />
            <Sparkles className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] relative z-10" />
          </div>
          <span className="text-slate-300 text-xs font-bold font-inter text-center tracking-wide">
            גרד כאן לחשיפת ההטבה
          </span>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center w-full">
          <span className="text-white/20 text-[8px] font-mono tracking-wider">
            PASS NODE: #2468-6.2
          </span>
          <span className="text-slate-500 text-[8px] font-bold tracking-widest font-inter">
            ANTIGRAVITY SYSTEMS
          </span>
        </div>
      </div>
    </div>
  );
}

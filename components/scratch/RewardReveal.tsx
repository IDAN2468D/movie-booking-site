'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RewardRevealProps {
  voucherCode: string;
  rewardTitle: string;
}

export function RewardReveal({ voucherCode, rewardTitle }: RewardRevealProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(voucherCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between bg-gradient-to-b from-[#141412] via-[#0A0A09] to-[#060605] py-8 px-6 rounded-3xl border border-white/[0.12] select-none z-0 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_0_40px_rgba(245,158,11,0.18)] transform-gpu hover:scale-[1.01] transition-transform duration-500">
      {/* Holographic Reflection Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-10 mix-blend-overlay opacity-80 animate-pulse [animation-duration:6s]" />

      {/* Ticket Edge Punches */}
      <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#05070B] border border-white/[0.08] shadow-[inset_-3px_0_6px_rgba(0,0,0,0.8)] z-20" />
      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#05070B] border border-white/[0.08] shadow-[inset_3px_0_6px_rgba(0,0,0,0.8)] z-20" />

      {/* Perforation Line */}
      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t border-dashed border-amber-500/20 z-10" />

      {/* Top Section: Header Wreath, Title & Sector Info */}
      <div className="flex flex-col items-center w-full z-10 text-center">
        {/* Laurel Wreath / Crown Badge */}
        <div className="relative w-16 h-16 rounded-full border border-amber-500/35 flex items-center justify-center bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-3">
          <div className="absolute inset-1.5 border border-dashed border-amber-500/40 rounded-full animate-spin [animation-duration:25s]" />
          <svg className="w-8 h-8 text-amber-400 drop-shadow-[0_2px_5px_rgba(245,158,11,0.5)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 19h20v2H2v-2zm1-2h18v-2H3v2zm1.25-3h15.5l-1.5-6.5-4 3-2.75-5.5-2.75 5.5-4-3-1.5 6.5z" />
          </svg>
        </div>

        {/* Ticket Header Text */}
        <span className="text-[9px] font-black text-amber-400/80 tracking-[0.25em] uppercase font-inter mb-2">
          OFFICIAL REDEMPTION PASS
        </span>

        {/* Prize Name */}
        <h3 className="text-amber-300 text-xl lg:text-2xl font-black tracking-wide leading-tight font-outfit max-w-[240px] drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] px-2">
          {rewardTitle}
        </h3>

        {/* Triple Star Decor */}
        <span className="text-[10px] text-amber-500/50 tracking-[0.4em] mt-1.5 font-bold">★★★</span>
      </div>

      {/* Bottom Section: Code Box, Barcode & Serial */}
      <div className="flex flex-col items-center w-full z-10 gap-4">
        {/* Copy Button Box */}
        <button
          onClick={handleCopy}
          className="group flex items-center justify-between w-full max-w-[310px] py-4 px-4.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/35 hover:border-amber-500/60 hover:bg-amber-500/[0.15] transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.06),_inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer hover:scale-[1.02] transform-gpu"
        >
          <span className="text-amber-400 text-base font-mono font-black tracking-widest whitespace-nowrap mr-2 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]">
            {voucherCode}
          </span>
          <div className="flex items-center gap-1.5 text-amber-400/80 group-hover:text-amber-400 transition-colors flex-shrink-0">
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 animate-scale" />
                <span className="text-[10px] font-black text-emerald-400 font-outfit whitespace-nowrap">הועתק!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-[10px] font-black font-outfit whitespace-nowrap">העתק</span>
              </>
            )}
          </div>
        </button>

        {/* Vector Barcode & Serial */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <div className="flex items-center gap-[3px] h-8 opacity-65">
            {[1, 3, 2, 1, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 4, 1, 3, 1, 2, 2, 1, 3].map((w, idx) => (
              <div
                key={idx}
                style={{ width: `${w}px` }}
                className="h-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600"
              />
            ))}
          </div>
          <span className="text-[8px] font-bold text-slate-500 font-mono tracking-widest">
            SERIAL: #0081-9428-N
          </span>
        </div>
      </div>
    </div>
  );
}

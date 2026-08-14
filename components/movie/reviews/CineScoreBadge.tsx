'use client';

import React from 'react';
import { Award, ShieldCheck, Star } from 'lucide-react';

interface CineScoreBadgeProps {
  score: number; // 1-10
  percentage?: number; // 0-100%
  totalReviews: number;
  verifiedCount: number;
  className?: string;
}

export default function CineScoreBadge({
  score,
  percentage,
  totalReviews,
  verifiedCount,
  className = '',
}: CineScoreBadgeProps) {
  const displayScore = score > 0 ? score.toFixed(1) : '–';
  const displayPercent = percentage ?? Math.round(score * 10);

  return (
    <div
      className={`relative inline-flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-white/[0.04] to-primary/10 border border-amber-500/20 backdrop-blur-xl shadow-lg ${className}`}
      dir="rtl"
    >
      {/* Visual Ring / Score Box */}
      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex flex-col items-center justify-center text-black font-black shadow-md shadow-amber-500/30 shrink-0">
        <span className="text-base leading-none">{displayScore}</span>
        <span className="text-[9px] uppercase tracking-tighter opacity-80">/ 10</span>
      </div>

      {/* Details */}
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Award size={14} className="text-amber-400" />
          <span>CineScore קהילתי</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/60">
          <span>{totalReviews} ביקורות</span>
          {verifiedCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck size={11} />
                <span>{verifiedCount} מאומתים</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

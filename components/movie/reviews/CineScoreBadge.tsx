'use client';

import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

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
  const hasReviews = totalReviews > 0;

  return (
    <div
      className={`relative inline-flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-white/[0.04] to-primary/10 border border-amber-500/30 backdrop-blur-2xl shadow-xl shadow-amber-500/5 ${className}`}
      dir="rtl"
    >
      {/* Visual Score Box with Glowing Gradient */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center justify-center text-black font-black shadow-md shadow-amber-500/30 shrink-0 transform-gpu">
        <span className="text-base sm:text-lg leading-none font-outfit">{displayScore}</span>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter opacity-85 font-bold">/ 10</span>
      </div>

      {/* Details */}
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Award size={13} className="text-amber-400" />
          <span>CineScore קהילתי</span>
          {hasReviews && percentage !== undefined && percentage > 0 && (
            <span className="text-[10px] text-amber-400/80 font-bold">({percentage}%)</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-[11px] text-white/60 font-medium">
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
          {!hasReviews && (
            <span className="text-white/40 flex items-center gap-0.5">
              <Sparkles size={10} className="text-amber-400" />
              <span>טרם דורג</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

interface ReviewsStatsSummaryProps {
  score: number;
  percentage: number;
  totalReviews: number;
  verifiedCount: number;
  distribution?: { [key: number]: number };
}

export default function ReviewsStatsSummary({
  score,
  percentage,
  totalReviews,
  verifiedCount,
  distribution = {},
}: ReviewsStatsSummaryProps) {
  if (totalReviews === 0) return null;

  // Group into 5 buckets for cleaner visual histogram: 9-10, 7-8, 5-6, 3-4, 1-2
  const buckets = [
    { label: '9-10', count: (distribution[10] || 0) + (distribution[9] || 0) },
    { label: '7-8', count: (distribution[8] || 0) + (distribution[7] || 0) },
    { label: '5-6', count: (distribution[6] || 0) + (distribution[5] || 0) },
    { label: '3-4', count: (distribution[4] || 0) + (distribution[3] || 0) },
    { label: '1-2', count: (distribution[2] || 0) + (distribution[1] || 0) },
  ];

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div
      className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
      dir="rtl"
    >
      {/* Col 1: Overall CineScore & Recommendation */}
      <div className="flex items-center gap-4 border-b md:border-b-0 md:border-l border-white/10 pb-4 md:pb-0 md:pl-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center justify-center text-black font-black shadow-lg shadow-amber-500/25 shrink-0">
          <span className="text-2xl leading-none font-outfit">{score.toFixed(1)}</span>
          <span className="text-[10px] font-bold opacity-80">/ 10</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-sm font-black text-amber-300">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span>ציון CineScore משוקלל</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">
            מבוסס על <strong className="text-white">{totalReviews}</strong> חוות דעת
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-black flex items-center gap-1">
              <ThumbsUp size={11} />
              <span>{percentage}% ממליצים</span>
            </span>
          </div>
        </div>
      </div>

      {/* Col 2: Rating Histogram */}
      <div className="space-y-1.5 border-b md:border-b-0 md:border-l border-white/10 pb-4 md:pb-0 md:pl-4">
        {buckets.map((b) => {
          const barWidth = totalReviews > 0 ? (b.count / maxCount) * 100 : 0;
          return (
            <div key={b.label} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-[11px] text-white/50 font-mono text-left">{b.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="w-5 text-[10px] text-white/40 text-right">{b.count}</span>
            </div>
          );
        })}
      </div>

      {/* Col 3: Verified Stats Highlights */}
      <div className="flex flex-col gap-2">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={14} />
            </div>
            <div>
              <div className="text-xs font-black text-white">צופים מאומתים</div>
              <div className="text-[10px] text-white/40">רכשו כרטיסים באתר</div>
            </div>
          </div>
          <span className="text-sm font-black text-emerald-400">{verifiedCount}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Star size={14} />
            </div>
            <div>
              <div className="text-xs font-black text-white">ביקורות קהילה</div>
              <div className="text-[10px] text-white/40">חוות דעת כלליות</div>
            </div>
          </div>
          <span className="text-sm font-black text-white">{totalReviews - verifiedCount}</span>
        </div>
      </div>
    </div>
  );
}

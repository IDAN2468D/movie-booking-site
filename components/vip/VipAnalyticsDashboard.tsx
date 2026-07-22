"use client";

import React, { useState, useEffect } from 'react';
import { getVipAnalyticsAction } from '@/app/actions/getVipAnalyticsActions';

interface VipAnalyticsDashboardProps {
  userId: string;
}

export const VipAnalyticsDashboard: React.FC<VipAnalyticsDashboardProps> = ({ userId }) => {
  const [data, setData] = useState<{
    vipTier: string;
    totalMoviesWatched: number;
    totalPulsePoints: number;
    genreAffinity: Array<{ genre: string; score: number; color: string }>;
  } | null>(null);

  useEffect(() => {
    getVipAnalyticsAction({ userId, timeframe: '90d' }).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  }, [userId]);

  return (
    <div className="w-full max-w-md p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] text-white shadow-2xl" dir="rtl">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-['Outfit'] text-xl font-bold text-cyan-400">VIP Cine-Pulse Analytics</h3>
          <p className="text-xs text-neutral-400 font-['Inter']">דרגה: {data?.vipTier || 'Platinum'}</p>
        </div>
        <div className="text-left font-mono">
          <span className="text-xs text-neutral-400 block">נקודות Pulse</span>
          <span className="text-lg font-bold text-emerald-400">{data?.totalPulsePoints ?? 0}</span>
        </div>
      </div>

      {/* Genre Affinity Heatmap */}
      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">מפת חום של זיקת ז'אנרים</h4>
      <div className="space-y-3 mb-6">
        {data?.genreAffinity.map((g) => (
          <div key={g.genre}>
            <div className="flex justify-between text-xs font-['Inter'] mb-1">
              <span>{g.genre}</span>
              <span className="font-mono">{g.score}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{ width: `${g.score}%`, backgroundColor: g.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs font-mono text-center">
        🏆 צפית ב-{data?.totalMoviesWatched ?? 0} סרטים ב-90 הימים האחרונים!
      </div>
    </div>
  );
};

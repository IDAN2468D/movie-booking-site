'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Clock, Flame, Award, Star, Trophy, Sparkles } from 'lucide-react';
import { UserCineStats } from '@/app/actions/cineStatsActions';

interface CineStatsOverviewProps {
  stats: UserCineStats;
}

export function CineStatsOverview({ stats }: CineStatsOverviewProps) {
  const kpis = [
    {
      label: 'סרטים שצפית',
      value: stats.totalMoviesWatched,
      suffix: 'סרטים',
      icon: Film,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      label: 'זמן מסך כולל',
      value: stats.totalRuntimeHours,
      suffix: 'שעות',
      icon: Clock,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      label: 'רצף שבועי',
      value: `${stats.cinemaStreak} שבועות`,
      suffix: 'ברצף',
      icon: Flame,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      label: 'נקודות יוקרה VIP',
      value: stats.loyaltyPoints,
      suffix: 'PTS',
      icon: Trophy,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border flex flex-col justify-between shadow-xl ${kpi.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/60">{kpi.label}</span>
                <span className="p-2 rounded-xl bg-white/[0.06]">
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-white font-outfit tracking-tight">
                  {kpi.value}
                </div>
                <span className="text-[10px] text-white/40 font-medium">{kpi.suffix}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reviewer Level & Genre Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reviewer Profile Card */}
        <div className="p-5 rounded-3xl bg-neutral-900/50 backdrop-blur-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">דירוג קהילה ו-CineScore</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black border border-amber-400/30">
              {stats.reviewerRank.level}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-4 text-center">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-base font-black text-white">{stats.reviewerRank.reviewsCount}</div>
              <div className="text-[10px] text-white/50 mt-0.5">ביקורות שפורסמו</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-base font-black text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{stats.reviewerRank.averageRating || '—'}</span>
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">ציון ממוצע</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-base font-black text-primary">{stats.reviewerRank.verifiedReviewsCount}</div>
              <div className="text-[10px] text-white/50 mt-0.5">ביקורות מאומתות</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>פרסם עוד 2 ביקורות מאומתות לשדרוג תג המבקר שלך!</span>
          </div>
        </div>

        {/* Genre Breakdown Bars */}
        <div className="p-5 rounded-3xl bg-neutral-900/50 backdrop-blur-xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">התפלגות ז'אנרים מועדפים</h3>
            <span className="text-[10px] text-white/40">לפי היסטוריית כרטיסים</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {stats.favoriteGenres.map((item) => (
              <div key={item.genre} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/80">{item.genre}</span>
                  <span className="text-primary font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-l from-primary via-purple-500 to-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CineStatsOverview;

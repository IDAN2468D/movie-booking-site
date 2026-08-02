'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Award, Zap } from 'lucide-react';
import { FriendSatisfaction, Friend } from '@/types/seatingGame';

interface HarmonyMeterProps {
  score: number;
  statusText: string;
  satisfactions: Record<string, FriendSatisfaction>;
  friends: Friend[];
  assignedCount: number;
}

export const HarmonyMeter: React.FC<HarmonyMeterProps> = ({
  score,
  statusText,
  satisfactions,
  friends,
  assignedCount,
}) => {
  const getGradient = (val: number) => {
    if (val >= 90) return 'from-emerald-400 via-teal-300 to-cyan-400';
    if (val >= 75) return 'from-cyan-400 via-sky-400 to-blue-500';
    if (val >= 50) return 'from-amber-400 via-orange-400 to-yellow-300';
    return 'from-rose-500 via-red-500 to-amber-400';
  };

  const getGlowColor = (val: number) => {
    if (val >= 90) return 'shadow-[0_0_30px_rgba(16,185,129,0.35)]';
    if (val >= 75) return 'shadow-[0_0_30px_rgba(6,182,212,0.35)]';
    if (val >= 50) return 'shadow-[0_0_30px_rgba(245,158,11,0.35)]';
    return 'shadow-[0_0_30px_rgba(244,63,94,0.35)]';
  };

  return (
    <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Background Neon Aura */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header & Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 text-cyan-300 shadow-lg">
            <HeartHandshake className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white tracking-wide">מד הרמוניה קבוצתית</h3>
              {score >= 90 && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                  שיא הרמוניה!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{statusText}</p>
          </div>
        </div>

        {/* Score Display Card */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 px-5 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">ציון שביעות רצון</span>
            <span className="text-xs font-mono text-cyan-400">
              {assignedCount} / {friends.length} שובצו
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-black bg-gradient-to-r ${getGradient(
              score
            )} bg-clip-text text-transparent`}
          >
            {score}%
          </motion.div>
        </div>
      </div>

      {/* Dynamic Animated Meter Bar */}
      <div className="space-y-1.5 relative z-10">
        <div className="relative w-full h-5 bg-slate-950/90 rounded-full p-1 border border-slate-800/90 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getGradient(
              score
            )} ${getGlowColor(score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
          />
        </div>
      </div>

      {/* Individual Satisfaction Avatar Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 relative z-10">
        {friends.map((friend) => {
          const sat = satisfactions[friend.id];
          const isAssigned = Boolean(sat);
          const friendScore = sat?.score ?? 0;

          return (
            <div
              key={friend.id}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                isAssigned
                  ? friendScore >= 70
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/30'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/30'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: friend.color }}
              />
              <span className="truncate font-semibold text-xs flex-1">{friend.name}</span>
              <span className="font-mono text-xs font-bold">
                {isAssigned ? `${friendScore}%` : '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

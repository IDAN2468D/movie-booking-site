'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { AchievementBadge } from '@/app/actions/cineStatsActions';

interface AchievementBadgesGridProps {
  badges: AchievementBadge[];
}

export function AchievementBadgesGrid({ badges }: AchievementBadgesGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const handleBadgeClick = (badge: AchievementBadge) => {
    setSelectedBadge(badge);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && badge.unlocked) {
      navigator.vibrate([20, 30, 40]);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm md:text-base font-black text-white">תגי הישג ומועדון CinePulse</h3>
        </div>
        <span className="text-xs text-white/50">
          פתוחים: {badges.filter((b) => b.unlocked).length} מתוך {badges.length}
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ scale: badge.unlocked ? 1.02 : 1 }}
            onClick={() => handleBadgeClick(badge)}
            className={`cursor-pointer p-4 rounded-3xl backdrop-blur-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              badge.unlocked
                ? `bg-neutral-900/80 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-amber-400/50`
                : 'bg-black/40 border-white/5 opacity-60'
            }`}
          >
            {/* Background Ambient Glow for Unlocked Badges */}
            {badge.unlocked && (
              <div
                className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${badge.glowColor} rounded-full blur-3xl opacity-20 pointer-events-none`}
              />
            )}

            {/* Top Row: Rarity + Status */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  badge.rarity === 'Legendary'
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
                    : badge.rarity === 'Epic'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : badge.rarity === 'Rare'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-white/10 text-white/70 border-white/10'
                }`}
              >
                {badge.rarity}
              </span>

              {badge.unlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>נפתח</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-white/40">
                  <Lock className="w-3.5 h-3.5" />
                  <span>נעול</span>
                </span>
              )}
            </div>

            {/* Badge Content */}
            <div className="my-3 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {badge.unlocked && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{badge.title}</span>
              </h4>
              <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                {badge.description}
              </p>
            </div>

            {/* Bottom Progress Bar for Locked / Date for Unlocked */}
            <div className="pt-2 border-t border-white/5">
              {badge.unlocked ? (
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>מאומת בארנק הביומטרי</span>
                </span>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/40 font-bold">
                    <span>התקדמות</span>
                    <span>{badge.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Badge Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full p-6 rounded-3xl bg-neutral-900 border border-white/20 shadow-2xl text-center space-y-4"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr ${selectedBadge.glowColor} flex items-center justify-center shadow-lg`}
              >
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedBadge.title}</h3>
                <p className="text-xs text-white/60 mt-1">{selectedBadge.description}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] text-xs text-white/80 font-medium">
                {selectedBadge.unlocked
                  ? '✨ תג זה נפתח בהצלחה ומקנה נקודות יוקרה נוספות!'
                  : `🔒 המשך לצפות ולבקר סרטים כדי לפתוח (${selectedBadge.progress}% הושלמו)`}
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                סגור
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AchievementBadgesGrid;

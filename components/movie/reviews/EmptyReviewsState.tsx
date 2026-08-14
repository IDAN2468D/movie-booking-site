'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Star, Sparkles, ShieldCheck, PenSquare } from 'lucide-react';

interface EmptyReviewsStateProps {
  movieTitle: string;
  onOpenModal: (prefillRating?: number) => void;
  onToggleInline?: () => void;
}

export default function EmptyReviewsState({
  movieTitle,
  onOpenModal,
  onToggleInline,
}: EmptyReviewsStateProps) {
  const handleScoreSelect = (score: number) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    if (onToggleInline) {
      onToggleInline();
    } else {
      onOpenModal(score);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-amber-500/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl text-center"
      dir="rtl"
    >
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 right-1/2 translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon */}
      <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-amber-500/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
        <MessageSquarePlus className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-400 text-black shadow-md">
          <Sparkles size={12} />
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-outfit">
        היה הראשון לקבוע את ה-CineScore לסרט זה!
      </h3>
      <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-6 font-medium">
        שתף את חוות הדעת שלך על <span className="text-amber-400 font-bold">"{movieTitle}"</span> והשפע על דירוג הצופים הקהילתי.
      </p>

      {/* Rating Pill Selector */}
      <div className="inline-flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl mb-6 max-w-md w-full">
        <span className="text-[11px] font-bold text-white/60">
          בחר ציון מהיר להתחלת כתיבה:
        </span>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleScoreSelect(star)}
              className="h-8 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-black text-amber-300 font-mono text-xs font-black transition-colors flex items-center justify-center border border-white/10 hover:border-amber-400"
            >
              {star}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (onToggleInline) onToggleInline();
            else onOpenModal(8);
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/25 active:scale-95 transition-all"
        >
          <PenSquare size={16} />
          <span>פתח טופס כתיבת ביקורת</span>
        </button>
      </div>

      {/* Verified Ticket Badge Hint */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/40">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>רוכשי כרטיסים ב-CinePulse מקבלים תג אימות צפייה אוטומטית</span>
      </div>
    </motion.div>
  );
}

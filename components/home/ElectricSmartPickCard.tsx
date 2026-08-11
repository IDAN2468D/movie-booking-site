'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Ticket, Clock } from 'lucide-react';
import { AIRecommendation } from '@/types/ai';

interface ElectricSmartPickCardProps {
  rec: AIRecommendation;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * ⚡ ElectricSmartPickCard: MovieBook UI Card with Animated Conic Electric Border.
 * Strictly adheres to electric_border_movie_cards_skill_prompt.md and screenshot visuals.
 */
export default function ElectricSmartPickCard({
  rec,
  index,
  isSelected,
  onClick,
}: ElectricSmartPickCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative [transform:translateZ(0)] w-full"
    >
      {/* 1. Main Outer Wrapper with Rotating Electric Neon Border */}
      <div
        onClick={onClick}
        className={`electric-movie-card w-full text-right cursor-pointer select-none transition-all duration-300 ${
          isSelected
            ? 'ring-2 ring-orange-500 shadow-[0_0_35px_rgba(255,69,0,0.6),0_0_15px_rgba(255,0,85,0.4)]'
            : ''
        }`}
      >
        {/* 2. Inner Dark Card Content Layer (z-index: 1, #11090d background) */}
        <div className="electric-card-inner flex flex-col justify-between h-full bg-[#11090d] rounded-[22px] p-6 text-right relative z-[1]">
          {/* Header Row: Format Badge on right, Ticket Icon on left */}
          <div className="flex items-center justify-between mb-4">
            <div className="p-1 opacity-20 group-hover:opacity-40 transition-opacity">
              <Ticket className="w-8 h-8 text-white stroke-[1.5]" />
            </div>

            <span className="px-3.5 py-1 bg-[#ff4500] text-white text-[10px] font-black rounded-full shadow-[0_2px_12px_rgba(255,69,0,0.4)] tracking-wide">
              {rec.bestFormat || 'אימקס'}
            </span>
          </div>

          {/* Title & Personalization Text */}
          <div className="mb-5">
            <h3 className="text-xl font-bold text-white mb-1.5 font-outfit tracking-tight">
              {rec.title}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
              {rec.reason}
            </p>
          </div>

          {/* Bottom Boxes */}
          <div className="flex flex-col gap-2.5 mt-auto">
            {/* Showtime & Remaining Seats */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1216]/90 rounded-xl border border-white/[0.06] justify-start">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                {rec.availabilityBadge}
              </span>
            </div>

            {/* MovieBook Subscription CTA Bar */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#2c0e0b]/90 to-[#1f0b09]/90 rounded-xl border border-orange-900/40 justify-start shadow-inner">
              <Info className="w-4 h-4 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-300/90 font-medium">
                {rec.savingsTip || 'חינם עם מנוי ה-MovieBook שלך'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

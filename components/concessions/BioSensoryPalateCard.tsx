'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Clock, Plus } from 'lucide-react';
import { BioSensoryPairing } from '@/app/actions/bioSensorySnackActions';

interface BioSensoryPalateCardProps {
  snack: BioSensoryPairing;
  onSelect?: (snack: BioSensoryPairing) => void;
}

export const BioSensoryPalateCard: React.FC<BioSensoryPalateCardProps> = ({ snack, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-gradient-to-br ${snack.gradientColors} backdrop-blur-2xl border rounded-3xl p-5 text-right shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all`}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="px-2.5 py-1 rounded-full bg-white/10 text-white font-bold text-[10px] flex items-center gap-1 border border-white/20">
          <Sparkles className="w-3 h-3 text-amber-400" /> AI Pick ({snack.matchScorePercentage}% התאמה)
        </span>
        <span className="text-xs font-mono font-bold text-amber-300">₪{snack.priceILS}</span>
      </div>

      <h4 className="font-outfit text-base font-extrabold text-white mb-1">{snack.name}</h4>
      <p className="text-xs text-gray-300 leading-relaxed mb-4">{snack.palateProfile}</p>

      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>הכנה: ~{Math.round(snack.estimatedPrepTimeSec / 60)} דק&apos;</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect?.(snack)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>הוסף למגש</span>
        </button>
      </div>
    </motion.div>
  );
};

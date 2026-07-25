'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AuraProfileResult } from '@/lib/validations/aura-chamber';
import { Sparkles, Film, Activity, RotateCcw } from 'lucide-react';

interface AuraResonanceResultViewProps {
  result: AuraProfileResult;
  onReset: () => void;
}

export const AuraResonanceResultView: React.FC<AuraResonanceResultViewProps> = ({
  result,
  onReset,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full p-8 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] font-inter space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg"
            style={{ backgroundColor: `${result.auraColor}22`, borderColor: result.auraColor, color: result.auraColor }}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-outfit">{result.auraTitle}</h3>
            <span className="text-xs font-mono text-slate-400">תדר אנרגיה: {result.energyFrequencyHz} Hz</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>סריקה חדשה</span>
        </button>
      </div>

      {/* Resonance Score Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            תאמת תהודה ביומטרית
          </span>
          <span className="font-mono text-cyan-300">{result.resonancePercentage}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.resonancePercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: result.auraColor }}
          />
        </div>
      </div>

      {/* Mood Description */}
      <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        {result.moodDescription}
      </p>

      {/* Recommended Vibes */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          ז'אנרים וחוויות מומלצות לאורה שלך:
        </div>
        <div className="flex flex-wrap gap-2">
          {result.recommendedVibes.map((vibe, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold font-mono border"
              style={{
                backgroundColor: `${result.auraColor}15`,
                borderColor: `${result.auraColor}40`,
                color: result.auraColor,
              }}
            >
              #{vibe}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

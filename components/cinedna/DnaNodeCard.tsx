'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CineDnaNode } from '@/lib/schemas/cineDna.schema';
import { Sparkles, Dna, Activity } from 'lucide-react';

interface DnaNodeCardProps {
  node: CineDnaNode | null;
}

const TYPE_TRANSLATIONS: Record<string, string> = {
  movie: 'סרט מרכזי',
  director: 'בימוי וחזון אומנותי',
  composer: 'פסקול ותדרי סאונד',
  cinematographer: 'צילום ותאורה',
  theme: 'תמה ומוטיב נרטיבי',
  color_palette: 'פלטת צבעים כרומטית',
};

export function DnaNodeCard({ node }: DnaNodeCardProps) {
  if (!node) {
    return (
      <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 text-center">
        <p className="text-sm text-off-white/40 font-medium">בחר צומת בגרף הגנטי לצפייה בפרטים</p>
      </div>
    );
  }

  const intensityPercent = Math.round(node.metadata.intensity * 100);
  const colorHex = node.metadata.colorHex || '#FF9F0A';

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-6 rounded-3xl bg-black/50 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden group"
    >
      {/* Chromatic Glow Accent */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: colorHex }}
      />

      <div className="relative z-10 space-y-4 text-right" dir="rtl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-white/5 border border-white/10 text-cyan-300">
            <Dna size={13} className="text-cyan-400" />
            {TYPE_TRANSLATIONS[node.type] || node.type}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Sparkles size={14} />
            <span>זיקה גנטית {intensityPercent}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black text-white font-rubik tracking-tight">{node.label}</h3>
          {node.metadata.year && (
            <span className="text-xs font-bold text-off-white/50">שנת יציאה: {node.metadata.year}</span>
          )}
        </div>

        {node.metadata.description && (
          <p className="text-sm text-off-white/80 leading-relaxed">{node.metadata.description}</p>
        )}

        {/* Intensity Meter */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-bold text-off-white/60">
            <span>עוצמת תהודה נוירונית</span>
            <span>{intensityPercent} / 100</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${intensityPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorHex, boxShadow: `0 0 12px ${colorHex}` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-off-white/40">
          <Activity size={12} className="text-primary" />
          <span>מחושב בזמן אמת ע״י CineDNA Engine & Gemini AI</span>
        </div>
      </div>
    </motion.div>
  );
}

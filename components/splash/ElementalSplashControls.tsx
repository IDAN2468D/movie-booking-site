'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, ArrowLeft } from 'lucide-react';

export type ElementalVariant = 'all' | 'water' | 'lightning' | 'fire';

interface ElementalSplashControlsProps {
  activeVariant: ElementalVariant;
  onSelectVariant: (variant: ElementalVariant) => void;
  onEnter: () => void;
  onSkip: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

const VARIANTS: { id: ElementalVariant; label: string; icon: string; color: string }[] = [
  { id: 'all', label: 'כל הסרטים (TMDB)', icon: '✨', color: 'border-white/30 text-white' },
  { id: 'water', label: 'אווטאר · מים', icon: '🌊', color: 'border-sky-400/50 text-sky-300' },
  { id: 'lightning', label: 'בין כוכבים · ברק', icon: '⚡', color: 'border-purple-400/50 text-purple-300' },
  { id: 'fire', label: 'חולית 2 · אש', icon: '🔥', color: 'border-orange-400/50 text-orange-300' },
];

export const ElementalSplashControls: React.FC<ElementalSplashControlsProps> = ({
  activeVariant,
  onSelectVariant,
  onEnter,
  onSkip,
  audioMuted,
  onToggleAudio,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
      className="absolute bottom-8 inset-x-0 mx-auto w-full max-w-xl px-4 z-40 flex flex-col items-center gap-3.5 pointer-events-auto"
      dir="rtl"
    >
      {/* Element Selector Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl">
        {VARIANTS.map((item) => {
          const isSelected = activeVariant === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectVariant(item.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? `bg-white/15 ${item.color} shadow-[0_0_20px_rgba(255,255,255,0.15)] font-semibold scale-102`
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden xs:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unified Bottom Ergonomic Actions Dock (Audio, Enter, Skip) */}
      <div className="flex items-center gap-2 sm:gap-3 w-full justify-center">
        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={onToggleAudio}
          className="h-12 px-3.5 sm:px-4 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/15 hover:border-white/30 text-white/80 hover:text-white backdrop-blur-2xl transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 shrink-0 active:scale-95"
          title={audioMuted ? 'הפעל שמע' : 'השתק שמע'}
          aria-label={audioMuted ? 'הפעל שמע' : 'השתק שמע'}
        >
          {audioMuted ? <VolumeX size={18} className="text-white/50" /> : <Volume2 size={18} className="text-amber-400 animate-pulse" />}
          <span className="hidden sm:inline text-xs font-semibold">{audioMuted ? 'שמע כבוי' : 'שמע פעיל'}</span>
        </button>

        {/* Primary CTA - Enter Cinema */}
        <motion.button
          type="button"
          onClick={onEnter}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="h-12 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-[0_0_35px_rgba(244,63,94,0.4)] flex items-center gap-2 cursor-pointer transition-all border border-white/20 group shrink-0"
        >
          <Sparkles size={16} className="text-amber-200 animate-spin group-hover:scale-110 transition-transform" />
          <span>כניסה לקולנוע</span>
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>

        {/* Skip Button */}
        <button
          type="button"
          onClick={onSkip}
          className="h-12 px-4 sm:px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 text-white/90 hover:text-white backdrop-blur-2xl transition-all cursor-pointer text-xs sm:text-sm font-semibold tracking-wide shadow-xl flex items-center justify-center shrink-0 active:scale-95"
          title="דלג ישירות לקולנוע"
        >
          <span>דלג / SKIP</span>
        </button>
      </div>
    </motion.div>
  );
};

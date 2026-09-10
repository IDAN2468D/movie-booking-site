'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Zap, Flame, ChevronDown } from 'lucide-react';
import { ElementalVariant } from './ElementalSplashControls';

interface ElementChoice {
  id: ElementalVariant;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const CHOICES: ElementChoice[] = [
  { id: 'all', label: 'כל עולמות הסרטים (TMDB)', sub: 'אווטאר, בין כוכבים וחולית', icon: Sparkles, color: 'text-amber-400' },
  { id: 'water', label: 'אווטאר: דרכי המים', sub: 'TMDB 7.7★ · אוקיינוס פנדורה', icon: Droplets, color: 'text-cyan-400' },
  { id: 'lightning', label: 'בין כוכבים (Interstellar)', sub: 'TMDB 8.4★ · שדה קוונטי וחור תולעת', icon: Zap, color: 'text-yellow-400' },
  { id: 'fire', label: 'חולית: חלק 2 (Dune)', sub: 'TMDB 8.3★ · להבות המדבר של אראקיס', icon: Flame, color: 'text-rose-500' },
];

export default function SplashLauncherPill() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLaunch = (variant: ElementalVariant) => {
    setIsOpen(false);
    window.dispatchEvent(
      new CustomEvent('open-elemental-splash', { detail: { variant } })
    );
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-right z-30" dir="rtl">
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-10 px-2.5 sm:px-3 flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-cyan-500/15 hover:from-amber-500/25 hover:to-cyan-500/25 border border-amber-400/30 hover:border-amber-400/60 backdrop-blur-2xl text-amber-300 shadow-xl transition-all group shrink-0 cursor-pointer"
        aria-label="בחר פתיח אלמנטלי לצפייה"
        title="פתיח אלמנטלי (בחר אלמנט)"
      >
        <Sparkles size={16} className="text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
        <span className="hidden xl:inline text-[11px] font-bold tracking-tight text-white/95">פתיח אלמנטלי</span>
        <ChevronDown size={13} className={`text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-64 p-2 rounded-2xl bg-[#090b10]/95 backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
          >
            <div className="px-2 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">בחר פתיח לצפייה</span>
              <span className="text-[9px] font-mono text-white/40">WebGL2 · 3D</span>
            </div>

            <div className="flex flex-col gap-1">
              {CHOICES.map((choice) => {
                const Icon = choice.icon;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleLaunch(choice.id)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.09] border border-white/5 hover:border-white/20 transition-all text-right group cursor-pointer"
                  >
                    <div className={`p-1.5 rounded-lg bg-white/5 ${choice.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {choice.label}
                      </span>
                      <span className="text-[10px] text-white/50">{choice.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

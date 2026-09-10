'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ChevronDown, Moon, Subtitles, Sun, SunMedium, Sunset
} from 'lucide-react';
import { useDayNightContext } from '@/components/providers/DayNightProvider';
import { TimeBand } from '@/hooks/useDayNight';
import { useStealthTrayStore } from '@/lib/store/stealthTrayStore';
import { ElementalVariant } from '@/components/splash/ElementalSplashControls';

interface CinemaExperienceMenuProps {
  onOpenCineSub: () => void;
}

const SPLASH_OPTIONS: { id: ElementalVariant; label: string; icon: string; tag: string }[] = [
  { id: 'all', label: 'כל העולמות', icon: '✨', tag: 'TMDB' },
  { id: 'water', label: 'אווטאר 2', icon: '🌊', tag: '7.7★' },
  { id: 'lightning', label: 'בין כוכבים', icon: '⚡', tag: '8.4★' },
  { id: 'fire', label: 'חולית 2', icon: '🔥', tag: '8.3★' },
];

export default function CinemaExperienceMenu({ onOpenCineSub }: CinemaExperienceMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { band, info, setManualBand, isManualOverride } = useDayNightContext();
  const { isStealthActive, toggleStealthMode } = useStealthTrayStore();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleLaunchSplash = (variant: ElementalVariant) => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('open-elemental-splash', { detail: { variant } }));
  };

  const timeBands: { id: TimeBand; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dawn', label: 'שחר', icon: SunMedium },
    { id: 'day', label: 'יום', icon: Sun },
    { id: 'sunset', label: 'שקיעה', icon: Sunset },
    { id: 'night', label: 'לילה', icon: Moon },
  ];

  return (
    <div ref={menuRef} className="relative inline-block text-right z-30 font-inter" dir="rtl">
      {/* Unified Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`h-10 px-3 flex items-center gap-2 rounded-xl transition-all cursor-pointer border shadow-md ${
          isOpen || isStealthActive
            ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/90'
        }`}
        aria-label="מרכז חוויית קולנוע ומצבי צפייה"
        title="מרכז חוויית קולנוע (תאורה, פתיח, מגש שקט, כתוביות)"
      >
        <Sparkles size={15} className="text-amber-400 animate-pulse" />
        <span className="text-xs font-bold tracking-tight">חוויית צפייה</span>
        <ChevronDown size={13} className={`text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Floating Liquid Glass Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#0e0f17]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3 z-50 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles size={13} />
                מצבי קולנוע ואווירה
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                {info.labelHe}
              </span>
            </div>

            {/* Section 1: Dynamic Day/Night Lighting */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
                <span>תאורת יום / לילה</span>
                {isManualOverride && (
                  <button onClick={() => setManualBand(null)} className="text-[9px] text-cyan-400 hover:underline cursor-pointer">אוטומטי</button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                {timeBands.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setManualBand(id)}
                    className={`py-1.5 flex flex-col items-center gap-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      band === id ? 'bg-white/15 text-white shadow-sm border border-white/20' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} className={band === id ? 'text-amber-400' : ''} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: TMDB Elemental Splash */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-white/70">פתיח אלמנטלי TMDB</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SPLASH_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunchSplash(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-right flex items-center justify-between transition-all cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs font-bold text-white/90 group-hover:text-amber-300">{item.label}</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Stealth Tray & Subtitles */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {/* Stealth Tray Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Moon size={15} className={isStealthActive ? 'text-amber-400' : 'text-white/50'} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/90">מגש שקט לאולם</span>
                    <span className="text-[9px] text-white/50">החשכת מסך להזמנה שקטה</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleStealthMode()}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isStealthActive ? 'bg-amber-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full bg-white shadow-md ${isStealthActive ? 'mr-auto' : 'ml-auto'}`}
                  />
                </button>
              </div>

              {/* CineSub AI Trigger */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCineSub();
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 transition-all cursor-pointer group active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Subtitles size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-white/90">כתוביות חיות CineSub AI</span>
                    <span className="text-[9px] text-cyan-300/70">תמלול קולי בזמן אמת באולם</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

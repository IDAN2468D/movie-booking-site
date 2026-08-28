'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunMedium, Sun, Sunset, Moon, Sparkles, RefreshCw, Check } from 'lucide-react';
import { useDayNightContext } from '@/components/providers/DayNightProvider';
import { TimeBand } from '@/hooks/useDayNight';

export default function DayNightLightingPill() {
  const { band, info, isManualOverride, setManualBand, bands } = useDayNightContext();
  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = (id: TimeBand, size = 15) => {
    switch (id) {
      case 'dawn': return <SunMedium size={size} className="text-amber-400 shrink-0" />;
      case 'day': return <Sun size={size} className="text-sky-400 shrink-0" />;
      case 'sunset': return <Sunset size={size} className="text-pink-400 shrink-0" />;
      case 'night': return <Moon size={size} className="text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block text-right z-30" dir="rtl">
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        suppressHydrationWarning
        className="h-10 px-3 flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-2xl text-white shadow-xl transition-all group shrink-0 cursor-pointer"
        aria-label={`מצב תאורה: ${info.labelHe}`}
        title={`תאורה קולנועית: ${info.labelHe}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: info.accentColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: info.accentColor }}
          />
        </span>

        <div className="p-1 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
          {renderIcon(band, 14)}
        </div>

        <div className="hidden lg:flex flex-col items-start leading-tight text-right">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-white tracking-wide">{info.labelHe}</span>
            {isManualOverride && (
              <span className="text-[8px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono">
                ידני
              </span>
            )}
          </div>
          <span dir="ltr" className="text-[9px] text-white/50 font-mono tracking-tighter">
            {info.hoursLabel}
          </span>
        </div>

        <Sparkles size={11} className="text-white/40 group-hover:text-yellow-400 transition-colors hidden sm:inline-block ms-0.5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] p-2.5 rounded-2xl bg-[#0B0C12]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] z-50 space-y-1.5"
            >
              <div className="flex items-center justify-between px-2 py-1 text-xs text-white/70 border-b border-white/10 mb-1">
                <span className="font-semibold flex items-center gap-1.5 text-[11px] text-white">
                  <Sparkles size={12} className="text-pink-400" />
                  תאורת יום/לילה דינמית
                </span>
                {isManualOverride && (
                  <button
                    type="button"
                    onClick={() => setManualBand(null)}
                    className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={10} />
                    איפוס לאוטומטי
                  </button>
                )}
              </div>

              {bands.map((b) => {
                const isSelected = band === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setManualBand(b.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-right cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border border-white/20 shadow-sm'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="p-1.5 rounded-lg shrink-0"
                        style={{ backgroundColor: `${b.accentColor}25` }}
                      >
                        {renderIcon(b.id, 15)}
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5 flex-wrap">
                          <span>{b.labelHe}</span>
                          <span dir="ltr" className="text-[9px] text-white/45 font-mono">
                            {b.hoursLabel}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/60 truncate">{b.subLabelHe}</div>
                      </div>
                    </div>

                    {isSelected && <Check size={14} className="text-pink-400 ms-2 shrink-0" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSaverStore } from '@/lib/store/screenSaverStore';

const TIMEOUT_OPTIONS = [
  { label: '15 שניות', value: 15000 },
  { label: '30 שניות', value: 30000 },
  { label: 'דקה אחת', value: 60000 },
  { label: '3 דקות', value: 180000 },
  { label: '5 דקות', value: 300000 },
  { label: 'כבוי (ידני בלבד)', value: 0 },
];

export function ScreenSaverSettingsModal() {
  const isSettingsOpen = useScreenSaverStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useScreenSaverStore((state) => state.setIsSettingsOpen);
  const inactivityTimeout = useScreenSaverStore((state) => state.inactivityTimeout);
  const setInactivityTimeout = useScreenSaverStore((state) => state.setInactivityTimeout);
  const soundEnabled = useScreenSaverStore((state) => state.soundEnabled);
  const setSoundEnabled = useScreenSaverStore((state) => state.setSoundEnabled);
  const soundVolume = useScreenSaverStore((state) => state.soundVolume);
  const setSoundVolume = useScreenSaverStore((state) => state.setSoundVolume);

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-full max-w-lg p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/80 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.2)] text-white"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h2 className="text-2xl font-bold font-['Outfit'] tracking-wide">הגדרות שומר מסך</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Inactivity Timer Setting */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white/90 mb-3 font-['Inter']">
                זמן חוסר פעילות להפעלת שומר מסך
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIMEOUT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setInactivityTimeout(opt.value)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                      inactivityTimeout === opt.value
                        ? 'bg-red-600 border-red-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle & Volume Slider */}
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white/90 font-['Inter']">סאונד אווירה אקוסטי</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? '-translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {soundEnabled && (
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                    <span>עוצמת שמע</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.01"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10"
              >
                סגור
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

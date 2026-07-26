'use client';

import { motion } from 'framer-motion';
import { useScreenSaverStore } from '@/lib/store/screenSaverStore';

interface ScreenSaverControlsProps {
  totalMovies: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function ScreenSaverControls({
  totalMovies,
  onNext,
  onPrev,
  onClose,
}: ScreenSaverControlsProps) {
  const activeIndex = useScreenSaverStore((state) => state.activeIndex);
  const setActiveIndex = useScreenSaverStore((state) => state.setActiveIndex);
  const isPlaying = useScreenSaverStore((state) => state.isPlaying);
  const setIsPlaying = useScreenSaverStore((state) => state.setIsPlaying);
  const soundEnabled = useScreenSaverStore((state) => state.soundEnabled);
  const setSoundEnabled = useScreenSaverStore((state) => state.setSoundEnabled);
  const setIsSettingsOpen = useScreenSaverStore((state) => state.setIsSettingsOpen);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/60 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)]"
      dir="rtl"
    >
      {/* Slide Indicators */}
      <div className="flex items-center gap-1.5 ml-3">
        {Array.from({ length: totalMovies }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx 
                ? 'w-6 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`עבור לשקופית ${idx + 1}`}
          />
        ))}
      </div>

      <div className="w-[1px] h-5 bg-white/20" />

      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="הקודם"
      >
        <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-95"
        title={isPlaying ? 'השהה מצגת' : 'הפעל מצגת'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="הבא"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="w-[1px] h-5 bg-white/20" />

      {/* Mute/Unmute Audio */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`p-2 rounded-full transition-colors ${
          soundEnabled ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-white/40 hover:bg-white/10'
        }`}
        title={soundEnabled ? 'השתק שמע אווירה' : 'הפעל שמע אווירה'}
      >
        {soundEnabled ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="2 2" />
          </svg>
        )}
      </button>

      {/* Settings Modal Open */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        title="הגדרות שומר מסך"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <div className="w-[1px] h-5 bg-white/20" />

      {/* Exit Button */}
      <button
        onClick={onClose}
        className="px-3 py-1.5 bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-white rounded-full text-xs font-bold transition-colors border border-white/10 flex items-center gap-1.5"
      >
        <span>יציאה</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

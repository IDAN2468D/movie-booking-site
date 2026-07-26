'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSaverStore, selectIsScreenSaverActive } from '@/lib/store/screenSaverStore';
import { useScreenSaverAudio } from '@/hooks/useScreenSaverAudio';
import { ScreenSaverControls } from './ScreenSaverControls';
import { ScreenSaverSettingsModal } from './ScreenSaverSettingsModal';
import { ScreenSaverPosterCard } from './ScreenSaverPosterCard';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { SCREEN_SAVER_MOVIES } from '@/lib/constants/screensaverMovies';

const AUTO_INTERVAL_MS = 6000;

export function CinematicScreenSaver() {
  const isScreenSaverActive = useScreenSaverStore(selectIsScreenSaverActive);
  const setIsScreenSaverActive = useScreenSaverStore((state) => state.setIsScreenSaverActive);
  const activeIndex = useScreenSaverStore((state) => state.activeIndex);
  const setActiveIndex = useScreenSaverStore((state) => state.setActiveIndex);
  const isPlaying = useScreenSaverStore((state) => state.isPlaying);
  const { playSubBassDrop } = useScreenSaverAudio();

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isScreenSaverActive || !isPlaying) return;

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCREEN_SAVER_MOVIES.length);
    }, AUTO_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isScreenSaverActive, isPlaying, setActiveIndex]);

  if (!isScreenSaverActive) return null;

  const currentMovie = SCREEN_SAVER_MOVIES[activeIndex % SCREEN_SAVER_MOVIES.length];

  const handleNext = () => {
    playSubBassDrop();
    setActiveIndex((prev) => (prev + 1) % SCREEN_SAVER_MOVIES.length);
  };

  const handlePrev = () => {
    playSubBassDrop();
    setActiveIndex((prev) => (prev - 1 + SCREEN_SAVER_MOVIES.length) % SCREEN_SAVER_MOVIES.length);
  };

  const handleClose = () => {
    playSubBassDrop();
    setIsScreenSaverActive(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto bg-[#0A0A0A] overflow-hidden isolate select-none" dir="rtl">
      {/* Backdrop Image with Resilient Failover */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <ResilientImage
            src={currentMovie.backdropUrl}
            alt={currentMovie.title}
            fallbackTitle={currentMovie.title}
            fill
            priority
            className="object-cover pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent pointer-events-none" />

      {/* Movie Details Container & Official Poster Card */}
      <div className="absolute bottom-28 right-12 left-12 md:right-24 md:left-24 z-10 flex items-end justify-between gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl text-right"
          >
            <h1 
              className="text-5xl md:text-7xl font-black text-white tracking-widest mb-4"
              style={{ fontFamily: "'Outfit', 'Rubik', sans-serif", textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              {currentMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90" style={{ fontFamily: "'Inter', 'Assistant', sans-serif" }}>
              <span className="px-3 py-1 bg-white/20 rounded border border-white/10 text-sm font-bold tracking-widest shadow-lg">
                {currentMovie.year}
              </span>
              {currentMovie.genres.map((genre) => (
                <span key={genre} className="text-sm font-bold tracking-widest flex items-center gap-2 drop-shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {genre}
                </span>
              ))}
            </div>

            <p 
              className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow-xl"
              style={{ fontFamily: "'Inter', 'Assistant', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              {currentMovie.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Floating Official Poster Card */}
        <AnimatePresence mode="wait">
          <ScreenSaverPosterCard 
            key={`poster-${currentMovie.id}`}
            posterUrl={currentMovie.posterUrl}
            title={currentMovie.title}
          />
        </AnimatePresence>
      </div>

      {/* Top Status Header */}
      <div className="absolute top-10 right-10 left-10 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3" dir="ltr">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.9)]" />
          <span className="text-white/70 text-xs tracking-[0.2em] font-bold uppercase drop-shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            מצב המתנה קולנועי
          </span>
        </div>

        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
          title="סגור שומר מסך"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Interactive Controls & Settings Modal */}
      <ScreenSaverControls
        totalMovies={SCREEN_SAVER_MOVIES.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={handleClose}
      />
      <ScreenSaverSettingsModal />
    </div>
  );
}

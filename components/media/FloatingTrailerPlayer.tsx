'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2, Sparkles, Volume2, Ticket, Play } from 'lucide-react';
import Link from 'next/link';
import { useTrailerStore } from '@/lib/store/trailer-store';
import AmbientGlowFrame from './AmbientGlowFrame';

export function FloatingTrailerPlayer() {
  const {
    isOpen,
    isMinimized,
    movieId,
    movieTitle,
    trailerKey,
    ambientGlow,
    spatialAudio,
    closeTrailer,
    toggleMinimize,
    toggleAmbientGlow,
    toggleSpatialAudio,
  } = useTrailerStore();

  return (
    <AnimatePresence mode="wait">
      {isOpen && trailerKey && (
        <motion.div
          key="floating-trailer-player"
          drag={!isMinimized}
          dragMomentum={false}
          dragConstraints={{ left: -100, right: 400, top: -500, bottom: 50 }}
          dragElastic={0.08}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-[9999] max-w-[calc(100vw-3rem)] pointer-events-auto select-none"
          dir="rtl"
        >
          {isMinimized ? (
            /* Minimized Compact Bar */
            <div className="flex items-center gap-3 p-2.5 px-4 rounded-full bg-neutral-950/95 backdrop-blur-2xl border border-primary/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <Play className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-white/90 truncate max-w-[160px]">
                {movieTitle || 'טריילר פעיל'}
              </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={toggleMinimize}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="הגדל נגן"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={closeTrailer}
                className="p-1 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
                title="סגור נגן"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Full Floating Player Window */
            <AmbientGlowFrame isActive={ambientGlow} className="w-[360px] sm:w-[440px]">
              {/* Header Controls */}
              <div 
                className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10 cursor-move"
                onDoubleClick={toggleMinimize}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <h4 className="text-xs font-bold text-white tracking-wide truncate">
                    {movieTitle || 'טריילר קולנועי'}
                  </h4>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={toggleAmbientGlow}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      ambientGlow ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white/80'
                    }`}
                    title="תאורת אווירה דינמית"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={toggleSpatialAudio}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      spatialAudio ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/80'
                    }`}
                    title="שמע מרחבי מועצם"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={toggleMinimize}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title="מזער"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={closeTrailer}
                    className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="סגור נגן"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Iframe Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                  title={`${movieTitle} Trailer`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Bottom Booking Action Bar */}
              {movieId && (
                <div className="p-2.5 bg-neutral-950/80 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-white/50">חוויית צפייה בקולנוע</span>
                  <Link
                    href={`/movie/${movieId}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>הזמן כרטיסים</span>
                  </Link>
                </div>
              )}
            </AmbientGlowFrame>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingTrailerPlayer;


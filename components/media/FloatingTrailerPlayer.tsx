'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Sparkles, Volume2, Ticket, ChevronLeft, ChevronRight, Waves, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { useTrailerStore } from '@/lib/store/trailer-store';
import AmbientGlowFrame from './AmbientGlowFrame';
import FloatingTrailerMiniBar from './FloatingTrailerMiniBar';

export function FloatingTrailerPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isOpen,
    isMinimized,
    movieId,
    movieTitle,
    trailerKey,
    videoList,
    activeVideoIndex,
    ambientGlow,
    spatialAudio,
    audioEnhanceMode,
    closeTrailer,
    toggleMinimize,
    toggleAmbientGlow,
    toggleSpatialAudio,
    setAudioEnhanceMode,
    selectVideoIndex,
  } = useTrailerStore();

  const handleNextVideo = () => {
    if (videoList.length > 1) selectVideoIndex((activeVideoIndex + 1) % videoList.length);
  };

  const handlePrevVideo = () => {
    if (videoList.length > 1) selectVideoIndex((activeVideoIndex - 1 + videoList.length) % videoList.length);
  };

  const cycleAudioMode = () => {
    const modes: Array<'spatial-3d' | 'sub-bass' | 'balanced'> = ['spatial-3d', 'sub-bass', 'balanced'];
    setAudioEnhanceMode(modes[(modes.indexOf(audioEnhanceMode) + 1) % modes.length]);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && trailerKey && (
        <motion.div
          key="floating-trailer-player"
          drag={!isMinimized}
          dragMomentum={false}
          dragElastic={0}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-[9999] max-w-[calc(100vw-2rem)] pointer-events-auto select-none"
          dir="rtl"
        >
          {isMinimized ? (
            <FloatingTrailerMiniBar
              movieTitle={movieTitle}
              onMaximize={toggleMinimize}
              onClose={closeTrailer}
            />
          ) : (
            <AmbientGlowFrame isActive={ambientGlow} className={isExpanded ? 'w-[640px] sm:w-[820px] md:w-[940px] transition-all duration-300' : 'w-[520px] sm:w-[620px] md:w-[700px] transition-all duration-300'}>
              {/* Header Controls */}
              <div 
                className="flex items-center justify-between px-4 py-3 bg-white/[0.06] border-b border-white/10 cursor-move backdrop-blur-md"
                onDoubleClick={toggleMinimize}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-wide truncate font-outfit">
                    {movieTitle || 'טריילר קולנועי'}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={cycleAudioMode}
                    className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                      audioEnhanceMode === 'sub-bass' ? 'bg-[#FF1464]/20 text-[#FF1464]' : audioEnhanceMode === 'spatial-3d' ? 'bg-purple-500/25 text-purple-300' : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title={`מצב שמע: ${audioEnhanceMode === 'sub-bass' ? 'באס 35Hz' : audioEnhanceMode === 'spatial-3d' ? 'מרחבי 3D' : 'מאוזן'}`}
                  >
                    <Waves className="w-4 h-4" />
                  </button>
                  <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors" title={isExpanded ? 'הקטן גודל' : 'הגדל גודל קולנועי'}>
                    <Maximize2 className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={toggleAmbientGlow} className={`p-2 rounded-xl text-xs transition-colors ${ambientGlow ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title="תאורת אווירה דינמית">
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={toggleSpatialAudio} className={`p-2 rounded-xl text-xs transition-colors ${spatialAudio ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title="שמע מרחבי מועצם">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={toggleMinimize} className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="מזער">
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={closeTrailer} className="p-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/20 transition-colors" title="סגור נגן">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Iframe Container */}
              <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1&rel=0&modestbranding=0&controls=1`}
                  title={`${movieTitle} Trailer`}
                  className="w-full h-full border-0 relative z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Multi-video mini stepper & Booking Bar */}
              <div className="p-2.5 bg-neutral-950/85 border-t border-white/5 flex items-center justify-between gap-2">
                {videoList.length > 1 ? (
                  <div className="flex items-center gap-1 text-[11px] text-white/60">
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handlePrevVideo}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/70"
                      title="סרטון קודם"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-[10px]">{activeVideoIndex + 1}/{videoList.length}</span>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handleNextVideo}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/70"
                      title="סרטון הבא"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-white/50">חוויית צפייה בקולנוע</span>
                )}

                {movieId && (
                  <Link
                    href={`/movie/${movieId}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-black text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>הזמן כרטיסים</span>
                  </Link>
                )}
              </div>
            </AmbientGlowFrame>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingTrailerPlayer;

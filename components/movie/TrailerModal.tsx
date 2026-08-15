'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, PictureInPicture, Sparkles, Volume2, Share2, Ticket, Check } from 'lucide-react';
import Link from 'next/link';
import { VideoResult } from '@/lib/tmdb';
import { useTrailerStore } from '@/lib/store/trailer-store';

interface Props {
  videos: VideoResult[];
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  movieId?: number | string;
}

export default function TrailerModal({ videos, isOpen, onClose, movieTitle, movieId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = videos[activeIndex] || videos[0];
  const { openTrailer, spatialAudio, toggleSpatialAudio } = useTrailerStore();

  const handleSwitchToFloating = () => {
    if (current) {
      openTrailer({
        movieId: movieId ? String(movieId) : '',
        movieTitle,
        trailerKey: current.key,
        videoList: videos.map((v) => ({ id: v.id, key: v.key, name: v.name, type: v.type })),
      });
      onClose();
    }
  };

  const handleShare = async () => {
    if (!current) return;
    const url = `https://youtube.com/watch?v=${current.key}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `טריילר: ${movieTitle}`, url });
        return;
      } catch { /* Fallback */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          {/* Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Container - Grand Cinema Theater Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-7xl rounded-[2.5rem] overflow-hidden bg-neutral-950/98 border border-white/20 shadow-[0_40px_120px_rgba(0,0,0,0.98),0_0_80px_rgba(0,240,255,0.15)] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Radial Backlight Glow */}
            <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.04] border-b border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Film className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-white font-black text-lg sm:text-2xl font-outfit truncate tracking-tight">{movieTitle}</h3>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[11px] font-black border border-cyan-400/30">4K Ultra HD</span>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm truncate font-medium">{current.name || 'טריילר רשמי באיכות קולנועית'}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={toggleSpatialAudio}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    spatialAudio ? 'bg-purple-500/25 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                  title="שמע מרחבי תלת-ממדי"
                >
                  <Volume2 size={16} />
                  <span className="hidden md:inline">סאונד מרחבי</span>
                </button>
                <button
                  onClick={handleSwitchToFloating}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2 transition-all border border-white/15 hover:border-cyan-400/40 shadow-sm"
                  title="עבור לנגן צף והמשך לגלוש באתר"
                >
                  <PictureInPicture size={16} className="text-cyan-400" />
                  <span className="hidden sm:inline">נגן צף</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 border border-white/10 transition-all hover:scale-105"
                  title="שיתוף טריילר"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 border border-red-500/30 transition-all hover:scale-105 shadow-sm"
                  title="סגור"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Full-Bleed 16:9 Video Canvas */}
            <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${current.key}?autoplay=1&rel=0&modestbranding=0&controls=1&enablejsapi=1`}
                title={current.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 relative z-10"
              />
            </div>

            {/* Multi-Trailer Bar & Booking Footer */}
            <div className="p-4 sm:p-5 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Video Selector Tabs */}
              <div className="flex items-center gap-2.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-hide">
                {videos.map((v, i) => (
                  <button
                    key={v.id || i}
                    onClick={() => setActiveIndex(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                      i === activeIndex
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/50 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Sparkles size={14} className={i === activeIndex ? 'text-white' : 'text-cyan-400'} />
                    <span>{v.name || `טריילר ${i + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Instant Booking CTA */}
              {movieId && (
                <Link
                  href={`/movie/${movieId}`}
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-yellow to-primary text-black text-sm font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,184,0,0.4)] shrink-0"
                >
                  <Ticket size={18} className="text-black" />
                  <span>הזמן כרטיסים להקרנה</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


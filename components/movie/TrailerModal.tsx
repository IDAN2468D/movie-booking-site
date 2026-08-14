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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-6xl rounded-3xl overflow-hidden bg-neutral-950/95 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Radial Backlight Glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/25 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Header Bar */}
            <div className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-base sm:text-lg font-outfit truncate">{movieTitle}</h3>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-white/10 text-primary text-[10px] font-bold border border-primary/20">4K HDR</span>
                  </div>
                  <p className="text-white/50 text-xs truncate">{current.name || 'טריילר רשמי באיכות קולנועית'}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={toggleSpatialAudio}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    spatialAudio ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                  title="שמע מרחבי תלת-ממדי"
                >
                  <Volume2 size={14} />
                  <span className="hidden md:inline">סאונד מרחבי</span>
                </button>
                <button
                  onClick={handleSwitchToFloating}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all border border-white/15 hover:border-primary/40"
                  title="עבור לנגן צף והמשך לגלוש באתר"
                >
                  <PictureInPicture size={14} className="text-primary" />
                  <span className="hidden sm:inline">נגן צף</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 border border-white/10 transition-all hover:scale-105"
                  title="שיתוף טריילר"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 border border-red-500/30 transition-all hover:scale-105"
                  title="סגור"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Video Canvas */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${current.key}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={current.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Multi-Trailer Bar & Booking Footer */}
            <div className="p-3.5 sm:p-4 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Video Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-hide">
                {videos.map((v, i) => (
                  <button
                    key={v.id || i}
                    onClick={() => setActiveIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                      i === activeIndex
                        ? 'bg-primary text-black border-primary font-black shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Sparkles size={12} className={i === activeIndex ? 'text-black' : 'text-primary'} />
                    <span>{v.name || `טריילר ${i + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Instant Booking CTA */}
              {movieId && (
                <Link
                  href={`/movie/${movieId}`}
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary via-cyan-400 to-[#FF1464] text-black text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,242,254,0.35)] shrink-0"
                >
                  <Ticket size={15} />
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


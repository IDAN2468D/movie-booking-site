"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Share2, Calendar, Film, PictureInPicture, Sparkles } from "lucide-react";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
import { useTrailerStore } from "@/lib/store/trailer-store";
import { TrailerAudioCompanion } from "./TrailerAudioCompanion";
import { TrailerTriviaOverlay } from "./TrailerTriviaOverlay";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string | null;
  movie?: UpcomingMovie | null;
}

export function TrailerModal({ isOpen, onClose, trailerKey, movie }: TrailerModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const handleSwitchToFloating = () => {
    if (trailerKey) {
      openTrailer({
        movieId: movie?.movieId ? String(movie.movieId) : "",
        movieTitle: movie?.title || "טריילר קולנועי",
        trailerKey,
      });
      onClose();
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share && movie) {
      try {
        await navigator.share({
          title: `טריילר: ${movie.title}`,
          text: `צפו בטריילר לסרט בקרוב: ${movie.title}`,
          url: shareUrl,
        });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleSaveToCalendar = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!isOpen || !trailerKey) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/92 backdrop-blur-3xl"
          onClick={onClose}
        />

        {/* Modal Stage - Grand Cinema Theater Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-7xl rounded-[2.5rem] overflow-hidden bg-neutral-950/98 border border-white/20 shadow-[0_40px_120px_rgba(0,0,0,0.98),0_0_80px_rgba(0,240,255,0.15)] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dynamic Radial Ambient Aura */}
          <div className="absolute -top-36 -left-36 w-[32rem] h-[32rem] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute -bottom-36 -right-36 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* Header Bar */}
          <div className="relative z-10 px-6 py-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Film className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-outfit text-lg sm:text-2xl font-extrabold text-white truncate tracking-tight">
                    {movie ? movie.title : "טריילר רשמי"}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[11px] font-black border border-cyan-400/30">
                    <Sparkles className="w-3 h-3" /> 4K Ultra HD
                  </span>
                </div>
                {movie?.releaseDate && (
                  <span className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-0.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    יוצא לאקרנים: {new Date(movie.releaseDate).toLocaleDateString("he-IL")}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              <TrailerAudioCompanion />

              <button
                onClick={handleSwitchToFloating}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400/50 rounded-xl flex items-center gap-2 text-white text-xs font-bold transition-all shadow-sm"
                title="עבור לנגן צף"
              >
                <PictureInPicture className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">נגן צף</span>
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-white/80 transition-all hover:scale-105"
                title="שיתוף טריילר"
              >
                <Share2 className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                title="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full-Bleed 16:9 Video Canvas */}
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=0&rel=0&enablejsapi=1`}
              title={movie?.title || "YouTube trailer player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 relative z-10"
            />
          </div>

          {/* Footer Bar */}
          <div className="relative z-10 px-6 py-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 max-w-xl hidden sm:block font-medium">
              {movie?.overview || "צפו בהצצה בלעדית לסרט שעומד לצאת בקרוב בבתי הקולנוע של CinePulse."}
            </p>

            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              {showShareToast && (
                <span className="text-xs text-cyan-400 font-bold animate-pulse">קישור הועתק ללוח!</span>
              )}

              <button
                onClick={handleSaveToCalendar}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  isSaved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                }`}
              >
                <Bell className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "נשמר ביומן ✓" : "הזכר לי ביומן"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

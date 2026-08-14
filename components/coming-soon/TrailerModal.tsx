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

        {/* Modal Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden bg-neutral-950/95 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dynamic Radial Ambient Aura */}
          <div className="absolute -top-36 -left-36 w-96 h-96 bg-cyan-500/25 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Header Bar */}
          <div className="relative z-10 px-5 sm:px-6 py-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-outfit text-base sm:text-xl font-extrabold text-white truncate">
                    {movie ? movie.title : "טריילר רשמי"}
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                    <Sparkles className="w-2.5 h-2.5" /> 4K Ultra HD
                  </span>
                </div>
                {movie?.releaseDate && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    יוצא לאקרנים: {new Date(movie.releaseDate).toLocaleDateString("he-IL")}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <TrailerAudioCompanion />

              <button
                onClick={handleSwitchToFloating}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400/50 rounded-xl flex items-center gap-1.5 text-white/90 hover:text-white transition-all text-xs font-bold"
                title="עבור לנגן צף"
              >
                <PictureInPicture className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">נגן צף</span>
              </button>

              <button
                onClick={handleShare}
                className="w-9 h-9 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-white/80 transition-all hover:scale-105"
                title="שיתוף טריילר"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                title="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 16:9 Video Canvas */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
              title={movie?.title || "YouTube trailer player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 relative z-10"
            />

            {/* AI Trivia Overlay */}
            {movie?.title && <TrailerTriviaOverlay movieTitle={movie.title} isOpen={isOpen} />}
          </div>

          {/* Footer Bar */}
          <div className="relative z-10 px-5 sm:px-6 py-3.5 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-400 line-clamp-1 max-w-lg hidden sm:block">
              {movie?.overview || "צפו בהצצה בלעדית לסרט שעומד לצאת בקרוב בבתי הקולנוע של CinePulse."}
            </p>

            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              {showShareToast && (
                <span className="text-xs text-cyan-400 font-medium animate-pulse">קישור הועתק ללוח!</span>
              )}

              <button
                onClick={handleSaveToCalendar}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 hover:brightness-125 border border-cyan-400/30"
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "נשמר ביומן ✓" : "הזכר לי ביומן"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

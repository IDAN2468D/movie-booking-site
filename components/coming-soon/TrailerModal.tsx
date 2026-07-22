"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Share2, Calendar, Film } from "lucide-react";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
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
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleSaveToCalendar = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && trailerKey && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="relative w-full max-w-5xl mx-auto mb-12 rounded-3xl overflow-hidden bg-neutral-950/90 border border-white/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col"
          dir="rtl"
        >
          {/* Dynamic Backlight Halo Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-primary/20 via-purple-600/15 to-cyan-500/20 blur-[80px] opacity-60 animate-pulse" />
          </div>

          {/* Header Bar */}
          <div className="relative z-10 px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-outfit text-lg sm:text-xl font-bold text-white truncate">
                  {movie ? movie.title : "טריילר רשמי"}
                </h2>
                {movie?.releaseDate && (
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    יוצא ב- {new Date(movie.releaseDate).toLocaleDateString('he-IL')}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <TrailerAudioCompanion />

              <button
                onClick={handleShare}
                className="w-9 h-9 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-white/80 transition-all hover:scale-105"
                title="שיתוף טריילר"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 bg-primary/80 hover:bg-primary text-white border border-primary/40 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_15px_rgba(255,20,100,0.5)]"
                title="סגור טריילר"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 16:9 Video Container */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              title={movie?.title || "YouTube trailer player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 relative z-10"
            />

            {/* AI Director Trivia Overlay */}
            {movie?.title && (
              <TrailerTriviaOverlay movieTitle={movie.title} isOpen={isOpen} />
            )}
          </div>

          {/* Footer Bar */}
          <div className="relative z-10 px-6 py-3.5 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-white/50 line-clamp-1 max-w-md hidden sm:block">
              {movie?.overview || "צפו בהצצה בלעדית לסרט שעומד לצאת בקרוב בבתי הקולנוע."}
            </p>

            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              {showShareToast && (
                <span className="text-xs text-cyan-400 font-medium animate-pulse">
                  קישור הועתק ללוח!
                </span>
              )}

              <button
                onClick={handleSaveToCalendar}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "נשמר בהצלחה!" : "הזכר לי ביומן"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

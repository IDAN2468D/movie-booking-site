"use client";

import React, { useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Trophy } from "lucide-react";
import { useRatingStore } from "@/lib/store/ratingStore";
import { submitRatingAction } from "@/app/actions/ratingActions";
import RatingStarField from "./RatingStarField";

export default function RatingRitual() {
  const isOpen = useRatingStore((s) => s.isRatingOpen);
  const movieTitle = useRatingStore((s) => s.movieTitle);
  const posterUrl = useRatingStore((s) => s.posterUrl);
  const movieId = useRatingStore((s) => s.movieId);
  const currentRating = useRatingStore((s) => s.currentRating);
  const submitted = useRatingStore((s) => s.submitted);
  const pointsAwarded = useRatingStore((s) => s.pointsAwarded);
  const setRating = useRatingStore((s) => s.setRating);
  const markSubmitted = useRatingStore((s) => s.markSubmitted);
  const closeRating = useRatingStore((s) => s.closeRating);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(() => {
    if (!movieId || currentRating === 0) return;
    startTransition(async () => {
      const result = await submitRatingAction({
        userId: "demo-user",
        movieId,
        rating: currentRating,
      });
      if (result.success && result.data) {
        markSubmitted(result.data.pointsAwarded);
        // Auto-close after celebration
        setTimeout(() => closeRating(), 3500);
      }
    });
  }, [movieId, currentRating, markSubmitted, closeRating]);

  const playSubBassDrop = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Sub-bass failed:", e);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={closeRating}
        >
          {/* Cinematic blurred poster backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
              filter: "blur(60px) brightness(0.25) saturate(1.5)",
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Main Glass Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 130, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-4 p-8 rounded-3xl
              backdrop-blur-3xl saturate-[250%] brightness-105
              bg-neutral-950/40 border border-white/[0.12]
              text-center overflow-hidden"
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeRating}
              className="absolute top-4 right-4 text-white/40
                hover:text-white transition-colors p-1 z-10"
            >
              <X size={18} />
            </button>

            {/* Gold radial ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  currentRating >= 4
                    ? "radial-gradient(circle at center, rgba(234,179,8,0.12) 0%, transparent 70%)"
                    : "none",
              }}
            />

            {!submitted ? (
              <>
                {/* Title */}
                <h2
                  className="text-xl font-bold text-white tracking-tight
                    mb-1 font-[Outfit]"
                  dir="rtl"
                >
                  איך היה הסרט?
                </h2>
                <p
                  className="text-sm text-white/50 font-[Inter] mb-6 leading-relaxed"
                  dir="rtl"
                >
                  {movieTitle}
                </p>

                {/* Star Field */}
                <div className="mb-8">
                  <RatingStarField
                    currentRating={currentRating}
                    onRate={(r) => {
                      setRating(r);
                      if (r === 5) playSubBassDrop();
                    }}
                    disabled={isPending}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={currentRating === 0 || isPending}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 rounded-xl font-[Outfit] font-bold
                    text-sm tracking-wide transition-all
                    disabled:opacity-30 disabled:cursor-not-allowed
                    border border-white/10"
                  style={{
                    background:
                      currentRating > 0
                        ? "rgba(234, 179, 8, 0.15)"
                        : "rgba(255,255,255,0.05)",
                    color:
                      currentRating > 0
                        ? "#facc15"
                        : "rgba(255,255,255,0.3)",
                  }}
                  dir="rtl"
                >
                  {isPending ? "שומר..." : "שלח דירוג"}
                </motion.button>
              </>
            ) : (
              /* ── Success Celebration ── */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full
                    bg-yellow-500/10 border border-yellow-500/20
                    flex items-center justify-center"
                >
                  <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />
                </div>
                <h2
                  className="text-lg font-bold text-white font-[Outfit] mb-1
                    flex items-center justify-center gap-2"
                  dir="rtl"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  תודה על הדירוג!
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h2>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black text-yellow-400 font-[Outfit]"
                >
                  +{pointsAwarded} נקודות
                </motion.p>
                <p
                  className="text-xs text-white/40 mt-2 font-[Inter]"
                  dir="rtl"
                >
                  נוספו לחשבון הנאמנות שלך
                </p>
              </motion.div>
            )}

            {/* Bottom sparkle particles */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 opacity-40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    animationDelay: `${i * 0.25}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

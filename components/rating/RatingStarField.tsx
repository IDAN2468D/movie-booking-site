"use client";

import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingStarFieldProps {
  currentRating: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
}

// Musical notes: C4 → E4 → G4 → C5 → E5
const STAR_FREQUENCIES = [261.63, 329.63, 392.0, 523.25, 659.25];
const VIBRATION_PATTERNS = [
  [30],
  [40, 20, 40],
  [50, 20, 50],
  [60, 20, 60, 20, 60],
  [80, 30, 80, 30, 80, 30, 120],
];

export default function RatingStarField({
  currentRating,
  onRate,
  disabled = false,
}: RatingStarFieldProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playStarNote = useCallback((starIndex: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(STAR_FREQUENCIES[starIndex], ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  }, []);

  const triggerHaptic = useCallback((starIndex: number) => {
    if (navigator.vibrate) {
      navigator.vibrate(VIBRATION_PATTERNS[starIndex]);
    }
  }, []);

  const handleStarTap = useCallback(
    (index: number) => {
      if (disabled) return;
      const rating = index + 1;
      onRate(rating);
      playStarNote(index);
      triggerHaptic(index);
    },
    [disabled, onRate, playStarNote, triggerHaptic]
  );

  return (
    <div className="flex items-center justify-center gap-3" dir="ltr">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < currentRating;
        return (
          <motion.button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => handleStarTap(i)}
            whileTap={{ scale: 1.4 }}
            animate={{
              scale: isFilled ? [1, 1.25, 1] : 1,
              opacity: isFilled ? 1 : 0.4,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative w-14 h-14 flex items-center justify-center
              rounded-xl backdrop-blur-xl
              border border-white/10
              disabled:cursor-not-allowed
              focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50"
            style={{
              background: isFilled
                ? "rgba(234, 179, 8, 0.15)"
                : "rgba(255, 255, 255, 0.03)",
              boxShadow: isFilled
                ? "0 0 20px rgba(234, 179, 8, 0.3), inset 0 0 0 1px rgba(234, 179, 8, 0.2)"
                : "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
          >
            <Star
              size={28}
              className={`transition-colors duration-200 ${
                isFilled
                  ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                  : "text-white/30"
              }`}
            />
            {/* Micro-particle burst on fill */}
            {isFilled && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-xl
                  border border-yellow-400/30 pointer-events-none"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

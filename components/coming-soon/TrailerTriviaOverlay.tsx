"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, EyeOff } from "lucide-react";
import { generateTrailerTriviaAction } from "@/app/actions/trailerTriviaActions";
import { TrailerTriviaItem } from "@/lib/validations/trivia";

interface TrailerTriviaOverlayProps {
  movieTitle: string;
  isOpen: boolean;
}

export function TrailerTriviaOverlay({ movieTitle, isOpen }: TrailerTriviaOverlayProps) {
  const [triviaList, setTriviaList] = useState<TrailerTriviaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isOpen || !movieTitle) return;

    let isMounted = true;
    setLoading(true);

    generateTrailerTriviaAction(movieTitle)
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setTriviaList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load trailer trivia:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movieTitle, isOpen]);

  // Rotate trivia every 7 seconds
  useEffect(() => {
    if (triviaList.length <= 1 || hidden) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % triviaList.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [triviaList, hidden]);

  if (!isOpen || hidden) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4 sm:left-6 sm:right-auto z-30 max-w-sm pointer-events-auto">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-2xl text-xs text-white/70"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>מייצר תובנות במאי ב-AI...</span>
          </motion.div>
        ) : triviaList.length > 0 ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-neutral-950/80 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] text-right"
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold text-primary font-outfit">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                תובנת במאי (#{currentIndex + 1})
              </span>
              <button
                onClick={() => setHidden(true)}
                className="text-white/40 hover:text-white transition-colors"
                title="הסתר תובנות"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-inter">
              {triviaList[currentIndex].text}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

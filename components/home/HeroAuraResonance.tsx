"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeroAuraModal } from "./HeroAuraModal";

interface HeroAuraResonanceProps {
  movieTitle?: string;
  movieId?: number | string;
}

export default function HeroAuraResonance({
  movieTitle = "Dune: Part Two",
  movieId = 101,
}: HeroAuraResonanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playSubBassPulse = () => {
    // 1. Device Haptics
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // Fallback
      }
    }

    // 2. Multi-oscillator Web Audio API Pulse (Audible on all speakers)
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary Sub-bass Oscillator (55Hz -> 110Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.4);

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.exponentialRampToValueAtTime(0.4, now + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      // Harmonic Warmth Oscillator (110Hz -> 220Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110, now);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 0.4);

      gain2.gain.setValueAtTime(0.01, now);
      gain2.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.6);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } catch {
      // Graceful fallback
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    playSubBassPulse();
  };

  return (
    <>
      <div className="w-full max-w-[1600px] mx-auto px-4 mt-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-3xl p-4 md:p-6 bg-neutral-950/60 backdrop-blur-[40px] saturate-[250%] brightness-105 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden"
          dir="rtl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-primary/15 to-purple-600/10 opacity-70 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10 text-right">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,20,100,0.3)]">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary/50 opacity-75" />
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h4 className="text-lg font-bold font-['Outfit'] text-white">
                סורק הילת סרטים נוירונית (AI Aura Scanner)
              </h4>
              <p className="text-xs text-neutral-400 font-['Inter']">
                גלה את התהודה האקוסטית והעוצמה הרגשית של הסרט {movieTitle}
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleOpenModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-primary to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-[0_10px_30px_rgba(255,20,100,0.3)] transition-all flex items-center gap-2 shrink-0 border border-white/20"
          >
            <span>הפעל סריקה נוירונית ⚡</span>
          </motion.button>
        </motion.div>
      </div>

      {isModalOpen && (
        <HeroAuraModal
          movieTitle={movieTitle}
          movieId={movieId}
          onClose={() => setIsModalOpen(false)}
          onSubBassTrigger={playSubBassPulse}
        />
      )}
    </>
  );
}

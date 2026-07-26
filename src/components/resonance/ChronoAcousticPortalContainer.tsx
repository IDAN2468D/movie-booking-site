"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { actionGetChronoPresets } from "@/lib/actions/chrono-portal-actions";

type Decade = "1920s" | "1970s" | "1990s" | "2090s";

export function ChronoAcousticPortalContainer() {
  const [selectedDecade, setSelectedDecade] = useState<Decade>("2090s");
  const [statusText, setStatusText] = useState<string>("מוכן לשיגור זמני קולי");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const decadeColors: Record<Decade, string> = {
    "1920s": "from-amber-700/40 to-yellow-900/40 border-amber-500/40",
    "1970s": "from-orange-600/40 to-red-900/40 border-orange-500/40",
    "1990s": "from-cyan-600/40 to-blue-900/40 border-cyan-500/40",
    "2090s": "from-purple-600/40 to-fuchsia-900/40 border-purple-500/40",
  };

  const playDecadeSound = async (decade: Decade) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      if (decade === "1920s") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
      } else if (decade === "1970s") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.setValueAtTime(320, ctx.currentTime);
      } else if (decade === "1990s") {
        filter.type = "highpass";
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(150, ctx.currentTime);
        osc.type = "sine";
        osc.frequency.setValueAtTime(38, ctx.currentTime); // 38Hz sub-bass
      }

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1000);

      const res = await actionGetChronoPresets({
        decade,
        cutoffFrequency: filter.frequency.value,
        resonanceGain: 12,
        subBassTriggered: decade === "2090s",
      });

      if (res.success && res.data) {
        setStatusText(`${res.data.preset.title}: ${res.data.preset.description}`);
      }
    } catch {
      setStatusText("שגיאה בהפעלת תדר זמני");
    }
  };

  const handleSelect = (decade: Decade) => {
    setSelectedDecade(decade);
    playDecadeSound(decade);
  };

  return (
    <div dir="rtl" className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-white font-['Outfit']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          ⏳ פורטל מסע בזמן קולי-חזותי
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-mono border ${decadeColors[selectedDecade]}`}>
          {selectedDecade}
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-6 font-['Inter']">
        בחר עשור סאונד כדי לעבד את הפסקול והאווירה הציבורית בעזרת מסנני תדרים ופורטל תת-בס 38Hz.
      </p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["1920s", "1970s", "1990s", "2090s"] as Decade[]).map((dec) => (
          <motion.button
            key={dec}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(dec)}
            className={`py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
              selectedDecade === dec
                ? "bg-gradient-to-b from-white/20 to-white/5 border-white/40 shadow-lg shadow-purple-500/20"
                : "bg-white/5 border-white/10 hover:border-white/20 text-neutral-300"
            }`}
          >
            {dec}
          </motion.button>
        ))}
      </div>

      <motion.div
        animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.5 }}
        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center font-['Inter'] text-sm text-neutral-200"
      >
        {statusText}
      </motion.div>
    </div>
  );
}

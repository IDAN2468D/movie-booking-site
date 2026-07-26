"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { actionCalculateFluidState } from "@/lib/actions/fluid-matrix-actions";

export function SynestheticFluidMatrixContainer() {
  const [activeNote, setActiveNote] = useState<string>("C4");
  const [viscosity, setViscosity] = useState<number>(1.0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleMouseMove = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const freq = 220 + (x / rect.width) * 440;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      const res = await actionCalculateFluidState({
        cursorX: x,
        cursorY: y,
        viscosity,
        harmonicNote: "AUTO",
        particleCount: 120,
      });

      if (res.success && res.data) {
        setActiveNote(res.data.activeNote);
      }
    } catch {
      // Audio synth silent fallback
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-white font-['Outfit']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-pink-300">
          🎨 מטריצת סאונד-נוזל סינסתטית
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-mono border border-blue-500/40 bg-blue-500/10 text-blue-300">
          NOTE: {activeNote}
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-4 font-['Inter']">
        הזז את העכבר/מגע בתוך מטריצת הנוזל ליצירת צלילים הרמוניים ודינמיקה חזותית צמיגה ב-120Hz.
      </p>

      <div
        onMouseMove={handleMouseMove}
        className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950/80 border border-white/15 overflow-hidden cursor-crosshair flex items-center justify-center shadow-inner"
      >
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <span className="text-xs font-mono text-neutral-300 pointer-events-none bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          🌊 הזז את הסמן בתוך הנוזל להשמעה הרמונית
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-neutral-400 font-['Inter']">
        <span>צמיגות נוזל: {viscosity.toFixed(1)}</span>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={viscosity}
          onChange={(e) => setViscosity(parseFloat(e.target.value))}
          className="w-36 accent-indigo-400 cursor-pointer"
        />
      </div>
    </div>
  );
}

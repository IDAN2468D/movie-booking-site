"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Sparkles, Sliders } from "lucide-react";

export type AudioMode = "standard" | "dialogue" | "subbass";

interface TrailerAudioCompanionProps {
  onModeChange?: (mode: AudioMode) => void;
}

export function TrailerAudioCompanion({ onModeChange }: TrailerAudioCompanionProps) {
  const [activeMode, setActiveMode] = useState<AudioMode>("standard");
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBassSurgeEffect = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      // Fallback silently if Web Audio blocked by browser policy
    }
  };

  const handleSelectMode = (mode: AudioMode) => {
    setActiveMode(mode);
    if (mode === "subbass") {
      playBassSurgeEffect();
    }
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  useEffect(() => {
    // Clean up AudioContext on unmount
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
      <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono pl-1 border-l border-white/10">
        <Sliders className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="hidden sm:inline">סאונד:</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handleSelectMode("standard")}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
            activeMode === "standard"
              ? "bg-white/20 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          רגיל
        </button>

        <button
          onClick={() => handleSelectMode("dialogue")}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
            activeMode === "dialogue"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              : "text-white/60 hover:text-cyan-400 hover:bg-white/5"
          }`}
        >
          <Volume2 className="w-3 h-3" />
          דיאלוג
        </button>

        <button
          onClick={() => handleSelectMode("subbass")}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
            activeMode === "subbass"
              ? "bg-primary/30 text-primary border border-primary/40 shadow-[0_0_15px_rgba(255,20,100,0.5)]"
              : "text-white/60 hover:text-primary hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-3 h-3 text-primary animate-spin" />
          בס 40Hz
        </button>
      </div>

      {/* Animated Equalizer Visualizer Bars */}
      <div className="flex items-end gap-0.5 h-3.5 ml-1">
        <div className={`w-0.5 bg-primary rounded-full transition-all duration-300 ${activeMode === "subbass" ? "h-3 animate-bounce" : "h-1.5"}`} />
        <div className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${activeMode === "dialogue" ? "h-3.5 animate-pulse" : "h-2"}`} />
        <div className={`w-0.5 bg-purple-400 rounded-full transition-all duration-300 ${activeMode === "subbass" ? "h-2.5 animate-bounce" : "h-1"}`} />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Lock, ShieldCheck } from "lucide-react";

interface BiometricHoloScannerProps {
  onAuthenticated: () => void;
  isUnlocked: boolean;
}

export function BiometricHoloScanner({ onAuthenticated, isUnlocked }: BiometricHoloScannerProps) {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playHeartbeatSound = () => {
    // 1. Device Haptics
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // Fallback
      }
    }

    // 2. Web Audio Heartbeat Sub-Bass Pulse
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(50, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.4, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  };

  const handleMouseDown = () => {
    if (isUnlocked) return;
    setIsPressing(true);
    playHeartbeatSound();

    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(intervalRef.current!);
        setIsPressing(false);
        onAuthenticated();
      }
    }, 120);
  };

  const handleMouseUp = () => {
    if (isUnlocked) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPressing(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center my-4" dir="rtl">
      {isUnlocked ? (
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <ShieldCheck className="w-4 h-4" />
          <span>אימות ביומטרי מאושר — כרטיס פתוח</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <motion.button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              whileTap={{ scale: 0.95 }}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center border transition-all ${
                isPressing
                  ? "bg-violet-600/40 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.8)] scale-105"
                  : "bg-white/10 border-white/20 hover:bg-white/20 shadow-xl"
              }`}
            >
              {/* Radial Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#a78bfa"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * progress) / 100}
                  className="transition-all duration-100"
                />
              </svg>

              <Fingerprint className={`w-8 h-8 ${isPressing ? "text-violet-300 animate-pulse" : "text-white"}`} />
            </motion.button>
          </div>

          <p className="text-[11px] font-['Inter'] text-neutral-300 flex items-center gap-1.5 font-semibold">
            <Lock className="w-3 h-3 text-violet-400" />
            <span>לחץ והחזק 1.5 שניות לאימות ביומטרי ופתיחת הכרטיס</span>
          </p>
        </div>
      )}
    </div>
  );
}

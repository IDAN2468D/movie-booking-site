"use client";

import { useRef, useCallback } from "react";

export function useSeatHaptics() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const triggerSeatHapticPulse = useCallback(
    (panValue: number = 0, frequency: number = 40, durationMs: number = 250) => {
      // 1. Physical Device Haptics (Vibration API)
      if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
        try {
          navigator.vibrate([35, 40, 25]);
        } catch {
          // Graceful fallback if forbidden by user gesture rules
        }
      }

      // 2. Web Audio Sub-Bass Oscillator & Stereo Spatializer
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner
          ? ctx.createStereoPanner()
          : null;

        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        // Exponential pitch drop for tactile sub-bass feel
        osc.frequency.exponentialRampToValueAtTime(
          30,
          ctx.currentTime + durationMs / 1000
        );

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + durationMs / 1000
        );

        if (panner) {
          panner.pan.setValueAtTime(Math.min(1, Math.max(-1, panValue)), ctx.currentTime);
          osc.connect(panner);
          panner.connect(gain);
        } else {
          osc.connect(gain);
        }

        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durationMs / 1000);
      } catch {
        // Fallback for non-supported audio contexts
      }
    },
    [getAudioContext]
  );

  return { triggerSeatHapticPulse };
}

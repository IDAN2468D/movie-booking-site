"use client";

import { useEffect, useRef, useCallback } from "react";

export function useSubBass() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext lazily on first interaction or mount if allowed
    const initCtx = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Try to init, if auto-play blocks it, we catch and ignore till interaction
    try { initCtx(); } catch (e) { console.warn("AudioContext deferred until interaction", e); }

    const handleInteraction = () => initCtx();
    window.addEventListener('pointerdown', handleInteraction, { once: true });

    return () => {
      // Explicit cleanup to prevent severe browser memory leaks across page switches
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
      audioCtxRef.current = null;
      window.removeEventListener('pointerdown', handleInteraction);
    };
  }, []);

  const triggerSubBass = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    // Resume context if suspended by browser autoplay policy
    if (ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(40, ctx.currentTime); // Deep 40Hz sub-bass
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05); // Rapid attack
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); // Extended release

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  return { triggerSubBass };
}

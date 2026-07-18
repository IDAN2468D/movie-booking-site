"use client";

import { useEffect, useRef, useCallback } from "react";

export function useSubBass() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize and resume AudioContext synchronously on interaction
    const initCtx = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(e => console.warn("AudioContext resume failed", e));
      }
    };

    try { initCtx(); } catch (e) { console.warn("AudioContext deferred until interaction", e); }

    const handleInteraction = () => initCtx();
    window.addEventListener('pointerdown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
      audioCtxRef.current = null;
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  const triggerSubBass = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const panner = ctx.createPanner();

    // Use triangle for richer harmonics so it's audible on small speakers
    osc.type = "triangle";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

    // BiquadFilter for sweeping sub-bass effect
    filter.type = "lowpass";
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);

    // Spatial PannerNode
    panner.panningModel = 'HRTF';
    if (panner.positionX) {
      panner.positionX.setValueAtTime(0, ctx.currentTime);
      panner.positionY.setValueAtTime(0, ctx.currentTime);
      panner.positionZ.setValueAtTime(1, ctx.currentTime);
    } else {
      panner.setPosition(0, 0, 1);
    }

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }, []);

  return { triggerSubBass };
}

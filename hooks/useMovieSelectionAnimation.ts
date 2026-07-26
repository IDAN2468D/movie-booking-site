'use client';

import { useState, useCallback, useRef } from 'react';

export function useMovieSelectionAnimation() {
  const [isActive, setIsActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSpatialAcousticDrop = useCallback(() => {
    try {
      const AudioCtxClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtxClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Sub-Bass Drop (38Hz -> 20Hz Exponential decay)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(38, now);
      subOsc.frequency.exponentialRampToValueAtTime(18, now + 0.8);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.85);

      // 2. Holographic High Shimmer (Filtered Sawtooth)
      const shimmerOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const shimmerGain = ctx.createGain();

      shimmerOsc.type = 'sawtooth';
      shimmerOsc.frequency.setValueAtTime(440, now);
      shimmerOsc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(4, now);

      shimmerGain.gain.setValueAtTime(0.08, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      shimmerOsc.connect(filter);
      filter.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmerOsc.start(now);
      shimmerOsc.stop(now + 0.4);
    } catch {
      // Audio playback fails gracefully if blocked by browser policy
    }
  }, []);

  const triggerAnimation = useCallback(() => {
    setIsActive(true);
    playSpatialAcousticDrop();
  }, [playSpatialAcousticDrop]);

  const resetAnimation = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    triggerAnimation,
    resetAnimation,
    playSpatialAcousticDrop,
  };
}

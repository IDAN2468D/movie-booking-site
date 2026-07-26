'use client';

import { useState, useCallback, useRef } from 'react';
import { AiMovieAnimationFrame } from '@/lib/validations/ai-movie-animation.schema';

export function useAiMovieAnimation() {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSpatialTone = useCallback(() => {
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio playback fails silently if user has not interacted
    }
  }, []);

  const nextFrame = useCallback((framesCount: number) => {
    setActiveFrameIndex(prev => (prev + 1) % framesCount);
    playSpatialTone();
  }, [playSpatialTone]);

  const prevFrame = useCallback((framesCount: number) => {
    setActiveFrameIndex(prev => (prev - 1 + framesCount) % framesCount);
    playSpatialTone();
  }, [playSpatialTone]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    activeFrameIndex,
    setActiveFrameIndex,
    isPlaying,
    togglePlay,
    nextFrame,
    prevFrame,
    playSpatialTone,
  };
}

'use client';

import { useRef, useCallback } from 'react';

export const useMultisensoryFeedback = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize the AudioContext strictly on the first user interaction (drag start)
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioContextRef.current) {
      // Use standard or webkit prefixed AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    // If it's suspended (browsers do this to save resources), resume it
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playDragPulse = useCallback(() => {
    // Ultra-short tactical pulse
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  }, []);

  const playDropRealization = useCallback(() => {
    // 1. Synthesize Procedural Web Audio Drop Tone (Zero-Asset)
    const ctx = audioContextRef.current;
    if (ctx) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      // Configure Oscillator (Mechanical drop pop)
      osc.type = 'triangle'; // Gives a slightly richer harmonic than sine
      
      // Pitch ramp: 350Hz down to 80Hz exponentially
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

      // Configure Low-Pass Filter to enrich bass and muffle high-end digital harshness
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 500;
      filterNode.Q.value = 1;

      // Configure Volume envelope (Quick attack, exponential decay)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      // Connect graph: Osc -> Filter -> Gain -> Destination
      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start and Stop
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }

    // 2. Hardware Haptic Feedback Pulse (Mechanical Double-Tap)
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([15, 30, 15]);
    }
  }, []);

  return { initAudio, playDragPulse, playDropRealization };
};

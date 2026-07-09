'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useAcousticDeck() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const atmosphericGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API safely
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtxRef.current = new AudioContextClass();
    const ctx = audioCtxRef.current;

    // Master Gain
    masterGainRef.current = ctx.createGain();
    masterGainRef.current.gain.value = 1.0;
    masterGainRef.current.connect(ctx.destination);

    // Biquad Filter for atmospheric dimming
    filterNodeRef.current = ctx.createBiquadFilter();
    filterNodeRef.current.type = 'lowpass';
    filterNodeRef.current.frequency.value = 20000; // Start fully open
    filterNodeRef.current.connect(masterGainRef.current);

    // Atmospheric Gain layer
    atmosphericGainRef.current = ctx.createGain();
    atmosphericGainRef.current.gain.value = 0.0;
    atmosphericGainRef.current.connect(filterNodeRef.current);

    return () => {
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  const triggerResonance = useCallback((type: 'like' | 'pass') => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);

    const now = ctx.currentTime;

    if (type === 'like') {
      // 40Hz sub-bass drop and harmonic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    } else {
      // Dissonant thud for pass
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }

    osc.start(now);
    osc.stop(now + 1.5);
  }, []);

  const setCrossfade = useCallback((intensity: number) => {
    // Intensity from 0 to 1 based on drag distance
    if (!audioCtxRef.current || !filterNodeRef.current || !atmosphericGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Muffle main audio by lowering cutoff frequency
    const minFreq = 500;
    const maxFreq = 20000;
    const currentFreq = maxFreq - (maxFreq - minFreq) * intensity;
    filterNodeRef.current.frequency.setTargetAtTime(currentFreq, ctx.currentTime, 0.1);

    // Increase atmospheric drone bleed
    atmosphericGainRef.current.gain.setTargetAtTime(intensity * 0.3, ctx.currentTime, 0.1);
  }, []);

  const resetCrossfade = useCallback(() => {
    if (!audioCtxRef.current || !filterNodeRef.current || !atmosphericGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    filterNodeRef.current.frequency.setTargetAtTime(20000, ctx.currentTime, 0.2);
    atmosphericGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
  }, []);

  return { triggerResonance, setCrossfade, resetCrossfade };
}

"use client";

import { useRef, useCallback } from "react";

export function useCheckoutResonance() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerResonance = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    
    // Create an oscillator for the 40Hz sub-bass
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8); // Drop from 60Hz to 30Hz

    // Create a filter to muffle it initially then open up
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);

    // Gain node for an impactful fade out
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    // Wire up: osc -> filter -> gain -> destination
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Add some noise (glass shatter approximation)
    const bufferSize = ctx.sampleRate * 1.5; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 3000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Start everything
    osc.start(ctx.currentTime);
    noise.start(ctx.currentTime);

    // Stop after 1.5s
    osc.stop(ctx.currentTime + 1.5);
    noise.stop(ctx.currentTime + 1.5);
  }, []);

  return { triggerResonance };
}

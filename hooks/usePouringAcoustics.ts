"use client";

import { useCallback } from "react";

// Shared AudioContext for the food physics
let pouringAudioCtx: AudioContext | null = null;

export function usePouringAcoustics() {
  const initAudio = useCallback(() => {
    if (typeof window !== "undefined" && !pouringAudioCtx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        pouringAudioCtx = new AudioContextClass();
      }
    }
  }, []);

  const unlockAudio = useCallback(async () => {
    initAudio();
    if (pouringAudioCtx && pouringAudioCtx.state === "suspended") {
      try {
        await pouringAudioCtx.resume();
        console.log("[usePouringAcoustics] AudioContext successfully unlocked on drag start.");
      } catch (e) {
        console.warn("[usePouringAcoustics] Failed to unlock AudioContext:", e);
      }
    }
  }, [initAudio]);

  const playPouringSound = useCallback(async () => {
    initAudio();
    if (!pouringAudioCtx) return;
    const ctx = pouringAudioCtx;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      console.log(`[usePouringAcoustics] AudioContext state: ${ctx.state}`);

      const now = ctx.currentTime;

      // 1. Foolproof Tone (Pitch Sweep) to guarantee we hear something
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 1.5);
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.5);

      // 2. White Noise (Fizz)
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass"; 
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(8000, now + 1.5);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1.0, now + 0.1);
      gainNode.gain.setValueAtTime(1.0, now + 1.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 3.0);
      
      console.log("[usePouringAcoustics] Sound triggered successfully");
    } catch (e) {
      console.warn("[usePouringAcoustics] Error playing pouring sound:", e);
    }
  }, [initAudio]);

  return { playPouringSound, unlockAudio };
}

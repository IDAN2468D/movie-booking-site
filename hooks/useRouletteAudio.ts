'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useRef, useCallback } from 'react';

export function useRouletteAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const initialized = useRef(false);

  const initAudio = useCallback(() => {
    if (!initialized.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
        initialized.current = true;
      }
    }
  }, []);

  const playTick = useCallback((row: number, col: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panner = ctx.createPanner();

    // Configure Panner for Spatial tracking
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;

    // Map col (0-5) to X axis (-2 to 2)
    const xPos = ((col / 5) * 4) - 2;
    // Map row (0-7) to Z axis (1 to 5 depth)
    const zPos = -((row / 7) * 4) - 1;
    
    panner.positionX.setValueAtTime(xPos, t);
    panner.positionY.setValueAtTime(0, t);
    panner.positionZ.setValueAtTime(zPos, t);

    // Short, sharp "click" simulating acoustic mechanical turn
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

    gainNode.gain.setValueAtTime(0.3, t);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }, []);

  const playResolutionDrop = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Immersive sub-bass drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.3); // Drop to 40Hz sub frequency

    // Filter for warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);

    // Envelope
    gainNode.gain.setValueAtTime(0.8, t);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 2.0);
  }, []);

  return { initAudio, playTick, playResolutionDrop };
}

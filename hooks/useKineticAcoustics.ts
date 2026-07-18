import { useCallback, useRef } from 'react';

export const useKineticAcoustics = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playKineticFusionDrop = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    // 1. Oscillator for Sub-Bass (40Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // 2. Gain Node for Envelope (Attack, Decay, Sustain, Release)
    const gainNode = ctx.createGain();
    
    // 3. Panner Node for Spatialization (Centered, wide)
    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;

    // 4. Biquad Filter to shape the low end punch
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

    // Connections
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    // Pitch sweep (The "Drop")
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

    // Volume Envelope (Punchy attack, slow fade)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0); // Release

    // Play
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  }, []);

  return { playKineticFusionDrop };
};

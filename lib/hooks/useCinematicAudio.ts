import { useRef } from 'react';

export function useCinematicAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClick = () => {
    if (typeof window === 'undefined') return;

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Synthesize a premium low-frequency cinematic click/bass drop feedback
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn('Web Audio synthesis failed:', err);
    }
  };

  return { playClick };
}

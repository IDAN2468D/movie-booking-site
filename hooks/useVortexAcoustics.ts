import { useCallback, useRef, useEffect } from 'react';

export const useVortexAcoustics = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  const playSuctionRamp = useCallback((intensity: number) => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';

    const gainNode = ctx.createGain();
    
    const freq = 100 + (intensity * 400); 
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(Math.max(0.01, intensity * 0.1), ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  const playResolutionDrop = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    const gainNode = ctx.createGain();
    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.05); 
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

    osc.start();
    osc.stop(ctx.currentTime + 3.0);
  }, []);

  return { playSuctionRamp, playResolutionDrop };
};

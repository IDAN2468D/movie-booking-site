import { useRef, useCallback, useState } from 'react';

export const useAcousticWavefront = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isActive, setIsActive] = useState(false);

  const initEngine = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Create an algorithmic bass rumble
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 50; // Deep bass

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 35; // Sub bass

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // Slow pulse for trailer drama

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 50; // Modulate frequency

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0; // Start muted

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.8;

    // Routing
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(ctx.destination);

    // Start oscillators
    osc1.start();
    osc2.start();
    lfo.start();

    analyserRef.current = analyser;

    // Fade in
    mainGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 2);
    
    setIsActive(true);
  }, []);

  const stopEngine = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
      setIsActive(false);
    }
  }, []);

  return { initEngine, stopEngine, analyserRef, isActive };
};

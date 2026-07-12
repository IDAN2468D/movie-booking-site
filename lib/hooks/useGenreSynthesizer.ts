import { useRef } from 'react';

export function useGenreSynthesizer() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  const playSweep = (genre: string) => {
    if (typeof window === 'undefined') return;

    try {
      const ctx = initCtx();
      const now = ctx.currentTime;
      const mainGain = ctx.createGain();
      mainGain.connect(ctx.destination);

      const cleanGenre = genre.toLowerCase();

      if (cleanGenre.includes('sci-fi') || cleanGenre.includes('scifi') || cleanGenre.includes('science')) {
        // Sci-Fi: Low-to-high sawtooth sweep with lowpass filter sweep
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.4);

        filter.type = 'lowpass';
        filter.Q.value = 10;
        filter.frequency.setValueAtTime(150, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 0.4);

        mainGain.gain.setValueAtTime(0.4, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.4);

      } else if (cleanGenre.includes('horror') || cleanGenre.includes('thriller')) {
        // Horror: High-pitch beating minor-second tension cluster
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(780, now);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(815, now); // dissonance

        mainGain.gain.setValueAtTime(0.3, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(mainGain);
        osc2.connect(mainGain);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);

      } else if (cleanGenre.includes('action') || cleanGenre.includes('adventure')) {
        // Action: Sub-bass frequency drop (120Hz -> 30Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(120, now);
        osc1.frequency.linearRampToValueAtTime(30, now + 0.4);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(60, now);
        osc2.frequency.linearRampToValueAtTime(15, now + 0.4);

        mainGain.gain.setValueAtTime(0.5, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc1.connect(mainGain);
        osc2.connect(mainGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);

      } else if (cleanGenre.includes('drama')) {
        // Drama: Deep, intense low-frequency minor chord swell
        const notes = [146.83, 174.61, 220.00]; // D3, F3, A3 (D minor chord)
        notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          
          osc.type = 'sawtooth';
          osc.frequency.value = freq;
          
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, now);
          filter.frequency.linearRampToValueAtTime(800, now + 0.3);
          filter.frequency.exponentialRampToValueAtTime(300, now + 1.0);
          
          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(mainGain);
          
          osc.start(now);
          osc.stop(now + 1.0);
        });
      } else if (cleanGenre.includes('comedy') || cleanGenre.includes('romance')) {
        // Comedy/Romance: Bright square-wave major arpeggio cascade
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          
          osc.type = 'square';
          osc.frequency.value = freq;
          
          noteGain.gain.setValueAtTime(0.15, now + idx * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
          
          osc.connect(noteGain);
          noteGain.connect(mainGain);
          
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.15);
        });
      } else {
        // Default generic pop for unmapped bubbles (rating, runtime, etc.)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

        mainGain.gain.setValueAtTime(0.2, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (err) {
      console.warn('Audio Synthesis Sweep failed:', err);
    }
  };

  return { playSweep };
}

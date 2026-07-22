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

  const playSweep = (genreOrMood: string) => {
    if (typeof window === 'undefined') return;

    try {
      const ctx = initCtx();
      const now = ctx.currentTime;
      const mainGain = ctx.createGain();
      mainGain.connect(ctx.destination);

      const tag = genreOrMood.toLowerCase();

      if (tag.includes('adrenaline') || tag.includes('אדרנלין')) {
        // 🔥 Adrenaline: Rapid sub-bass drop & sharp high stutter
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

        mainGain.gain.setValueAtTime(0.5, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.35);

      } else if (tag.includes('mind') || tag.includes('מחשבה') || tag.includes('mystery') || tag.includes('מסתורין')) {
        // 🧠 Mind-bend / Mystery: FM LFO modulation pitch sweep
        const carrier = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(300, now);
        carrier.frequency.exponentialRampToValueAtTime(600, now + 0.5);

        modulator.type = 'sine';
        modulator.frequency.value = 15; // 15Hz vibrato
        modGain.gain.value = 40;

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        mainGain.gain.setValueAtTime(0.3, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        carrier.connect(mainGain);
        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + 0.5);
        modulator.stop(now + 0.5);

      } else if (tag.includes('fantasy') || tag.includes('פנטזיה') || tag.includes('animation') || tag.includes('אנימציה')) {
        // 🧙‍♂️ Fantasy / Animation: Ethereal crystalline arpeggio shimmer
        const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.12, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.25);
        });

      } else if (tag.includes('dark') || tag.includes('אפלה') || tag.includes('horror') || tag.includes('אימה')) {
        // 🌙 Dark / Horror: 40Hz sub-bass frequency drop & dissonance
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.6); // 40Hz sub-bass drop

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(147, now); // Dissonant minor second
        osc2.frequency.exponentialRampToValueAtTime(42, now + 0.6);

        mainGain.gain.setValueAtTime(0.4, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(mainGain);
        osc2.connect(mainGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);

      } else if (tag.includes('romantic') || tag.includes('רומנטיקה') || tag.includes('זוגי')) {
        // ✨ Romantic: Warm sine chord swell
        const freqs = [329.63, 415.30, 493.88]; // E4, G#4, B4
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now);
          osc.stop(now + 0.6);
        });

      } else if (tag.includes('top-rated') || tag.includes('מופת')) {
        // 🏆 Top Rated: Radiant victory chime chord
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.15, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.4);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.4);
        });

      } else if (tag.includes('action') || tag.includes('פעולה') || tag.includes('thriller') || tag.includes('מתח')) {
        // ⚡ Action / Thriller: Punchy low-end impact (120Hz -> 30Hz)
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.3);

        mainGain.gain.setValueAtTime(0.5, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.3);

      } else if (tag.includes('scifi') || tag.includes('מדע בדיוני')) {
        // 🚀 Sci-Fi: Sawtooth lowpass filter sweep
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.linearRampToValueAtTime(1400, now + 0.4);

        mainGain.gain.setValueAtTime(0.35, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.4);

      } else {
        // 🎵 Default category acoustic pop
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

        mainGain.gain.setValueAtTime(0.2, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (err) {
      console.warn('Audio Synthesis Sweep failed:', err);
    }
  };

  return { playSweep };
}

'use client';

import { useEffect, useCallback } from 'react';

// Shared global AudioContext singleton to avoid multiple contexts and browser limit issues.
let globalAudioCtx: AudioContext | null = null;

export function useAcousticFeedback() {
  const initAudio = useCallback(() => {
    if (typeof window !== 'undefined' && !globalAudioCtx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        try {
          globalAudioCtx = new AudioContextClass();
          console.log('[Acoustic Feedback] Shared AudioContext initialized successfully.');
        } catch (e) {
          console.error('[Acoustic Feedback] Failed to initialize AudioContext:', e);
        }
      }
    }
  }, []);

  // Global listener to pre-resume AudioContext on first user interaction.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGesture = () => {
      initAudio();
      if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume()
          .then(() => {
            console.log('[Acoustic Feedback] AudioContext resumed successfully on user gesture.');
          })
          .catch((err) => {
            console.warn('[Acoustic Feedback] Failed to resume AudioContext:', err);
          });
      }
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [initAudio]);

  const playTick = useCallback(() => {
    initAudio();
    if (!globalAudioCtx) {
      console.warn('[Acoustic Feedback] playTick ignored: AudioContext not initialized.');
      return;
    }
    const ctx = globalAudioCtx;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

      gainNode.gain.setValueAtTime(0.15, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
      console.log('[Acoustic Feedback] Played tick sound.');
    } catch (err) {
      console.warn('[Acoustic Feedback] Error playing tick:', err);
    }
  }, [initAudio]);

  const playBassDrop = useCallback(() => {
    initAudio();
    if (!globalAudioCtx) {
      console.warn('[Acoustic Feedback] playBassDrop ignored: AudioContext not initialized.');
      return;
    }
    const ctx = globalAudioCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // 150Hz down to 40Hz sub-bass frequency envelope
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, t);

      gainNode.gain.setValueAtTime(0.6, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.5);
      console.log('[Acoustic Feedback] Played sub-bass drop.');
    } catch (err) {
      console.warn('[Acoustic Feedback] Error playing bass drop:', err);
    }
  }, [initAudio]);

  return { initAudio, playTick, playBassDrop };
}

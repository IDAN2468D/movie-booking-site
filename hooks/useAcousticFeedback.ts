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

  const playSpatialClick = useCallback((seatId?: string, spatialConfig?: { x: number; y: number; z: number }) => {
    initAudio();
    if (!globalAudioCtx) {
      console.warn('[Acoustic Feedback] playSpatialClick ignored: AudioContext not initialized.');
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
      const panner = ctx.createPanner();

      // Configure Panner for Dolby Atmos spatial feeling
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 10000;
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 0;
      panner.coneOuterGain = 0;

      // Extract coordinates: explicit config takes precedence over seatId inference
      let x = 0;
      let y = 0;
      let z = 0;

      if (spatialConfig) {
        x = spatialConfig.x;
        y = spatialConfig.y;
        z = spatialConfig.z;
      } else if (seatId) {
        const row = seatId.charAt(0);
        const col = parseInt(seatId.slice(1), 10);
        
        // A=0 ... H=7
        const rowIndex = row.toUpperCase().charCodeAt(0) - 65; 
        
        // Map to 3D space: rows affect Z (depth), cols affect X (stereo pan)
        z = (rowIndex - 3.5) * 3; // Front rows are negative Z, back rows are positive
        x = (col - 3.5) * 4;      // Left seats are negative X, right seats are positive
      }

      panner.positionX.setValueAtTime(x, t);
      panner.positionY.setValueAtTime(y, t);
      panner.positionZ.setValueAtTime(z, t);

      // Low frequency premium click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, t);

      gainNode.gain.setValueAtTime(0.8, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
      console.log(`[Acoustic Feedback] Played spatial click for ${seatId || 'unknown'} at [x:${x}, y:${y}, z:${z}].`);
    } catch (err) {
      console.warn('[Acoustic Feedback] Error playing spatial click:', err);
    }
  }, [initAudio]);

  return { initAudio, playTick, playBassDrop, playSpatialClick };
}

import { useCallback } from 'react';

export function useVibrationPulse() {
  const triggerPulse = useCallback((pattern: number | number[] = [100, 50, 100]) => {
    // Check if the HTML5 Vibration API is supported and active
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        console.warn('Vibration API blocked or unavailable', err);
      }
    } else {
      // Fallback: Web Audio API 40Hz sub-bass ping for iOS devices
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        console.warn('Acoustic fallback failed', e);
      }
    }
  }, []);

  return { triggerPulse };
}

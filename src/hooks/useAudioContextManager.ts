'use client';

import { useEffect, useCallback } from 'react';
import { audioContextManager } from '@/lib/audio/audioContextManager';

export function useAudioContextManager() {
  useEffect(() => {
    // Schedule suspend when window/tab is hidden or inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioContextManager.scheduleAutoSuspend();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const playChime = useCallback((frequency?: number, duration?: number, type?: OscillatorType) => {
    return audioContextManager.playChime(frequency, duration, type);
  }, []);

  const playHapticBass = useCallback((frequency?: number, duration?: number) => {
    return audioContextManager.playHapticBass(frequency, duration);
  }, []);

  const resume = useCallback(() => {
    return audioContextManager.resume();
  }, []);

  return {
    playChime,
    playHapticBass,
    resume,
    audioManager: audioContextManager,
  };
}

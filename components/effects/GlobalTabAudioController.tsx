'use client';

import { useEffect } from 'react';

export function GlobalTabAudioController() {
  useEffect(() => {
    const handleInvisibility = () => {
      if (document.visibilityState === 'hidden') {
        // 1. Immediately cancel Web Speech Synthesis (TTS)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
          } catch (e) {
            console.warn('Speech cancellation error:', e);
          }
        }

        // 2. Pause and mute all active HTML5 audio and video elements
        try {
          const mediaElements = document.querySelectorAll<HTMLMediaElement>('audio, video');
          mediaElements.forEach((media) => {
            try {
              media.pause();
            } catch {}
          });
        } catch (e) {
          console.warn('Media pause error:', e);
        }
      }
    };

    document.addEventListener('visibilitychange', handleInvisibility);
    window.addEventListener('blur', handleInvisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleInvisibility);
      window.removeEventListener('blur', handleInvisibility);
    };
  }, []);

  return null;
}

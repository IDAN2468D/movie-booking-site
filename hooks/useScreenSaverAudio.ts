'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScreenSaverStore } from '@/lib/store/screenSaverStore';

// Relaxing Piano Ambient Melody URLs with fallback
const MELODY_TRACKS = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=relaxing-piano-10821.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
];

export function useScreenSaverAudio() {
  const isScreenSaverActive = useScreenSaverStore((state) => state.isScreenSaverActive);
  const soundEnabled = useScreenSaverStore((state) => state.soundEnabled);
  const soundVolume = useScreenSaverStore((state) => state.soundVolume);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSubBassDrop = useCallback(() => {
    // Soft interaction feedback
  }, []);

  useEffect(() => {
    if (!isScreenSaverActive || !soundEnabled || typeof window === 'undefined') {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {}
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      return;
    }

    let trackIndex = 0;

    const createAndPlayAudio = (index: number) => {
      if (trackIndex >= MELODY_TRACKS.length) return;

      const audio = new Audio(MELODY_TRACKS[index]);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Smooth fade-in melody
            let currentVol = 0;
            const maxVol = Math.min(soundVolume, 0.15); // Gentle volume ceiling
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

            fadeIntervalRef.current = setInterval(() => {
              if (audioRef.current && currentVol < maxVol) {
                currentVol += 0.005;
                audioRef.current.volume = Math.min(currentVol, maxVol);
              } else {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              }
            }, 100);
          })
          .catch(() => {
            // If track 0 fails, fallback to track 1
            if (index + 1 < MELODY_TRACKS.length) {
              trackIndex++;
              createAndPlayAudio(trackIndex);
            }
          });
      }
    };

    createAndPlayAudio(trackIndex);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {}
        audioRef.current = null;
      }
    };
  }, [isScreenSaverActive, soundEnabled, soundVolume]);

  return { playSubBassDrop };
}

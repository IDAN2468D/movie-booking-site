'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CommentarySegment } from '@/lib/schemas/directorsCut.schema';

export function useDirectorsCutAudio(segments: CommentarySegment[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync active segment with current timeline seconds
  useEffect(() => {
    if (!segments || segments.length === 0) return;
    const sorted = [...segments].sort((a, b) => a.timestampSec - b.timestampSec);
    let matched = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (currentSec >= sorted[i].timestampSec) {
        matched = i;
      }
    }
    setActiveSegmentIndex(matched);
  }, [currentSec, segments]);

  const speakSegment = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
    if (segments[activeSegmentIndex]) {
      speakSegment(segments[activeSegmentIndex].commentaryText);
    }
  }, [segments, activeSegmentIndex, speakSegment]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seekTo = useCallback(
    (seconds: number) => {
      setCurrentSec(seconds);
      const targetIndex = segments.findIndex((s) => s.timestampSec >= seconds);
      const chosen = targetIndex >= 0 ? targetIndex : 0;
      setActiveSegmentIndex(chosen);
      if (isPlaying && segments[chosen]) {
        speakSegment(segments[chosen].commentaryText);
      }
    },
    [segments, isPlaying, speakSegment]
  );

  // Progress timer loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSec((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return {
    isPlaying,
    currentSec,
    activeSegmentIndex,
    activeSegment: segments[activeSegmentIndex] || segments[0] || null,
    play,
    pause,
    togglePlay,
    seekTo,
  };
}

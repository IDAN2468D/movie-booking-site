'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WhisperChannel, WhisperEqPreset, WhisperTrackEngine } from '@/lib/audio/whisperTrackEngine';

export function useWhisperTrack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [channel, setChannel] = useState<WhisperChannel>('dialogue_boost');
  const [volume, setVolume] = useState<number>(0.85);
  const [latencyOffsetMs, setLatencyOffsetMs] = useState<number>(0);
  const [eqPreset, setEqPreset] = useState<WhisperEqPreset>('clear_voice');
  const engineRef = useRef<WhisperTrackEngine | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      engineRef.current = new WhisperTrackEngine();
    }
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    } else {
      engineRef.current.startSimulation(channel);
      engineRef.current.setVolume(volume);
      engineRef.current.setLatencyOffset(latencyOffsetMs);
      engineRef.current.setEqPreset(eqPreset);
      setIsPlaying(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 40, 30]);
    }
  }, [isPlaying, channel, volume, latencyOffsetMs, eqPreset]);

  const selectChannel = useCallback((newChannel: WhisperChannel) => {
    setChannel(newChannel);
    if (engineRef.current && isPlaying) {
      engineRef.current.startSimulation(newChannel);
      engineRef.current.setEqPreset(eqPreset);
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  }, [isPlaying, eqPreset]);

  const changeVolume = useCallback((newVol: number) => {
    setVolume(newVol);
    if (engineRef.current) {
      engineRef.current.setVolume(newVol);
    }
  }, []);

  const changeLatency = useCallback((offsetMs: number) => {
    setLatencyOffsetMs(offsetMs);
    if (engineRef.current) {
      engineRef.current.setLatencyOffset(offsetMs);
    }
  }, []);

  const changeEq = useCallback((newEq: WhisperEqPreset) => {
    setEqPreset(newEq);
    if (engineRef.current) {
      engineRef.current.setEqPreset(newEq);
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
  }, []);

  return {
    isPlaying,
    channel,
    volume,
    latencyOffsetMs,
    eqPreset,
    togglePlay,
    selectChannel,
    changeVolume,
    changeLatency,
    changeEq,
  };
}

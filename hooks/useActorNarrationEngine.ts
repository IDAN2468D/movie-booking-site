'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export function useActorNarrationEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);

  const cleanAudio = useCallback(() => {
    if (droneOscRef.current) {
      try {
        droneOscRef.current.stop();
        droneOscRef.current.disconnect();
      } catch {}
      droneOscRef.current = null;
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
      audioCtxRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => cleanAudio();
  }, [cleanAudio]);

  const playAcousticBackdrop = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const t = ctx.currentTime;
      // 40Hz Sub-Bass Drop
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(120, t);
      bassOsc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
      bassGain.gain.setValueAtTime(0.3, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(t);
      bassOsc.stop(t + 0.6);

      // 432Hz Ambient Drone
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(432, t);
      droneGain.gain.setValueAtTime(0.001, t);
      droneGain.gain.linearRampToValueAtTime(0.04, t + 1.0);
      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start(t);
      droneOscRef.current = droneOsc;
    } catch {}
  }, []);

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      playAcousticBackdrop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'he' ? 'he-IL' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        cleanAudio();
        if (onEnd) onEnd();
      };
      utterance.onerror = () => cleanAudio();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch {
      cleanAudio();
    }
  }, [lang, playAcousticBackdrop, cleanAudio]);

  return {
    isPlaying,
    lang,
    setLang,
    speakText,
    stopNarration: cleanAudio,
  };
}

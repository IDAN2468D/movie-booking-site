'use client';

import { useState, useRef, useCallback } from 'react';
import { SeatAcousticProfile } from '@/lib/schemas/acousticSweetspot.schema';

export function useWebAudioSpatializer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState(440);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const subBassRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<PannerNode | StereoPannerNode | null>(null);

  const stopAudio = useCallback(() => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (subBassRef.current) {
        subBassRef.current.stop();
        subBassRef.current.disconnect();
        subBassRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    } catch {
      // Audio cleanup error ignore
    }
    setIsPlaying(false);
  }, []);

  const playSpatialTone = useCallback((profile: SeatAcousticProfile) => {
    if (typeof window === 'undefined') return;

    try {
      if (isPlaying) {
        stopAudio();
        return;
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Master Gain with soft ramp
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gainRef.current = masterGain;

      // Lowpass Filter based on distance from screen (y coordinate: 0=front, 1=back)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoffFreq = 18000 - profile.coordinates.y * 7000;
      filter.frequency.setValueAtTime(cutoffFreq, now);

      // Main Oscillator (Spatial Melodic Tone)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const rootFreq = profile.sweetSpotRating === 'EXCELLENT' ? 432 : 396;
      setActiveFrequency(rootFreq);
      osc.frequency.setValueAtTime(rootFreq, now);
      osc.frequency.exponentialRampToValueAtTime(rootFreq * 1.5, now + 1.2);

      // 35Hz - 50Hz Sub-Bass Rumble for Subwoofer simulation
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(42, now);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.4, now);
      subOsc.connect(subGain);
      subGain.connect(masterGain);

      // Spatial Panning (HRTF / Panner)
      if (ctx.createPanner) {
        const panner = ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.positionX.setValueAtTime(profile.coordinates.x * 3, now);
        panner.positionY.setValueAtTime(0, now);
        panner.positionZ.setValueAtTime(profile.coordinates.y * 3, now);
        pannerRef.current = panner;

        osc.connect(filter);
        filter.connect(panner);
        panner.connect(masterGain);
      } else if (ctx.createStereoPanner) {
        const stereoPanner = ctx.createStereoPanner();
        stereoPanner.pan.setValueAtTime(profile.coordinates.x, now);
        pannerRef.current = stereoPanner;

        osc.connect(filter);
        filter.connect(stereoPanner);
        stereoPanner.connect(masterGain);
      } else {
        osc.connect(filter);
        filter.connect(masterGain);
      }

      masterGain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);
      oscRef.current = osc;
      subBassRef.current = subOsc;
      setIsPlaying(true);

      // Haptic Vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 60, 80]);
      }
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying, stopAudio]);

  return {
    isPlaying,
    activeFrequency,
    playSpatialTone,
    stopAudio,
  };
}

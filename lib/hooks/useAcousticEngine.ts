'use client';

import { useCallback, useEffect, useRef } from 'react';

interface AcousticEngine {
  playCinematicImpact: () => void;
  playSubBassDrop: () => void;
  playSpatializedClick: (clientX: number, clientY: number) => void;
  speak: (text: string) => void;
  initAudio: () => void;
  isAudioSuspended: () => boolean;
}

export function useAcousticEngine(): AcousticEngine {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
  }, []);

  const isAudioSuspended = useCallback(() => {
    if (!audioContext.current) return true;
    return audioContext.current.state === 'suspended';
  }, []);

  useEffect(() => {
    // Initialize AudioContext only on user interaction or first use
    // to comply with browser autoplay policies.

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playCinematicImpact = useCallback(() => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    
    // 1. Sub-bass boom
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(150, ctx.currentTime);
    boomOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);
    
    boomGain.gain.setValueAtTime(0, ctx.currentTime);
    boomGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
    boomGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
    
    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(ctx.currentTime);
    boomOsc.stop(ctx.currentTime + 3);

    // 2. White noise impact (Air / Breath)
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(2000, ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(ctx.currentTime);
    
    // 3. Sci-fi drone (Hans Zimmer Style Brass/Synth chord)
    const freqs = [55, 110, 164.81]; // A1, A2, E3
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(3000, ctx.currentTime + 1);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 4);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 4);
    });
  }, []);

  const playSubBassDrop = useCallback(() => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // 40Hz immersive drop, made audible with a triangle wave and higher initial freq
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.5);

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

    // Filter to remove harsh harmonics but keep it audible
    filter.type = 'lowpass';
    filter.frequency.value = 250;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2);
  }, []);

  const playSpatializedClick = useCallback((clientX: number, clientY: number) => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panner = ctx.createPanner();

    // High tech click
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    // Spatialize based on grid coordinates
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = (clientY / window.innerHeight) * 2 - 1;
    
    panner.panningModel = 'HRTF';
    panner.positionX.value = x;
    panner.positionY.value = -y; // Invert Y for audio space
    panner.positionZ.value = -1;

    osc.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Futuristic AI voice settings
    utterance.pitch = 0.8;
    utterance.rate = 0.9;
    
    // Attempt to select an English robotic or calm female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  // Preload voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return { playCinematicImpact, playSubBassDrop, playSpatializedClick, speak, initAudio, isAudioSuspended };
}

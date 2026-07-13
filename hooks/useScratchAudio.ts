import { useEffect, useRef, useCallback } from 'react';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  return sharedAudioCtx;
}

export function useScratchAudio() {
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (noiseSourceRef.current) return;

    try {
      // 1-second white noise buffer
      const bufferSize = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Filter simulating paper friction (bandpass around 900Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 900;
      filter.Q.value = 1.5;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);

      noiseSourceRef.current = source;
      filterRef.current = filter;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn('[Scratch Audio] Failed to init Audio Graph:', e);
    }
  }, []);

  const updateScratchAudio = useCallback((speed: number) => {
    const gain = gainNodeRef.current;
    const filter = filterRef.current;
    if (!gain || !filter) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (speed > 0.05) {
        const targetVolume = Math.min(speed * 0.35, 0.25);
        const targetFreq = 700 + Math.min(speed * 1200, 2000);

        gain.gain.setTargetAtTime(targetVolume, now, 0.02);
        filter.frequency.setTargetAtTime(targetFreq, now, 0.02);
      } else {
        // Fast decay to completely cut trailing friction sound
        gain.gain.setTargetAtTime(0, now, 0.01);
      }
    } catch (_) {}
  }, []);

  const stopAudio = useCallback(() => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch (_) {}
      noiseSourceRef.current = null;
    }
    if (filterRef.current) {
      filterRef.current.disconnect();
      filterRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return { initAudio, updateScratchAudio, stopAudio };
}

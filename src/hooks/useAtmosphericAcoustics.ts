import { useEffect, useRef } from 'react';

interface UseAtmosphericAcousticsProps {
  isActive: boolean;
  audioUrl?: string;
}

export function useAtmosphericAcoustics({ isActive, audioUrl }: UseAtmosphericAcousticsProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!audioUrl || !isActive) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const initAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        sourceRef.current = ctx.createBufferSource();
        sourceRef.current.buffer = audioBuffer;
        sourceRef.current.loop = true;

        filterRef.current = ctx.createBiquadFilter();
        filterRef.current.type = 'lowpass';
        filterRef.current.frequency.value = 400; // Start muffled

        pannerRef.current = ctx.createPanner();
        pannerRef.current.panningModel = 'HRTF';
        pannerRef.current.setPosition(0, 0, 1);

        gainRef.current = ctx.createGain();
        gainRef.current.gain.value = 0;

        sourceRef.current.connect(filterRef.current);
        filterRef.current.connect(pannerRef.current);
        pannerRef.current.connect(gainRef.current);
        gainRef.current.connect(ctx.destination);

        sourceRef.current.start();
        
        // Fade in and sweep filter
        gainRef.current.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
        filterRef.current.frequency.setTargetAtTime(2000, ctx.currentTime, 1.0);
      } catch (err) {
        console.error('Atmospheric Acoustics initialization failed', err);
      }
    };

    if (!sourceRef.current) {
      initAudio();
    } else {
       gainRef.current?.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
       filterRef.current?.frequency.setTargetAtTime(2000, ctx.currentTime, 1.0);
    }

    return () => {
      if (gainRef.current && ctx) {
        gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      }
    };
  }, [isActive, audioUrl]);

  return null;
}

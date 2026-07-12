import { useEffect, useRef } from 'react';
import { useSetAudioTelemetry } from '@/lib/store/subtitlesStore';

export function useAudioAnalyzer(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const setAudioTelemetry = useSetAudioTelemetry();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let source: MediaElementAudioSourceNode | null = null;

    const initAudio = () => {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      try {
        source = ctx.createMediaElementSource(video);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          const frequencies = Array.from(dataArray);
          const sum = frequencies.reduce((a, b) => a + b, 0);
          const amplitude = sum / frequencies.length;

          setAudioTelemetry(amplitude, frequencies);
          animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);
      } catch (err) {
        console.error('Web Audio source connection failed:', err);
      }
    };

    const handlePlay = () => {
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [videoRef, setAudioTelemetry]);
}

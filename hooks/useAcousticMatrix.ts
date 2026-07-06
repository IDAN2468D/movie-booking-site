import { useEffect, useRef } from 'react';
import { z } from 'zod';

const SeatCoordinatesSchema = z.object({
  row: z.number().int().min(0).max(7),
  col: z.number().int().min(0).max(5),
});

export interface AcousticResult {
  success: boolean;
  data?: {
    panX: number;
    panZ: number;
    frequency: number;
    gain: number;
  };
  error?: string;
}

export function useAcousticMatrix(
  seatId: string | null,
  mediaElement: HTMLMediaElement | null
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Parse seat coordinates
  const getCoordinates = (id: string | null) => {
    if (!id) return null;
    try {
      const idx = parseInt(id.split('-')[1], 10);
      if (isNaN(idx) || idx < 0 || idx >= 48) return null;
      const row = Math.floor(idx / 6);
      const col = idx % 6;
      const validated = SeatCoordinatesSchema.parse({ row, col });
      return validated;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!mediaElement) return;

    // Lazy initialization of AudioContext on user interaction/mount
    const initAudio = () => {
      if (audioContextRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Panner Node for spatial positioning
      const panner = ctx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 100;
      panner.rolloffFactor = 1;
      pannerRef.current = panner;

      // Biquad Filter Node for low-pass roll-off (depth simulation)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filterRef.current = filter;

      try {
        const source = ctx.createMediaElementSource(mediaElement);
        sourceRef.current = source;

        // Connect graph: MediaElement -> Panner -> Filter -> Destination
        source.connect(panner);
        panner.connect(filter);
        filter.connect(ctx.destination);
      } catch (err) {
        console.error('Audio source node connection error:', err);
      }
    };

    // Initialize audio context on play/load of media element
    const handlePlay = () => {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    mediaElement.addEventListener('play', handlePlay);

    return () => {
      mediaElement.removeEventListener('play', handlePlay);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mediaElement]);

  // Update spatializer parameters in a decoupled loop (requestAnimationFrame)
  useEffect(() => {
    const updateAudioMatrix = () => {
      const coords = getCoordinates(seatId);
      const panner = pannerRef.current;
      const filter = filterRef.current;
      const ctx = audioContextRef.current;

      if (panner && filter && ctx) {
        // Center of screen is at x = 0, z = 0
        // Leftmost seat col = 0 -> x = -1.5, Rightmost seat col = 5 -> x = 1.5
        const xOffset = coords ? (coords.col - 2.5) * 1.5 : 0;
        
        // Front row (row = 0) is closest to screen (z = 2), Back row (row = 7) is furthest (z = 12)
        const zOffset = coords ? 2.0 + coords.row * 1.5 : 5.0;

        // Decoupled parametric updates
        panner.positionX.setValueAtTime(xOffset, ctx.currentTime);
        panner.positionY.setValueAtTime(0, ctx.currentTime);
        panner.positionZ.setValueAtTime(zOffset, ctx.currentTime);

        // Low-pass frequency rolls off based on distance/depth (furthest seats have more low-pass)
        const maxFreq = 22000;
        const minFreq = 4000;
        const normalizedDepth = coords ? coords.row / 7 : 0.5; // 0 to 1
        const targetFreq = maxFreq - (maxFreq - minFreq) * normalizedDepth;
        
        filter.frequency.setValueAtTime(targetFreq, ctx.currentTime);
      }

      animationFrameRef.current = requestAnimationFrame(updateAudioMatrix);
    };

    animationFrameRef.current = requestAnimationFrame(updateAudioMatrix);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [seatId]);

  // Calculate static metrics for UI display conforming to Result Pattern
  const coords = getCoordinates(seatId);
  if (!coords) {
    return {
      success: false,
      error: 'No active seat coordinates',
    };
  }

  const panX = (coords.col - 2.5) * 1.5;
  const panZ = 2.0 + coords.row * 1.5;
  const maxFreq = 22000;
  const minFreq = 4000;
  const targetFreq = maxFreq - (maxFreq - minFreq) * (coords.row / 7);

  return {
    success: true,
    data: {
      panX,
      panZ,
      frequency: targetFreq,
      gain: Math.max(0.6, 1.0 - (coords.row / 7) * 0.25),
    },
  };
}

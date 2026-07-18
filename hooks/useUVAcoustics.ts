"use client";

import { useEffect, useRef, useCallback } from "react";

// Shared AudioContext for the UV scanner to avoid limits
let uvAudioCtx: AudioContext | null = null;

export function useUVAcoustics() {
  const activeNodes = useRef<{ osc?: OscillatorNode; gain?: GainNode; filter?: BiquadFilterNode }>({});

  const initUV = useCallback(() => {
    if (typeof window !== "undefined" && !uvAudioCtx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        uvAudioCtx = new AudioContextClass();
      }
    }
  }, []);

  const startUVSound = useCallback(() => {
    initUV();
    if (!uvAudioCtx) return;
    const ctx = uvAudioCtx;

    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    try {
      if (activeNodes.current.osc) return; // Already running

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      // Low frequency hum for the UV light
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, ctx.currentTime);

      // Filter to muffle it initially
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);

      // Start at 0 volume
      gainNode.gain.setValueAtTime(0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      activeNodes.current = { osc, filter, gain: gainNode };
    } catch (e) {
      console.warn("Error starting UV sound:", e);
    }
  }, [initUV]);

  const stopUVSound = useCallback(() => {
    if (activeNodes.current.gain && uvAudioCtx) {
      const { gain, osc, filter } = activeNodes.current;
      gain.gain.linearRampToValueAtTime(0, uvAudioCtx.currentTime + 0.3);
      
      setTimeout(() => {
        try {
          osc?.stop();
          osc?.disconnect();
          filter?.disconnect();
          gain?.disconnect();
        } catch (e) {}
      }, 350);
      
      activeNodes.current = {};
    }
  }, []);

  // Set intensity based on how close the UV light is to a watermark (0.0 to 1.0)
  const setUVIntensity = useCallback((intensity: number) => {
    if (!uvAudioCtx || !activeNodes.current.gain || !activeNodes.current.osc || !activeNodes.current.filter) return;
    
    const ctx = uvAudioCtx;
    const { gain, osc, filter } = activeNodes.current;
    
    const now = ctx.currentTime;
    
    // Map intensity (0-1) to volume (0.05 to 0.4)
    const targetVolume = 0.05 + (intensity * 0.35);
    gain.gain.setTargetAtTime(targetVolume, now, 0.1);
    
    // Map intensity to frequency (60Hz to 120Hz)
    const targetFreq = 60 + (intensity * 60);
    osc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    
    // Open up the filter when intense to make it sound "brighter"
    const targetFilter = 200 + (intensity * 1000);
    filter.frequency.setTargetAtTime(targetFilter, now, 0.1);
  }, []);

  return { startUVSound, stopUVSound, setUVIntensity };
}

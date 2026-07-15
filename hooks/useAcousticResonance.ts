"use client";

import { useEffect, useRef, useState } from "react";
import { getSeatAcousticProfileAction } from "@/app/actions/acousticsActions";

interface AcousticState {
  pan: number;
  filterFreq: number;
  delayTime: number;
}

export function useAcousticResonance() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Web Audio API context on first interaction
    const initAudio = () => {
      if (audioCtxRef.current) return;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 20000;

      const panner = ctx.createStereoPanner();
      panner.pan.value = 0;

      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      // Routing: Synth -> Filter -> Delay -> Panner -> Gain -> Destination
      filter.connect(delay);
      delay.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterRef.current = filter;
      pannerRef.current = panner;
      delayRef.current = delay;
      gainRef.current = gain;
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const simulateResonance = async (seatId: string, x: number, y: number) => {
    setLoading(true);
    
    // Fetch profile from server action
    const result = await getSeatAcousticProfileAction({ seatId, x, y });
    setLoading(false);

    if (result.success && result.data && audioCtxRef.current) {
      const { pan, filterFreq, delayTime } = result.data;
      const ctx = audioCtxRef.current;
      
      // Update nodes smoothly
      if (pannerRef.current) {
        pannerRef.current.pan.setTargetAtTime(pan, ctx.currentTime, 0.1);
      }
      if (filterRef.current) {
        filterRef.current.frequency.setTargetAtTime(filterFreq, ctx.currentTime, 0.1);
      }
      if (delayRef.current) {
        delayRef.current.delayTime.setTargetAtTime(delayTime, ctx.currentTime, 0.1);
      }

      // Generate a 808-style cinematic sub-bass pulse
      if (gainRef.current) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
        
        osc.connect(filterRef.current!);
        
        gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
        gainRef.current.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
        gainRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
        
        setIsActive(true);
        setTimeout(() => setIsActive(false), 1500);
      }
    }
  };

  return {
    simulateResonance,
    isActive,
    loading
  };
}

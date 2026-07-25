'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateSynapseAlignmentAction } from '@/app/actions/synapse-actions';
import { RefractionTunnelView } from './RefractionTunnelView';
import { FrequencySliderView } from './FrequencySliderView';

export const SynapsePreludeContainer: React.FC = () => {
  const [alignment, setAlignment] = useState(25);
  const [threshold, setThreshold] = useState<'low' | 'medium' | 'high'>('medium');
  const [tunnelColor, setTunnelColor] = useState('rgba(56, 189, 248, 0.4)');
  const [targetFreq, setTargetFreq] = useState(1500);
  const [status, setStatus] = useState('INITIALIZING_PRELUDE');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Initialize Web Audio API Filter
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(targetFreq, ctx.currentTime);
      filter.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterNodeRef.current = filter;
    }
  }, [targetFreq]);

  // Sub-bass 40Hz resolution drop effect
  const trigger40HzSubBass = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  }, []);

  const updateAlignment = useCallback(async (newAlign: number, newThresh: 'low' | 'medium' | 'high') => {
    initAudio();
    const res = await calculateSynapseAlignmentAction({
      alignmentPercentage: newAlign,
      sensoryThreshold: newThresh,
      frequencyHz: targetFreq,
    });

    if (res.success && res.data) {
      setTunnelColor(res.data.refractionTunnelColor);
      setTargetFreq(res.data.targetFrequency);
      setStatus(res.data.sensoryStatus);

      if (filterNodeRef.current && audioCtxRef.current) {
        filterNodeRef.current.frequency.setTargetAtTime(
          res.data.targetFrequency,
          audioCtxRef.current.currentTime,
          0.1
        );
      }

      if (newAlign >= 100) {
        trigger40HzSubBass();
      }
    }
  }, [initAudio, targetFreq, trigger40HzSubBass]);

  useEffect(() => {
    updateAlignment(alignment, threshold);
  }, [alignment, threshold, updateAlignment]);

  const handleAutoWarmup = () => {
    let current = alignment;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setAlignment(current);
    }, 250);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-6 rounded-3xl border border-white/10 bg-neutral-950/70 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-white">
      <div className="text-center space-y-1">
        <h2 className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
          Synapse Prelude: Sensory Onboarding
        </h2>
        <p className="font-inter text-xs text-neutral-400">
          Phase 31 (Sprint 79) — Acoustic & Refractive Warm-Up Matrix
        </p>
      </div>

      <RefractionTunnelView
        alignmentPercentage={alignment}
        tunnelColor={tunnelColor}
        sensoryStatus={status}
      />

      <FrequencySliderView
        alignment={alignment}
        threshold={threshold}
        onAlignmentChange={(val) => setAlignment(val)}
        onThresholdChange={(t) => setThreshold(t)}
        onTriggerPreset={handleAutoWarmup}
        targetFreq={targetFreq}
      />
    </div>
  );
};

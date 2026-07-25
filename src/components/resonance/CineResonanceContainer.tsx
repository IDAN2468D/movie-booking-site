'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateCineResonanceAction } from '@/app/actions/resonance-actions';
import { CineResonanceWaveView } from './CineResonanceWaveView';
import { CineResonanceControlsView } from './CineResonanceControlsView';

export const CineResonanceContainer: React.FC = () => {
  const [resonance, setResonance] = useState(35);
  const [mode, setMode] = useState<'dialogue' | 'bass' | 'surround'>('bass');
  const [glowColor, setGlowColor] = useState('rgba(56, 189, 248, 0.5)');
  const [targetFreq, setTargetFreq] = useState(3500);
  const [statusHebrew, setStatusHebrew] = useState('מוכן לכיול');
  const [descriptionHebrew, setDescriptionHebrew] = useState('הזז את סליידר התהודה כדי להתאים את צליל הקולנוע');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const filter = ctx.createBiquadFilter();

      filter.type = mode === 'bass' ? 'lowpass' : mode === 'dialogue' ? 'bandpass' : 'highpass';
      filter.frequency.setValueAtTime(targetFreq, ctx.currentTime);
      filter.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterNodeRef.current = filter;
    }
  }, [mode, targetFreq]);

  const triggerSubBassDrop = useCallback(() => {
    if (typeof window === 'undefined') return;
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

  const updateResonance = useCallback(async (newLevel: number, newMode: 'dialogue' | 'bass' | 'surround') => {
    initAudio();
    const res = await calculateCineResonanceAction({
      resonanceLevel: newLevel,
      profileMode: newMode,
      frequencyTargetHz: targetFreq,
    });

    if (res.success && res.data) {
      setGlowColor(res.data.glowColor);
      setTargetFreq(res.data.targetFrequency);
      setStatusHebrew(res.data.statusHebrew);
      setDescriptionHebrew(res.data.descriptionHebrew);

      if (filterNodeRef.current && audioCtxRef.current) {
        filterNodeRef.current.frequency.setTargetAtTime(
          res.data.targetFrequency,
          audioCtxRef.current.currentTime,
          0.1
        );
      }

      if (newLevel >= 100) {
        triggerSubBassDrop();
      }
    }
  }, [initAudio, targetFreq, triggerSubBassDrop]);

  useEffect(() => {
    updateResonance(resonance, mode);
  }, [resonance, mode, updateResonance]);

  const handleAutoCalibrate = () => {
    let current = resonance;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setResonance(current);
    }, 200);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-6 rounded-3xl border border-white/10 bg-neutral-950/70 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-white text-right" dir="rtl">
      <div className="text-center space-y-1">
        <h2 className="font-outfit text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
          מנוע תהודה קולנועית וכיול אקוסטי
        </h2>
        <p className="font-sans text-xs text-neutral-400">
          אופטימיזציית תדרי שמע וסנכרון אקוסטי בזמן אמת
        </p>
      </div>

      <CineResonanceWaveView
        resonanceLevel={resonance}
        glowColor={glowColor}
        statusHebrew={statusHebrew}
        descriptionHebrew={descriptionHebrew}
      />

      <CineResonanceControlsView
        resonance={resonance}
        mode={mode}
        onResonanceChange={(val) => setResonance(val)}
        onModeChange={(m) => setMode(m)}
        onAutoCalibrate={handleAutoCalibrate}
        targetFreq={targetFreq}
      />
    </div>
  );
};

'use client';

import React, { useState, useRef } from 'react';
import { HapticNode, HapticPreset } from '@/lib/validations/haptic';
import { HapticNodeGridView } from './HapticNodeGridView';
import { HapticFrequencyControlsView } from './HapticFrequencyControlsView';
import { calibrateHapticProfile } from '@/app/actions/haptic-actions';
import { Volume2, CheckCircle2 } from 'lucide-react';

const INITIAL_NODES: HapticNode[] = [
  { id: 'sub-bass', label: 'סאב-באס עמוק', frequency: 35, vibratePattern: [100, 50, 100], x: 1, y: 1 },
  { id: 'cinematic-pulse', label: 'פולס קולנועי', frequency: 60, vibratePattern: [200, 100, 200], x: 2, y: 1 },
  { id: 'thriller-heart', label: 'דופק מתח', frequency: 90, vibratePattern: [50, 50, 50, 50], x: 1, y: 2 },
  { id: 'action-boom', label: 'פיצוץ אקשן', frequency: 140, vibratePattern: [300, 50, 150], x: 2, y: 2 },
];

export const TactileResonanceContainer: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [preset, setPreset] = useState<HapticPreset>('sci-fi');
  const [subBassFrequency, setSubBassFrequency] = useState<number>(40);
  const [hapticIntensity, setHapticIntensity] = useState<number>(0.8);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>('מערכת תהודה הפטית מוכנה לכיול');
  const [resonanceScore, setResonanceScore] = useState<number | null>(88);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAcousticHapticPulse = (frequency: number, pattern: number[]) => {
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioCtx();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, ctx.currentTime);

          gain.gain.setValueAtTime(hapticIntensity * 0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }

        // Trigger physical haptic vibration if supported
        if ('vibrate' in navigator && hapticIntensity > 0) {
          const scaledPattern = pattern.map((dur) => Math.round(dur * hapticIntensity));
          navigator.vibrate(scaledPattern);
        }
      }
    } catch {
      // Audio or vibration unavailable fallback
    }
  };

  const handleNodeClick = (node: HapticNode) => {
    setActiveNodeId(node.id);
    playAcousticHapticPulse(node.frequency, node.vibratePattern);
    setStatusMessage(`מופעל: ${node.label} (${node.frequency} Hz)`);
  };

  const handleCalibrate = async () => {
    setIsCalibrating(true);
    setStatusMessage('מחשב פרופיל תהודה הפטית עם AI...');

    const res = await calibrateHapticProfile({
      subBassFrequency,
      hapticIntensity,
      spatialPanning: 0,
      preset,
      activeNodeId: activeNodeId || undefined,
    });

    setIsCalibrating(false);
    if (res.success && res.data) {
      setResonanceScore(res.data.resonanceScore);
      setStatusMessage(res.data.message);
      playAcousticHapticPulse(subBassFrequency, [150, 100, 250]);
    } else {
      setStatusMessage(res.error || 'נכשל כיול התהודה');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Phase 31 • Sprint 81
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit mt-2">
            מרכז התהודה והמגע ההפטי הקולנועי
          </h1>
          <p className="text-sm text-slate-300 font-inter mt-1">
            חווה סאונד שמרגישים בגוף: תדרים אקוסטיים נמוכים בשילוב רעדים הפטיים מותאמים
          </p>
        </div>

        {resonanceScore !== null && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400 font-inter">ציון תהודה הפטית</div>
              <div className="text-xl font-bold font-mono text-cyan-300">{resonanceScore} / 100</div>
            </div>
          </div>
        )}
      </div>

      {/* Grid View */}
      <HapticNodeGridView
        nodes={INITIAL_NODES}
        activeNodeId={activeNodeId}
        onNodeClick={handleNodeClick}
      />

      {/* Controls View */}
      <HapticFrequencyControlsView
        preset={preset}
        subBassFrequency={subBassFrequency}
        hapticIntensity={hapticIntensity}
        isCalibrating={isCalibrating}
        onPresetChange={setPreset}
        onFrequencyChange={setSubBassFrequency}
        onIntensityChange={setHapticIntensity}
        onCalibrate={handleCalibrate}
      />

      {/* Status Bar */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs font-mono font-bold flex items-center gap-3">
          <Volume2 className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

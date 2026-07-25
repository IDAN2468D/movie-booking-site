'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScaleType, SoundtrackPresetResult } from '@/lib/validations/synth';
import { SynthOscillatorControlsView } from './SynthOscillatorControlsView';
import { QuantumWaveformVisualizerView } from './QuantumWaveformVisualizerView';
import { generateSoundtrackPresetAction } from '@/app/actions/synth-actions';
import { Disc3, CheckCircle2 } from 'lucide-react';

export const QuantumPersonaSoundtrackSynthContainer: React.FC = () => {
  const [scale, setScale] = useState<ScaleType>('cinematic_minor');
  const [tempoBpm, setTempoBpm] = useState<number>(110);
  const [cutoffFreqHz, setCutoffFreqHz] = useState<number>(1200);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [presetResult, setPresetResult] = useState<SoundtrackPresetResult | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    bassDrone: true,
    arpeggio: true,
    harmonicPad: true,
    subBass: true,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthLoopRef = useRef<NodeJS.Timeout | null>(null);

  const playPolyphonicNote = useCallback((freq: number, duration: number) => {
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioCtx();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();

          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(cutoffFreqHz, now);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
        }
      }
    } catch {
      // Audio fallback
    }
  }, [cutoffFreqHz]);

  const handleToggleLayer = (layer: 'bassDrone' | 'arpeggio' | 'harmonicPad' | 'subBass') => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleGeneratePreset = async () => {
    setIsGenerating(true);
    const res = await generateSoundtrackPresetAction({
      scale,
      tempoBpm,
      cutoffFreqHz,
      activeLayers,
    });
    setIsGenerating(false);

    if (res.success && res.data) {
      setPresetResult(res.data);
      if (isPlaying) {
        playPolyphonicNote(res.data.baseFrequencyHz, 1.2);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / tempoBpm) * 500;
      const notes = presetResult?.harmonicNotes || [220, 261.63, 329.63, 392, 440];
      let stepIdx = 0;

      synthLoopRef.current = setInterval(() => {
        const note = notes[stepIdx % notes.length];
        if (activeLayers.arpeggio) playPolyphonicNote(note, 0.4);
        if (activeLayers.bassDrone && stepIdx % 4 === 0) playPolyphonicNote(note / 2, 1.2);
        stepIdx++;
      }, intervalMs);
    } else {
      if (synthLoopRef.current) clearInterval(synthLoopRef.current);
    }

    return () => {
      if (synthLoopRef.current) clearInterval(synthLoopRef.current);
    };
  }, [isPlaying, tempoBpm, presetResult, activeLayers, playPolyphonicNote]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Phase 31 • Sprint 83
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit mt-2">
            סנתזטור פסקול הנוירונים הקוונטי
          </h1>
          <p className="text-sm text-slate-300 font-inter mt-1">
            חולל ומקסס פסקול קולנועי בזמן אמת מותאם לפרסונה והאווירה שלך
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
          <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-bold font-mono">Polyphonic Synth 120Hz</span>
        </div>
      </div>

      {/* Waveform Visualizer */}
      <QuantumWaveformVisualizerView
        isPlaying={isPlaying}
        tempoBpm={tempoBpm}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* Preset Result Banner */}
      {presetResult && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs font-inter flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">{presetResult.presetTitle}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{presetResult.themeDescription}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls View */}
      <SynthOscillatorControlsView
        scale={scale}
        tempoBpm={tempoBpm}
        cutoffFreqHz={cutoffFreqHz}
        activeLayers={activeLayers}
        isGenerating={isGenerating}
        onScaleChange={setScale}
        onTempoChange={setTempoBpm}
        onCutoffChange={setCutoffFreqHz}
        onToggleLayer={handleToggleLayer}
        onGeneratePreset={handleGeneratePreset}
      />
    </div>
  );
};

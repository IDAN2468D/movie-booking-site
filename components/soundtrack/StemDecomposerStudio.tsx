'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Sparkles, Mic, Music, Disc, Zap, Play, Pause } from 'lucide-react';
import { StemFader } from './StemFader';
import { getStemPresetsAction, StemPreset } from '@/app/actions/stemMixerActions';

export function StemDecomposerStudio() {
  const [dialogue, setDialogue] = useState(100);
  const [score, setScore] = useState(80);
  const [bass, setBass] = useState(85);
  const [fx, setFx] = useState(70);
  const [mutedStems, setMutedStems] = useState<{ [key: string]: boolean }>({});
  const [presets, setPresets] = useState<StemPreset[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    getStemPresetsAction().then((res) => {
      if (res.success && res.data) {
        setPresets(res.data);
      }
    });
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleMute = (stem: string) => {
    setMutedStems((prev) => ({ ...prev, [stem]: !prev[stem] }));
  };

  const applyPreset = (preset: StemPreset) => {
    setActivePreset(preset.id);
    setDialogue(preset.dialogue);
    setScore(preset.score);
    setBass(preset.bass);
    setFx(preset.fx);
    setMutedStems({});
    triggerSubBassPulse(preset.subBassSweepHz);
  };

  const triggerSubBassPulse = (freq = 40) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime((bass / 100) * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 20, 60]);
      }
    } catch (e) {
      console.warn('Sub-bass trigger error:', e);
    }
  };

  const toggleTestPlayback = () => {
    if (isPlayingTest) {
      setIsPlayingTest(false);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
      }
    } else {
      setIsPlayingTest(true);
      triggerSubBassPulse(42);
    }
  };

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">אולפן פירוק פסקול (Stem Decomposer)</h3>
            <p className="text-xs text-gray-400">שליטה ב-4 ערוצי סאונד נפרדים בזמן אמת עם תדרי סאב-באס 35Hz-50Hz</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleTestPlayback}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
        >
          {isPlayingTest ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlayingTest ? 'עצור הדמיה אקוסטית' : 'הפעל הדמיה מרחבית'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> פריסטים:
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              activePreset === p.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StemFader
          label="דיאלוג ושחקנים"
          subLabel="Stem 1: Vocal Track"
          icon={<Mic className="w-4 h-4 text-cyan-400" />}
          value={dialogue}
          color="text-cyan-400"
          isMuted={!!mutedStems.dialogue}
          onChange={setDialogue}
          onToggleMute={() => toggleMute('dialogue')}
        />
        <StemFader
          label="פסקול תזמורתי"
          subLabel="Stem 2: Score / Melodic"
          icon={<Music className="w-4 h-4 text-purple-400" />}
          value={score}
          color="text-purple-400"
          isMuted={!!mutedStems.score}
          onChange={setScore}
          onToggleMute={() => toggleMute('score')}
        />
        <StemFader
          label="סאב-באס ותדרים נמוכים"
          subLabel="Stem 3: 35-50Hz Sub"
          icon={<Disc className="w-4 h-4 text-amber-400" />}
          value={bass}
          color="text-amber-400"
          isMuted={!!mutedStems.bass}
          onChange={(val) => {
            setBass(val);
            if (val % 20 === 0) triggerSubBassPulse(38);
          }}
          onToggleMute={() => toggleMute('bass')}
        />
        <StemFader
          label="אפקטים קוליים ו-SFX"
          subLabel="Stem 4: Sound FX & Foley"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          value={fx}
          color="text-emerald-400"
          isMuted={!!mutedStems.fx}
          onChange={setFx}
          onToggleMute={() => toggleMute('fx')}
        />
      </div>
    </div>
  );
}

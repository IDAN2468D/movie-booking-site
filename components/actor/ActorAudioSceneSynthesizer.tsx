'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Waves, Radio } from 'lucide-react';

interface ActorAudioSceneSynthesizerProps {
  actorName: string;
  sampleQuote?: string;
}

export function ActorAudioSceneSynthesizer({
  actorName,
  sampleQuote = 'החולית תישאר לנצח. האקוסטיקה של הקולנוע מתעוררת לחיים ברגעי השיא.',
}: ActorAudioSceneSynthesizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubBassActive, setIsSubBassActive] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const startSubBassPulse = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(42, ctx.currentTime); // 42Hz Sub-bass
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(60, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
      oscRef.current = osc;
    } catch {
      // Audio context fallbacks
    }
  };

  const handleTogglePlayback = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (isSubBassActive) {
      startSubBassPulse();
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${actorName}. ${sampleQuote}`);
      utterance.lang = 'he-IL';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <div dir="rtl" className="w-full p-8 rounded-[2rem] bg-neutral-950/40 border border-emerald-500/30 backdrop-blur-[40px] saturate-[250%] shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-['Outfit']">סינתיסייזר סאב-באס ואקוסטיקה</h3>
            <p className="text-xs text-neutral-400 font-['Inter']">Web Audio 35-50Hz Sub-Bass & Speech Synth</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          35Hz-50Hz Pulse
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-4 mb-6">
        <p className="text-sm text-neutral-200 leading-relaxed font-['Inter'] italic">
          &quot;{sampleQuote}&quot;
        </p>

        {isPlaying && (
          <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Waves className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="text-xs font-mono text-emerald-300">תצירי קול וסאב-באס פעילים בלייב...</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleTogglePlayback}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] font-['Outfit']"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'עצור סאב-באס וקריינות' : 'נגן מונולוג אקוסטי סאב-באס'}
        </button>

        <button
          onClick={() => setIsSubBassActive(!isSubBassActive)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-['Outfit'] flex items-center gap-2 border transition-all ${
            isSubBassActive
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-neutral-900 border-white/10 text-neutral-400'
          }`}
        >
          {isSubBassActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {isSubBassActive ? 'סאב-באס 42Hz: פעיל' : 'סאב-באס: מנוטרל'}
        </button>
      </div>
    </div>
  );
}

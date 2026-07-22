'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc3, Sliders, Zap, Music } from 'lucide-react';
import type { SoundtrackItem } from '@/lib/schemas/soundtrack';
import { SoundtrackVisualizer } from './SoundtrackVisualizer';

interface SoundtrackPlayerCardProps {
  track: SoundtrackItem;
}

export function SoundtrackPlayerCard({ track }: SoundtrackPlayerCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [pan, setPan] = useState(0);
  const [isBassBoosted, setIsBassBoosted] = useState(false);
  const [useSynthFallback, setUseSynthFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    stopPlayback();
    setCurrentTime(0);
    setUseSynthFallback(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl || '';
      audioRef.current.load();
    }
  }, [track]);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
  };

  const getAudioCtx = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        pannerRef.current = panner;
        panner.connect(analyser);
        analyser.connect(ctx.destination);
      } else {
        analyser.connect(ctx.destination);
      }
      audioCtxRef.current = ctx;
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSynthNote = (step: number) => {
    const ctx = getAudioCtx();
    if (!ctx || !analyserRef.current) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const destination = pannerRef.current || analyserRef.current;

    const notes = [220, 261.63, 329.63, 392.00, 440.00];
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(notes[step % notes.length], now);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(noteGain);
    noteGain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.35);
  };

  const startSynthLoop = () => {
    setUseSynthFallback(true);
    let step = 0;
    playSynthNote(step);
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    synthTimerRef.current = setInterval(() => {
      step += 1;
      setCurrentTime(prev => (prev >= duration ? 0 : prev + 1));
      playSynthNote(step);
    }, 350);
  };

  const togglePlay = () => {
    getAudioCtx();

    if (isPlaying) {
      stopPlayback();
    } else {
      if (audioRef.current && track.audioUrl && !useSynthFallback) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(true);
            startSynthLoop();
          });
      } else {
        setIsPlaying(true);
        startSynthLoop();
      }
    }
  };

  const handlePanChange = (newPan: number) => {
    setPan(newPan);
    if (pannerRef.current && audioCtxRef.current) {
      pannerRef.current.pan.setValueAtTime(newPan, audioCtxRef.current.currentTime);
    }
  };

  const triggerBassDrop = () => {
    setIsBassBoosted(true);
    setTimeout(() => setIsBassBoosted(false), 1500);
    const ctx = getAudioCtx();
    if (ctx && analyserRef.current) {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(pannerRef.current || analyserRef.current);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-lg rounded-[32px] overflow-hidden bg-neutral-950/50 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-[40px] saturate-[250%] p-6 text-white text-right relative group" dir="rtl">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 180)}
        onEnded={() => setIsPlaying(false)}
        onError={() => startSynthLoop()}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
          <img src={track.coverImage} alt={track.songTitle} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <Disc3 size={32} className={`text-indigo-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2.5s' }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1 inline-block">
            {track.movieTitle} OST
          </span>
          <h3 className="font-['Outfit'] font-extrabold text-lg text-white truncate leading-snug">{track.songTitle}</h3>
          <p className="text-xs text-neutral-400 truncate">{track.artist}</p>
        </div>
      </div>

      <div className="mb-5">
        <SoundtrackVisualizer analyserNode={analyserRef.current} isPlaying={isPlaying} />
      </div>

      <div className="mb-4 space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 180}
          value={currentTime}
          onChange={(e) => {
            const val = Number(e.target.value);
            setCurrentTime(val);
            if (audioRef.current) audioRef.current.currentTime = val;
          }}
          className="w-full h-1.5 bg-white/10 accent-indigo-500 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
        <button onClick={togglePlay} className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95">
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="mr-0.5" />}
        </button>

        <button onClick={triggerBassDrop} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${isBassBoosted ? 'bg-pink-500 text-white border-pink-400 scale-105 shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'bg-white/5 border-white/10 text-pink-300 hover:bg-white/10'}`}>
          <Zap size={14} className={isBassBoosted ? 'animate-bounce' : ''} />
          <span>40Hz Sub-Bass Drop</span>
        </button>

        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <Sliders size={14} className="text-indigo-400" />
          <input type="range" min={-1} max={1} step={0.1} value={pan} onChange={(e) => handlePanChange(Number(e.target.value))} className="w-16 accent-indigo-400 cursor-pointer" title="איזון אקוסטי (Pan)" />
        </div>
      </div>
    </div>
  );
}

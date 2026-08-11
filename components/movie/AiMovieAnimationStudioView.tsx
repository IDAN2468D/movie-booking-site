'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Pause, ChevronRight, ChevronLeft, Wand2, RefreshCw } from 'lucide-react';
import { AiMovieAnimationFrame } from '@/lib/validations/ai-movie-animation.schema';

interface AiMovieAnimationStudioViewProps {
  movieTitle: string;
  frames: AiMovieAnimationFrame[];
  activeFrameIndex: number;
  isPlaying: boolean;
  isGenerating: boolean;
  activeStyle: string;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onStyleChange: (style: 'cyberpunk' | 'retro_film' | 'epic_glow' | 'noir' | 'fantasy') => void;
  onGenerateCustom: (prompt: string) => void;
}

const STYLES = [
  { id: 'cyberpunk', label: 'סייברפאנק ניאון' },
  { id: 'retro_film', label: 'פילם רטרו' },
  { id: 'epic_glow', label: 'זוהר אפסי' },
  { id: 'noir', label: 'נואר דרמטי' },
  { id: 'fantasy', label: 'פנטזיה קסומה' },
] as const;

export default function AiMovieAnimationStudioView({
  movieTitle,
  frames,
  activeFrameIndex,
  isPlaying,
  isGenerating,
  activeStyle,
  onNext,
  onPrev,
  onTogglePlay,
  onStyleChange,
  onGenerateCustom,
}: AiMovieAnimationStudioViewProps) {
  const [promptText, setPromptText] = useState('');
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  const currentFrame = frames[activeFrameIndex] || frames[0];

  useEffect(() => {
    setIsImgLoaded(false);
    if (currentFrame?.imageUrl) {
      setImgSrc(currentFrame.imageUrl);
    }
    // Safety auto-resolve timer so spinner never hangs indefinitely
    const timer = setTimeout(() => {
      setIsImgLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [activeFrameIndex, currentFrame?.id, currentFrame?.imageUrl]);

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim()) {
      onGenerateCustom(promptText.trim());
      setPromptText('');
    }
  };

  const handleImgError = () => {
    // If external AI image fails to load, fallback to a reliable frame or default svg
    setImgSrc(frames[1]?.imageUrl || frames[0]?.imageUrl || '/posters/default.svg');
    setIsImgLoaded(true);
  };

  return (
    <div className="relative w-full rounded-[32px] bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] p-6 md:p-8 overflow-hidden text-right my-8" dir="rtl">
      {/* Background Refraction Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center border border-white/20">
            <Wand2 className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest block">AI Studio Engine</span>
            <h3 className="text-xl font-black text-white font-display">מחולל אנימציות תמונה AI — {movieTitle}</h3>
          </div>
        </div>

        {/* Style Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeStyle === style.id
                  ? 'bg-primary text-black border-primary font-black shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Animated Scene Display */}
      {currentFrame && (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 mb-6 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-full h-full"
            >
              {/* Native HTML img tag for 100% reliable cross-origin loading */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc || currentFrame.imageUrl}
                alt={currentFrame.title}
                onLoad={() => setIsImgLoaded(true)}
                onError={handleImgError}
                style={{ filter: currentFrame.cssFilter }}
                className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-all duration-700 ${
                  isPlaying ? 'scale-105 transition-transform duration-10000' : ''
                } ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Loading Shimmer Overlay */}
              {(!isImgLoaded || isGenerating) && (
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10 space-y-3">
                  <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                  <span className="text-sm font-black text-white tracking-wide animate-pulse">
                    מפיח חיים בתמונת ה-AI שלך...
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

              {/* Holographic Refraction Particle Sweep */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent mix-blend-overlay pointer-events-none z-10"
              />

              {/* Frame Info Overlay */}
              <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end z-20">
                <div>
                  <h4 className="text-lg font-black text-white drop-shadow-md">{currentFrame.title}</h4>
                  <p className="text-xs text-white/80 line-clamp-1 max-w-lg">{currentFrame.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onPrev} className="w-9 h-9 rounded-xl bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                    <ChevronRight size={18} />
                  </button>
                  <button onClick={onTogglePlay} className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform">
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
                  </button>
                  <button onClick={onNext} className="w-9 h-9 rounded-xl bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Custom Prompt Generator Bar */}
      <form onSubmit={handleSubmitCustom} className="flex gap-3">
        <input
          type="text"
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          placeholder="תאר סצנת AI חדשה (למשל: חללית ניאון סגולה בחלל...)"
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-all"
        />
        <button
          type="submit"
          disabled={isGenerating || !promptText.trim()}
          className="px-6 py-3 bg-gradient-to-r from-primary to-cyan-500 text-black rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          ייצר תמונת AI
        </button>
      </form>
    </div>
  );
}

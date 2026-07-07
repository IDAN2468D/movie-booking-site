'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { ChronoHistory } from '../../lib/validations/liquidGlass';

interface ChronoSlideProps {
  item: ChronoHistory;
  index: number;
  scrollYProgress: MotionValue<number>;
  onRecall: (movieId: string, date: string) => void;
}

export function ChronoSlide({ item, index, scrollYProgress, onRecall }: ChronoSlideProps) {
  // Acoustic Audio Generator for Neural Flashback
  const playRecallSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const panner = ctx.createStereoPanner();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
      
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      panner.pan.value = 0;
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      
      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.log('Audio API not supported');
    }
  };

  const handleRecallClick = () => {
    playRecallSound();
    onRecall(item.movieId, item.date);
  };

  // Map scroll progress to optical degradation (older items degrade as we scroll down)
  // Utilizing raw math indices to map specific scroll ranges to transformations safely on the GPU.
  const step = 0.25;
  const startRange = (index - 1) * step;
  const peakRange = index * step;
  const endRange = (index + 1) * step;

  let input = [startRange, peakRange, endRange];
  let outOpacity = [0.2, 1, 0.2];
  let outScale = [0.85, 1, 0.85];
  let outBlur = [12, 0, 12];

  if (startRange < 0) {
    input = [0, endRange];
    outOpacity = [1, 0.2];
    outScale = [1, 0.85];
    outBlur = [0, 12];
  } else if (endRange > 1) {
    input = [startRange, 1];
    outOpacity = [0.2, 1];
    outScale = [0.85, 1];
    outBlur = [12, 0];
  }

  const opacity = useTransform(scrollYProgress, input, outOpacity);
  const scale = useTransform(scrollYProgress, input, outScale);
  const blur = useTransform(scrollYProgress, input, outBlur);
  
  // Apply visual decay as a direct filter string output bound to the blur motion value
  const filter = useTransform(blur, (v) => `blur(${v}px) saturate(${100 - v * 4}%)`);

  return (
    <motion.div
      className="relative w-full h-[180px] bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between transform-gpu will-change-transform shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md"
      style={{ opacity, scale, filter }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-outfit text-2xl font-bold text-white drop-shadow-md tracking-wide">
          {item.movieId}
        </h3>
        <span className="font-inter text-[10px] font-medium text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase shadow-inner">
          {item.date}
        </span>
      </div>
      
      <div className="space-y-2 border-t border-dashed border-white/10 pt-4 mt-auto">
        <div className="flex justify-between font-inter text-[11px] text-neutral-500 tracking-wider">
          <span>ORDER ID</span>
          <span className="text-white/70 font-mono">{item.orderId}</span>
        </div>
        <div className="flex justify-between items-center font-inter text-[11px] text-neutral-500 tracking-wider mt-2">
          <span>TEMPORAL DECAY</span>
          <span className="text-white/70 font-mono">{(item.decayLevel * 100).toFixed(0)}%</span>
        </div>
        
        <button 
          onClick={handleRecallClick}
          className="group relative w-full mt-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl overflow-hidden transition-all active:scale-95 shadow-[0_0_15px_rgba(255,159,10,0.1)] hover:shadow-[0_0_25px_rgba(255,159,10,0.3)]"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 text-primary text-[10px] font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,159,10,0.6)]">
            שחזר זיכרון
          </span>
        </button>
      </div>
      
      {/* Filmstrip holes indicator */}
      <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-evenly">
        {[1,2,3,4].map(n => <div key={n} className="w-1 h-3 rounded-sm bg-neutral-950/80 shadow-inner" />)}
      </div>
      <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-evenly">
        {[1,2,3,4].map(n => <div key={n} className="w-1 h-3 rounded-sm bg-neutral-950/80 shadow-inner" />)}
      </div>
    </motion.div>
  );
}

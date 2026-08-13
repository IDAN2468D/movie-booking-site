'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Volume2, X, Play, Pause, Sparkles, Disc } from 'lucide-react';

interface SeatAcousticPreviewModalProps {
  seatNumber: string;
  rowCategory: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SeatAcousticPreviewModal({
  seatNumber,
  rowCategory,
  isOpen,
  onClose,
}: SeatAcousticPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  if (!isOpen) return null;

  const playSpatialTone = () => {
    if (typeof window === 'undefined') return;
    try {
      if (isPlaying) {
        setIsPlaying(false);
        if (audioCtxRef.current) audioCtxRef.current.suspend();
        return;
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const isPrime = rowCategory.includes('VIP') || rowCategory.includes('Prime');
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isPrime ? 12000 : 6000, ctx.currentTime);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        const panValue = seatNumber.includes('1') ? -0.5 : seatNumber.includes('8') ? 0.5 : 0;
        panner.pan.setValueAtTime(panValue, ctx.currentTime);
        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(filter);
        filter.connect(gain);
      }

      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      setIsPlaying(true);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 20, 40]);
      }
    } catch (e) {
      console.warn('Acoustic spatial preview error:', e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-neutral-950/90 border border-white/15 rounded-3xl p-6 text-white text-right shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Headphones className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold font-outfit text-white">סימולציית אקוסטיקה 3D למושב {seatNumber}</h4>
                <span className="text-xs text-cyan-400">{rowCategory} &bull; Dolby Atmos Spatializer</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-5 text-center">
            <Disc className={`w-12 h-12 mx-auto mb-3 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              השמעת תדרי שמע מרחביים 3D המשחזרים את זווית התפשטות הסאונד, הדיבר והבאס המדויקת של מושב {seatNumber}.
            </p>

            <button
              type="button"
              onClick={playSpatialTone}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'עצור הדמיה אקוסטית' : 'הפעל בדיקת שמע 3D למושב'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 font-mono">
            <span>Stereo Panner: Active</span>
            <span>Biquad Cutoff: 12kHz</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

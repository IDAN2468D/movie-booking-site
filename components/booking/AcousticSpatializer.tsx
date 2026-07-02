'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { useAcousticMatrix } from '@/hooks/useAcousticMatrix';
import { Volume2, VolumeX, Play, Pause, Disc } from 'lucide-react';

export default function AcousticSpatializer() {
  const hoveredSeat = useBookingStore((state) => state.hoveredSeat);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const auraColor = useBookingStore((state) => state.auraColor || '#FF1464');

  const activeSeatId = hoveredSeat || (selectedSeats.length > 0 ? selectedSeats[selectedSeats.length - 1] : null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { success, data } = useAcousticMatrix(activeSeatId, audioRef.current);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio playback failed to start:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Convert row index for ripple projection (0 to 7)
  const getRippleDelay = () => {
    if (!activeSeatId) return 0;
    const idx = parseInt(activeSeatId.split('-')[1], 10);
    return isNaN(idx) ? 0 : Math.floor(idx / 6) * 0.15;
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-6 select-none font-sans">
      <div
        className="relative overflow-hidden rounded-[32px] p-5 text-white backdrop-blur-3xl saturate-[200%] brightness-110 shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] border-[0.5px] border-white/10"
        style={{
          background: 'rgba(10, 10, 15, 0.6)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-emerald-400">
              הדמיית סאונד מרחבית (Atmos)
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {activeSeatId ? `כיול אקוסטי למושב ${activeSeatId.replace('s-', '')}` : 'אנא בחר מושב לכיול מרחבי'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              {isMuted ? <VolumeX size={12} className="text-red-400" /> : <Volume2 size={12} className="text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Audio Player and Controller */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-3 rounded-2xl mb-4">
          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform active:scale-95 shrink-0"
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="translate-x-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">פסקול הדגמה</span>
            <span className="block text-xs font-bold text-slate-200 truncate">Dolby Atmos Spatial Soundstage Teaser</span>
          </div>
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            >
              <Disc size={18} className="text-emerald-400 opacity-60" />
            </motion.div>
          )}
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          loop
          crossOrigin="anonymous"
          className="hidden"
        />

        {/* Wavefront Visualizer Viewport */}
        <div className="relative w-full h-36 rounded-2xl bg-black/80 border border-white/10 overflow-hidden flex flex-col items-center justify-between py-4">
          {/* Virtual Cinema Screen at Top */}
          <div className="w-4/5 h-2 bg-gradient-to-r from-emerald-500/20 via-emerald-400/80 to-emerald-500/20 rounded-full blur-[1px] relative shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[6px] font-black text-emerald-400/60 tracking-widest uppercase">
              FRONT SCREEN L-C-R SPEAKERS
            </span>
          </div>

          {/* SVG Wavefront ripples extending towards selected seat */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {success && data && isPlaying && (
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <radialGradient id="waveGlow" cx="50%" cy="10%" r="50%">
                    <stop offset="0%" stopColor={auraColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Concentric ripples */}
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx="50%"
                    cy="10%"
                    r="20"
                    stroke={auraColor}
                    strokeWidth="1.5"
                    fill="none"
                    style={{ originX: '50%', originY: '10%' }}
                    animate={{
                      scale: [1, 6],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.7 + getRippleDelay(),
                      ease: 'easeOut',
                    }}
                  />
                ))}

                {/* Path indicator to the seat */}
                <motion.line
                  x1="50%"
                  y1="10%"
                  x2={`${50 + (data.panX * 10)}%`}
                  y2={`${15 + (data.panZ * 7)}%`}
                  stroke="rgba(52, 211, 153, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Mic/Seat marker */}
                <circle
                  cx={`${50 + (data.panX * 10)}%`}
                  cy={`${15 + (data.panZ * 7)}%`}
                  r="6"
                  fill={auraColor}
                  className="animate-pulse"
                />
              </svg>
            )}
          </div>

          {/* Status Overlay */}
          <AnimatePresence>
            {success && data ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="w-full px-4 flex justify-between items-end text-[8px] text-slate-500 font-bold uppercase tracking-wider z-10"
              >
                <div>
                  <span>הגבר: {Math.round(data.gain * 100)}%</span>
                </div>
                <div className="text-right">
                  <span>תדר פילטר: {Math.round(data.frequency)}Hz</span>
                </div>
              </motion.div>
            ) : (
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
                הפעל מוזיקה ובחר מושב לכיול
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Real-time spatial metrics */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-center">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
            <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">צידוד (Pan X)</span>
            <span className="block text-[11px] font-black text-slate-200 mt-0.5">
              {success && data ? `${data.panX.toFixed(2)}m` : '0.00m'}
            </span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
            <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">מרחק עומק (Depth Z)</span>
            <span className="block text-[11px] font-black text-slate-200 mt-0.5">
              {success && data ? `${data.panZ.toFixed(2)}m` : '0.00m'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

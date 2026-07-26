'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Play, RotateCcw, X } from 'lucide-react';
import { MovieSelectionAnimationPreset } from '@/lib/validations/movie-selection-animation.schema';
import { getImageUrl } from '@/lib/tmdb';

interface MovieSelectionAnimationViewProps {
  movieTitle: string;
  posterPath: string | null;
  preset: MovieSelectionAnimationPreset;
  isActive: boolean;
  onTrigger: () => void;
  onClose: () => void;
}

export default function MovieSelectionAnimationView({
  movieTitle,
  posterPath,
  preset,
  isActive,
  onTrigger,
  onClose,
}: MovieSelectionAnimationViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Motion Vectors (Zero Reflow)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-6" dir="rtl">
      {/* Dynamic Backlight Refraction */}
      <div
        className="absolute -inset-4 rounded-[40px] blur-3xl opacity-60 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${preset.glowColor} 0%, ${preset.secondaryGlow} 60%, transparent 100%)`,
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(0,0,0,0.5)] rounded-[32px] p-6 md:p-8 overflow-hidden text-right"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest block">Liquid Glass 4.0</span>
              <h3 className="text-xl font-black text-white font-display">אנימציית הסרט הנבחר</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/90 border border-white/10">
              {preset.themeName}
            </span>
            {isActive && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="סגור תצוגה"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Interactive 3D Canvas Area */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            animate={
              isActive
                ? {
                    scale: [0.95, 1.05, 1],
                    rotateZ: [0, -3, 3, 0],
                  }
                : {}
            }
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative w-36 h-52 md:w-44 md:h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group cursor-pointer"
            onClick={onTrigger}
          >
            <Image
              src={getImageUrl(posterPath, 'w500')}
              alt={movieTitle}
              fill
              sizes="(max-width: 768px) 144px, 176px"
              className="object-cover transform-gpu group-hover:scale-110 transition-transform duration-700"
            />
            {/* Holographic Laser Sweep */}
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00e5ff] z-20 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute bottom-3 inset-x-3 text-center z-20">
              <span className="text-xs font-black text-white drop-shadow-md line-clamp-1">{movieTitle}</span>
            </div>
          </motion.div>

          {/* Action Trigger Overlay */}
          {!isActive && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTrigger}
              className="absolute bottom-4 left-4 px-5 py-2.5 bg-primary text-black rounded-xl font-black text-xs flex items-center gap-2 shadow-lg z-30"
            >
              <Play size={14} className="fill-current" />
              הפעל אנימציה
            </motion.button>
          )}

          {isActive && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTrigger}
              className="absolute bottom-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-xs flex items-center gap-2 border border-white/20 hover:bg-white/20 z-30"
            >
              <RotateCcw size={14} />
              נגן שוב
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

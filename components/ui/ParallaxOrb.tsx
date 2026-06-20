'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { getPaletteForMovie } from '@/lib/utils/color-sync';

interface ParallaxOrbProps {
  size?: number;
  offsetY?: string;
  offsetX?: string;
  parallaxFactor?: number; // Higher value = moves more (closer depth)
}

export default function ParallaxOrb({
  size = 400,
  offsetY = '20%',
  offsetX = '10%',
  parallaxFactor = 0.05,
}: ParallaxOrbProps) {
  const selectedMovie = useBookingStore((state) => state.selectedMovie);

  const palette = useMemo(() => {
    return getPaletteForMovie(selectedMovie?.genre_ids || []);
  }, [selectedMovie]);

  // Mouse tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for hardware-accelerated movement
  const springX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  // Map coordinate offsets based on depth (parallax factor)
  const translateX = useTransform(springX, (val) => val * parallaxFactor);
  const translateY = useTransform(springY, (val) => val * parallaxFactor);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center coordinates relative to window
      const xOffset = e.clientX - window.innerWidth / 2;
      const yOffset = e.clientY - window.innerHeight / 2;

      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        top: offsetY,
        left: offsetX,
        x: translateX,
        y: translateY,
        background: `radial-gradient(circle at 30% 30%, ${palette.primary}2A 0%, ${palette.secondary}08 50%, transparent 100%)`,
        willChange: 'transform',
      }}
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute rounded-full border border-white/5 backdrop-blur-[60px] saturate-[180%] pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.3)]"
    />
  );
}

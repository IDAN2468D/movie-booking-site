'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

interface HolographicVIPPassProps {
  tierName: string;
  points: number;
  glowColor: string;
  badge: string;
  activeStep: number;
}

export function HolographicVIPPass({
  tierName,
  points,
  glowColor,
  badge,
  activeStep,
}: HolographicVIPPassProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Map mouse position to degree rotation (max 15 degrees)
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Get dynamic icons and styles based on step
  const getStepStyles = () => {
    switch (activeStep) {
      case 0:
        return {
          iconColor: 'text-primary',
          accentBorder: 'border-primary/40',
          bgGlow: 'radial-gradient(circle at 50% 50%, rgba(255,20,100,0.15) 0%, transparent 60%)',
          shimmerGlow: 'rgba(255,20,100,0.3)',
        };
      case 1:
        return {
          iconColor: 'text-cyan-400',
          accentBorder: 'border-cyan-500/40',
          bgGlow: 'radial-gradient(circle at 50% 50%, rgba(10,239,255,0.15) 0%, transparent 60%)',
          shimmerGlow: 'rgba(10,239,255,0.3)',
        };
      default:
        return {
          iconColor: 'text-amber-400',
          accentBorder: 'border-amber-500/40',
          bgGlow: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.2) 0%, transparent 60%)',
          shimmerGlow: 'rgba(245,158,11,0.3)',
        };
    }
  };

  const currentStyles = getStepStyles();

  return (
    <div className="perspective-[1000px] w-full max-w-md aspect-[4/3] relative">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        }}
        className="w-full h-full rounded-[32px] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] p-8 flex flex-col justify-between overflow-hidden relative group transition-all duration-300 transform-gpu will-change-transform"
      >
        {/* Holographic light streak overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-black/35 pointer-events-none z-10" />
        
        {/* Dynamic inner glow */}
        <motion.div
          animate={{ background: currentStyles.bgGlow }}
          className="absolute inset-0 transition-all duration-700 pointer-events-none"
        />

        {/* Shimmer flare effect */}
        <div 
          className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${currentStyles.shimmerGlow} 0%, transparent 50%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Top Header Row */}
        <div style={{ transform: 'translateZ(40px)' }} className="flex justify-between items-start z-10 flex-row relative">
          <Crown className={`w-8 h-8 transition-colors duration-500 ${currentStyles.iconColor}`} />
          <div className="text-right">
            <p className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase font-sans">Liquid Member</p>
            <p className="text-sm font-bold text-white font-outfit">{tierName}</p>
          </div>
        </div>

        {/* Center Visuals */}
        <div style={{ transform: 'translateZ(60px)' }} className="flex-1 flex items-center justify-center relative my-6 z-10">
          <div className="relative flex flex-col items-center gap-2">
            <div className={`w-20 h-20 rounded-full bg-white/5 border ${currentStyles.accentBorder} flex items-center justify-center relative transition-all duration-500`}>
              <Sparkles className={`w-10 h-10 ${currentStyles.iconColor} animate-pulse`} />
              <div className="absolute inset-0 rounded-full animate-ping border border-white/5 opacity-20 pointer-events-none" />
            </div>
            <span className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-[0.2em] font-sans drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              {badge}
            </span>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div style={{ transform: 'translateZ(30px)' }} className="flex justify-between items-end z-10 flex-row relative">
          <div className="text-right">
            <p className="text-[8px] text-white/30 font-sans uppercase">Points Accumulated</p>
            <p className="text-xs font-mono font-bold text-white">{points.toLocaleString()} PTS</p>
          </div>
          <div className="text-left">
            <p className="text-[8px] text-white/30 font-sans uppercase">Club Tier Status</p>
            <p className={`text-xs font-black uppercase tracking-wider font-outfit ${currentStyles.iconColor}`}>
              {activeStep === 0 ? 'Classic' : activeStep === 1 ? 'IMAX Pro' : 'Platinum'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

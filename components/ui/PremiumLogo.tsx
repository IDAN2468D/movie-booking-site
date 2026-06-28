'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PremiumLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PremiumLogo: React.FC<PremiumLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: {
      container: 'gap-3',
      icon: 'w-16 h-16',
      text: 'text-2xl',
      subtitle: 'text-[9px]',
    },
    md: {
      container: 'gap-4',
      icon: 'w-24 h-24',
      text: 'text-3xl',
      subtitle: 'text-[11px]',
    },
    lg: {
      container: 'gap-5',
      icon: 'w-32 h-32',
      text: 'text-5xl',
      subtitle: 'text-[14px]',
    },
    hero: {
      container: 'gap-6',
      icon: 'w-40 h-40 md:w-56 md:h-56',
      text: 'text-[48px] md:text-[64px]',
      subtitle: 'text-[12px] md:text-[14px] mt-4',
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center group cursor-pointer ${currentSize.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated SVG Icon Container */}
      <div className={`relative ${currentSize.icon} drop-shadow-[0_0_15px_rgba(255,184,0,0.4)] group-hover:drop-shadow-[0_0_30px_rgba(255,184,0,0.7)] transition-all duration-500 shrink-0 rounded-2xl`}>
        
        {/* Glassmorphism Background (Deep Obsidian/Charcoal) */}
        <div className="absolute inset-0 bg-[#051424]/70 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          {/* Shimmer Streak Effect */}
          <motion.div 
            className="absolute top-0 -left-[100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg]"
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 3, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
          />
        </div>

        {/* SVG Elements animated via Framer Motion */}
        <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
          <svg height="100%" width="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <defs>
              <filter id="goldGlow" height="150%" width="150%" x="-25%" y="-25%">
                <feGaussianBlur result="blur" stdDeviation="4" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="tealGlow" height="150%" width="150%" x="-25%" y="-25%">
                <feGaussianBlur result="blur" stdDeviation="5" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Book Base (Film Strip outline) */}
            <motion.path 
              d="M30 60C30 60 65 50 100 60C135 50 170 60 170 60V140C170 140 135 130 100 140C65 130 30 140 30 140V60Z" 
              fill="none" 
              filter="url(#goldGlow)" 
              stroke="#FFB800" 
              strokeWidth="4"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Center Spine */}
            <motion.line 
              x1="100" x2="100" y1="60" y2="140" 
              stroke="white" 
              strokeWidth="2" 
              strokeDasharray="6 4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            />

            {/* Play Button */}
            <motion.path 
              d="M85 85L120 100L85 115V85Z" 
              fill="#00F0FF" 
              filter="url(#tealGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1, filter: "brightness(1.5)" }}
            />
          </svg>
        </div>
      </div>

      {/* Typographic Logo */}
      <div className="flex flex-col items-center text-center mt-1">
        <h1 className={`font-outfit ${currentSize.text} flex items-center gap-0.5 md:gap-1 font-black leading-none`}>
          <motion.span 
            className="text-white drop-shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            MOVIE
          </motion.span>
          <motion.span 
            className="text-[#FFB800] drop-shadow-[0_0_10px_rgba(255,184,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(255,184,0,0.9)] transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            BOOK
          </motion.span>
        </h1>
        
        {/* Subtitle is always rendered but scales based on size */}
        <motion.h2 
          className={`font-outfit ${currentSize.subtitle} text-white/80 tracking-[0.4em] uppercase mt-2 group-hover:text-white transition-colors duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Premium Cinema
        </motion.h2>
      </div>
    </motion.div>
  );
};

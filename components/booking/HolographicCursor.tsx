import React from 'react';
import { motion } from 'framer-motion';

interface HolographicCursorProps {
  x: number;
  y: number;
  color: string;
  userId: string;
}

export function HolographicCursor({ x, y, color, userId }: HolographicCursorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
      className="absolute top-0 left-0 pointer-events-none z-[100] flex flex-col items-start drop-shadow-xl"
      style={{ willChange: 'transform' }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color}
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_10px_currentColor]"
        style={{ transform: 'rotate(-20deg)', transformOrigin: 'top left' }}
      >
        <path d="M4 4l16 5.333-7.333 2.667L10 19.333z" />
      </svg>
      <div 
        className="mt-1 ml-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg backdrop-blur-md"
        style={{ backgroundColor: color }}
      >
        {userId.substring(0, 6)}
      </div>
    </motion.div>
  );
}

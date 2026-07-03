'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LobbyCursorProps {
  name: string;
  initialX: number;
  initialY: number;
}

export default function LobbyCursor({ name, initialX, initialY }: LobbyCursorProps) {
  return (
    <motion.g
      initial={{ x: initialX, y: initialY }}
      animate={{
        x: [initialX - 8, initialX + 12, initialX - 4, initialX + 8, initialX - 8],
        y: [initialY + 4, initialY - 8, initialY + 10, initialY - 4, initialY + 4]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="pointer-events-none"
    >
      {/* Hardware-accelerated pulse circle instead of heavy CPU/GPU SVG Gaussian blur filter */}
      <circle r="9" fill="#22D3EE" opacity="0.3" className="animate-ping" />
      <circle r="5" fill="#22D3EE" stroke="#000" strokeWidth="1.5" />
      
      <g transform="translate(10, -7)">
        <rect width="32" height="14" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="0.5" />
        <text x="16" y="10" textAnchor="middle" fill="#22D3EE" fontSize="7px" fontWeight="black">{name}</text>
      </g>
    </motion.g>
  );
}

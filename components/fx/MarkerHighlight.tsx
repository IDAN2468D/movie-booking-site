'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarkerHighlightProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * MarkerHighlight - A premium, hand-drawn highlight effect in the YUV.AI style.
 * Uses a slightly irregular SVG path to simulate a marker stroke.
 */
export const MarkerHighlight = ({ 
  children, 
  className = '', 
  delay = 0.5,
  color = '#E5FF00',
  strokeWidth = 14
}: MarkerHighlightProps) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -z-0 pointer-events-none translate-y-1">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* A slightly wobbly, hand-drawn path for that "organic" feel */}
          <motion.path
            d="M 2,16 C 15,14 25,16 45,15 C 65,14 85,16 98,14.5"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              filter: 'blur(0.5px)',
              opacity: 0.6,
              mixBlendMode: 'screen' 
            }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              duration: 0.8,
              delay,
              ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a natural stroke feel
            }}
          />
        </svg>
      </span>
    </span>
  );
};

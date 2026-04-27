'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HolographicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Dark Mesh */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Animated Holographic Fog */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 45, 0]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(10,239,255,0.03)_0%,transparent_50%)] blur-[60px] will-change-transform"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, -45, 0]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute -bottom-[50%] -right-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,159,10,0.03)_0%,transparent_50%)] blur-[60px] will-change-transform"
      />

      {/* Static Refraction Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      
      {/* Bottom Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}

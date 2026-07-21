'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface SubBassPulseVisualizerProps {
  isActive: boolean;
}

export const SubBassPulseVisualizer: React.FC<SubBassPulseVisualizerProps> = ({ isActive }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute rounded-full border border-white/20 bg-white/5"
            style={{
              width: '100vw',
              height: '100vw',
              maxWidth: '800px',
              maxHeight: '800px',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.0, 1.3] }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
            className="absolute rounded-full border border-white/30 bg-blue-500/10"
            style={{
              width: '80vw',
              height: '80vw',
              maxWidth: '600px',
              maxHeight: '600px',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              filter: 'blur(10px)',
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

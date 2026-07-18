'use client';

import React, { ReactNode } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { useAcousticWavefront } from '@/hooks/useAcousticWavefront';

interface AcousticWavefrontProps {
  children: ReactNode;
}

export const AcousticWavefront: React.FC<AcousticWavefrontProps> = ({ children }) => {
  const { initEngine, stopEngine, analyserRef, isActive } = useAcousticWavefront();
  const intensityData = new Uint8Array(1);
  
  // Motion values to drive the visualizer without triggering React re-renders
  const audioIntensity = useMotionValue(0);
  
  // Transform the intensity (0-255) into usable CSS values
  const scale1 = useTransform(audioIntensity, [0, 255], [1, 1.05]);
  const scale2 = useTransform(audioIntensity, [0, 255], [1, 1.15]);
  const opacity = useTransform(audioIntensity, [0, 255], [0.1, 0.6]);
  const blur = useTransform(audioIntensity, [0, 255], [10, 40]);

  useAnimationFrame(() => {
    if (analyserRef.current && isActive) {
      analyserRef.current.getByteTimeDomainData(intensityData);
      // Data is centered at 128, so we get the absolute deviation from the center
      const deviation = Math.abs(intensityData[0] - 128) * 2; 
      // Smooth the value slightly for better visual physics
      const current = audioIntensity.get();
      audioIntensity.set(current + (deviation - current) * 0.1);
    }
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      
      {/* Wavefront Ring 1 */}
      <motion.div 
        style={{ scale: scale1, opacity: opacity }}
        className="absolute inset-0 rounded-3xl bg-transparent border-2 border-[#00D1FF] pointer-events-none mix-blend-overlay"
      />
      
      {/* Wavefront Ring 2 (Outer, stronger blur) */}
      <motion.div 
        style={{ 
          scale: scale2, 
          opacity: useTransform(opacity, v => v * 0.5),
          filter: useTransform(blur, v => `blur(${v}px)`)
        }}
        className="absolute inset-[-20px] rounded-[3rem] bg-[#8A5CFF]/20 border border-[#8A5CFF] pointer-events-none mix-blend-screen"
      />

      {/* The actual content (e.g., YouTube iframe) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Overlay Toggle to comply with Autoplay rules */}
      {!isActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl transition-opacity group-hover:bg-black/60">
          <button 
            onClick={initEngine}
            className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-['Outfit'] font-bold tracking-widest backdrop-blur-md hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            הפעל חווית קולנוע (Acoustic Sync)
          </button>
        </div>
      )}

      {isActive && (
        <div className="absolute top-4 left-4 z-20">
           <button 
            onClick={stopEngine}
            className="w-8 h-8 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
            title="Stop Audio"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

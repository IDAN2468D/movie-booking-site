'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLiquidGlassStore } from '../../lib/store/liquidGlassStore';

export function BiometricIntensityMap() {
  const [active, setActive] = useState(false);
  const activeGenre = useLiquidGlassStore((state) => state.activeIntensityGenre);

  useEffect(() => {
    // Simulating initialization of the biometric sensor layer after 1s
    const timer = setTimeout(() => setActive(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  // Determine heatmap colors dynamically based on the verified schema parameters
  const isHorror = activeGenre === 'Horror' || activeGenre === 'Thriller';
  const isSciFi = activeGenre === 'Sci-Fi' || activeGenre === 'Action';
  
  const primaryAura = isHorror ? 'bg-red-600/30' : isSciFi ? 'bg-blue-600/30' : 'bg-pink-600/30';
  const secondaryAura = isHorror ? 'bg-orange-600/20' : isSciFi ? 'bg-cyan-600/20' : 'bg-purple-600/20';

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[40px] opacity-70">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {/* Deep volumetric heatmap overlay simulating emotional response zones entirely on the GPU thread */}
        <div className={`absolute top-[20%] left-[20%] w-[500px] h-[500px] ${primaryAura} rounded-full mix-blend-screen filter backdrop-blur-[60px] blur-[80px] saturate-[250%] transform-gpu will-change-transform animate-pulse`} />
        
        <div className={`absolute bottom-[10%] right-[10%] w-[450px] h-[450px] ${secondaryAura} rounded-full mix-blend-screen filter backdrop-blur-[50px] blur-[60px] saturate-[250%] transform-gpu will-change-transform`} style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full mix-blend-overlay filter blur-[100px] transform-gpu will-change-transform" />
      </motion.div>
    </div>
  );
}

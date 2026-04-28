'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { MeshBackground } from '../effects/MeshBackground';

export const CinematicFX = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springX = useSpring(mousePos.x, { stiffness: 50, damping: 20 });
  const springY = useSpring(mousePos.y, { stiffness: 50, damping: 20 });

  const [particles] = useState(() => 
    [...Array(6)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random(),
      duration: 10 + i * 2,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <MeshBackground />
      {/* 1. Cinematic Film Grain */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 2. Dynamic Light Streaks */}
      <motion.div 
        animate={{ 
          x: [-1000, 2000],
          opacity: [0, 0.5, 0] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear",
          delay: 2 
        }}
        className="absolute top-1/4 left-0 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent blur-md rotate-[-5deg]"
      />
      
      <motion.div 
        animate={{ 
          x: [2000, -1000],
          opacity: [0, 0.3, 0] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          delay: 5 
        }}
        className="absolute top-2/3 left-0 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-lg rotate-[10deg]"
      />

      {/* 3. Refractive Particles (Floating Glass) */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            x: springX,
            y: springY,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full will-change-transform"
          initial={{
            top: p.top,
            left: p.left,
            opacity: 0.1,
            scale: p.scale,
          }}
        >
          {/* Optimized particle: removed backdrop-blur-3xl which kills performance */}
          <div className="w-full h-full bg-white/10 border border-white/20 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
        </motion.div>
      ))}

      {/* 4. Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

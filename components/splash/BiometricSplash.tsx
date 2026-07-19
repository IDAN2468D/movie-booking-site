"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

export function BiometricSplash() {
  const [isVisible, setIsVisible] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Hide splash after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40; 
      const y = (e.clientY / window.innerHeight - 0.5) * -40; // Invert Y for natural tilt
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[999999] bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Volumetric Film Grain */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', backgroundRepeat: 'repeat' }} />
          
          {/* Dynamic Aura Gradient */}
          <motion.div 
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            animate={{
              background: [
                `radial-gradient(circle at 20% 20%, #FF1464 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 80%, #0AEFFF 0%, transparent 50%)`,
                `radial-gradient(circle at 50% 50%, #FF1464 0%, transparent 50%)`
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "background" }}
          />

          {/* Tilt Container */}
          <motion.div 
            className="relative z-10"
            style={{
              rotateX: mouseY,
              rotateY: mouseX,
              transformStyle: "preserve-3d"
            }}
          >
            <h1 className="text-6xl md:text-9xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 tracking-tighter"
                style={{ textShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,20,100,0.4)', transform: 'translateZ(50px)' }}>
              MOVIEBOOK
            </h1>
            <p className="text-center mt-4 text-white/50 tracking-[0.5em] font-['Inter'] uppercase text-xs md:text-sm font-bold drop-shadow-xl" 
               style={{ transform: "translateZ(30px)" }}>
              Cognitive Cinematic Experience
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

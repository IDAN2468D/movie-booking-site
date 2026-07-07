'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useLiquidGlassStore } from '../../lib/store/liquidGlassStore';

// 6 geometric shards simulating shattered glass
const SHARD_VECTORS = [
  { id: 1, path: 'M0,0 L50,0 L20,30 Z', mx: -150, my: -180, rotate: -45, scale: 0.9 },
  { id: 2, path: 'M50,0 L100,0 L80,40 L30,30 Z', mx: 120, my: -160, rotate: 30, scale: 1.1 },
  { id: 3, path: 'M100,0 L150,20 L90,60 Z', mx: 200, my: -80, rotate: 65, scale: 0.8 },
  { id: 4, path: 'M0,40 L30,20 L60,80 L0,100 Z', mx: -180, my: 120, rotate: -35, scale: 1.05 },
  { id: 5, path: 'M40,30 L90,50 L70,100 L20,80 Z', mx: 50, my: 180, rotate: 15, scale: 1.2 },
  { id: 6, path: 'M100,30 L150,40 L130,100 L80,90 Z', mx: 160, my: 150, rotate: 45, scale: 0.95 },
];

export function TicketShatterSimulator() {
  const isTicketShattered = useLiquidGlassStore((state) => state.isTicketShattered);
  const setTicketShattered = useLiquidGlassStore((state) => state.setTicketShattered);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hardware-accelerated cursor/gyro tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isTicketShattered) return;
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize -1 to 1 based on center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) / (rect.width / 2));
      mouseY.set((e.clientY - centerY) / (rect.height / 2));
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isTicketShattered, mouseX, mouseY]);

  if (!isTicketShattered) {
    return (
      <div className="relative w-full max-w-md mx-auto p-10 rounded-[32px] backdrop-blur-[40px] border border-white/[0.12] bg-neutral-950/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center transform-gpu will-change-transform transition-transform hover:scale-[1.02]">
        <h2 className="font-outfit text-3xl font-bold text-white tracking-tight mb-2">The Kinetic Ticket</h2>
        <p className="font-inter text-sm text-neutral-400">Transaction Confirmed & Locked.</p>
        
        <div className="mt-8 w-full border-t border-dashed border-white/20 pt-6 space-y-3">
          <div className="flex justify-between font-inter text-xs">
            <span className="text-white/60">ORDER ID</span>
            <span className="text-white font-medium">#LG4-0992-X</span>
          </div>
          <div className="flex justify-between font-inter text-xs">
            <span className="text-white/60">SEATS</span>
            <span className="text-white font-medium text-right">E4, E5 (VIP Glass)</span>
          </div>
        </div>

        <button 
          onClick={() => setTicketShattered(true)}
          className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 font-inter text-white text-sm font-semibold rounded-2xl border border-white/20 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          Shatter to Collectible
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center overflow-hidden touch-none">
      <div className="absolute inset-0 pointer-events-none">
        {SHARD_VECTORS.map((shard) => {
          // Calculate parallax intensity per shard mapped to raw vector arrays
          const xTransform = useTransform(smoothX, [-1, 1], [-shard.mx * 0.4, shard.mx * 0.8]);
          const yTransform = useTransform(smoothY, [-1, 1], [-shard.my * 0.4, shard.my * 0.8]);

          return (
            <motion.svg
              key={shard.id}
              className="absolute left-1/2 top-1/2 w-[150px] h-[100px] -ml-[75px] -mt-[50px] transform-gpu will-change-transform"
              initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              animate={{ 
                x: shard.mx, 
                y: shard.my, 
                rotate: shard.rotate, 
                scale: shard.scale,
                opacity: 0.8 
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              style={{ x: xTransform, y: yTransform }}
            >
              <path
                d={shard.path}
                className="fill-white/5 stroke-white/30 backdrop-blur-xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              />
            </motion.svg>
          );
        })}
      </div>
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        className="z-10 font-outfit text-white text-4xl font-black tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
      >
        COLLECTIBLE SECURED
      </motion.div>
    </div>
  );
}

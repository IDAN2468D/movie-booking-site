'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';
import { useLiquidGlassStore } from '../../lib/store/liquidGlassStore';
import { SnackTrayItem } from '../../lib/validations/liquidGlass';
import { usePouringAcoustics } from '@/hooks/usePouringAcoustics';

interface DropZone {
  id: string;
  x: number;
  y: number;
}

export function SnackDraggableItem({ item, dropZones }: { item: SnackTrayItem; dropZones: DropZone[] }) {
  const updateSnackPosition = useLiquidGlassStore((state) => state.updateSnackPosition);
  const { playPouringSound, unlockAudio } = usePouringAcoustics();
  
  // Decoupled motion values to prevent re-renders on every drag frame
  const x = useMotionValue(item.x);
  const y = useMotionValue(item.y);
  const controls = useAnimation();
  const dragRef = useRef<HTMLDivElement>(null);

  // Sync initial position if it changes from store externally
  useEffect(() => {
    controls.set({ x: item.x, y: item.y });
  }, [item.x, item.y, controls]);

  const handleDragEnd = () => {
    const currentX = x.get();
    const currentY = y.get();
    
    // Proximity collision detection (Atomic Radius: 75px)
    let snappedZone: DropZone | null = null;
    for (const zone of dropZones) {
      // Offset dropzone center vs drag item center
      const targetCenterX = zone.x + 16; 
      const targetCenterY = zone.y + 16;
      
      const dx = targetCenterX - currentX;
      const dy = targetCenterY - currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 75) {
        snappedZone = zone;
        break;
      }
    }

      if (snappedZone) {
      // Snap strictly to the target dropzone coordinates via Framer Motion spring
      const snapX = snappedZone.x + 16;
      const snapY = snappedZone.y + 16;
      controls.start({ x: snapX, y: snapY, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      
      console.log(`[SnackDraggable] Item ${item.id} snapped to ${snappedZone.id}. isPlaced: ${item.isPlaced}`);
      
      // If it wasn't placed before, play sound
      if (!item.isPlaced) {
        console.log(`[SnackDraggable] Calling playPouringSound...`);
        playPouringSound();
      }
      
      updateSnackPosition(item.id, snapX, snapY, true, snappedZone.id);
    } else {
      updateSnackPosition(item.id, currentX, currentY, false);
    }
  };

  return (
    <motion.div
      ref={dragRef}
      className="absolute w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] transform-gpu will-change-transform z-50 group"
      drag
      dragMomentum={false}
      style={{ x, y }}
      animate={controls}
      onDragStart={unlockAudio}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.15)', zIndex: 999 }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/80 to-blue-500/80 mb-2 shadow-inner drop-shadow-md group-active:scale-95 transition-transform" />
      <span className="font-inter text-[11px] font-semibold text-white px-2 text-center leading-tight tracking-wide z-10">
        {item.name}
      </span>
      
      <AnimatePresence>
        {item.isPlaced && (
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 bg-cyan-500/30 backdrop-blur-sm rounded-b-2xl transform-gpu origin-bottom z-0"
            style={{ height: '100%' }}
          >
            {/* Liquid Surface Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-300/80 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
            
            {/* Fizz Particles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 0], y: -20 }}
              transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.2 }}
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 1, 0], y: -15 }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
              className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {item.isPlaced && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 1.5 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-neutral-900 shadow-[0_0_10px_rgba(74,222,128,0.6)] z-20"
        />
      )}
    </motion.div>
  );
}

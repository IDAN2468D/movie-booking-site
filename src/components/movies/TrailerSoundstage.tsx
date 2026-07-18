import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';

interface TrailerSoundstageProps {
  onPositionChange: (x: number, y: number) => void;
}

export function TrailerSoundstage({ onPositionChange }: TrailerSoundstageProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="absolute top-4 right-4 w-32 h-32 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-2 z-50">
      <div className="text-[9px] text-white/70 uppercase tracking-widest text-center mb-1">
        Acoustic Soundstage
      </div>
      <div className="relative w-full h-[calc(100%-16px)] border border-white/10 rounded-lg overflow-hidden" ref={constraintsRef}>
        {/* Center crosshairs */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 pointer-events-none" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/10 pointer-events-none" />
        
        {/* Draggable sound source */}
        <motion.div
          className="absolute w-6 h-6 bg-primary rounded-full shadow-[0_0_15px_var(--tw-colors-primary)] cursor-grab active:cursor-grabbing flex items-center justify-center"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          dragMomentum={false}
          onDrag={(event, info) => {
            if (!constraintsRef.current) return;
            const bounds = constraintsRef.current.getBoundingClientRect();
            // Calculate percentage from center (-100 to 100)
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;
            
            // X goes left to right, Y goes top to bottom (but audio height is usually inverted)
            const xPercent = ((info.point.x - centerX) / (bounds.width / 2)) * 100;
            const yPercent = ((centerY - info.point.y) / (bounds.height / 2)) * 100;
            
            onPositionChange(
              Math.max(-100, Math.min(100, xPercent)),
              Math.max(-100, Math.min(100, yPercent))
            );
          }}
          initial={{ x: 38, y: 38 }} // Center of 28x28 bounds
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { useCineSyncStore } from '@/lib/store/cinesyncStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CineSyncSeatOverlay() {
  const { activeRoomId, participants, myUserId } = useCineSyncStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeRoomId) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!overlayRef.current) return;
      const rect = overlayRef.current.getBoundingClientRect();
      
      // Calculate cursor coordinates in percentages (0-100)
      const pctX = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const pctY = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      // Save to global window space for the sync loop to read
      (window as any).__cinesync_cursor = { x: pctX, y: pctY };
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.addEventListener('mousemove', onMouseMove, { passive: true });
      overlay.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    return () => {
      if (overlay) {
        overlay.removeEventListener('mousemove', onMouseMove);
        overlay.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [activeRoomId]);

  if (!activeRoomId) return null;

  // Filter out ourselves to only show other users' cursors
  const otherParticipants = participants.filter((p) => p.userId !== myUserId);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
    >
      <AnimatePresence>
        {otherParticipants.map((p) => {
          // Fallback coordinate checks
          const x = p.cursorX ?? 50;
          const y = p.cursorY ?? 50;

          return (
            <motion.div
              key={p.userId}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                x: `${x}%`, 
                y: `${y}%`,
                opacity: 1, 
                scale: 1 
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 15,
                mass: 0.1
              }}
              style={{
                position: 'absolute',
                left: -6, // offset to center cursor
                top: -6,  // offset to center cursor
              }}
              className="flex flex-col items-center pointer-events-none"
            >
              {/* Cursor Glow Point */}
              <div 
                className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-black/80 shadow-[0_0_12px_#22D3EE] animate-pulse"
              />
              
              {/* Floating Participant Tag */}
              <div className="mt-1 px-2 py-0.5 rounded bg-black/90 border border-cyan-500/30 shadow-2xl">
                <span className="text-[7px] font-black text-cyan-400 font-sans tracking-tight block whitespace-nowrap">
                  {p.name} {p.selectedSeat && `(${p.selectedSeat.replace('s-', '')})`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

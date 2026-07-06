'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketExport from '../booking/TicketExport';

interface KineticTicketTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: string | null;
  showtimeId: string; // for mock props
  movieTitle?: string;
}

export default function KineticTicketTransition({
  isOpen,
  onClose,
  seatId,
  showtimeId,
  movieTitle = 'Pulp Fiction',
}: KineticTicketTransitionProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (isOpen && seatId) {
      // Create initial shards logic
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 800, // explode outward X
        y: (Math.random() - 0.5) * 800, // explode outward Y
      }));
      setParticles(newParticles);
      setShowTicket(false);

      // Trigger the assembly phase
      const t1 = setTimeout(() => setShowTicket(true), 1200);

      return () => {
        clearTimeout(t1);
      };
    } else {
      setParticles([]);
      setShowTicket(false);
    }
  }, [isOpen, seatId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/80 backdrop-blur-[40px] overflow-hidden"
      >
        {/* Particle Explosion */}
        {!showTicket && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{ 
              scale: [0, Math.random() * 2 + 1, 0],
              x: [0, p.x, 0], // Explode out, then assemble in center
              y: [0, p.y, 0],
              rotate: [0, Math.random() * 720, 0]
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="absolute w-3 h-3 bg-emerald-400/80 shadow-[0_0_20px_#34d399] rounded-sm transform-gpu"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Shard shape
            }}
          />
        ))}

        {/* The Kinetic Ticket Assembly */}
        {showTicket && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px) hue-rotate(90deg)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px) hue-rotate(0deg)' }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="relative transform-gpu"
          >
            <TicketExport
              bookingId={showtimeId}
              movieTitle={movieTitle}
              seats={seatId ? [seatId] : []}
              date="2026-07-06"
              time="20:00"
              className="scale-110" // slightly larger for absolute preview
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute -top-12 right-0 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors border border-white/10"
            >
              סגור כרטיס קטיני
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

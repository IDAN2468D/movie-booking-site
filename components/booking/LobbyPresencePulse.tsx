"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PulsePoint {
  id: string;
  x: number; // percentage
  y: number; // percentage
  intensity: number; // 0.5 to 1.0
}

export default function LobbyPresencePulse() {
  const [pulsePoints, setPulsePoints] = useState<PulsePoint[]>([]);

  useEffect(() => {
    // Simulate real-time concurrent user seating clicks/presence in booking lobby
    const interval = setInterval(() => {
      const newPoint: PulsePoint = {
        id: Math.random().toString(),
        x: Math.random() * 80 + 10, // keep within container borders (10% - 90%)
        y: Math.random() * 80 + 10,
        intensity: Math.random() * 0.5 + 0.5,
      };

      setPulsePoints((prev) => [...prev.slice(-8), newPoint]); // Keep max 8 active points
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-transparent">
      {/* Background radial refraction canopy */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,7,11,0.2)_0%,rgba(0,0,0,0.8)_80%)]" />

      {/* Concurrent User Wavefront Ripples */}
      <AnimatePresence>
        {pulsePoints.map((point) => (
          <div
            key={point.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {/* Concentric Expanding Shockwaves */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 3 * point.intensity, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5 + i * 0.5,
                  ease: "easeOut",
                  repeat: 0,
                }}
                className="absolute w-24 h-24 rounded-full border border-cyan-400/20"
                style={{
                  filter: "blur(2px)",
                  background: `radial-gradient(circle, rgba(10,239,255,${0.03 / (i + 1)}) 0%, rgba(10,239,255,0) 70%)`,
                }}
              />
            ))}

            {/* Glowing Activity Node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white/50"
              style={{
                boxShadow: "0 0 15px #0AEFFF, 0 0 30px #0AEFFF",
              }}
            />

            {/* Floating Label simulating another user */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.6, y: -12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute whitespace-nowrap text-[9px] font-Outfit text-cyan-300 font-bold bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20 backdrop-blur-md -translate-x-1/2"
            >
              משתמש פעיל ⚡
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PulseEvent {
  id: string;
  message: string;
  size: "small" | "medium" | "large";
  x: number;
  y: number;
}

export function SocialPulseRings() {
  const [pulses, setPulses] = useState<PulseEvent[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/pulse/stream");

    eventSource.addEventListener("pulse", (event) => {
      const data = JSON.parse(event.data) as PulseEvent;
      setPulses((prev) => [...prev, data]);

      // Remove after animation completes (approx 8 seconds)
      setTimeout(() => {
        setPulses((current) => current.filter((p) => p.id !== data.id));
      }, 8000);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {pulses.map((pulse) => {
          const maxRadius = pulse.size === "large" ? 400 : pulse.size === "medium" ? 250 : 150;
          
          return (
            <motion.div
              key={pulse.id}
              className="absolute flex items-center justify-center"
              style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              {/* Ripple Ring 1 */}
              <motion.div
                className="absolute rounded-full border-[1.5px] border-[#0AEFFF]/40 shadow-[0_0_30px_rgba(10,239,255,0.4)]"
                animate={{ width: [0, maxRadius], height: [0, maxRadius], opacity: [1, 0] }}
                transition={{ duration: 5, ease: "easeOut" }}
              />
              {/* Ripple Ring 2 */}
              <motion.div
                className="absolute rounded-full border border-[#FF1464]/30"
                animate={{ width: [0, maxRadius * 0.8], height: [0, maxRadius * 0.8], opacity: [1, 0] }}
                transition={{ duration: 6, ease: "easeOut", delay: 0.2 }}
              />
              
              {/* Pulse Text / Metadata */}
              <motion.div
                className="absolute bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -20, -40] }}
                transition={{ duration: 5, ease: "easeInOut" }}
              >
                <Sparkles size={14} className="text-[#0AEFFF]" />
                <span className="text-white/80 font-['Inter'] text-xs font-medium" dir="rtl">{pulse.message}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

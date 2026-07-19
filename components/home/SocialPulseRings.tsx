"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { sendVibeCheckAction } from "@/app/actions/vibeActions";

interface PulseEvent {
  id: string;
  message: string;
  size: "small" | "medium" | "large";
  x: number;
  y: number;
  hasVibed?: boolean;
}

export function SocialPulseRings() {
  const [pulses, setPulses] = useState<PulseEvent[]>([]);
  const [vibedPulseIds, setVibedPulseIds] = useState<Set<string>>(new Set());
  const [receivedVibeId, setReceivedVibeId] = useState<string | null>(null);

  // Acoustic click synthesis
  const playVibeAcoustic = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio Context blocked or failed.');
    }
  }, []);

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

    eventSource.addEventListener("vibe_check", (event) => {
      const { pulseId } = JSON.parse(event.data);
      // Trigger a visual burst for this specific pulse ID
      setReceivedVibeId(pulseId);
      setTimeout(() => setReceivedVibeId(null), 1000);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const handleVibeClick = async (pulseId: string) => {
    if (vibedPulseIds.has(pulseId)) return;
    
    // Play acoustic feedback instantly
    playVibeAcoustic();
    
    // Optimistic UI update
    setVibedPulseIds(prev => new Set(prev).add(pulseId));

    // Send Server Action
    const res = await sendVibeCheckAction({ pulseId });
    if (!res.success) {
      console.error("Failed to send Vibe Check");
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {pulses.map((pulse) => {
          const maxRadius = pulse.size === "large" ? 400 : pulse.size === "medium" ? 250 : 150;
          const isVibed = vibedPulseIds.has(pulse.id);
          const isReceivingVibe = receivedVibeId === pulse.id;
          
          return (
            <motion.div
              key={pulse.id}
              className="absolute flex items-center justify-center pointer-events-auto"
              style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              {/* Ripple Ring 1 */}
              <motion.div
                className="absolute rounded-full border-[1.5px] border-[#0AEFFF]/40 shadow-[0_0_30px_rgba(10,239,255,0.4)]"
                animate={{ 
                  width: [0, maxRadius], 
                  height: [0, maxRadius], 
                  opacity: isReceivingVibe ? [1, 1, 0] : [1, 0],
                  borderColor: isReceivingVibe ? "#a855f7" : "#0AEFFF" // Shift to purple if vibed
                }}
                transition={{ duration: 5, ease: "easeOut" }}
              />
              {/* Ripple Ring 2 */}
              <motion.div
                className="absolute rounded-full border border-[#FF1464]/30"
                animate={{ width: [0, maxRadius * 0.8], height: [0, maxRadius * 0.8], opacity: [1, 0] }}
                transition={{ duration: 6, ease: "easeOut", delay: 0.2 }}
              />
              
              {/* Pulse Text / Metadata */}
              <motion.button
                onClick={() => handleVibeClick(pulse.id)}
                disabled={isVibed}
                className={`absolute backdrop-blur-md px-4 py-2 rounded-full border flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer
                  ${isVibed ? "bg-fuchsia-500/30 border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.5)]" : "bg-black/60 border-white/10 hover:bg-black/80 hover:border-[#0AEFFF]/50"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isVibed ? 1 : [0, 1, 1, 0], 
                  y: isVibed ? -20 : [10, 0, -20, -40],
                  scale: isReceivingVibe ? 1.2 : 1 
                }}
                transition={{ duration: isVibed ? 0.3 : 5, ease: "easeInOut" }}
              >
                {isVibed ? (
                  <Zap size={14} className="text-fuchsia-400" />
                ) : (
                  <Sparkles size={14} className="text-[#0AEFFF]" />
                )}
                <span className={`font-['Inter'] text-xs font-medium ${isVibed ? "text-fuchsia-100" : "text-white/80"}`} dir="rtl">
                  {isVibed ? "Vibe נשלח!" : pulse.message}
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

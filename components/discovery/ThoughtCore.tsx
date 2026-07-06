"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { BubbleToken } from "@/lib/validations/discovery";

interface ThoughtCoreProps {
  isAbsorbing: boolean;
  activeBubbles: BubbleToken[];
  coreRef: React.RefObject<HTMLDivElement | null>;
}

export function ThoughtCore({ isAbsorbing, activeBubbles, coreRef }: ThoughtCoreProps) {
  const [hasWindow, setHasWindow] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setHasWindow(true);
  }, []);

  // Play Acoustic Sub-bass wave on absorb
  useEffect(() => {
    if (isAbsorbing && hasWindow) {
      try {
        if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioCtx();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const panner = ctx.createPanner();

        // Sub-bass configuration
        osc.type = "sine";
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);

        filter.type = "lowpass";
        filter.frequency.value = 150;

        panner.panningModel = "HRTF";
        panner.setPosition(0, 0, 1);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (err) {
        console.warn("Acoustic Audio skipped", err);
      }
    }
  }, [isAbsorbing, hasWindow]);

  const hasBubbles = activeBubbles.length > 0;

  return (
    <div className="flex items-center justify-center relative w-full h-[350px]">
      {/* Core Glow Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        ref={coreRef}
        className={`w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/[0.15] flex items-center justify-center relative backdrop-blur-[20px] transition-all duration-500 ${isAbsorbing ? 'shadow-[0_0_80px_rgba(217,70,239,0.6)] border-fuchsia-500' : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(217,70,239,0.2)]'}`}
        style={{
          background: isAbsorbing || hasBubbles
            ? 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, rgba(5,7,11,0.6) 70%)' 
            : 'rgba(5, 7, 11, 0.4)'
        }}
        animate={{
          scale: isAbsorbing ? [1, 1.15, 1] : 1,
          filter: isAbsorbing ? ["brightness(1)", "brightness(1.5)", "brightness(1)"] : "brightness(1)",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Inner Core Pulse */}
        <motion.div 
          animate={{ 
            scale: isAbsorbing ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: isAbsorbing ? [0.5, 1, 0.5] : [0.2, 0.4, 0.2]
          }}
          transition={{ repeat: Infinity, duration: isAbsorbing ? 0.8 : 3, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full bg-fuchsia-500/20 blur-xl pointer-events-none"
        />
        
        <div className="text-center z-10 flex flex-col items-center pointer-events-none p-4">
          {isAbsorbing ? (
            <span className="font-['Outfit'] font-bold text-fuchsia-400 text-xl animate-pulse drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
              מסנכרן תודעה...
            </span>
          ) : hasBubbles ? (
            <div className="flex flex-col gap-2">
              <span className="font-['Outfit'] font-bold text-fuchsia-300 text-lg">
                המסננים שלך:
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {activeBubbles.map(b => (
                  <span key={b.id} className="px-2 py-1 bg-white/10 rounded-md text-sm text-white font-bold border border-white/20">
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="font-['Outfit'] font-bold text-gray-400 text-lg opacity-70">
              גרור בועות לכאן
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

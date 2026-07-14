"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActorAcousticNarrationProps {
  actorName: string;
  biography: string;
  notableRoles: string[];
}

export function ActorAcousticNarration({
  actorName,
  biography,
  notableRoles,
}: ActorAcousticNarrationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanAudio = () => {
    if (droneOscRef.current) {
      try {
        droneOscRef.current.stop();
      } catch {}
      droneOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => cleanAudio();
  }, []);

  const playBassDropAndStartDrone = (ctx: AudioContext) => {
    const t = ctx.currentTime;
    
    // 1. 40Hz Bass Drop
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFilter = ctx.createBiquadFilter();
    
    bassOsc.type = "sine";
    bassOsc.frequency.setValueAtTime(150, t);
    bassOsc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
    
    bassFilter.type = "lowpass";
    bassFilter.frequency.setValueAtTime(200, t);
    
    bassGain.gain.setValueAtTime(0.5, t);
    bassGain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
    
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    gainNodeConnect(bassGain, ctx);
    
    bassOsc.start(t);
    bassOsc.stop(t + 1.2);

    // 2. Continuous Cinematic Drone (Sawtooth 55Hz, lowpass 120Hz)
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();

    droneOsc.type = "sawtooth";
    droneOsc.frequency.setValueAtTime(55, t);

    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(120, t);

    droneGain.gain.setValueAtTime(0.05, t); // Soft ambient hum

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    gainNodeConnect(droneGain, ctx);

    droneOsc.start(t);
    droneOscRef.current = droneOsc;
  };

  const gainNodeConnect = (gainNode: GainNode, ctx: AudioContext) => {
    try {
      gainNode.connect(ctx.destination);
    } catch {}
  };

  const handleStartAudio = async () => {
    if (isPlaying) {
      cleanAudio();
      return;
    }

    setIsLoading(true);
    let currentScript = script;

    if (!currentScript) {
      try {
        const res = await fetch("/api/ai/actor-narration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actorName, biography, notableRoles }),
        });
        const data = await res.json();
        if (data.success && data.script) {
          currentScript = data.script;
          setScript(currentScript);
        }
      } catch (err) {
        console.error("Failed to generate actor narration script:", err);
      }
    }

    if (!currentScript) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsPlaying(true);

    try {
      const AudioContextClass = window.AudioContext || 
        (window as unknown as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        playBassDropAndStartDrone(ctx);
      }

      const utterance = new SpeechSynthesisUtterance(currentScript);
      utteranceRef.current = utterance;

      const voices = window.speechSynthesis.getVoices();
      const heVoice = voices.find((v) => v.lang.includes("he") || v.lang.includes("HE"));
      if (heVoice) utterance.voice = heVoice;

      utterance.rate = 0.82; // Slower, dramatic pacing
      utterance.pitch = 0.88; // Deeper tone

      utterance.onend = () => cleanAudio();
      utterance.onerror = () => cleanAudio();

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Audio playback initialization failed:", err);
      cleanAudio();
    }
  };

  return (
    <div 
      className="p-6 rounded-[2rem] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-[#00F0FF]/30"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)"
      }}
    >
      <h3 className="text-lg font-black text-white font-['Outfit'] flex items-center gap-2">
        <Sparkles size={16} className="text-[#00F0FF] animate-pulse" />
        דיוקן קולי אקוסטי
      </h3>
      
      <p className="text-xs text-gray-400 font-['Inter'] leading-relaxed">
        קריינות קולנועית תיאטרלית המבוססת על האפיון האישי ותפקידיו של {actorName}.
      </p>

      {/* Acoustic Wave Animation */}
      <div className="h-8 flex items-center justify-center gap-1.5 my-2">
        <AnimatePresence>
          {isPlaying ? (
            [...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0.3 }}
                animate={{ scaleY: [0.3, 1.2, 0.3] }}
                exit={{ scaleY: 0.3 }}
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 rounded-full bg-gradient-to-t from-[#00F0FF] to-violet-500 origin-center will-change-transform transform-gpu"
                style={{ height: "24px" }}
              />
            ))
          ) : (
            <div className="w-12 h-0.5 bg-white/20 rounded-full" />
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleStartAudio}
        disabled={isLoading}
        className={`w-full py-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all font-['Outfit'] ${
          isPlaying
            ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
            : "bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/20"
        } shadow-[0_0_15px_rgba(0,240,255,0.15)] disabled:opacity-50`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isPlaying ? (
          <>
            <VolumeX size={18} />
            עצור קריינות
          </>
        ) : (
          <>
            <Volume2 size={18} />
            הפעל דיוקן קולי
          </>
        )}
      </button>
    </div>
  );
}

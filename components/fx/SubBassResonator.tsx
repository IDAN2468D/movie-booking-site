"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface SubBassResonatorProps {
  mediaElementSelector?: string; // Optional selector to bind to an existing <video> or <audio>
}

export default function SubBassResonator({ mediaElementSelector = "video" }: SubBassResonatorProps) {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [bassIntensity, setBassIntensity] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastVibrationTime = useRef<number>(0);

  const controls = useAnimation();

  const toggleVibration = () => {
    // Request permission/initialize audio context on user gesture
    if (!audioContextRef.current) {
      initAudioPipeline();
    }
    setIsVibrationEnabled(prev => !prev);
  };

  const initAudioPipeline = () => {
    try {
      const mediaEl = document.querySelector(mediaElementSelector) as HTMLMediaElement;
      if (!mediaEl) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaElementSource(mediaEl);
      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(80, audioCtx.currentTime); // Filter above 80Hz (Bass range)

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      // Pipeline routing
      source.connect(lowpass);
      lowpass.connect(analyser);
      analyser.connect(audioCtx.destination); // Send audio to speakers

      setIsActive(true);
      startAnalysisLoop();
    } catch (err) {
      console.warn("AudioContext initialization bypassed or already running: ", err);
    }
  };

  const startAnalysisLoop = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average bass frequency energy
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedBass = average / 255; // 0.0 to 1.0
      setBassIntensity(normalizedBass);

      // Web Haptic Vibration Trigger (Throttled to avoid hardware fatigue)
      if (isVibrationEnabled && normalizedBass > 0.6) {
        const now = Date.now();
        if (now - lastVibrationTime.current > 150) {
          const duration = Math.min(50, Math.floor(normalizedBass * 80));
          if (navigator.vibrate) {
            navigator.vibrate(duration);
          }
          lastVibrationTime.current = now;
        }
      }

      animationFrameId.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  useEffect(() => {
    // Attempt automatic binding if media element is already playing
    const bindOnInteraction = () => {
      if (!audioContextRef.current) {
        initAudioPipeline();
      }
    };
    
    window.addEventListener("click", bindOnInteraction, { once: true });
    
    return () => {
      window.removeEventListener("click", bindOnInteraction);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, [mediaElementSelector]);

  // Framer Motion spring scaling for liquid pulse orb
  const scale = 1 + bassIntensity * 0.45;
  const shadowSpread = Math.floor(bassIntensity * 40);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-sm w-full mx-auto text-center">
      <h3 className="font-Outfit text-lg font-bold text-white mb-1">
        הדהוד באס אקוסטי (Haptic Bass Sync)
      </h3>
      <p className="font-Inter text-xs text-white/60 mb-4 leading-relaxed">
        חיישן אקוסטי המפעיל רטט דינמי במכשיר הנייד בהתאם לתדרי הסאב-באס של הטריילר.
      </p>

      {/* Dynamic Liquid Orb Visualizer */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <motion.div
          animate={{
            borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transform: `scale(${scale})`,
            boxShadow: `0 0 ${20 + shadowSpread}px rgba(10, 239, 255, ${0.2 + bassIntensity * 0.5})`,
          }}
          className="absolute w-24 h-24 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-purple-500/40 border border-cyan-400/20"
        />
        <div className="z-10 font-Outfit text-cyan-400 text-xs font-semibold tracking-wider">
          {isActive ? `${Math.round(bassIntensity * 100)}% BASS` : "STANDBY"}
        </div>
      </div>

      {/* Control Button */}
      <button
        onClick={toggleVibration}
        className={`px-5 py-2.5 rounded-xl font-Outfit text-xs font-bold tracking-wide transition-all duration-300 ${
          isVibrationEnabled
            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(10,239,255,0.2)]"
            : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
        }`}
      >
        {isVibrationEnabled ? "📳 רטט אקוסטי פעיל" : "📴 הפעל רטט אקוסטי"}
      </button>
    </div>
  );
}

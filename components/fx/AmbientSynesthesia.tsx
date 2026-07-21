'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AmbientSynesthesiaProps {
  imageUrl: string;
  movieId: number;
  movieTitle: string;
}

export default function AmbientSynesthesia({ imageUrl, movieId, movieTitle }: AmbientSynesthesiaProps) {
  const [isActive, setIsActive] = useState(false);
  const [dominantColor, setDominantColor] = useState<{ r: number, g: number, b: number } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Extract Color via Web Worker
  useEffect(() => {
    if (!imageUrl) return;

    workerRef.current = new Worker('/workers/color-extractor.worker.js');
    
    workerRef.current.onmessage = (e) => {
      if (e.data.success && e.data.color) {
        setDominantColor(e.data.color);
        // Adjust EQ if audio is already active
        if (filterRef.current) {
          applyColorToEQ(e.data.color, filterRef.current);
        }
      } else {
        console.warn('Color extraction failed:', e.data.error);
      }
    };

    // Use proxy for external image to bypass Canvas CORS issues
    const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;
    workerRef.current.postMessage({ imageUrl: proxyUrl });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [imageUrl]);

  const applyColorToEQ = (color: { r: number, g: number, b: number }, filter: BiquadFilterNode) => {
    // Map RGB to frequency. 
    // Red implies warmer, lower frequencies. Blue implies cooler, higher frequencies.
    // Base frequency is around 100Hz.
    // Red increases low frequency emphasis.
    // Blue shifts filter higher.
    const brightness = (color.r + color.g + color.b) / 3;
    const blueDominance = color.b / (color.r + color.g + color.b + 1);
    
    const targetFreq = 80 + (blueDominance * 200) + (brightness * 0.5); // Range ~80Hz to ~350Hz
    
    // Smooth transition
    if (audioContextRef.current) {
      filter.frequency.setTargetAtTime(targetFreq, audioContextRef.current.currentTime, 1.5);
    } else {
      filter.frequency.value = targetFreq;
    }
  };

  const toggleSynesthesia = () => {
    if (isActive) {
      stopAudio();
      setIsActive(false);
    } else {
      startAudio();
      setIsActive(true);
    }
  };

  const startAudio = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      // Use movieId to generate a unique base frequency (between 40Hz and 100Hz)
      const baseFreq = 40 + (movieId % 60);
      
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime); // Unique note per movie
      
      // Add a secondary oscillator for harmony based on title length
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, audioCtx.currentTime); // Perfect fifth
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      // Default frequency before color extraction
      filter.frequency.setValueAtTime(120, audioCtx.currentTime);
      filter.Q.setValueAtTime(2, audioCtx.currentTime);
      
      if (dominantColor) {
        applyColorToEQ(dominantColor, filter);
      }

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // Fade in
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 3);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc2.start();
      
      oscillatorRef.current = osc;
      // Store osc2 in a custom property to stop it later
      (osc as any)._osc2 = osc2;
      filterRef.current = filter;
    } catch (err) {
      console.warn("Failed to initialize AudioContext: ", err);
    }
  };

  const stopAudio = () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      const osc2 = (oscillatorRef.current as any)?._osc2;
      if (osc2) {
        try { osc2.stop(); } catch (e) {}
      }
      try { oscillatorRef.current?.stop(); } catch (e) {}
      audioContextRef.current.close();
      audioContextRef.current = null;
      oscillatorRef.current = null;
      filterRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const rgbString = dominantColor 
    ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`
    : 'rgba(255,255,255,0.1)';
    
  const rgbaString = dominantColor
    ? `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.2)`
    : 'rgba(255,255,255,0.05)';

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-2xl transition-all duration-700">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? 1 : 0.3,
        }}
        transition={{
          duration: 4,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${rgbaString} 0%, transparent 70%)`
        }}
      />
      
      <div className="z-10 flex flex-col items-center text-center space-y-3">
        <h3 className="font-Outfit text-lg font-bold text-white tracking-wide" style={{ textShadow: `0 0 15px ${rgbString}` }}>
          סינסטזיה סביבתית
        </h3>
        <p className="font-Inter text-xs text-white/50 max-w-xs leading-relaxed" dir="rtl">
          ה-AI מחלץ את צבעי הפוסטר ומשנה את תדרי האקוסטיקה ליצירת צליל אווירה ייחודי לסרט ״{movieTitle}״.
        </p>
        
        <button
          onClick={toggleSynesthesia}
          className="mt-4 px-6 py-2.5 rounded-full font-Outfit text-sm font-semibold transition-all duration-500 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isActive ? rgbString : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            boxShadow: isActive ? `0 0 20px ${rgbaString}` : 'none'
          }}
        >
          {isActive ? '🛑 הפסק סינסטזיה' : '🎵 הפעל חווית אודיו לסרט'}
        </button>
      </div>
    </div>
  );
}

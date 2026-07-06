"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubtitleSegment {
  time: number;
  text: string;
}

interface QuantumSubtitlesProps {
  mediaElementSelector?: string; // Binds to a video player
  subtitles?: SubtitleSegment[];
}

const mockSubtitles: SubtitleSegment[] = [
  { time: 0, text: "במעמקי היקום האפל..." },
  { time: 3, text: "כוח חדש עומד להתעורר." },
  { time: 6, text: "האם אתם מוכנים לחוויה הקולנועית הבאה?" },
  { time: 10, text: "הכינו את החושים שלכם." },
  { time: 14, text: "הסרט שכולם חיכו לו - עכשיו בהזמנה מוקדמת." },
];

export default function QuantumSubtitles({
  mediaElementSelector = "video",
  subtitles = mockSubtitles,
}: QuantumSubtitlesProps) {
  const [currentText, setCurrentText] = useState("");
  const [audioEnergy, setAudioEnergy] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaEl = document.querySelector(mediaElementSelector) as HTMLMediaElement;
    if (!mediaEl) return;

    // 1. Time-update subtitle sync
    const handleTimeUpdate = () => {
      const currentTime = mediaEl.currentTime;
      const activeSub = [...subtitles]
        .reverse()
        .find((sub) => currentTime >= sub.time);
      
      setCurrentText(activeSub ? activeSub.text : "");
    };

    mediaEl.addEventListener("timeupdate", handleTimeUpdate);

    // 2. Audio-reactive listener
    const initAudioReaction = () => {
      if (audioContextRef.current) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const source = ctx.createMediaElementSource(mediaEl);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 32;
        analyserRef.current = analyser;

        source.connect(analyser);
        analyser.connect(ctx.destination);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioEnergy(avg / 255); // Normalize 0 - 1

          animationRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Suppress audio route lock errors (common on autoplay blocks)
      }
    };

    mediaEl.addEventListener("play", initAudioReaction, { once: true });

    return () => {
      mediaEl.removeEventListener("timeupdate", handleTimeUpdate);
      mediaEl.removeEventListener("play", initAudioReaction);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, [mediaElementSelector, subtitles]);

  // Reactive springs mapping based on audio energy level
  const textScale = 1 + audioEnergy * 0.15;
  const textGlow = audioEnergy * 15;
  const textWeight = 400 + Math.floor(audioEnergy * 400); // Shift weight dynamically (normal to bold)
  const textColor = audioEnergy > 0.65 ? "#FF1464" : "#0AEFFF"; // Dynamic crimson shift on explosion peaks

  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center pointer-events-none z-30 px-6">
      <AnimatePresence mode="wait">
        {currentText && (
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
            className="px-6 py-2.5 rounded-full bg-black/45 text-center max-w-2xl border border-white/5"
          >
            <motion.p
              dir="rtl"
              animate={{
                scale: textScale,
                textShadow: `0 0 ${textGlow}px ${textColor}`,
                fontWeight: textWeight,
                color: textColor,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className="font-Outfit text-sm sm:text-base tracking-wide select-none"
            >
              {currentText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

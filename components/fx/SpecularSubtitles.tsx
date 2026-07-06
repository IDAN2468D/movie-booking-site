"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/lib/store";
import { validateSubtitles, SubtitleItem } from "@/lib/validations/subtitles";
import SubtitleText from "./SubtitleText";

interface SpecularSubtitlesProps {
  mediaElementSelector?: string;
  defaultSubtitles?: SubtitleItem[];
}

export default function SpecularSubtitles({
  mediaElementSelector = "video",
  defaultSubtitles = [],
}: SpecularSubtitlesProps) {
  // Consume Zustand store state using atomic selectors
  const activeSubtitlesState = useBookingStore((state) => state.activeSubtitles);
  
  const [currentText, setCurrentText] = useState("");
  const [audioEnergy, setAudioEnergy] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Combine store subtitles or defaults, and validate them
  const rawSubtitles = activeSubtitlesState.length > 0 ? activeSubtitlesState : defaultSubtitles;

  useEffect(() => {
    // 1. Zod boundaries verification
    const validation = validateSubtitles(rawSubtitles);
    if (!validation.success) {
      setValidationError(validation.error || "Subtitles schema check failed");
      return;
    }
    setValidationError(null);

    const mediaEl = document.querySelector(mediaElementSelector) as HTMLMediaElement;
    if (!mediaEl) return;

    // 2. Sync subtitles on playback timeline update
    const handleTimeUpdate = () => {
      const currentTime = mediaEl.currentTime;
      const activeSegment = [...rawSubtitles]
        .reverse()
        .find((seg) => currentTime >= seg.time);
      setCurrentText(activeSegment ? activeSegment.text : "");
    };

    mediaEl.addEventListener("timeupdate", handleTimeUpdate);

    // 3. Web Audio real-time Analyser pipeline setup
    const initAudioAnalyser = () => {
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
        
        const monitorFrequencies = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let totalEnergy = 0;
          for (let i = 0; i < dataArray.length; i++) {
            totalEnergy += dataArray[i];
          }
          const avgEnergy = totalEnergy / dataArray.length;
          setAudioEnergy(avgEnergy / 255); // scale to range 0.0 - 1.0

          animationFrameId.current = requestAnimationFrame(monitorFrequencies);
        };
        monitorFrequencies();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Handle audio routing lock errors from browser autoplay protections
      }
    };

    mediaEl.addEventListener("play", initAudioAnalyser, { once: true });

    return () => {
      mediaEl.removeEventListener("timeupdate", handleTimeUpdate);
      mediaEl.removeEventListener("play", initAudioAnalyser);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, [mediaElementSelector, rawSubtitles]);

  if (validationError) {
    return (
      <div className="absolute bottom-16 left-0 right-0 text-center text-xs font-Outfit text-red-500 bg-red-950/40 p-2 backdrop-blur-md rounded-lg max-w-sm mx-auto border border-red-500/20">
        שגיאת כתוביות: {validationError}
      </div>
    );
  }

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
              backdropFilter: "blur(12px) saturate(160%)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
            }}
            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 pointer-events-none"
          >
            <SubtitleText text={currentText} audioEnergy={audioEnergy} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

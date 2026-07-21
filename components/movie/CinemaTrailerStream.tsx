"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { KineticTypography } from "./KineticTypography";
import { DirectorsWhisper } from "./DirectorsWhisper";

export function CinemaTrailerStream({ tmdbId, youtubeKey = "dQw4w9WgXcQ", movieTitle = "Unknown Movie" }: { tmdbId?: string, youtubeKey?: string, movieTitle?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Simulated DOM video frame extraction for ambient outer glow (120Hz sync emulation)
    const intervalId = setInterval(() => {
      if (containerRef.current) {
        const randomHue = Math.floor(Math.random() * 360);
        containerRef.current.style.boxShadow = `0 0 40px hsl(${randomHue}, 80%, 50%, 0.3)`;
      }
    }, 150);

    return () => {
      clearInterval(intervalId);
      // Absolute instance tracking & clean player state destruction to bypass iframe memory leaks
      if (iframeRef.current) {
        iframeRef.current.src = "";
        iframeRef.current.remove();
        iframeRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black/50 border border-white/10 transition-shadow duration-300"
      style={{ aspectRatio: "16/9" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] to-transparent z-10 pointer-events-none" />
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
        className="w-full h-full object-cover relative z-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/80 font-['Outfit'] tracking-wider">
        LIVE STREAM
      </div>
      <KineticTypography />
      <DirectorsWhisper movieTitle={movieTitle} />
    </motion.div>
  );
}

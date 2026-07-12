"use client";

import React, { useState, useRef, useTransition } from "react";
import { PanInfo } from "framer-motion";
import { EmotionBubbles } from "./EmotionBubbles";
import { ThoughtCore } from "./ThoughtCore";
import { BubbleToken } from "@/lib/validations/discovery";
import { discoverMoviesAction } from "@/lib/actions/discovery";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGenreSynthesizer } from "@/lib/hooks/useGenreSynthesizer";
import { useProximityHaptics } from "@/lib/hooks/useProximityHaptics";
import {
  useSetDiscoveryOverTarget,
  useSetDiscoveryFocalScale,
  useSetDiscoveryActiveGenreId,
} from "@/lib/store/discoveryAudioStore";

interface DiscoveryCatalogProps {
  initialTrending: any[];
}

export function DiscoveryCatalog({ initialTrending }: DiscoveryCatalogProps) {
  const [activeBubbles, setActiveBubbles] = useState<BubbleToken[]>([]);
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [results, setResults] = useState<any[]>(initialTrending || []);
  const [isPending, startTransition] = useTransition();
  const coreRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [hoveredCoreId, setHoveredCoreId] = useState<string | null>(null);
  const { playSweep } = useGenreSynthesizer();
  const setOverTarget = useSetDiscoveryOverTarget();
  const setFocalScale = useSetDiscoveryFocalScale();
  const setActiveGenreId = useSetDiscoveryActiveGenreId();
  const { calculateTension } = useProximityHaptics(coreRef);

  const handleDrag = (event: any, info: PanInfo, bubble: BubbleToken) => {
    if (!coreRef.current) return;
    const coreRect = coreRef.current.getBoundingClientRect();
    const bubbleRect = (event.target as HTMLElement).getBoundingClientRect();
    const isIntersecting = !(
      bubbleRect.right < coreRect.left || bubbleRect.left > coreRect.right ||
      bubbleRect.bottom < coreRect.top || bubbleRect.top > coreRect.bottom
    );

    // Calculate Tension
    const coreCenter = { x: coreRect.left + coreRect.width / 2, y: coreRect.top + coreRect.height / 2 };
    const bubbleCenter = { x: bubbleRect.left + bubbleRect.width / 2, y: bubbleRect.top + bubbleRect.height / 2 };
    calculateTension(bubbleCenter, coreCenter, 300);

    if (isIntersecting && hoveredCoreId !== bubble.id) {
      setHoveredCoreId(bubble.id);
      playSweep(bubble.id);
      setOverTarget(true);
      setFocalScale(1.25);
      setActiveGenreId(bubble.id);
    } else if (!isIntersecting && hoveredCoreId === bubble.id) {
      setHoveredCoreId(null);
      setOverTarget(false);
      setFocalScale(1.0);
      setActiveGenreId(null);
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    bubble: BubbleToken
  ) => {
    if (!coreRef.current) return;
    const coreRect = coreRef.current.getBoundingClientRect();
    const bubbleRect = (event.target as HTMLElement).getBoundingClientRect();
    const isIntersecting = !(
      bubbleRect.right < coreRect.left || bubbleRect.left > coreRect.right ||
      bubbleRect.bottom < coreRect.top || bubbleRect.top > coreRect.bottom
    );

    calculateTension({ x: 9999, y: 9999 }, { x: 0, y: 0 }, 1); // Reset tension

    setHoveredCoreId(null);
    setOverTarget(false);
    setFocalScale(1.0);
    setActiveGenreId(null);

    if (isIntersecting) {
      setIsAbsorbing(true);
      playSweep(bubble.id);
      
      const newBubbles = [...activeBubbles];
      if (!newBubbles.find(b => b.id === bubble.id)) {
        newBubbles.push(bubble);
      }
      
      setActiveBubbles(newBubbles);

      startTransition(async () => {
        const res = await discoverMoviesAction({
          bubbles: newBubbles,
          page: 1,
          limit: 20
        });
        
        if (res.success && res.data) {
          setResults(res.data.movies);
        }
        setTimeout(() => setIsAbsorbing(false), 800);
      });
    }
  };

  const clearBubbles = () => {
    setActiveBubbles([]);
    setResults(initialTrending);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-['Inter'] relative pb-24 overflow-hidden" dir="rtl">
      <div className="absolute inset-0 z-0 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center pt-24 px-4 md:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-['Outfit'] font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] mb-4">
            קטלוג דיסקברי
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            גרור בועות אל ליבת המחשבה כדי לגלות את החוויה הבאה שלך.
          </p>
        </header>

        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 mb-16">
          <div className="w-full lg:w-1/3">
            <EmotionBubbles onDragEnd={handleDragEnd} onDrag={handleDrag} />
          </div>
          <div className="w-full lg:w-1/3 relative">
            <ThoughtCore isAbsorbing={isAbsorbing} activeBubbles={activeBubbles} coreRef={coreRef} />
            {activeBubbles.length > 0 && (
              <button onClick={clearBubbles} className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-fuchsia-400 border border-fuchsia-400/50 rounded-full px-4 py-1 hover:bg-fuchsia-400/10 transition-colors">
                נקה מסננים
              </button>
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold font-['Outfit'] mb-6 px-4">{activeBubbles.length > 0 ? "תוצאות סינון" : "עכשיו בקולנוע"}</h2>
          <div ref={carouselRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing px-4 pb-12">
            <motion.div drag="x" dragConstraints={carouselRef} dragElastic={0.1} dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }} className="flex gap-6 w-max min-w-full">
            {results.length > 0 ? results.map((movie) => (
              <motion.div key={movie.id || movie._id} whileHover={{ scale: 1.03 }} className="flex-none w-64 md:w-72 relative rounded-3xl overflow-hidden aspect-[2/3] border border-white/[0.12] cursor-pointer bg-neutral-900 pointer-events-auto" style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)' }}>
                <Image src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400'} alt={movie.title || "Movie"} fill className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500" unoptimized draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/40 to-transparent flex flex-col justify-end p-5 pointer-events-none">
                  <h3 className="text-xl font-bold font-['Outfit'] text-white drop-shadow-md">{movie.displayTitle || movie.title}</h3>
                  {movie.vote_average > 0 && <div className="text-amber-400 text-sm font-bold mt-1">⭐ {movie.vote_average.toFixed(1)}</div>}
                </div>
              </motion.div>
            )) : <div className="text-gray-500 italic w-full text-center py-12">לא נמצאו תוצאות עבור המסננים שנבחרו</div>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

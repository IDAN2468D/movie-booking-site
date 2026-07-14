"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Star } from "lucide-react";
import { useAcousticFeedback } from "@/hooks/useAcousticFeedback";

export interface ActorFilm {
  movieId: string;
  title: string;
  characterName: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
}

interface SpecularTimelineProps {
  filmography: ActorFilm[];
}

export function SpecularTimeline({ filmography }: SpecularTimelineProps) {
  const { playTick } = useAcousticFeedback();

  if (!filmography || filmography.length === 0) return null;

  return (
    <div className="mt-16 w-full" dir="rtl">
      <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-3 font-['Outfit'] select-none">
        <Sparkles className="text-[#00F0FF] animate-pulse" />
        <span style={{ textShadow: "0 0 15px rgba(0, 240, 255, 0.4)" }}>
          ציר זמן פילמוגרפיה
        </span>
      </h2>

      <div className="relative border-r-2 border-white/10 pr-6 space-y-12 mr-4">
        {filmography.map((film, index) => (
          <motion.div
            key={film.movieId}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: index * 0.05,
            }}
            className="relative group will-change-transform transform-gpu"
          >
            {/* Timeline Dot with Glow */}
            <div className="absolute -right-[35px] top-6 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white/20 group-hover:border-[#00F0FF] group-hover:bg-[#00F0FF] transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] z-10" />

            {/* Film Card with Liquid Glass 4.0 Styling */}
            <Link
              href={`/movie/${film.movieId}`}
              onMouseEnter={playTick}
              className="block p-6 rounded-[2rem] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] transition-all duration-300 hover:border-[#00F0FF]/50 hover:bg-neutral-950/60"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Poster Frame */}
                <div className="relative w-24 h-36 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,0,0,0.4)] flex-shrink-0 transition-transform duration-500 group-hover:scale-105 will-change-transform transform-gpu">
                  <Image
                    src={film.posterUrl || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200"}
                    alt={film.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-between h-full text-center md:text-right">
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Outfit'] transition-colors group-hover:text-[#00F0FF] line-clamp-1">
                      {film.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 font-['Inter'] line-clamp-1">
                      בתפקיד: <span className="text-gray-200 font-medium">{film.characterName || "עצמו"}</span>
                    </p>
                  </div>

                  {/* Metadata Indicators */}
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 font-['Inter']">
                      <Calendar size={12} className="text-[#00F0FF]" />
                      {film.releaseYear}
                    </span>
                    {film.rating > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 font-['Inter']">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {film.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

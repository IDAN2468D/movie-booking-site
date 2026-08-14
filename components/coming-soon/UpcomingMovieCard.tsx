"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Play, Bell, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
import { useBookingStore } from "@/lib/store";
import { getImageUrl } from "@/lib/tmdb";

interface UpcomingMovieCardProps {
  movie: UpcomingMovie;
  onPlayTrailer: (movieId: number) => void;
  onHover: (movie: UpcomingMovie) => void;
  onOpenReminderModal: (movie: UpcomingMovie) => void;
  reminderVersion?: number;
}

export function UpcomingMovieCard({
  movie,
  onPlayTrailer,
  onHover,
  onOpenReminderModal,
  reminderVersion,
}: UpcomingMovieCardProps) {
  const { setAuraColor } = useBookingStore();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`movie_reminder_${movie.movieId}`);
      if (stored) setSavedEmail(stored);
    } catch { /* empty */ }

    if (!movie.releaseDate) return;
    const releaseDate = new Date(movie.releaseDate);

    const updateCountdown = () => {
      const today = new Date();
      const diffTime = releaseDate.getTime() - today.getTime();
      if (diffTime <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diffTime / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffTime / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffTime / 1000 / 60) % 60),
        seconds: Math.floor((diffTime / 1000) % 60),
      });
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [movie.movieId, movie.releaseDate, reminderVersion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const handleMouseEnter = () => {
    onHover(movie);
    const colors = ["#FF1464", "#00E5FF", "#7C3AED", "#10B981", "#F59E0B"];
    setAuraColor(colors[movie.movieId % colors.length]);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      className="gradient-border-card group relative flex flex-col rounded-3xl overflow-hidden bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] border border-white/10 shadow-2xl transition-all duration-500 font-inter cursor-pointer"
    >
      {/* Gradient Border Overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: 'radial-gradient(350px circle at var(--x, 50%) var(--y, 50%), rgba(6, 182, 212, 0.95), rgba(168, 85, 247, 0.8), transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.posterPath ? (
          <Image
            src={getImageUrl(movie.posterPath, 'w500')}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-white/50 text-xs">אין תמונה</span>
          </div>
        )}

        {/* Luxury Play Trailer Overlay on Card Hover */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); onPlayTrailer(movie.movieId); }}
            className="group/btn relative flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            {/* Animated Pulsing Ring */}
            <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 opacity-40 blur-sm group-hover/btn:opacity-75 transition-opacity animate-pulse" />
            <div className="relative z-10 w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center border border-white/40">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
            <span className="relative z-10 font-outfit tracking-wide drop-shadow">צפה בטריילר 4K</span>
          </button>
        </div>

        {timeLeft !== null && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 z-20" dir="ltr">
            <span className="font-mono tabular-nums text-cyan-300">
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
                ? "יוצא היום!"
                : `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
            </span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        )}

        {savedEmail && (
          <div className="absolute top-3 left-3 bg-emerald-500/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-bold text-[10px] flex items-center gap-1 shadow-lg z-20">
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>תזכורת פעילה</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 relative z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="font-outfit text-lg font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors" dir="rtl">
            {movie.title}
          </h3>
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Sparkles className="w-3 h-3" />
            {(movie.voteAverage || 8.5).toFixed(1)}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed" dir="rtl">
          {movie.overview || "אין תקציר זמין"}
        </p>

        <div className="mt-1 flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">
            {new Date(movie.releaseDate).toLocaleDateString('he-IL')}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onOpenReminderModal(movie); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              savedEmail ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${savedEmail ? 'fill-current' : ''}`} />
            <span>{savedEmail ? 'תזכורת נקבעה ✓' : 'הזכר לי'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check persistent storage for reminder email
    try {
      const stored = localStorage.getItem(`movie_reminder_${movie.movieId}`);
      if (stored) {
        setSavedEmail(stored);
      }
    } catch {
      // localStorage disabled fallback
    }

    if (!movie.releaseDate) return;
    const releaseDate = new Date(movie.releaseDate);

    const updateCountdown = () => {
      const today = new Date();
      const diffTime = releaseDate.getTime() - today.getTime();

      if (diffTime <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffTime / 1000 / 60) % 60);
      const seconds = Math.floor((diffTime / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [movie.movieId, movie.releaseDate, reminderVersion]);

  const handleMouseEnter = () => {
    onHover(movie);
    const colors = ["#FF1464", "#00E5FF", "#7C3AED", "#10B981", "#F59E0B"];
    setAuraColor(colors[movie.movieId % colors.length]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 font-inter cursor-pointer transform-gpu"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.posterPath ? (
          <Image
            src={getImageUrl(movie.posterPath, 'w500')}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-white/50 text-xs">אין תמונה</span>
          </div>
        )}

        {/* Play Trailer Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie.movieId);
            }}
            className="w-16 h-16 rounded-full bg-cyan-500/90 text-white flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform shadow-[0_0_30px_rgba(56,189,248,0.6)]"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        </div>

        {/* Countdown Badge */}
        {timeLeft !== null && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white font-bold text-xs flex items-center gap-1.5" dir="ltr">
            <span className="font-mono tabular-nums text-cyan-300">
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
                ? "יוצא היום!"
                : `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
            </span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        )}

        {/* Saved indicator pill */}
        {savedEmail && (
          <div className="absolute top-3 left-3 bg-emerald-500/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-bold text-[10px] flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>תזכורת פעילה</span>
          </div>
        )}
      </div>

      {/* Content */}
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
            onClick={(e) => {
              e.stopPropagation();
              onOpenReminderModal(movie);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              savedEmail
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20'
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

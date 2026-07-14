"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Play, Bell } from "lucide-react";
import Image from "next/image";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
import { useBookingStore } from "@/lib/store";

interface UpcomingMovieCardProps {
  movie: UpcomingMovie;
  onPlayTrailer: (movieId: number) => void;
  onHover: (movie: UpcomingMovie) => void;
}

export function UpcomingMovieCard({ movie, onPlayTrailer, onHover }: UpcomingMovieCardProps) {
  const { setAuraColor } = useBookingStore();
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
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
  }, [movie.releaseDate]);

  const handleMouseEnter = () => {
    onHover(movie);
    // Simple mock aura color based on movie ID for Liquid Glass effect
    const colors = ["#FF1464", "#00E5FF", "#7C3AED", "#10B981", "#F59E0B"];
    setAuraColor(colors[movie.movieId % colors.length]);
  };

  const handleSaveToCalendar = () => {
    setIsSaved(true);
    // Simple toast could be implemented here or just visual feedback
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/5 backdrop-blur-[40px] saturate-[250%] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] transition-all duration-500 font-inter cursor-pointer"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-white/50">אין תמונה</span>
          </div>
        )}
        
        {/* Play Trailer Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie.movieId);
            }}
            className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,20,100,0.5)]"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        </div>
        
        {/* Countdown Badge */}
        {timeLeft !== null && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white font-bold text-sm flex items-center gap-2" dir="ltr">
            <span className="font-mono tabular-nums">
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 
                ? "יוצא היום!" 
                : `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
            </span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 relative z-10 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="font-outfit text-xl font-bold text-white line-clamp-1 group-hover:text-primary transition-colors" dir="rtl">
          {movie.title}
        </h3>
        
        <p className="text-sm text-white/60 line-clamp-2" dir="rtl">
          {movie.overview || "אין תקציר זמין"}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/40 font-medium">
            {new Date(movie.releaseDate).toLocaleDateString('he-IL')}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveToCalendar();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isSaved 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
            }`}
          >
            <Bell className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? "נשמר בהצלחה!" : "הזכר לי"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

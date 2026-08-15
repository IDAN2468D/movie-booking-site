"use client";

import React, { useState, useCallback } from "react";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
import { UpcomingMovieCard } from "@/components/coming-soon/UpcomingMovieCard";
import { ReminderModal } from "@/components/coming-soon/ReminderModal";
import { getMovieTrailerAction } from "@/app/actions/movieActions";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/lib/store";
import { useTrailerStore } from "@/lib/store/trailer-store";
import { Sparkles, CalendarDays, Flame, Clapperboard } from "lucide-react";

import { getImageUrl } from "@/lib/tmdb";

interface ComingSoonClientProps {
  initialMovies: UpcomingMovie[];
}

export function ComingSoonClient({ initialMovies }: ComingSoonClientProps) {
  const [hoveredMovie, setHoveredMovie] = useState<UpcomingMovie | null>(null);
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  // Reminder modal states
  const [reminderMovie, setReminderMovie] = useState<UpcomingMovie | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [reminderVersion, setReminderVersion] = useState(0);

  // Filter state
  const [activeTab, setActiveTab] = useState<'all' | 'month' | 'top'>('all');

  const auraColor = useBookingStore((state) => state.auraColor);

  const handlePlayTrailer = async (movieId: number) => {
    const movieObj = initialMovies.find((m) => m.movieId === movieId) || null;

    try {
      const res = await getMovieTrailerAction(movieId);
      if (res.success && res.data && res.data.length > 0) {
        const trailer = res.data.find((v) => v.official) || res.data[0];
        openTrailer({
          movieId: String(movieId),
          movieTitle: movieObj?.title || "טריילר קולנועי",
          trailerKey: trailer.key,
          videoList: res.data.map((v) => ({ id: v.id, key: v.key, name: v.name, type: v.type })),
        });
      } else {
        alert("לא נמצא טריילר לסרט זה.");
      }
    } catch {
      alert("שגיאה בטעינת הטריילר.");
    }
  };

  const handleOpenReminderModal = (movie: UpcomingMovie) => {
    setReminderMovie(movie);
    try {
      const stored = localStorage.getItem(`movie_reminder_${movie.movieId}`);
      setSavedEmail(stored);
    } catch {
      setSavedEmail(null);
    }
    setIsReminderOpen(true);
  };

  const handleReminderSaved = (email: string) => {
    if (reminderMovie) {
      try {
        localStorage.setItem(`movie_reminder_${reminderMovie.movieId}`, email);
      } catch {
        // Fallback
      }
      setReminderVersion((v) => v + 1);
    }
  };

  const handleReminderRemoved = () => {
    if (reminderMovie) {
      try {
        localStorage.removeItem(`movie_reminder_${reminderMovie.movieId}`);
      } catch {
        // Fallback
      }
      setReminderVersion((v) => v + 1);
    }
  };

  const handleHover = useCallback((movie: UpcomingMovie) => {
    setHoveredMovie(movie);
  }, []);

  const filteredMovies = initialMovies.filter((movie) => {
    if (activeTab === 'top') return (movie.voteAverage || 0) >= 8.0;
    if (activeTab === 'month') {
      const rel = new Date(movie.releaseDate);
      const now = new Date();
      return rel.getMonth() === now.getMonth() && rel.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 overflow-hidden font-inter pt-20" dir="rtl">
      {/* Immersive Background layer */}
      <AnimatePresence mode="wait">
        {hoveredMovie && hoveredMovie.posterPath && (
          <motion.div
            key={hoveredMovie.movieId}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${getImageUrl(hoveredMovie.posterPath, 'original')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) saturate(160%)',
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${auraColor}22 0%, transparent 70%), linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)`
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                סרטים חדשים בדרך
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-outfit font-extrabold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              בקרוב בקולנוע
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mt-2 font-inter">
              גלו את הסרטים החמים ביותר שעומדים לצאת. הפעילו תזכורת אימייל פרסיסטנטית והיו הראשונים לדעת מתי נפתחת המכירה.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>הכל</span>
            </button>
            <button
              onClick={() => setActiveTab('month')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'month'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>יוצאים החודש</span>
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'top'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>המיוחלים ביותר</span>
            </button>
          </div>
        </header>

        {/* Reminder Modal */}
        <ReminderModal
          isOpen={isReminderOpen}
          movie={reminderMovie}
          savedEmail={savedEmail}
          onClose={() => setIsReminderOpen(false)}
          onReminderSaved={handleReminderSaved}
          onReminderRemoved={handleReminderRemoved}
        />

        {/* Grid of Movies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <UpcomingMovieCard
              key={movie.movieId}
              movie={movie}
              onPlayTrailer={handlePlayTrailer}
              onHover={handleHover}
              onOpenReminderModal={handleOpenReminderModal}
              reminderVersion={reminderVersion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

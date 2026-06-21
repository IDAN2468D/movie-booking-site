'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { getPopularMoviesAction } from '@/lib/actions/recommendations';
import NeuralMoodOrbit from '@/components/discovery/NeuralMoodOrbit';
import { Sparkles, Calendar, Star, Info } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  displayTitle: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  genre_ids: number[];
  overview: string;
}

// Map mood IDs to TMDB genre IDs
const MOOD_TO_GENRES: Record<string, number[]> = {
  adrenaline: [28, 53, 12], // Action, Thriller, Adventure
  drama: [18, 99], // Drama, Documentary
  laugh: [35], // Comedy
  horror: [27, 53], // Horror, Thriller
  romance: [10749], // Romance
  scifi: [878, 14], // Sci-Fi, Fantasy
};

export default function DiscoveryPage() {
  const { activeMoods } = useBookingStore();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Load movies
  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await getPopularMoviesAction();
        if (res.success && res.data) {
          setAllMovies(res.data);
          setFilteredMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  // Filter movies based on selected moods
  useEffect(() => {
    if (activeMoods.length === 0) {
      requestAnimationFrame(() => setFilteredMovies(allMovies));
      return;
    }

    // Get all genre IDs associated with current active moods
    const requiredGenres = activeMoods.flatMap((mood) => MOOD_TO_GENRES[mood] || []);

    // Filter movies that have at least one of these genre IDs
    const filtered = allMovies.filter((movie) => {
      return movie.genre_ids.some((genreId) => requiredGenres.includes(genreId));
    });

    requestAnimationFrame(() => setFilteredMovies(filtered));
  }, [activeMoods, allMovies]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-6 md:px-12" dir="rtl">
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-4 justify-start">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(255,159,10,0.2)] animate-pulse">
               <Sparkles className="text-primary w-6 h-6" />
            </div>
            <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.4em]">Neural Discovery System</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-outfit">
             גילוי סרטים <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">נוירוני</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl">
             שחרר את סרגלי החיפוש הישנים. גרור ושחרר בועות רגש לתוך ליבת המחשבה וסנכרן את רשימת הסרטים המתאימה ביותר לתחושה שלך עכשיו.
          </p>
        </motion.div>
      </div>

      {/* Interactive Orbit Center */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        <div className="lg:col-span-6 flex justify-center">
          <NeuralMoodOrbit />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-[30px] shadow-lg">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Info size={18} />
              <h3 className="text-lg font-black tracking-tight">כיצד להשתמש בגילוי הנוירוני?</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed font-bold">
              <li>1. לחץ והחזק בועת רגש צפה (כמו אדרנלין או קומדיה).</li>
              <li>2. גרור אותה אל עבר <strong>&quot;ליבת הרגש&quot;</strong> הלבנה שבמרכז העיגול.</li>
              <li>3. שחרר את הבועה. הליבה תיכנס לפעולה ותסנן את הסרטים המתאימים.</li>
              <li>4. ניתן לגרור מספר בועות רגש במקביל כדי לשלב סגנונות וליצור שילובים מיוחדים!</li>
            </ul>
          </div>

          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">תוצאות חיפוש נוירוניות</span>
            <span className="text-xs text-cyan-400 font-black">נמצאו {filteredMovies.length} סרטים מתאימים</span>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="col-span-full py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold">
                  לא נמצאו סרטים מתאימים לרגשות שבחרת.
                </div>
              ) : (
                filteredMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.03 }}
                    className="group relative bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                  >
                    <Link href={`/movie/${movie.id}`}>
                      <div className="relative h-44 w-full bg-slate-800">
                        {movie.poster_path ? (
                          <NextImage
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.displayTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 bg-slate-900">
                            אין תמונה
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[8px] font-black text-yellow-400 flex items-center gap-1">
                          <Star size={8} fill="currentColor" />
                          {movie.vote_average.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-3 text-right">
                        <h4 className="text-xs font-black text-white truncate">{movie.displayTitle}</h4>
                        <div className="flex items-center gap-1.5 mt-1 justify-start text-[8px] text-slate-500 font-bold">
                          <Calendar size={10} />
                          <span>{movie.release_date?.substring(0, 4) || '2024'}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

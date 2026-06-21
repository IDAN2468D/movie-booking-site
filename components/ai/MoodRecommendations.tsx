'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, UploadCloud, Loader2, Sparkles, X, Star, Pizza, Film } from 'lucide-react';
import { cn } from '@/lib/utils/index';
import NextImage from 'next/image';
import Link from 'next/link';
import { getPopularMoviesAction } from '@/lib/actions/recommendations';

interface Movie {
  id: number;
  displayTitle: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  genre_ids: number[];
  overview: string;
}

// Hebrew genre keywords mapping to TMDB genre IDs
const HEBREW_GENRE_MAP: Record<string, number> = {
  'פעולה': 28, 'אקשן': 28,
  'הרפתקאות': 12,
  'אנימציה': 16,
  'קומדיה': 35,
  'פשע': 80,
  'דוקומנטרי': 99, 'תיעודי': 99,
  'דרמה': 18,
  'משפחה': 10751,
  'פנטזיה': 14,
  'היסטוריה': 36,
  'אימה': 27,
  'מוזיקה': 10402,
  'מסתורין': 9648,
  'רומנטיקה': 10749, 'רומנטי': 10749,
  'מדע בדיוני': 878, 'מד"ב': 878,
  'מתח': 53, 'מותחן': 53,
  'מלחמה': 10752,
  'מערבון': 37
};

export default function MoodRecommendations() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    mood: string;
    analysis: string;
    genre: string;
    snackRecommendation: string;
  } | null>(null);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load popular movies for client-side filtering
  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await getPopularMoviesAction();
        if (res.success && res.data) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      }
    }
    loadMovies();
  }, []);

  // Filter movies when genre recommendations change
  useEffect(() => {
    if (!result || movies.length === 0) return;
    
    // Find matching genre IDs based on Hebrew genre returned
    const genreLower = result.genre.toLowerCase();
    const matchedGenreIds: number[] = [];
    
    Object.entries(HEBREW_GENRE_MAP).forEach(([key, value]) => {
      if (genreLower.includes(key)) {
        matchedGenreIds.push(value);
      }
    });

    if (matchedGenreIds.length === 0) {
      // Fallback: select 3 random popular movies
      setRecommendedMovies(movies.slice(0, 3));
      return;
    }

    const filtered = movies.filter(movie => 
      movie.genre_ids.some(id => matchedGenreIds.includes(id))
    );

    setRecommendedMovies(filtered.slice(0, 4));
  }, [result, movies]);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyzeMood = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePreview }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          mood: data.mood,
          analysis: data.analysis,
          genre: data.genre,
          snackRecommendation: data.snackRecommendation
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto liquid-glass rounded-3xl p-8 border border-white/10" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-primary" />
          גילוי סרטים מבוסס סלפי (Mood Analyzer)
        </h2>
        <p className="text-gray-400">העלה צילום פנים (סלפי) כדי לנתח את מצב הרוח הנוכחי ולקבל סרט + חטיף תואמים.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selfie Upload Area */}
        <div 
          className={cn(
            "relative aspect-[4/5] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer",
            isDragActive ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40 bg-white/5",
            imagePreview ? "border-transparent" : ""
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Selfie Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); setResult(null); }}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">צלם או העלה סלפי</p>
                  <p className="text-gray-500 text-sm mt-1">גרור תמונה או לחץ לבחירת קובץ</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic AI Results */}
        <div className="flex flex-col justify-between h-[500px]">
          {imagePreview && !result && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow flex items-center justify-center"
            >
              <button 
                onClick={analyzeMood}
                className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-yellow-600 text-black font-black text-xl hover:shadow-[0_0_40px_rgba(255,159,10,0.5)] transition-all duration-300 hover:scale-[1.02]"
              >
                נתח מצב רוח והתאם אירוע
              </button>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow flex flex-col items-center justify-center gap-4 h-full"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
              </div>
              <p className="text-primary font-medium animate-pulse text-xl">סורק פנים ומנתח אמוציות...</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-grow space-y-6 overflow-y-auto custom-scrollbar pr-2 h-full text-right"
            >
              {/* Mood Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-3 bg-primary/20 rounded-br-2xl border-r border-b border-white/5">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">מצב רוח מזוהה</p>
                <h3 className="text-2xl font-black text-white">{result.mood}</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Snack Card */}
              <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-3 bg-yellow-500/10 rounded-br-2xl border-r border-b border-yellow-500/10">
                  <Pizza className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xs text-yellow-500/60 font-bold uppercase tracking-wider mb-1">שילוב נשנוש ומשקה מומלץ</p>
                <p className="text-base text-gray-200 font-bold mt-1">{result.snackRecommendation}</p>
              </div>

              {/* Movie Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  <Film className="w-4 h-4" />
                  <span>סרטי {result.genre} מומלצים עבורך:</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {recommendedMovies.map((movie) => (
                    <Link 
                      href={`/movie/${movie.id}`}
                      key={movie.id}
                      className="group bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all text-right flex flex-col justify-between"
                    >
                      <div className="aspect-[2/3] bg-primary/20 rounded-lg mb-2 overflow-hidden relative border border-white/5">
                        {movie.poster_path && (
                          <NextImage
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.displayTitle}
                            fill
                            className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[7px] text-yellow-400 font-black flex items-center gap-0.5">
                          <Star size={6} fill="currentColor" />
                          {movie.vote_average.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-white truncate">{movie.displayTitle}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!imagePreview && (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 h-full border border-white/5 rounded-2xl bg-white/[0.02]">
              <Camera className="w-16 h-16 mb-4 opacity-50 text-gray-600 animate-pulse" />
              <p className="text-lg">הסלפי שלך יופיע כאן</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import MovieSwipeDeck from "./MovieSwipeDeck";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ShowcaseMatcherWrapper({ movies }: { movies: any[] }) {
  const [deckEmpty, setDeckEmpty] = useState(false);
  const [likedMovies, setLikedMovies] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalMatch, setFinalMatch] = useState<any>(null);
  const router = useRouter();

  const handleSwipeRight = (movieId: string | number) => {
    setLikedMovies(prev => [...prev, movieId.toString()]);
  };

  useEffect(() => {
    if (deckEmpty) {
      setIsAnalyzing(true);
      // Simulate Quantum AI processing
      setTimeout(() => {
        setIsAnalyzing(false);
        if (likedMovies.length > 0) {
          const matchIdStr = likedMovies[Math.floor(Math.random() * likedMovies.length)].toString();
          setFinalMatch(movies.find(m => m.id?.toString() === matchIdStr || m._id?.toString() === matchIdStr));
        } else {
          setFinalMatch(movies[Math.floor(Math.random() * Math.min(movies.length, 5))]);
        }
      }, 3500);
    }
  }, [deckEmpty, likedMovies, movies]);

  return (
    <div className="w-full max-w-md mx-auto" dir="ltr">
      {!deckEmpty && (
        <MovieSwipeDeck 
          initialMovies={movies.slice(0, 10)}
          onDeckEmpty={() => setDeckEmpty(true)}
          onSwipeRight={handleSwipeRight as any}
          sessionId="mock-session-123"
        />
      )}

      {deckEmpty && isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-black/40 border border-emerald-500/30 rounded-3xl backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.2)]"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin" />
            <div className="absolute inset-2 border-r-2 border-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-4 bg-emerald-500/20 rounded-full animate-pulse blur-md" />
            <svg className="absolute inset-0 m-auto w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl text-emerald-400 font-bold mb-3 font-['Outfit'] drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
            הבינה המלאכותית מחשבת...
          </h2>
          <p className="text-white/60 font-['Inter'] animate-pulse">מנתח תבניות העדפה נוירוניות</p>
        </motion.div>
      )}

      {deckEmpty && !isAnalyzing && finalMatch && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative text-center p-8 bg-black/60 border border-emerald-400 rounded-[2.5rem] backdrop-blur-2xl shadow-[0_0_80px_rgba(52,211,153,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden"
          dir="rtl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-50 blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl text-emerald-300 font-bold mb-6 font-['Outfit'] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">
            התאמה קוונטית מושלמת! 🎬
          </h2>
          
          <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]">
            <Image 
              src={`https://image.tmdb.org/t/p/w780${finalMatch.poster_path || finalMatch.posterPath}`}
              alt={finalMatch.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-3xl font-bold font-['Outfit'] drop-shadow-md text-right">{finalMatch.displayTitle || finalMatch.title}</h3>
              <p className="text-emerald-400 font-bold mt-1 text-lg text-right">99.8% התאמה נוירונית מלאכותית</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 relative z-10">
            <button 
              onClick={() => router.push(`/cinema/live/${finalMatch.id || finalMatch._id}`)}
              className="w-full py-4 bg-red-500/20 border border-red-500 text-red-500 font-bold rounded-xl text-lg hover:bg-red-500 hover:text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              הכנס לשידור חי
            </button>
            
            <button 
              onClick={() => router.push(`/movie/${finalMatch.id || finalMatch._id}`)}
              className="w-full py-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl text-lg hover:bg-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              הזמן כרטיסים
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

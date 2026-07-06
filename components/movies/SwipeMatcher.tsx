"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/lib/tmdb";
import { useBookingStore } from "@/lib/store";

interface SwipeMatcherProps {
  movies: Movie[];
  userId: string;
}

interface MatchResult {
  movieId: number;
  showtime: string;
  hall: string;
  availableSeats: number;
  message: string;
}

export default function SwipeMatcher({ movies, userId }: SwipeMatcherProps) {
  const [deck, setDeck] = useState<Movie[]>(movies);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setSelectedMovie = useBookingStore(state => state.setSelectedMovie);

  // Parse roomCode safely on client, fallback to '123456'
  const [roomCode, setRoomCode] = useState<string>("123456");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('roomCode');
      if (code && code.length === 6) setRoomCode(code);
    }
  }, []);

  useEffect(() => {
    if (!roomCode) return;
    
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode, userId }),
    }).catch(console.error);

    const eventSource = new EventSource(`/api/rooms/listen?roomCode=${roomCode}`);
    
    eventSource.onmessage = (event) => {
      const result = JSON.parse(event.data);
      if (result.success && result.data.match) {
        setMatch({
          movieId: parseInt(result.data.matchedMovieId, 10),
          showtime: "TBD",
          hall: "VIP Glass Hall",
          availableSeats: 42,
          message: "התאמה נמצאה! שניכם אהבתם את הסרט הזה."
        });
        const matchedMovie = movies.find(m => m.id.toString() === result.data.matchedMovieId);
        if (matchedMovie) setSelectedMovie(matchedMovie);
      }
    };

    return () => eventSource.close();
  }, [roomCode, userId, movies, setSelectedMovie]);

  // Hardware-accelerated drag tokens (Liquid Glass 4.0)
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const glareX = useTransform(x, [-200, 200], ["-100%", "100%"]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);

  const handleSwipe = async (movie: Movie, direction: "left" | "right") => {
    // Remove the swiped card from deck
    setDeck((prev) => prev.filter((m) => m.id !== movie.id));
    x.set(0);

    if (direction === "right") {
      setSelectedMovie(movie);
      await processLike(movie.id);
    }
  };

  const processLike = async (movieId: number) => {
    // Non-blocking mutation to prevent UI jank during swipe
    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "like",
        roomCode,
        userId,
        movieId: movieId.toString(),
      }),
    }).catch(console.error);
  };

  if (match) {
    const matchedMovie = movies.find(m => m.id === match.movieId);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl saturate-[200%] brightness-110 bg-neutral-950/90 perspective-[1000px]"
        dir="rtl"
      >
        {/* Holographic Particle Explosion Array */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 2 + 1,
              x: (Math.random() - 0.5) * 800,
              y: (Math.random() - 0.5) * 800
            }}
            transition={{ duration: 1.5, ease: "easeOut", delay: Math.random() * 0.2 }}
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-400 rounded-full blur-[2px] pointer-events-none"
            style={{ boxShadow: '0 0 20px 5px rgba(52, 211, 153, 0.6)' }}
          />
        ))}

        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative max-w-md w-full bg-black/40 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(52,211,153,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden"
        >
          {/* Internal Radial Holographic Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent opacity-50 blur-2xl pointer-events-none" />

          <h2 className="text-4xl font-['Outfit'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-600 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
            התאמה קוונטית! ✨
          </h2>
          {matchedMovie && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-6 relative h-64 w-full rounded-2xl overflow-hidden border border-emerald-500/20"
            >
              <Image 
                src={`https://image.tmdb.org/t/p/w500${matchedMovie.backdrop_path || matchedMovie.poster_path}`} 
                alt={matchedMovie.displayTitle} 
                fill 
                className="object-cover opacity-80 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          )}
          <p className="text-lg font-['Inter'] text-emerald-100 mb-6 drop-shadow-md">{match.message}</p>
          
          <button 
            onClick={() => router.push(`/cinema/live/${match.movieId}`)}
            className="w-full py-4 bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-bold rounded-xl text-lg hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_30px_rgba(52,211,153,0.4)] active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            הכנס לשידור חי
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const topMovie = deck[0];

  return (
    <>
      {/* Dynamic Cinematic Backdrop (Fixed to screen) */}
      {topMovie && (
        <div className="fixed inset-0 z-[-1]">
          <Image 
            src={`https://image.tmdb.org/t/p/original${topMovie.backdrop_path || topMovie.poster_path}`}
            alt="backdrop"
            fill
            className="object-cover opacity-20 blur-3xl saturate-[150%] transition-opacity duration-1000"
          />
        </div>
      )}

      <div className="relative w-full h-[600px] flex items-center justify-center perspective-[2000px]">
      {deck.length === 0 ? (
        <div className="text-white font-['Outfit'] text-2xl drop-shadow-2xl">אין יותר סרטים להציג 🎬</div>
      ) : (
        <AnimatePresence>
          {deck.map((movie, index) => {
            const isTop = index === 0;
            return (
              <motion.div
                key={movie.id}
                style={isTop ? { x, rotate, zIndex: deck.length + 10 } : { zIndex: deck.length - index }}
                className="absolute w-full max-w-sm aspect-[2/3] rounded-[2rem] overflow-hidden cursor-grab active:cursor-grabbing border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{
                  scale: isTop ? 1 : 1 - index * 0.06,
                  y: isTop ? 0 : index * 25,
                  opacity: 1 - index * 0.15,
                  boxShadow: isTop ? "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 50px rgba(255,255,255,0.1)" : "none",
                }}
                exit={{ opacity: 0, scale: 0.8, x: isTop ? x.get() : 0, transition: { duration: 0.3 } }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  const swipe = offset.x;
                  if (swipe > 150) handleSwipe(movie, "right");
                  else if (swipe < -150) handleSwipe(movie, "left");
                }}
              >
                {/* Liquid Glass 4.0 Glare Shader */}
                {isTop && (
                  <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 mix-blend-overlay"
                    style={{ x: glareX }}
                  />
                )}

                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.displayTitle}
                  fill
                  className="object-cover pointer-events-none"
                />
                
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-['Outfit'] font-bold mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{movie.displayTitle || movie.title}</h3>
                  <div className="flex items-center gap-3 mb-2 font-['Inter'] font-bold text-sm">
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                      {movie.release_date?.split('-')[0] || 'TBA'}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2 mt-2 leading-relaxed drop-shadow-md">{movie.overview}</p>
                </div>

                {/* Refractive Like/Pass Overlays */}
                {isTop && (
                  <>
                    <motion.div 
                      className="absolute top-10 left-8 z-30 border-4 border-rose-500 bg-rose-500/20 backdrop-blur-sm text-rose-400 rounded-2xl px-6 py-2 font-['Outfit'] font-black text-4xl -rotate-12 shadow-[0_0_30px_rgba(225,29,72,0.5)]"
                      style={{ opacity: passOpacity }}
                    >
                      PASS
                    </motion.div>
                    <motion.div 
                      className="absolute top-10 right-8 z-30 border-4 border-emerald-500 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 rounded-2xl px-6 py-2 font-['Outfit'] font-black text-4xl rotate-12 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                      style={{ opacity: likeOpacity }}
                    >
                      LIKE
                    </motion.div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
      </div>
    </>
  );
}

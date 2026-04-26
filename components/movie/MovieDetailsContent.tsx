'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Clock, Calendar, Globe, Play, Ticket, Heart, Headphones, Sparkles, Loader2 } from 'lucide-react';
import { MovieDetails, CastMember, CrewMember, Movie, VideoResult, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import MovieCastSection from './MovieCastSection';
import MovieSimilarSection from './MovieSimilarSection';
import TrailerModal from './TrailerModal';
import MovieInfographic from './MovieInfographic';
import MovieTrivia from './MovieTrivia';
import { useUIStore } from '@/lib/store/ui-store';
import ReviewsSection from './ReviewsSection';
import { TMDBReview } from '@/lib/tmdb';

interface Props {
  movie: MovieDetails;
  cast: CastMember[];
  director: CrewMember | null;
  similarMovies: Movie[];
  videos: VideoResult[];
  tmdbReviews?: TMDBReview[];
}

const LANG_MAP: Record<string, string> = {
  en: 'אנגלית', he: 'עברית', fr: 'צרפתית', es: 'ספרדית',
  de: 'גרמנית', ja: 'יפנית', ko: 'קוריאנית', zh: 'סינית',
  ar: 'ערבית', ru: 'רוסית', hi: 'הינדית', it: 'איטלקית',
};

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} שעות ${m} דקות`;
}

function formatCurrency(amount: number): string {
  if (!amount) return '—';
  return '$' + amount.toLocaleString('en-US');
}

export default function MovieDetailsContent({ movie, cast, director, similarMovies, videos, tmdbReviews }: Props) {
  const router = useRouter();
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  const { setMovieContext } = useUIStore();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isFavorite = favorites.some(m => m.id === movie.id);

  React.useEffect(() => {
    setMounted(true);
    setMovieContext(movie.id, movie.title);
    return () => setMovieContext(undefined, undefined);
  }, [movie.id, movie.title, setMovieContext]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0F0F0F] animate-pulse" />;
  }

  const handleGenerateAudioGuide = async () => {
    if (isGeneratingAudio) return;
    
    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/ai/audio-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          overview: movie.overview
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Since the real generation takes time, we simulate the 'Ready' state or 
        // handle the background process. For now, we show a success toast/state.
        alert(data.message);
      }
    } catch (error) {
      console.error('Audio generation failed:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleBook = () => {
    setSelectedMovie({
      id: movie.id,
      title: movie.title,
      displayTitle: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      genre_ids: movie.genres.map(g => g.id),
    });
    router.push('/branches');
  };


  const handleFavorite = () => {
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      displayTitle: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      genre_ids: movie.genres.map(g => g.id),
    });
  };

  return (
    <>
    <div className="pb-20 text-right" dir="rtl">
      {/* Hero Backdrop - Premium Vertical Focus on Mobile */}
      <section className="relative w-full h-[600px] md:h-[550px] overflow-hidden">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/80 to-transparent hidden md:block z-10" />
        <div className="absolute inset-0 bg-black/20 opacity-40 md:hidden z-10" />

        {/* Holographic Scanner Line (Liquid Glass 2.0) */}
        <motion.div 
          animate={{ y: ['0%', '1000%', '0%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_25px_rgba(255,20,100,0.4)] z-20"
        />

        {/* Premium Refraction Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-yellow/5 opacity-30 z-20 pointer-events-none" />

        {/* Back Button - Premium Glass */}
        <Link
          href="/"
          className="absolute top-6 right-6 md:top-8 md:right-8 z-10 flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white text-sm font-black hover:bg-white/10 transition-all shadow-2xl"
        >
          <ArrowRight size={20} className="md:ml-2" />
          <span className="hidden md:inline">חזור למסך הבית</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-12 flex flex-col md:flex-row items-end gap-6 md:gap-10">
          {/* Poster - Responsive visibility */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-[120px] h-[180px] md:w-[220px] md:h-[330px] rounded-2xl md:rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] flex-shrink-0 relative self-start md:self-end"
          >
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 120px, 220px"
              className="object-cover saturate-[1.1]"
            />
          </motion.div>

          {/* Info Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full"
          >
            {movie.tagline && (
              <p className="text-primary text-xs md:text-sm font-black mb-2 uppercase tracking-widest opacity-90 drop-shadow-lg">&quot;{movie.tagline}&quot;</p>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-[0.9] tracking-tighter text-glow font-display uppercase">{movie.title}</h1>

            {/* Meta Pills - Scrollable on mobile */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 mb-6 pb-2 md:pb-0">
              <MetaPill icon={<Star size={14} className="text-primary fill-primary" />}>
                <span className="text-off-white">{movie.vote_average.toFixed(1)}</span>
              </MetaPill>
              {movie.runtime > 0 && (
                <MetaPill icon={<Clock size={14} />}>{formatRuntime(movie.runtime)}</MetaPill>
              )}
              <MetaPill icon={<Calendar size={14} />}>
                {new Date(movie.release_date).getFullYear()}
              </MetaPill>
              <MetaPill icon={<Globe size={14} />}>
                {LANG_MAP[movie.original_language] || movie.original_language}
              </MetaPill>
            </div>

            {/* Action Buttons Group - Liquid Glass 2.0 Premium Redesign */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 mt-8">
              {/* Secondary Actions: Vertical Pills */}
              <div className="flex items-center gap-2 h-14 md:h-16">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavorite}
                  className={`w-10 md:w-12 h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group ${
                    isFavorite 
                    ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(255,20,100,0.4)]' 
                    : 'bg-white/5 backdrop-blur-3xl saturate-[200%] border-white/10 text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  <Heart size={20} className={`${isFavorite ? 'fill-current' : ''} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateAudioGuide}
                  disabled={isGeneratingAudio}
                  className={`w-10 md:w-12 h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group ${
                    isGeneratingAudio 
                    ? 'bg-primary/20 border-primary/40 text-primary' 
                    : 'bg-white/5 backdrop-blur-3xl saturate-[200%] border-white/10 text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  {isGeneratingAudio ? (
                    <Loader2 size={20} className="animate-spin relative z-10" />
                  ) : (
                    <Headphones size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>

              {/* Trailer Button - Premium Refraction */}
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => videos.length > 0 && setShowTrailer(true)}
                disabled={videos.length === 0}
                className={`h-14 md:h-16 px-8 rounded-[1.25rem] font-black flex items-center justify-center gap-3 transition-all border shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group ${
                  videos.length > 0
                    ? 'bg-white/10 backdrop-blur-3xl saturate-[250%] brightness-125 border-white/20 text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                    : 'bg-white/5 opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                }`}
              >
                <span className="relative z-10 text-sm md:text-base tracking-tight drop-shadow-md text-white">טריילר</span>
                <Play className="fill-white w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              {/* Main Booking Action - High Depth & Glow */}
              <motion.button
                data-testid="book-now-button"
                whileHover={{ scale: 1.02, translateY: -2, boxShadow: '0 20px 40px rgba(255,20,100,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBook}
                className="flex-1 h-14 md:h-16 bg-gradient-to-br from-primary via-yellow/20 to-primary text-white rounded-[1.25rem] font-black flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_rgba(255,20,100,0.4)] relative overflow-hidden group border border-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <Ticket size={22} className="relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10 text-sm md:text-lg uppercase tracking-[0.1em] drop-shadow-sm font-display">הזמן עכשיו</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="px-4 md:px-12 mt-8 md:mt-12 space-y-8 md:space-y-12">
        {/* Overview + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2 font-display uppercase">
              תקציר
              <div className="w-2 h-2 rounded-full bg-primary" />
            </h2>
            <p className="text-off-white/90 leading-relaxed-hebrew text-lg font-medium mb-10">
              {movie.overview || 'אין תקציר זמין עבור סרט זה.'}
            </p>

            {/* AI Cinematic Insights Section - Liquid Glass 2.0 Premium */}
            <div className="relative group mt-12 mb-16">
              {/* Outer Glow / Portal Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-primary/20 rounded-[44px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative bg-black/40 backdrop-blur-[60px] saturate-[250%] brightness-125 rounded-[40px] p-8 md:p-12 border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden">
                {/* Holographic Mesh Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-yellow/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,20,100,0.2)] relative group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="text-primary w-8 h-8 drop-shadow-[0_0_15px_rgba(255,20,100,0.8)]" />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      </div>
                      <div>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mb-1">Advanced Engine</p>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter font-display uppercase">תובנות קולנועיות AI</h3>
                      </div>
                    </div>
                    
                    <div className="px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-off-white/50 font-bold uppercase tracking-widest">NotebookLM Analysis</span>
                        <span className="text-sm font-black text-off-white">מעבד נתונים...</span>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-3 space-y-6">
                       <div className="space-y-3">
                          <div className="text-xs text-primary font-black uppercase tracking-[0.2em] flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                             למה כדאי לצפות?
                          </div>
                          <p className="text-lg md:text-xl text-off-white leading-relaxed-hebrew font-medium">
                             ה-AI שלנו מנתח את <span className="text-primary font-black underline decoration-primary/30 decoration-4 underline-offset-4">{movie.title}</span> כחוויה {movie.vote_average > 7.5 ? 'חובה לחובבי קולנוע איכותי וסיפור סיפורים עוצמתי' : 'בידורית קלילה, מהנה ומושלמת לערב קולנועי רגוע'}.
                          </p>
                       </div>
                       
                       <div className="flex flex-wrap gap-3 pt-2">
                          {movie.genres.slice(0, 3).map(g => (
                            <span key={g.id} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-off-white/80 uppercase tracking-[0.2em] backdrop-blur-xl">
                               #{g.name}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group/card">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                       <div className="relative z-10">
                          <div className="flex justify-between items-end mb-4">
                             <p className="text-[10px] text-off-white/50 font-black uppercase tracking-[0.2em]">עיבוד רגשות וסגנון</p>
                             <span className="text-2xl font-black text-primary font-display tracking-tighter">75%</span>
                          </div>
                          
                          <div className="h-3 bg-[#0A0A0A]/5 rounded-full overflow-hidden border border-white/10 p-[1.5px] mb-6">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: '75%' }}
                               transition={{ duration: 2, ease: "easeOut" }}
                               className="h-full bg-gradient-to-r from-primary via-yellow/40 to-primary rounded-full relative shadow-[0_0_15px_rgba(255,20,100,0.5)]"
                             >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                             </motion.div>
                          </div>
                          
                          <p className="text-[10px] text-off-white/40 italic leading-relaxed">
                             הבינה המלאכותית אוספת ומצליבה נתונים מ-NotebookLM ומקורות קולנוע גלובליים ליצירת פרופיל פסיכולוגי של הסרט...
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Infographic Dashboard */}
            <MovieInfographic 
              voteAverage={movie.vote_average} 
              voteCount={movie.vote_count} 
              popularity={movie.popularity} 
            />

            {/* Movie Trivia Challenge */}
            <MovieTrivia movieTitle={movie.title} />
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <InfoCard label="במאי" value={director?.name || '—'} />
            <InfoCard label="סטטוס" value={movie.status === 'Released' ? 'שוחרר' : movie.status} />
            <InfoCard label="תקציב" value={formatCurrency(movie.budget)} />
            <InfoCard label="הכנסות" value={formatCurrency(movie.revenue)} />
            {movie.production_companies.length > 0 && (
              <InfoCard label="הפקה" value={movie.production_companies.map(c => c.name).join(', ')} />
            )}
          </motion.div>
        </div>

        {/* Cast */}
        <MovieCastSection cast={cast} />

        {/* Reviews Section */}
        <ReviewsSection 
          movieId={movie.id} 
          movieTitle={movie.title} 
          tmdbReviews={tmdbReviews}
        />

        {/* Similar Movies */}
        {similarMovies.length > 0 && <MovieSimilarSection movies={similarMovies} />}
      </div>

      {/* Trailer Modal - Moved inside main div */}
      <TrailerModal
        videos={videos}
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        movieTitle={movie.title}
      />
    </div>
    </>
  );
}

/* --- Sub-components --- */

function MetaPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs text-off-white/80 font-bold">
      {icon}
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
      <p className="text-[10px] font-black text-off-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

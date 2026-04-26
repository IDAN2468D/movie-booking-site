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
    <div className="pb-20 text-right selection:bg-primary selection:text-white" dir="rtl">
      {/* Hero Backdrop - Premium Vertical Focus on Mobile */}
      <section className="relative w-full h-[700px] md:h-[650px] overflow-hidden">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
        />
        {/* Dynamic Gradients (YUV-DESIGN Deep Black) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-background/90 to-transparent hidden md:block z-10" />
        <div className="absolute inset-0 bg-black/40 md:hidden z-10" />

        {/* Holographic Scanner Line (YUV-DESIGN Pink) */}
        <motion.div 
          animate={{ y: ['0%', '1000%', '0%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_40px_rgba(255,20,100,0.8)] z-20"
        />

        {/* Premium Refraction Overlay (Pink/Yellow) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-yellow/10 opacity-40 z-20 pointer-events-none" />

        {/* Back Button - YUV Sharp Style */}
        <Link
          href="/"
          className="absolute top-6 right-6 md:top-8 md:right-8 z-30 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-off-white text-xs font-display tracking-widest uppercase hover:bg-primary hover:border-primary transition-all shadow-2xl group"
        >
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          <span>BACK TO HOME</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-12 flex flex-col md:flex-row items-end gap-8 md:gap-12 z-20">
          {/* Poster - YUV Large Radius */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-[140px] h-[210px] md:w-[260px] md:h-[390px] rounded-[40px] md:rounded-[56px] overflow-hidden border-[1px] border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex-shrink-0 relative self-start md:self-end group"
          >
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 140px, 260px"
              className="object-cover saturate-[1.2] transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Info Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full"
          >
            {movie.tagline && (
              <p className="text-yellow text-[10px] md:text-xs font-display tracking-[0.3em] mb-3 uppercase opacity-90 drop-shadow-lg">
                &quot;{movie.tagline}&quot;
              </p>
            )}
            <h1 className="text-5xl md:text-8xl font-display text-off-white mb-6 leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {movie.title}
            </h1>

            {/* Meta Pills - YUV Rounded Full */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
              <MetaPill icon={<Star size={14} className="text-yellow fill-yellow" />}>
                {movie.vote_average.toFixed(1)}
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

            {/* Action Buttons Group - YUV-DESIGN Style */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <div className="flex items-center gap-3 h-14 md:h-16">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavorite}
                  className={`w-14 md:w-16 h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                    isFavorite 
                    ? 'bg-primary border-primary text-off-white' 
                    : 'bg-white/5 backdrop-blur-3xl border-white/10 text-off-white hover:bg-white/10'
                  }`}
                >
                  <Heart size={22} className={`${isFavorite ? 'fill-current' : ''} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleGenerateAudioGuide}
                  disabled={isGeneratingAudio}
                  className={`w-14 md:w-16 h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                    isGeneratingAudio 
                    ? 'bg-yellow/20 border-yellow/40 text-yellow' 
                    : 'bg-white/5 backdrop-blur-3xl border-white/10 text-off-white hover:bg-white/10'
                  }`}
                >
                  {isGeneratingAudio ? (
                    <Loader2 size={22} className="animate-spin relative z-10" />
                  ) : (
                    <Headphones size={22} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>

              {/* Trailer Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => videos.length > 0 && setShowTrailer(true)}
                disabled={videos.length === 0}
                className={`h-14 md:h-16 px-10 rounded-full font-display tracking-widest uppercase flex items-center justify-center gap-3 transition-all border shadow-2xl relative overflow-hidden group ${
                  videos.length > 0
                    ? 'bg-white/10 backdrop-blur-3xl border-white/20 text-off-white hover:bg-white/20'
                    : 'bg-white/5 opacity-40 cursor-not-allowed border-white/5 text-off-white/20'
                }`}
              >
                <span className="relative z-10 text-xs">WATCH TRAILER</span>
                <Play className="fill-off-white w-3 h-3 relative z-10 group-hover:scale-125 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              {/* Main Booking Action - YUV Primary (Pink) */}
              <motion.button
                data-testid="book-now-button"
                whileHover={{ scale: 1.05, y: -4, boxShadow: '0 20px 40px rgba(255,20,100,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBook}
                className="flex-1 h-14 md:h-16 bg-primary text-off-white rounded-full font-display tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all shadow-[0_15px_40px_rgba(255,20,100,0.3)] relative overflow-hidden group border border-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <Ticket size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10 text-sm md:text-base">BOOK NOW</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="px-6 md:px-16 mt-12 md:mt-16 space-y-12 md:space-y-20">
        {/* Overview + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-display text-off-white mb-6 flex items-center gap-4 uppercase tracking-tighter">
              STORYLINE
              <div className="w-8 h-[2px] bg-primary" />
            </h2>
            <div className="text-off-white/70 leading-[1.8] text-lg font-body mb-12">
              {movie.overview || 'אין תקציר זמין עבור סרט זה.'}
            </div>

            {/* AI Cinematic Insights Section - YUV Redesign */}
            <div className="relative group mt-16 mb-24">
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-yellow/10 to-primary/30 rounded-[56px] blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
              
              <div className="relative bg-background/60 backdrop-blur-[80px] rounded-[48px] p-8 md:p-14 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Holographic Grain */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-yellow/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-primary/20 rounded-[24px] flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(255,20,100,0.2)] group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="text-primary w-10 h-10 drop-shadow-[0_0_15px_rgba(255,20,100,0.8)]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-primary font-display uppercase tracking-[0.5em] mb-2">NEURAL ENGINE v4.0</p>
                        <h3 className="text-3xl md:text-4xl font-display text-off-white tracking-tighter uppercase">CINEMATIC INSIGHTS</h3>
                      </div>
                    </div>
                    
                    <div className="px-8 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center gap-5">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-off-white/40 font-display uppercase tracking-widest">REAL-TIME ANALYSIS</span>
                        <span className="text-xs font-display text-off-white uppercase tracking-widest">PROCESSING...</span>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-3 space-y-8">
                       <div className="space-y-4">
                          <div className="text-[10px] text-primary font-display uppercase tracking-[0.3em] flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                             EXPECTATION ANALYSIS
                          </div>
                          <div className="text-xl md:text-2xl text-off-white/90 leading-relaxed font-body">
                             ה-AI שלנו מנתח את <span className="text-yellow font-display underline decoration-yellow/30 decoration-4 underline-offset-8 uppercase">{movie.title}</span> כחוויה {movie.vote_average > 7.5 ? 'חובה לחובבי קולנוע איכותי וסיפור סיפורים עוצמתי' : 'בידורית קלילה, מהנה ומושלמת לערב קולנועי רגוע'}.
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap gap-4 pt-4">
                          {movie.genres.slice(0, 3).map(g => (
                            <span key={g.id} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-display text-off-white/60 uppercase tracking-[0.2em] backdrop-blur-xl hover:bg-primary/20 hover:text-primary transition-colors cursor-default">
                               #{g.name}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-2 p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-3xl relative overflow-hidden group/card">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                       <div className="relative z-10">
                          <div className="flex justify-between items-end mb-5">
                             <p className="text-[10px] text-off-white/40 font-display uppercase tracking-[0.2em]">MOOD RESONANCE</p>
                             <span className="text-3xl font-display text-primary tracking-tighter">75%</span>
                          </div>
                          
                          <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px] mb-8">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: '75%' }}
                               transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                               className="h-full bg-primary rounded-full relative shadow-[0_0_20px_rgba(255,20,100,0.5)]"
                             >
                                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                             </motion.div>
                          </div>
                          
                          <p className="text-[11px] text-off-white/40 italic leading-relaxed font-body">
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

          {/* Sidebar Info - YUV Sharp Style */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-8">
              <h3 className="text-sm font-display text-primary uppercase tracking-[0.3em] mb-4">PRODUCTION DETAILS</h3>
              <InfoCard label="DIRECTOR" value={director?.name || '—'} />
              <InfoCard label="STATUS" value={movie.status === 'Released' ? 'שוחרר' : movie.status} />
              <InfoCard label="BUDGET" value={formatCurrency(movie.budget)} />
              <InfoCard label="REVENUE" value={formatCurrency(movie.revenue)} />
              {movie.production_companies.length > 0 && (
                <InfoCard label="STUDIO" value={movie.production_companies.map(c => c.name).join(', ')} />
              )}
            </div>
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
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 px-5 py-2 rounded-full text-xs text-off-white font-display tracking-widest uppercase">
      {icon}
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 py-4 border-b border-white/5 last:border-0 group">
      <p className="text-[9px] font-display text-off-white/40 uppercase tracking-[0.4em] group-hover:text-primary transition-colors">{label}</p>
      <p className="text-sm font-body text-off-white/80 group-hover:text-off-white transition-colors">{value}</p>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Clock, Calendar, Globe, Play, Ticket, Heart, Share2, Headphones, Sparkles, Loader2 } from 'lucide-react';
import { MovieDetails, CastMember, CrewMember, Movie, VideoResult, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import MovieCastSection from './MovieCastSection';
import MovieSimilarSection from './MovieSimilarSection';
import TrailerModal from './TrailerModal';
import MovieInfographic from './MovieInfographic';
import MovieTrivia from './MovieTrivia';
import { useUIStore } from '@/lib/store/ui-store';

interface Props {
  movie: MovieDetails;
  cast: CastMember[];
  director: CrewMember | null;
  similarMovies: Movie[];
  videos: VideoResult[];
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

export default function MovieDetailsContent({ movie, cast, director, similarMovies, videos }: Props) {
  const router = useRouter();
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  const { setMovieContext } = useUIStore();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const isFavorite = favorites.some(m => m.id === movie.id);

  React.useEffect(() => {
    setMovieContext(movie.id, movie.title);
    return () => setMovieContext(undefined, undefined);
  }, [movie.id, movie.title, setMovieContext]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `בדוק את הסרט הזה: ${movie.title}`,
        url: window.location.origin + `/movie/${movie.id}`,
      });
    } else {
      alert('השיתוף אינו נתמך בדפדפן זה. הקישור הועתק ללוח.');
      navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id}`);
    }
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
      {/* Hero Backdrop */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0F0F0F]/80 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-black/20 opacity-40 md:hidden" />

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
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-[0.9] tracking-tighter text-glow font-outfit">{movie.title}</h1>

            {/* Meta Pills - Scrollable on mobile */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 mb-6 pb-2 md:pb-0">
              <MetaPill icon={<Star size={14} className="text-primary fill-primary" />}>
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

            {/* Action Buttons Group */}
            <div className="grid grid-cols-4 sm:flex items-center gap-3 md:gap-4">
              <button
                onClick={handleBook}
                className="col-span-4 sm:flex-1 bg-primary hover:bg-[#FF7A00] text-background px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_rgba(255,159,10,0.3)] active:scale-95 text-sm md:text-lg uppercase tracking-widest"
              >
                <Ticket size={24} />
                הזמן עכשיו
              </button>
              
              <button
                onClick={() => videos.length > 0 && setShowTrailer(true)}
                disabled={videos.length === 0}
                className={`col-span-2 sm:flex-none h-14 md:h-16 px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95 text-xs md:text-sm ${
                  videos.length > 0
                    ? 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20'
                    : 'bg-white/5 opacity-40 cursor-not-allowed text-slate-500'
                }`}
              >
                <Play className="fill-white w-4 h-4" />
                טריילר
              </button>
              
              <div className="col-span-2 flex items-center gap-2 md:gap-4">
                <button
                  onClick={handleGenerateAudioGuide}
                  disabled={isGeneratingAudio}
                  className={`flex-1 h-14 md:h-16 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                    isGeneratingAudio 
                    ? 'bg-primary/20 border-primary/40 text-primary' 
                    : 'bg-white/10 backdrop-blur-xl border-white/10 text-white'
                  }`}
                >
                  {isGeneratingAudio ? <Loader2 size={18} className="animate-spin" /> : <Headphones size={18} />}
                </button>
                <button 
                  onClick={handleFavorite}
                  className={`flex-1 h-14 md:h-16 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                    isFavorite 
                    ? 'bg-primary border-primary text-background' 
                    : 'bg-white/10 backdrop-blur-xl border-white/10 text-white'
                  }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
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
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              תקציר
              <div className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
            </h2>
            <p className="text-slate-300 leading-[1.9] text-base font-medium mb-10">
              {movie.overview || 'אין תקציר זמין עבור סרט זה.'}
            </p>

            {/* AI Cinematic Insights Section */}
            <div className="bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/5 rounded-[40px] p-8 border border-primary/20 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                      <Sparkles className="text-primary w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">בינה מלאכותית: תובנות קולנועיות</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">למה כדאי לצפות?</p>
                       <p className="text-sm text-white/80 leading-relaxed">ה-AI שלנו מנתח את {movie.title} כחוויה {movie.vote_average > 7.5 ? 'חובה לחובבי קולנוע איכותי' : 'בידורית קלילה ומהנה'}. הסרט מתאפיין ב-{movie.genres.map(g => g.name).slice(0, 2).join(' ו-')}.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                       <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2">סטטוס ניתוח NotebookLM</p>
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-3/4 animate-pulse" />
                          </div>
                          <span className="text-xs font-bold text-white">75% מוכן</span>
                       </div>
                       <p className="text-[9px] text-slate-500 mt-3 italic">ה-AI אוסף נתונים ממקורות קולנוע גלובליים...</p>
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

        {/* Similar Movies */}
        {similarMovies.length > 0 && <MovieSimilarSection movies={similarMovies} />}
      </div>
    </div>

    {/* Trailer Modal */}
    <TrailerModal
      videos={videos}
      isOpen={showTrailer}
      onClose={() => setShowTrailer(false)}
      movieTitle={movie.title}
    />
    </>
  );
}

/* --- Sub-components --- */

function MetaPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-bold">
      {icon}
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Calendar, Globe, Play, Ticket, Heart, Share2, Headphones, Sparkles, Loader2 } from 'lucide-react';
import { MovieDetails, CastMember, CrewMember, Movie, VideoResult, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import MovieCastSection from './MovieCastSection';
import MovieSimilarSection from './MovieSimilarSection';
import TrailerModal from './TrailerModal';
import MovieAIChat from './MovieAIChat';
import MovieInfographic from './MovieInfographic';
import MovieTrivia from './MovieTrivia';

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
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const isFavorite = favorites.some(m => m.id === movie.id);

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
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      genre_ids: movie.genres.map(g => g.id),
    });
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
      <section className="relative w-full h-[550px] overflow-hidden">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#111]/80 to-transparent" />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-8 right-8 z-10 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
        >
          <ArrowRight size={18} />
          חזור
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 right-0 left-0 p-12 flex items-end gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block w-[220px] h-[330px] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl flex-shrink-0 relative"
          >
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              sizes="220px"
              className="object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 mb-2"
          >
            {movie.tagline && (
              <p className="text-[#FF9F0A] text-sm font-bold mb-2 italic">&quot;{movie.tagline}&quot;</p>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{movie.title}</h1>

            {/* Meta Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              <MetaPill icon={<Star size={14} className="text-[#FF9F0A] fill-[#FF9F0A]" />}>
                {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()})
              </MetaPill>
              {movie.runtime > 0 && (
                <MetaPill icon={<Clock size={14} />}>{formatRuntime(movie.runtime)}</MetaPill>
              )}
              <MetaPill icon={<Calendar size={14} />}>
                {new Date(movie.release_date).toLocaleDateString('he-IL')}
              </MetaPill>
              <MetaPill icon={<Globe size={14} />}>
                {LANG_MAP[movie.original_language] || movie.original_language}
              </MetaPill>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(g => (
                <span key={g.id} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-slate-300 uppercase tracking-widest">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBook}
                className="bg-[#FF9F0A] hover:bg-[#FF7A00] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
              >
                <Ticket size={20} />
                הזמן כרטיסים
              </button>
              <button
                onClick={() => videos.length > 0 && setShowTrailer(true)}
                disabled={videos.length === 0}
                className={`backdrop-blur-md text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10 active:scale-95 ${
                  videos.length > 0
                    ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                    : 'bg-white/[0.02] opacity-40 cursor-not-allowed'
                }`}
              >
                <Play size={20} className="fill-white" />
                {videos.length > 0 ? 'טריילר' : 'אין טריילר'}
              </button>
              <button
                onClick={handleGenerateAudioGuide}
                disabled={isGeneratingAudio}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                  isGeneratingAudio 
                  ? 'bg-primary/20 border-primary/40 text-primary' 
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'
                }`}
                title="מדריך קולי AI"
              >
                {isGeneratingAudio ? <Loader2 size={20} className="animate-spin" /> : <Headphones size={20} />}
              </button>
              <button 
                onClick={handleFavorite}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                  isFavorite 
                  ? 'bg-primary border-primary text-background' 
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button 
                onClick={handleShare}
                className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 transition-all text-white active:scale-95"
              >
                <Share2 size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="px-8 md:px-12 mt-12 space-y-12">
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
    <MovieAIChat movieId={movie.id} movieTitle={movie.title} />
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

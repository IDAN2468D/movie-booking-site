'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import dynamic from 'next/dynamic';
import CategoryFilters from './CategoryFilters';
import MovieSection from './MovieSection';
import FeaturedHero from './FeaturedHero';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import { X } from 'lucide-react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import StoryBar from '@/components/stories/StoryBar';
import { useFilteredMovies } from '@/hooks/useFilteredMovies';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

const SocialPulseRings = dynamic(
  () => import('./SocialPulseRings').then((m) => m.SocialPulseRings),
  { ssr: false }
);

interface HomeContentProps {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
  recommendationsNode?: React.ReactNode;
}

export default function HomeContent({ 
  popularMovies, 
  topRatedMovies, 
  trendingMovies,
  nowPlayingMovies,
  recommendationsNode
}: HomeContentProps) {
  const { activeCategory, setActiveCategory, selectedMovie, setSelectedMovie } = useBookingStore();
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!heroWrapperRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      gsap.to(heroWrapperRef.current, {
        scale: 0.94,
        y: 50,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroWrapperRef.current,
          scroller: scrollerEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroWrapperRef);

    return () => ctx.revert();
  }, []);

  const { moviesToShow, isGlobalFiltering, isLoadingGenre, isFiltering } = useFilteredMovies({
    popularMovies,
    topRatedMovies,
    trendingMovies,
    nowPlayingMovies,
  });

  const heroMovie = trendingMovies.find(m => m.poster_path && m.backdrop_path) 
    || popularMovies.find(m => m.poster_path && m.backdrop_path) 
    || trendingMovies[0] 
    || popularMovies[0];

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden [transform:translateZ(0)] day-night-transition">
      <HolographicBackground />
      <SocialPulseRings />
      
      <div className="relative z-10 [transform:translateZ(0)]">
        <StoryBar />
        <div 
          ref={heroWrapperRef}
          className="transform-gpu"
          style={{ transformOrigin: 'top center', willChange: 'transform, opacity' }}
        >
          {heroMovie && <FeaturedHero movie={heroMovie} />}
        </div>

        <div className="px-4 mt-8">
          <CategoryFilters />
        </div>

        {/* AI Recommendations Section */}
        {activeCategory === 'all' && (
          <div className="relative z-20">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
            {recommendationsNode}
          </div>
        )}



        <div className="space-y-4 mt-8">
          {isLoadingGenre || isFiltering ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <LoadingIndicator variant="orbit" size="lg" label="טוען סרטים..." />
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">
                {isFiltering ? 'מעבד נתונים (Quantum Worker)...' : 'טוען סרטים...'}
              </p>
            </div>
          ) : isGlobalFiltering ? (
            <MovieSection title="תוצאות מסוננות" movies={moviesToShow} />
          ) : activeCategory === 'all' ? (
            <>
              <MovieSection 
                title="מוקרן כעת" 
                movies={nowPlayingMovies.slice(0, 12)} 
                onSeeAll={() => setActiveCategory('recent')}
              />
              <MovieSection 
                title="סרטים פופולריים" 
                movies={popularMovies.filter(m => !nowPlayingMovies.slice(0, 12).some(np => np.id === m.id)).slice(0, 12)} 
                onSeeAll={() => setActiveCategory('trending')}
              />
              <MovieSection 
                title="הכי מדורגים" 
                movies={topRatedMovies.filter(m => !nowPlayingMovies.slice(0, 12).some(np => np.id === m.id) && !popularMovies.slice(0, 12).some(p => p.id === m.id)).slice(0, 12)} 
                onSeeAll={() => setActiveCategory('top')}
              />
            </>
          ) : (
            <MovieSection title="סרטי הקטגוריה" movies={moviesToShow} />
          )}
          
          {moviesToShow.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <p className="text-xl font-bold mb-2">לא נמצאו סרטים תואמים</p>
              <p className="text-sm">נסו לשנות את החיפוש או הפילטרים</p>
            </div>
          )}
        </div>

        {/* Mobile Booking Trigger (Liquid Glass 4.0 Pro) */}
        {selectedMovie && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="xl:hidden fixed bottom-20 left-4 right-4 mx-auto max-w-md bg-[#05070B]/80 backdrop-blur-3xl saturate-[220%] brightness-110 p-2.5 rounded-2xl flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-30 border border-white/15 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-cyan-500/10 opacity-50 pointer-events-none" />
            <div className="flex items-center gap-2.5 relative z-10 flex-1 min-w-0 pr-1">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 overflow-hidden relative shadow-lg shrink-0">
                <NextImage 
                  src={getImageUrl(selectedMovie.poster_path, 'w500')} 
                  alt={selectedMovie.displayTitle}
                  fill
                  sizes="40px"
                  className="object-cover saturate-[1.1]"
                />
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-[8px] text-primary font-black uppercase tracking-[0.2em] mb-0.5">סרט נבחר להזמנה</p>
                <p className="text-xs text-white font-black truncate leading-tight">{selectedMovie.displayTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10 shrink-0">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-booking'))}
                aria-label={`הזמן כרטיס לסרט ${selectedMovie.displayTitle}`}
                className="px-4 py-2 bg-gradient-to-r from-primary to-amber-500 text-white font-black rounded-xl text-[10px] uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                הזמן כרטיס
              </button>
              <button
                onClick={() => setSelectedMovie(null)}
                aria-label="בטל בחירת סרט"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

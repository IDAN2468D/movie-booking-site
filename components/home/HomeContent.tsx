'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import CategoryFilters from './CategoryFilters';
import MovieSection from './MovieSection';
import FeaturedHero from './FeaturedHero';
import { Movie } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import HolographicBackground from '@/components/ui/HolographicBackground';
import StoryBar from '@/components/stories/StoryBar';
import { useFilteredMovies } from '@/hooks/useFilteredMovies';

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
  const { activeCategory, setActiveCategory, selectedMovie } = useBookingStore();
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!heroWrapperRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      gsap.to(heroWrapperRef.current, {
        scale: 0.93,
        y: 60,
        opacity: 0.35,
        filter: 'blur(10px)',
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

  const { moviesToShow, isGlobalFiltering, isLoadingGenre } = useFilteredMovies({
    popularMovies,
    topRatedMovies,
    trendingMovies,
    nowPlayingMovies,
  });

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden [transform:translateZ(0)]">
      <HolographicBackground />
      
      <div className="relative z-10 [transform:translateZ(0)]">
        <StoryBar />
        <div 
          ref={heroWrapperRef}
          style={{ transformOrigin: 'top center' }}
        >
          <FeaturedHero movie={trendingMovies[0]} />
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
          {isLoadingGenre ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,159,10,0.3)]" />
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">טוען סרטים...</p>
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
                movies={popularMovies.slice(0, 12)} 
                onSeeAll={() => setActiveCategory('trending')}
              />
              <MovieSection 
                title="הכי מדורגים" 
                movies={topRatedMovies.slice(0, 12)} 
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

        {/* Mobile Booking Trigger (Liquid Glass 2.0) */}
        {selectedMovie && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="xl:hidden fixed bottom-28 left-6 right-6 mx-auto max-w-md bg-[#05070B]/60 backdrop-blur-3xl saturate-[220%] brightness-110 p-3.5 rounded-full flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] z-40 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-cyan-500/10 opacity-50 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0 pr-1">
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/15 overflow-hidden relative shadow-2xl shrink-0">
                <NextImage 
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                  alt={selectedMovie.displayTitle}
                  fill
                  sizes="44px"
                  className="object-cover saturate-[1.1]"
                />
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-[8px] text-primary font-black uppercase tracking-[0.25em] mb-0.5">הסרט שנבחר</p>
                <p className="text-xs text-white font-black truncate leading-tight">{selectedMovie.displayTitle}</p>
              </div>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-booking'))}
              className="px-5 py-3 bg-gradient-to-r from-primary to-yellow-500 text-white font-black rounded-full text-[10px] uppercase tracking-widest relative z-10 shadow-[0_10px_25px_rgba(255,20,100,0.35)] active:scale-95 transition-all shrink-0 ml-1 font-display"
            >
              <MarkerHighlight color="#ffffff" delay={0.1} strokeWidth={4}>
                הזמן כרטיס
              </MarkerHighlight>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

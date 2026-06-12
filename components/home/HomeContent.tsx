'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CategoryFilters from './CategoryFilters';
import MovieSection from './MovieSection';
import FeaturedHero from './FeaturedHero';
import CinemaShowcase from './CinemaShowcase';
import CinemaExperienceScrolly from './CinemaExperienceScrolly';
import TextScrollReveal from './TextScrollReveal';
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
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) setScrollContainer(mainEl);
  }, []);

  const { scrollYProgress } = useScroll({
    container: scrollContainer ? { current: scrollContainer } : undefined
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.93]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.35]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.3], ['blur(0px)', 'blur(10px)']);

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
        <motion.div 
          style={{ 
            scale: heroScale, 
            y: heroY, 
            opacity: heroOpacity, 
            filter: heroBlur,
            transformOrigin: 'top center',
            willChange: 'transform, opacity, filter'
          }}
        >
          <FeaturedHero movie={trendingMovies[0]} />
        </motion.div>

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

        {activeCategory === 'all' && (
          <>
            <CinemaShowcase />
            <TextScrollReveal />
            <CinemaExperienceScrolly />
          </>
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
            className="xl:hidden fixed bottom-28 left-6 right-6 mx-auto max-w-md bg-black/40 backdrop-blur-[40px] p-5 rounded-[32px] flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] z-40 border-[0.5px] border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/5 opacity-40 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative shadow-2xl shrink-0">
                <NextImage 
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                  alt={selectedMovie.displayTitle}
                  fill
                  sizes="48px"
                  className="object-cover saturate-[1.1]"
                />
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-0.5">הסרט שנבחר</p>
                <p className="text-sm text-white font-black truncate leading-tight">{selectedMovie.displayTitle}</p>
              </div>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-booking'))}
              className="px-5 py-3 bg-primary text-background font-black rounded-xl text-xs uppercase tracking-widest relative z-10 shadow-[0_15px_30px_rgba(255,159,10,0.3)] active:scale-95 transition-all shrink-0 ml-2"
            >
              <MarkerHighlight color="#000000" delay={0.1} strokeWidth={4}>
                הזמן 3 כרטיסים
              </MarkerHighlight>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

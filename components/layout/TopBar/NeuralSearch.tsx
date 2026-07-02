'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, SlidersHorizontal, TrendingUp, Clapperboard, Sparkles, ArrowRight } from 'lucide-react';
import NextImage from 'next/image';
import { discoverMovies, Movie, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';

interface NeuralSearchProps {
  onOpenFilter: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  onNeuralPipelineSync?: (results: Movie[]) => void;
}

// Result Pattern wrapper for Fuzzy Filtering
function fuzzyFilterMovies(movies: Movie[], query: string): { success: boolean; data?: Movie[]; error?: string } {
  if (!query) return { success: true, data: [] };
  try {
    const cleanQuery = query.trim().toLowerCase();
    const filtered = movies.filter((movie) => {
      const displayTitle = (movie.displayTitle || '').toLowerCase();
      const title = (movie.title || '').toLowerCase();
      const overview = (movie.overview || '').toLowerCase();
      return (
        displayTitle.includes(cleanQuery) ||
        title.includes(cleanQuery) ||
        overview.includes(cleanQuery)
      );
    });
    return { success: true, data: filtered };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Fuzzy filtering failed' };
  }
}

export default function NeuralSearch({
  onOpenFilter,
  isMobile,
  onCloseMobile,
  onNeuralPipelineSync,
}: NeuralSearchProps) {
  // Strict Zustand Selectors
  const setSelectedMovie = useBookingStore((state) => state.setSelectedMovie);
  const setGlobalSearchQuery = useBookingStore((state) => state.setSearchQuery);
  const allMovies = useBookingStore((state) => state.allMovies);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        setGlobalSearchQuery(searchQuery);

        // Perform instant fuzzy match against local movies list first
        const localResult = fuzzyFilterMovies(allMovies, searchQuery);
        if (localResult.success && localResult.data && localResult.data.length > 0) {
          setSearchResults(localResult.data.slice(0, 5));
          onNeuralPipelineSync?.(localResult.data);
          setIsSearching(false);
          return;
        }

        // Fallback to TMDB database search
        try {
          const results = await discoverMovies({ query: searchQuery });
          setSearchResults(results.slice(0, 5));
          onNeuralPipelineSync?.(results);
        } catch (error) {
          console.error('Neural Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setGlobalSearchQuery('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setGlobalSearchQuery, allMovies, onNeuralPipelineSync]);

  const handleResultClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const trendingSearches = ['אווטאר 3', 'חולית: חלק שני', 'מתקפת סייבר 2026', 'IMAX קרוב אלי'];

  return (
    <div className={`relative flex-1 group ${isMobile ? 'w-full' : 'max-w-5xl'} font-inter`}>
      <div className="relative flex items-center">
        {/* Optical ambient radial glow border (Zero reflow scale/opacity animations) */}
        <motion.div
          animate={{ opacity: isSearchFocused ? 1 : 0, scale: isSearchFocused ? 1.01 : 0.99 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-primary/30 to-yellow/10 blur-[30px] pointer-events-none"
        />

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="absolute right-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}

        <Search
          className={`absolute ${isMobile ? 'right-12' : 'right-6'} w-5 h-5 transition-all duration-300 ${
            isSearchFocused ? 'text-primary scale-110' : 'text-slate-300'
          }`}
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          placeholder={isMobile ? 'חפשו...' : 'חפשו סרטים, במאים או חווית קולנוע...'}
          className={`w-full bg-[#12131a] border border-white/20 rounded-[28px] ${
            isMobile ? 'py-3.5 pr-20 pl-16 text-sm' : 'py-6 pr-16 pl-32 text-base'
          } text-white focus:outline-none focus:border-primary focus:bg-[#161722] transition-all duration-300 placeholder:text-slate-400 font-bold tracking-tight shadow-3xl`}
        />

        <div className="absolute left-4 flex items-center gap-3">
          {!isMobile && (
            <div
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-zinc-800 border border-zinc-700 transition-opacity ${
                isSearchFocused ? 'opacity-20' : 'opacity-100'
              }`}
            >
              <Command size={11} className="text-slate-300" />
              <span className="text-[11px] font-black text-slate-300 tracking-tighter">K</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchFocused(false);
              onOpenFilter();
            }}
            className={`${
              isMobile ? 'w-9 h-9' : 'w-12 h-12'
            } flex items-center justify-center rounded-2xl border bg-zinc-850 text-slate-200 hover:bg-zinc-800 border-zinc-700 active:scale-95 transition-transform`}
          >
            <SlidersHorizontal size={isMobile ? 16 : 20} />
          </button>
        </div>
      </div>

      {/* GPU-Accelerated 120Hz Animation Dropdown container */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
            className={`absolute top-full right-0 left-0 ${
              isMobile ? 'mt-2 p-4 rounded-[32px]' : 'mt-6 p-8 rounded-[40px]'
            } bg-[#101115] border border-white/20 z-50 overflow-y-auto max-h-[80vh]`}
          >
            {searchQuery.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-outfit">תוצאות</p>
                  </div>
                  {!isMobile && (
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest opacity-95 font-outfit">
                      Specular Neural Scanner
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <div className="w-8 h-8 border-[2.5px] border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">סורק רשת...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleResultClick(movie)}
                        className={`flex items-center ${
                          isMobile ? 'gap-4' : 'gap-6'
                        } p-3 rounded-[24px] hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700 cursor-pointer transition-colors duration-200 group relative overflow-hidden`}
                      >
                        <div className={`${isMobile ? 'w-12 h-18' : 'w-16 h-24'} rounded-xl bg-zinc-800 overflow-hidden shadow-2xl border border-zinc-700 relative z-10`}>
                          {movie.poster_path ? (
                            <NextImage
                              src={getImageUrl(movie.poster_path)}
                              alt={movie.displayTitle}
                              fill
                              sizes="64px"
                              className="object-cover saturate-[1.1]"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <Clapperboard size={isMobile ? 18 : 24} className="text-slate-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-right relative z-10">
                          <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-black text-white group-hover:text-primary transition-colors mb-1 line-clamp-1 font-outfit`}>
                            {movie.displayTitle}
                          </p>
                          <div className="flex items-center justify-end gap-3">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30">
                              <span className="text-[10px] text-primary font-black">{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-200 font-black uppercase">
                              {movie.release_date ? String(movie.release_date).split('-')[0] : 'בקרוב'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest italic">אין תוצאות</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`flex flex-col ${isMobile ? 'gap-6' : 'gap-10'}`}>
                <div className={`${isMobile ? 'p-4' : 'p-6'} rounded-[24px] bg-gradient-to-r from-primary/20 via-primary/10 to-yellow/10 border border-primary/30 relative overflow-hidden group`}>
                  <div className="flex items-center gap-4">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30`}>
                      <Sparkles size={isMobile ? 20 : 28} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white group-hover:text-primary transition-colors tracking-tight font-outfit uppercase">
                        מנוע ההמלצות הנוירוני פעיל!
                      </p>
                    </div>
                  </div>
                </div>

                <section>
                  <div className="flex items-center gap-3 text-primary mb-4 px-2">
                    <TrendingUp size={14} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] font-outfit">חיפושים לוהטים</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-[10px] font-black text-slate-100 hover:bg-primary hover:text-background active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

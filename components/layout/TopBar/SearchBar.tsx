'use client';

import React from 'react';
import { Search, Command, SlidersHorizontal, TrendingUp, Clapperboard, Sparkles, History, ArrowRight, X } from 'lucide-react';
import NextImage from 'next/image';
import { discoverMovies, Movie, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';

interface SearchBarProps {
  onOpenFilter: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function SearchBar({ onOpenFilter, isMobile, onCloseMobile }: SearchBarProps) {
  const setSelectedMovie = useBookingStore((state) => state.setSelectedMovie);
  const setGlobalSearchQuery = useBookingStore((state) => state.setSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Movie[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        setGlobalSearchQuery(searchQuery);
        try {
          const results = await discoverMovies({ query: searchQuery });
          setSearchResults(results.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setGlobalSearchQuery('');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, setGlobalSearchQuery]);

  const handleResultClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const trendingSearches = ['אווטאר 3', 'חולית: חלק שני', 'מתקפת סייבר 2026', 'IMAX קרוב אלי'];

  return (
    <div className={`relative flex-1 group ${isMobile ? 'w-full' : 'max-w-5xl'}`}>
      <div className={`relative flex items-center transition-all duration-1000 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
        <div className={`absolute inset-0 rounded-full transition-all duration-700 bg-gradient-to-r from-primary/30 to-yellow/10 opacity-0 ${isSearchFocused ? 'opacity-100 blur-[30px]' : ''}`} />
        
        {/* Mobile Back Button */}
        {isMobile && (
          <button 
            onClick={onCloseMobile}
            className="absolute right-0 w-12 h-12 flex items-center justify-center text-off-white/70 hover:text-off-white transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}

        <Search className={`absolute ${isMobile ? 'right-14' : 'right-8'} w-5 h-5 transition-all duration-700 ${isSearchFocused ? 'text-primary scale-110 rotate-[15deg]' : 'text-off-white/40'}`} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          placeholder={isMobile ? "Search..." : "Search movies, directors or cinematic experiences..."}
          className={`w-full bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-full ${isMobile ? 'py-4 pr-24 pl-20 text-sm' : 'py-6 pr-20 pl-40 text-base'} text-off-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all duration-700 placeholder:text-off-white/20 font-display uppercase tracking-widest shadow-2xl saturate-[1.5]`}
        />
        
        <div className={`absolute left-4 flex items-center gap-3`}>
          {!isMobile && (
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 shadow-inner transition-all duration-700 ${isSearchFocused ? 'border-primary/40 scale-90 opacity-40' : ''}`}>
              <Command size={12} className="text-off-white/30" />
              <span className="text-[10px] font-display text-off-white/30 tracking-widest">K</span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchFocused(false);
              onOpenFilter();
            }}
            className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} flex items-center justify-center rounded-full transition-all duration-700 relative overflow-hidden border bg-white/[0.05] text-off-white/40 hover:bg-primary hover:text-off-white border-white/10 hover:border-primary/50 group/filter`}
          >
            <SlidersHorizontal size={isMobile ? 18 : 22} className="relative z-10 transition-transform duration-700 group-hover/filter:rotate-[20deg]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-yellow/10 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-700" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={`absolute top-full right-0 left-0 ${isMobile ? 'mt-4 p-4 rounded-[40px]' : 'mt-8 p-10 rounded-[56px]'} bg-black/95 backdrop-blur-[60px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] z-50 saturate-[2] overflow-y-auto max-h-[80vh] no-scrollbar`}
          >
            {searchQuery.length > 0 ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    <p className="text-[10px] font-display text-primary uppercase tracking-[0.3em]">Results</p>
                  </div>
                  {!isMobile && <span className="text-[10px] text-off-white/20 font-display uppercase tracking-[0.4em]">Neural Core Active</span>}
                </div>
                <div className="space-y-4">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-6 opacity-70">
                      <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-display text-off-white/40 uppercase tracking-[0.3em]">Accessing Database...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((movie) => (
                      <motion.div 
                        key={movie.id} 
                        onClick={() => handleResultClick(movie)}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center ${isMobile ? 'gap-4' : 'gap-8'} p-4 rounded-full hover:bg-white/[0.05] border border-transparent hover:border-white/10 cursor-pointer transition-all duration-500 group relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`${isMobile ? 'w-14 h-20' : 'w-20 h-28'} rounded-[20px] bg-white/5 overflow-hidden shadow-2xl border border-white/10 relative z-10 group-hover:scale-105 transition-transform duration-500`}>
                           {movie.poster_path ? (
                             <NextImage 
                               src={getImageUrl(movie.poster_path)} 
                               alt={movie.displayTitle}
                               fill
                               sizes="80px"
                               className="object-cover saturate-[1.2] brightness-90 group-hover:brightness-110 transition-all"
                             />
                           ) : (
                             <div className="w-full h-full bg-black flex items-center justify-center">
                                <Clapperboard size={isMobile ? 24 : 32} className="text-off-white/10 group-hover:text-primary transition-colors" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1 text-right relative z-10">
                          <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-display text-off-white group-hover:text-primary transition-colors mb-2 line-clamp-1 uppercase tracking-tight`}>{movie.displayTitle}</p>
                          <div className="flex items-center justify-end gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-off-white font-display text-[10px]">
                              <Star size={10} className="fill-current" />
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-off-white/40 font-display uppercase tracking-widest">
                              {movie.release_date ? String(movie.release_date).split('-')[0] : 'FUTURE'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <p className="text-xs font-display text-off-white/20 uppercase tracking-[0.4em] italic">Zero Matches Found</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`flex flex-col ${isMobile ? 'gap-8' : 'gap-12'}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${isMobile ? 'p-6' : 'p-10'} rounded-[40px] bg-gradient-to-br from-primary/20 via-black to-yellow/5 border border-primary/20 relative overflow-hidden group`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-20 h-20'} rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40`}>
                      <Sparkles size={isMobile ? 24 : 36} className="text-off-white" />
                    </div>
                    <div>
                      <p className="text-lg md:text-2xl font-display text-off-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">
                        AI Recommendations<br/><span className="text-primary opacity-60">Engine Online</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <section>
                  <div className="flex items-center gap-4 text-primary mb-6 px-4">
                    <TrendingUp size={16} />
                    <p className="text-[10px] font-display uppercase tracking-[0.4em]">Hot Searches</p>
                  </div>
                  <div className="flex flex-wrap gap-3 md:gap-6 px-2">
                    {trendingSearches.map((term, i) => (
                      <motion.button 
                        key={term} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-display text-off-white/60 hover:bg-primary hover:text-off-white hover:border-primary transition-all duration-500 uppercase tracking-widest`}
                      >
                        {term}
                      </motion.button>
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

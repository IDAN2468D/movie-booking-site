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
        <div className={`absolute inset-0 rounded-[28px] transition-all duration-700 bg-gradient-to-r from-primary/30 to-cyan-500/10 opacity-0 ${isSearchFocused ? 'opacity-100 blur-[30px]' : ''}`} />
        
        {/* Mobile Back Button */}
        {isMobile && (
          <button 
            onClick={onCloseMobile}
            className="absolute right-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}

        <Search className={`absolute ${isMobile ? 'right-12' : 'right-6'} w-5 h-5 transition-all duration-700 ${isSearchFocused ? 'text-primary scale-110 rotate-[15deg]' : 'text-slate-500'}`} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          placeholder={isMobile ? "חפשו..." : "חפשו סרטים, במאים או חווית קולנוע..."}
          className={`w-full bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[28px] ${isMobile ? 'py-3.5 pr-20 pl-16 text-sm' : 'py-6 pr-16 pl-32 text-base'} text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all duration-700 placeholder:text-slate-500/50 font-bold tracking-tight shadow-3xl saturate-[1.5]`}
        />
        
        <div className={`absolute left-4 flex items-center gap-3`}>
          {!isMobile && (
            <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner transition-all duration-700 ${isSearchFocused ? 'border-primary/40 scale-90 opacity-40' : ''}`}>
              <Command size={11} className="text-slate-500" />
              <span className="text-[11px] font-black text-slate-500 tracking-tighter">K</span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchFocused(false);
              onOpenFilter();
            }}
            className={`${isMobile ? 'w-9 h-9' : 'w-12 h-12'} flex items-center justify-center rounded-2xl transition-all duration-700 relative overflow-hidden border bg-white/[0.05] text-slate-400 hover:bg-white/10 border-white/10 hover:border-white/20`}
          >
            <SlidersHorizontal size={isMobile ? 16 : 20} className="relative z-10 transition-transform duration-700 group-hover/filter:rotate-[20deg]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/10 to-cyan-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-700" />
          </button>
        </div>
      </div>

      {isSearchFocused && (
        <div className={`absolute top-full right-0 left-0 ${isMobile ? 'mt-2 p-4 rounded-[32px]' : 'mt-6 p-8 rounded-[40px]'} bg-[#0A0A0A]/95 backdrop-blur-[50px] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-6 duration-700 saturate-[2] overflow-y-auto max-h-[80vh]`}>
          {searchQuery.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">תוצאות</p>
                </div>
                {!isMobile && <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">Scanning Database</span>}
              </div>
              <div className="space-y-3">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 opacity-70">
                    <div className="w-8 h-8 border-[2.5px] border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">מחפש...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => handleResultClick(movie)}
                      className={`flex items-center ${isMobile ? 'gap-4' : 'gap-6'} p-3 rounded-[24px] hover:bg-white/[0.04] border border-transparent hover:border-white/10 cursor-pointer transition-all duration-500 group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`${isMobile ? 'w-12 h-18' : 'w-16 h-24'} rounded-xl bg-white/5 overflow-hidden shadow-2xl border border-white/10 relative z-10 group-hover:scale-105 transition-transform duration-500`}>
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
                              <Clapperboard size={isMobile ? 18 : 24} className="text-slate-700 group-hover:text-primary transition-colors" />
                           </div>
                         )}
                      </div>
                      <div className="flex-1 text-right relative z-10">
                        <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-black text-white group-hover:text-primary transition-colors mb-1 line-clamp-1 font-outfit`}>{movie.displayTitle}</p>
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                            <span className="text-[10px] text-primary font-black">{movie.vote_average.toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-black uppercase">
                            {movie.release_date ? String(movie.release_date).split('-')[0] : 'UPCOMING'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">אין תוצאות</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`flex flex-col ${isMobile ? 'gap-6' : 'gap-10'}`}>
              <div className={`${isMobile ? 'p-4' : 'p-6'} rounded-[24px] bg-gradient-to-r from-primary/15 via-primary/5 to-cyan-500/5 border border-primary/30 relative overflow-hidden group`}>
                <div className="flex items-center gap-4">
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-xl bg-primary/10 backdrop-blur-2xl flex items-center justify-center border border-primary/20`}>
                    <Sparkles size={isMobile ? 20 : 28} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white group-hover:text-primary transition-colors tracking-tight font-outfit">
                      מנוע ההמלצות החדש מוכן!
                    </p>
                  </div>
                </div>
              </div>

              <section>
                <div className="flex items-center gap-3 text-primary mb-4 px-2">
                  <TrendingUp size={14} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">חיפושים לוהטים</p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {trendingSearches.map(term => (
                    <button key={term} className={`px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-black text-slate-300 hover:bg-primary hover:text-background transition-all duration-500`}>
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

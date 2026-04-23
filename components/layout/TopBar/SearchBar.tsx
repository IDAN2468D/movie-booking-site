'use client';

import React from 'react';
import { Search, Command, SlidersHorizontal, TrendingUp, Clapperboard, Sparkles, History } from 'lucide-react';
import NextImage from 'next/image';
import { searchMovies, Movie, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';

export default function SearchBar({ onOpenFilter }: { onOpenFilter: () => void }) {
  const { setSelectedMovie, setSearchQuery: setGlobalSearchQuery } = useBookingStore();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Movie[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    setGlobalSearchQuery(searchQuery);
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchMovies(searchQuery);
          setSearchResults(results.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setGlobalSearchQuery]);

  const handleResultClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const trendingSearches = ['אווטאר 3', 'חולית: חלק שני', 'מתקפת סייבר 2026', 'IMAX קרוב אלי'];

  return (
    <div className="relative flex-1 group max-w-5xl">
      <div className={`relative flex items-center transition-all duration-1000 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
        <div className={`absolute inset-0 rounded-[28px] transition-all duration-700 bg-gradient-to-r from-primary/30 to-cyan-500/10 opacity-0 ${isSearchFocused ? 'opacity-100 blur-[30px]' : ''}`} />
        
        <Search className={`absolute right-6 w-5 h-5 transition-all duration-700 ${isSearchFocused ? 'text-primary scale-110 rotate-[15deg]' : 'text-slate-500'}`} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          placeholder="חפשו סרטים, במאים או חווית קולנוע..."
          className="w-full bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[28px] py-6 pr-16 pl-32 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all duration-700 placeholder:text-slate-500/50 font-bold tracking-tight shadow-3xl text-base saturate-[1.5]"
        />
        
        <div className="absolute left-5 flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner transition-all duration-700 ${isSearchFocused ? 'border-primary/40 scale-90 opacity-40' : ''}`}>
            <Command size={11} className="text-slate-500" />
            <span className="text-[11px] font-black text-slate-500 tracking-tighter">K</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchFocused(false);
              onOpenFilter();
            }}
            className="group/filter w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-700 relative overflow-hidden border bg-white/[0.05] text-slate-400 hover:bg-white/10 border-white/10 hover:border-white/20"
          >
            <SlidersHorizontal size={20} className="relative z-10 transition-transform duration-700 group-hover/filter:rotate-[20deg]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/10 to-cyan-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-700" />
          </button>
        </div>
      </div>

      {isSearchFocused && (
        <div className="absolute top-full right-0 left-0 mt-6 p-8 bg-[#0A0A0A]/90 backdrop-blur-[50px] border border-white/10 rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-6 duration-700 saturate-[2]">
          {searchQuery.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">תוצאות אמת</p>
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">Scanning TMDB Database</span>
              </div>
              <div className="space-y-3">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 opacity-70">
                    <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,159,10,0.2)]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">מאחזר מידע קולנועי...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => handleResultClick(movie)}
                      className="flex items-center gap-6 p-4 rounded-[28px] hover:bg-white/[0.04] border border-transparent hover:border-white/10 cursor-pointer transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-16 h-24 rounded-2xl bg-white/5 overflow-hidden shadow-2xl border border-white/10 relative z-10 group-hover:scale-105 transition-transform duration-500">
                         {movie.poster_path ? (
                           <NextImage 
                             src={getImageUrl(movie.poster_path)} 
                             alt={movie.title}
                             fill
                             sizes="64px"
                             className="object-cover saturate-[1.1]"
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <Clapperboard size={24} className="text-slate-700 group-hover:text-primary transition-colors" />
                           </div>
                         )}
                      </div>
                      <div className="flex-1 text-right relative z-10">
                        <p className="text-lg font-black text-white group-hover:text-primary transition-colors mb-1.5 line-clamp-1 font-outfit">{movie.title}</p>
                        <div className="flex items-center justify-end gap-4">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            <span className="text-xs text-primary font-black tracking-tighter">{movie.vote_average.toFixed(1)}</span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-[11px] text-slate-500 font-black uppercase tracking-tighter">
                            {movie.release_date ? movie.release_date.split('-')[0] : 'UPCOMING'}
                          </span>
                        </div>
                      </div>
                      <TrendingUp size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-110 relative z-10" />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <Search size={32} className="text-slate-800" />
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">לא נמצאו התאמות במערכת</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="p-6 rounded-[32px] bg-gradient-to-r from-primary/15 via-primary/5 to-cyan-500/5 border border-primary/30 relative overflow-hidden group animate-in slide-in-from-left duration-1000 shadow-xl">
                <div className="absolute top-0 left-0 p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#FF9F0A]" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">חדש במערכת</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 backdrop-blur-2xl flex items-center justify-center border border-primary/20 shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                    <Sparkles size={28} className="text-primary drop-shadow-[0_0_8px_rgba(255,159,10,0.5)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.1em]">MovieBook Personalization Engine</p>
                    <p className="text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight font-outfit">
                      מנוע ההמלצות החדש של 2026 מוכן לפעולה!
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <section>
                <div className="flex items-center gap-3 text-primary mb-6 px-2">
                  <TrendingUp size={16} className="animate-bounce" />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">חיפושים לוהטים</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {trendingSearches.map(term => (
                    <button key={term} className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-black text-slate-300 hover:bg-primary hover:text-background hover:border-primary hover:shadow-[0_10px_20px_rgba(255,159,10,0.2)] transition-all duration-500 uppercase tracking-tighter">
                      {term}
                    </button>
                  ))}
                </div>
              </section>
              
              <section>
                <div className="flex items-center gap-3 text-slate-500 mb-6 px-2">
                  <History size={16} />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">היסטוריית צפייה</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['בין כוכבים IMAX', 'מוקד קולנוע ירושלים', 'מבצעי VIP'].map((term) => (
                    <div key={term} className="flex items-center justify-between p-4 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] cursor-pointer transition-all duration-500 group/item">
                      <span className="text-xs font-black text-slate-400 group-hover/item:text-white transition-colors">{term}</span>
                      <Search size={14} className="text-slate-700 group-hover/item:text-primary transition-colors" />
                    </div>
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

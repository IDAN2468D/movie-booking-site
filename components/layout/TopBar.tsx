'use client';

import React from 'react';
import { Search, ChevronDown, User, Command, TrendingUp, History, Clapperboard, SlidersHorizontal, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';
import { searchMovies, Movie, getImageUrl } from '@/lib/tmdb';
import FilterModal from './FilterModal';

const categories = [
  { id: 'all', name: 'סרטים' },
  { id: 'series', name: 'סדרות' },
  { id: 'drama', name: 'דרמה' },
  { id: 'animation', name: 'אנימציה' },
  { id: 'comedy', name: 'קומדיה' }
];

export default function TopBar() {
  const { data: session } = useSession();
  const { activeCategory, setActiveCategory, setSelectedMovie } = useBookingStore();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Movie[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedGenre, setSelectedGenre] = React.useState('הכל');
  const [minRating, setMinRating] = React.useState(0);
  const [year, setYear] = React.useState('2026');

  React.useEffect(() => {
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
  }, [searchQuery]);

  const handleResultClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const genres = ['הכל', 'פעולה', 'מדע בדיוני', 'דרמה', 'אימה', 'קומדיה'];
  const years = ['2024', '2025', '2026'];

  const trendingSearches = ['אווטאר 3', 'חולית: חלק שני', 'מתקפת סייבר 2026', 'IMAX קרוב אלי'];

  return (
    <>
      <header className="h-20 flex items-center justify-between px-8 bg-[#1A1A1A]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
      <div className="flex items-center gap-8 flex-1 max-w-6xl">
        <div className="relative flex-1 group max-w-4xl">
          <div className={`relative flex items-center transition-all duration-700 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
            {/* Glossy Search Container */}
            <div className={`absolute inset-0 rounded-[24px] transition-all duration-500 bg-gradient-to-r from-[#FF9F0A]/20 to-transparent opacity-0 ${isSearchFocused ? 'opacity-100 blur-xl' : ''}`} />
            
            <Search className={`absolute right-5 w-5 h-5 transition-all duration-500 ${isSearchFocused ? 'text-[#FF9F0A] scale-110 rotate-12' : 'text-slate-500'}`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="חפשו סרטים או קולנוע..."
              className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[24px] py-5 pr-14 pl-28 text-white focus:outline-none focus:border-[#FF9F0A]/40 focus:bg-white/[0.06] transition-all placeholder:text-slate-500/60 font-medium tracking-tight shadow-2xl text-base"
            />
            
            <div className="absolute left-4 flex items-center gap-2">
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 shadow-sm transition-all duration-500 ${isSearchFocused ? 'border-[#FF9F0A]/30 scale-95 opacity-50' : ''}`}>
                <Command size={10} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-500">K</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearchFocused(false); // Close search dropdown
                  setIsFilterOpen(true);
                }}
                className={`group/filter p-2.5 rounded-xl transition-all duration-500 relative overflow-hidden ${isFilterOpen ? 'bg-[#FF9F0A] text-black' : 'bg-white/[0.05] text-slate-400 hover:bg-white/10 border border-white/10'}`}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <SlidersHorizontal size={18} className={`transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : 'group-hover/filter:rotate-12'}`} />
                </div>
                {!isFilterOpen && <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F0A]/0 via-[#FF9F0A]/5 to-transparent opacity-0 group-hover/filter:opacity-100 transition-opacity" />}
              </button>
            </div>
          </div>

          {/* Filter Modal will be moved to the end of the component to escape containing blocks */}

          {/* Expanded Search Results / Suggestions */}
          {isSearchFocused && (
            <div className="absolute top-full right-0 left-0 mt-4 p-6 bg-[#1A1A1A]/98 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
              {searchQuery.length > 0 ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[11px] font-black text-[#FF9F0A] uppercase tracking-[0.2em]">תוצאות חיות</p>
                    <span className="text-[10px] text-slate-500 font-bold italic">מחפש במאגר הנתונים...</span>
                  </div>
                  <div className="space-y-2">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-50">
                        <div className="w-8 h-8 border-2 border-[#FF9F0A] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">סורק מאגרי מידע...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((movie) => (
                        <div 
                          key={movie.id} 
                          onClick={() => handleResultClick(movie)}
                          className="flex items-center gap-5 p-3.5 rounded-[24px] hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer transition-all group"
                        >
                          <div className="w-14 h-20 rounded-2xl bg-white/5 overflow-hidden shadow-lg border border-white/5 relative">
                             {movie.poster_path ? (
                               <NextImage 
                                 src={getImageUrl(movie.poster_path)} 
                                 alt={movie.title}
                                 fill
                                 sizes="56px"
                                 className="object-cover"
                               />
                             ) : (
                               <div className="w-full h-full bg-gradient-to-br from-slate-800 to-[#1A1A1A] flex items-center justify-center">
                                  <Clapperboard size={20} className="text-slate-700 group-hover:text-[#FF9F0A] transition-colors" />
                               </div>
                             )}
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-base font-black text-white group-hover:text-[#FF9F0A] transition-colors mb-1 line-clamp-1">{movie.title}</p>
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-xs text-[#FF9F0A] font-black">דירוג {movie.vote_average.toFixed(1)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                                {movie.release_date ? movie.release_date.split('-')[0] : 'בקרוב'}
                              </span>
                            </div>
                          </div>
                          <TrendingUp size={16} className="text-[#FF9F0A] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <Search size={32} className="text-slate-800" />
                        <p className="text-xs font-bold text-slate-500 italic">לא נמצאו סרטים התואמים לחיפוש שלך</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Special Announcement */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FF9F0A]/10 via-[#FF9F0A]/5 to-transparent border border-[#FF9F0A]/20 relative overflow-hidden group animate-in slide-in-from-left duration-700">
                    <div className="absolute top-0 left-0 p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF9F0A] animate-pulse shadow-[0_0_10px_#FF9F0A]" />
                        <span className="text-[10px] font-black text-[#FF9F0A] uppercase tracking-[0.2em]">הודעה חיה</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF9F0A]/10 flex items-center justify-center border border-[#FF9F0A]/20">
                        <Info size={24} className="text-[#FF9F0A]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">המערכת של MovieBook 2026</p>
                        <p className="text-lg font-black text-white group-hover:text-[#FF9F0A] transition-colors tracking-tight">
                          מידע נוסף יגיע בקרוב ב-MovieBook 2026!
                        </p>
                      </div>
                    </div>
                  </div>

                  <section>
                    <div className="flex items-center gap-2 text-[#FF9F0A] mb-5 px-2">
                      <TrendingUp size={14} className="animate-bounce" />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em]">פופולרי עכשיו</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {trendingSearches.map(term => (
                        <button key={term} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-xs font-black text-slate-300 hover:bg-white/10 hover:border-[#FF9F0A]/30 hover:text-white transition-all shadow-sm hover:shadow-orange-500/5">
                          {term}
                        </button>
                      ))}
                    </div>
                  </section>
                  
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  <section>
                    <div className="flex items-center gap-2 text-slate-500 mb-5 px-2">
                      <History size={14} />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em]">היסטוריה אחרונה</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {['בין כוכבים IMAX', 'מוקד קולנוע ירושלים', 'מתקפת סייבר 2026', 'מבצעי VIP'].map((term) => (
                        <div key={term} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                          <span className="text-xs font-bold text-slate-400 group-hover/item:text-white transition-colors">{term}</span>
                          <Search size={12} className="text-slate-700 group-hover/item:text-[#FF9F0A] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-2">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                  ? 'bg-[#FF9F0A] text-background shadow-lg shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mr-8">
        {session ? (
          <>
            <div className="flex flex-col items-start ml-2">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest mb-0.5">ברוך השב,</span>
              <span className="text-sm font-bold text-white leading-tight">{session.user?.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[100px]">{session.user?.email}</span>
              </div>
            </div>
            <Link href="/profile" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9F0A] to-[#FF7A00] p-[2px] shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[14px] bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                 {session.user?.image ? (
                   <NextImage 
                     src={session.user.image} 
                     alt="Profile" 
                     width={48}
                     height={48}
                     className="w-full h-full object-cover" 
                   />
                 ) : (
                   <User className="text-white/80 w-6 h-6" />
                 )}
              </div>
            </Link>
          </>
        ) : (
          <Link href="/login" className="px-6 py-2 bg-primary text-background rounded-xl font-bold text-sm hover:scale-105 transition-all">
            התחברות
          </Link>
        )}
        <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition-colors" />
      </div>
    </header>

    <FilterModal 
      isOpen={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
      selectedGenre={selectedGenre}
      setSelectedGenre={setSelectedGenre}
      minRating={minRating}
      setMinRating={setMinRating}
      year={year}
      setYear={setYear}
      genres={genres}
      years={years}
    />
  </>
);
}

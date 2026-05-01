'use client';

import React from 'react';
import FilterModal from './FilterModal';
import SearchBar from './TopBar/SearchBar';
import CategoryTabs from './TopBar/CategoryTabs';
import UserProfile from './TopBar/UserProfile';
import { useBookingStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, Bot } from 'lucide-react';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import { useUIStore } from '@/lib/store/ui-store';
import { motion, AnimatePresence } from 'framer-motion';
import LiveActivityPulse from '@/components/ui/LiveActivityPulse';

export default function TopBar() {
  const { filters, setFilters } = useBookingStore();
  const { toggleConcierge, isConciergeOpen, isThinking, currentMovieId } = useUIStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);

  const genres = ['הכל', 'פעולה', 'מדע בדיוני', 'דרמה', 'אימה', 'קומדיה'];
  const years = ['הכל', '2024', '2025', '2026'];

  return (
    <>
      <header className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10 bg-black/40 backdrop-blur-[40px] saturate-[200%] brightness-110 sticky top-0 z-40 border-b-[0.5px] border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-700">
        {/* Holographic Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

        {/* Mobile Logo - Hidden when searching */}
        {!isMobileSearchOpen && (
          <Link href="/" className="flex md:hidden items-center gap-3 relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-10 h-10 relative bg-primary/20 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,20,100,0.2)] overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                unoptimized
                className="object-cover scale-125 saturate-[1.2]"
              />
            </div>
            <span className="text-xl font-black text-white tracking-tighter font-display leading-none drop-shadow-lg">
              <MarkerHighlight delay={1.5} color="#FF1464">MOVIEBOOK</MarkerHighlight>
            </span>
          </Link>
        )}

        <div className={`flex items-center gap-4 md:gap-10 flex-1 ${isMobileSearchOpen ? 'w-full' : 'max-w-7xl justify-end md:justify-start'} relative z-10 transition-all duration-500`}>
          {/* Search Bar - Desktop: Always visible, Mobile: Conditional */}
          <div className={`${isMobileSearchOpen ? 'block w-full animate-in slide-in-from-left-4 duration-500' : 'hidden'} md:block flex-1`}>
            <SearchBar 
              onOpenFilter={() => setIsFilterOpen(true)} 
              isMobile={isMobileSearchOpen}
              onCloseMobile={() => setIsMobileSearchOpen(false)}
            />
          </div>
          
          <div className="hidden lg:block">
            <CategoryTabs />
          </div>

          {/* Mobile Search Toggle Button */}
          {!isMobileSearchOpen && (
            <button 
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white shadow-xl active:scale-90 transition-all group animate-in fade-in zoom-in duration-500"
            >
              <Search className="w-5 h-5 group-hover:text-primary transition-colors" />
            </button>
          )}
        </div>

        {/* User Profile & AI Concierge - Hidden on mobile search */}
        {!isMobileSearchOpen && (
          <div className="flex items-center gap-3 md:gap-5 relative z-10 md:mr-0 mr-2 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* AI Concierge Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleConcierge}
              className={`relative h-11 px-4 md:px-6 rounded-xl border flex items-center gap-2 md:gap-3 transition-all duration-500 group overflow-hidden ${
                isConciergeOpen 
                  ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(255,20,100,0.4)]' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.1),transparent)] -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              
              <div className="relative z-10 flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {isThinking ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex gap-1"
                    >
                      {[0, 1, 2].map(i => (
                        <motion.span 
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className={`w-1 h-1 rounded-full ${isConciergeOpen ? 'bg-black' : 'bg-primary'}`}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {currentMovieId ? <Bot size={18} /> : <Sparkles size={18} className={isConciergeOpen ? 'text-black' : 'text-primary'} />}
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="hidden md:block text-xs font-black tracking-widest uppercase">Concierge</span>
              </div>
            </motion.button>

            <UserProfile />
            <div className="hidden sm:block">
              <LiveActivityPulse />
            </div>
          </div>
        )}
      </header>

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedGenre={filters.genre}
        setSelectedGenre={(genre) => setFilters({ genre })}
        minRating={filters.rating}
        setMinRating={(rating) => setFilters({ rating })}
        year={filters.year}
        setYear={(year) => setFilters({ year })}
        genres={genres}
        years={years}
      />
    </>
  );
}

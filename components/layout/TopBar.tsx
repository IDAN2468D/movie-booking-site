'use client';

import React from 'react';
import FilterModal from './FilterModal';
import SearchBar from './TopBar/SearchBar';
import CategoryTabs from './TopBar/CategoryTabs';
import UserProfile from './TopBar/UserProfile';
import { useBookingStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function TopBar() {
  const { filters, setFilters } = useBookingStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const genres = ['הכל', 'פעולה', 'מדע בדיוני', 'דרמה', 'אימה', 'קומדיה'];
  const years = ['הכל', '2024', '2025', '2026'];

  return (
    <>
      <header className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10 bg-black/40 backdrop-blur-[40px] saturate-[200%] brightness-110 sticky top-0 z-40 border-b-[0.5px] border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-700">
        {/* Mobile Logo */}
        <Link href="/" className="flex md:hidden items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,159,10,0.15)] overflow-hidden relative">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              unoptimized
              className="object-cover scale-125"
            />
          </div>
          <span className="text-xl font-black text-white tracking-tighter font-outfit leading-none">MOVIEBOOK</span>
        </Link>

        <div className="flex items-center gap-4 md:gap-10 flex-1 max-w-7xl justify-end md:justify-start">
          <div className="hidden md:block flex-1">
            <SearchBar onOpenFilter={() => setIsFilterOpen(true)} />
          </div>
          <div className="hidden lg:block">
            <CategoryTabs />
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 active:scale-95 transition-transform"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <UserProfile />
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

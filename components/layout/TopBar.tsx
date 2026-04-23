'use client';

import React from 'react';
import FilterModal from './FilterModal';
import SearchBar from './TopBar/SearchBar';
import CategoryTabs from './TopBar/CategoryTabs';
import UserProfile from './TopBar/UserProfile';
import { useBookingStore } from '@/lib/store';

export default function TopBar() {
  const { filters, setFilters } = useBookingStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const genres = ['הכל', 'פעולה', 'מדע בדיוני', 'דרמה', 'אימה', 'קומדיה'];
  const years = ['הכל', '2024', '2025', '2026'];

  return (
    <>
      <header className="h-24 flex items-center justify-between px-10 bg-white/[0.01] backdrop-blur-[40px] sticky top-0 z-40 border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-700">
        <div className="flex items-center gap-10 flex-1 max-w-7xl">
          <SearchBar onOpenFilter={() => setIsFilterOpen(true)} />
          <CategoryTabs />
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

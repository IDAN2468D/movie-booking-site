'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Sparkles, Filter, ArrowUpDown } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import WatchlistCard from './WatchlistCard';

interface WatchlistGridProps {
  movies: Movie[];
  onRemove: (movie: Movie) => void;
}

export default function WatchlistGrid({ movies, onRemove }: WatchlistGridProps) {
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSorted = useMemo(() => {
    let list = [...movies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.displayTitle && m.displayTitle.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) =>
        (a.displayTitle || a.title || '').localeCompare(b.displayTitle || b.title || '', 'he')
      );
    }
    return list;
  }, [movies, sortBy, searchQuery]);

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,20,100,0.15)]">
          <Bookmark size={36} className="text-primary" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">רשימת הצפייה שלך ריקה</h2>
        <p className="text-white/50 text-sm max-w-sm mb-8">
          שמור סרטים שמעניינים אותך בלחיצה על כפתור הסימניה כדי לעקוב אחריהם בקלות.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Sparkles size={14} />
          <span>גלה סרטים חדשים</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        {/* Search inside Watchlist */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="סנן ברשימה האישית..."
            className="w-full py-2.5 px-4 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-primary transition-all text-right"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-white/50 flex items-center gap-1">
            <ArrowUpDown size={12} />
            <span>מיון:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'title')}
            className="bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
          >
            <option value="date">תאריך הוספה</option>
            <option value="rating">דירוג הכי גבוה</option>
            <option value="title">לפי א&apos;-ב&apos;</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSorted.map((movie) => (
          <WatchlistCard key={movie.id} movie={movie} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Sparkles, ArrowUpDown, Share2, Check } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import WatchlistCard from './WatchlistCard';

interface WatchlistGridProps {
  movies: Movie[];
  onRemove: (movie: Movie) => void;
}

const COLLECTIONS = [
  { id: 'all', label: 'כל הרשימה' },
  { id: 'imax', label: 'חובה ב-IMAX 🎬' },
  { id: 'date', label: 'סרטי דייט 🍿' },
  { id: 'action', label: 'אקשן ומתח 🔥' },
];

export default function WatchlistGrid({ movies, onRemove }: WatchlistGridProps) {
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState('all');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const text = `בדקו את רשימת הסרטים המומלצת שלי ב-CinePulse: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: 'רשימת הצפייה שלי ב-CinePulse', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
    <div className="space-y-6" dir="rtl">
      {/* Collections Pills Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCollection(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCollection === c.id
                  ? 'bg-primary text-black shadow-md shadow-primary/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
          <span>{copied ? 'הקישור הועתק!' : 'שתף רשימה'}</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="סנן בתוך רשימת הצפייה..."
          className="w-full sm:w-72 py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-primary text-right"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-white/50 flex items-center gap-1">
            <ArrowUpDown size={12} />
            <span>מיון:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'title')}
            className="bg-black/40 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
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

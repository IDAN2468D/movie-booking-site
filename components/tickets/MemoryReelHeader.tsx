'use client';

import React from 'react';
import { Film, Clock, BarChart3, RotateCcw, Plus, LayoutGrid, Sparkles, Search } from 'lucide-react';

interface MemoryReelHeaderProps {
  stats: { totalHours: number; topGenre: string; totalReflections: number; totalCapsules: number };
  isReversed: boolean;
  setIsReversed: (v: boolean) => void;
  viewMode: 'reel' | 'grid';
  setViewMode: (m: 'reel' | 'grid') => void;
  onOpenCreate: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  genres: string[];
  selectedGenre: string;
  setSelectedGenre: (g: string) => void;
}

export const MemoryReelHeader: React.FC<MemoryReelHeaderProps> = ({
  stats,
  isReversed,
  setIsReversed,
  viewMode,
  setViewMode,
  onOpenCreate,
  searchQuery,
  setSearchQuery,
  genres,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 p-6 md:p-8 bg-gradient-to-b from-black/95 via-black/70 to-transparent rounded-t-[36px] border-b border-white/15" dir="rtl">
      {/* Title & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-[0_0_20px_rgba(255,159,10,0.3)]">
              <Film className="w-6 h-6" />
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-outfit text-white tracking-tight">
              קפסולות זיכרון קולנועיות
            </h2>
          </div>
          <p className="text-sm text-white/60 font-inter mt-1.5">
            שחזור חוויות, רשמי צפייה אישיים ורסיסי זיכרון קריפטוגרפיים ב-Dolby Atmos & IMAX
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReversed(!isReversed)}
            title="היפוך סדר כרונולוגי"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-primary hover:border-primary/40 transition-all active:scale-95 shadow-md"
          >
            <RotateCcw className={`w-5 h-5 transition-transform duration-500 ${isReversed ? '-rotate-180 text-primary' : ''}`} />
          </button>

          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 shadow-md">
            <button
              onClick={() => setViewMode('reel')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'reel' ? 'bg-primary text-black shadow-md' : 'text-white/60 hover:text-white'}`}
              title="תצוגת פילם"
            >
              <Film className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-cyan-400 text-black shadow-md' : 'text-white/60 hover:text-white'}`}
              title="תצוגת כספת גריד"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary via-amber-500 to-orange-500 text-black text-sm font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,159,10,0.35)]"
          >
            <Plus className="w-5 h-5" />
            <span>צור זיכרון</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/12 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md shadow-lg">
          <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="text-xs text-white/50 font-bold block">שעות צפייה</span>
            <span className="text-base md:text-lg font-black text-white font-mono">{stats.totalHours} שעות</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/12 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md shadow-lg">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <div>
            <span className="text-xs text-white/50 font-bold block">קפסולות שנאספו</span>
            <span className="text-base md:text-lg font-black text-white font-mono">{stats.totalCapsules} סרטים</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/12 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md shadow-lg">
          <BarChart3 className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <span className="text-xs text-white/50 font-bold block">ז׳אנר מוביל</span>
            <span className="text-base md:text-lg font-black text-white font-outfit">{stats.topGenre}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/12 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md shadow-lg">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs text-white/50 font-bold block">רשמים מתועדים</span>
            <span className="text-base md:text-lg font-black text-white font-mono">{stats.totalReflections} רשמים</span>
          </div>
        </div>
      </div>

      {/* Search & Genre Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש סרט, ציטוט או זיכרון..."
            className="w-full bg-white/5 border border-white/12 rounded-2xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full hide-scrollbar">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all shadow-sm ${
                selectedGenre === g
                  ? 'bg-white/20 text-white border border-white/40 shadow-md'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {g === 'all' ? 'הכל' : g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, X, Play, Sparkles, Star, Calendar } from 'lucide-react';
import { useTrailerStore } from '@/lib/store/trailer-store';
import { FEATURED_TRAILERS, FeaturedTrailer } from './trailerData';

export function TrailerPickerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-trailer-picker', handleOpen);
    window.addEventListener('toggle-trailer-picker', handleToggle);
    window.addEventListener('close-trailer-picker', handleClose);

    return () => {
      window.removeEventListener('open-trailer-picker', handleOpen);
      window.removeEventListener('toggle-trailer-picker', handleToggle);
      window.removeEventListener('close-trailer-picker', handleClose);
    };
  }, []);

  const categories = ['הכל', 'אקשן', 'מדע בדיוני', 'אנימציה', 'דרמה', 'אימה'];

  const filtered = FEATURED_TRAILERS.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      (t.originalTitle && t.originalTitle.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q) ||
      String(t.year).includes(q);
    const matchCat = selectedCategory === 'הכל' || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleSelectTrailer = (trailer: FeaturedTrailer) => {
    openTrailer({
      movieId: trailer.movieId,
      movieTitle: trailer.title,
      trailerKey: trailer.trailerKey,
    });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/92 backdrop-blur-3xl"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-5xl rounded-3xl bg-neutral-950/95 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col my-auto max-h-[90vh]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-outfit">כרזות וטריילרים קולנועיים (קיצור T / א)</h3>
                  <p className="text-xs text-slate-400">צפו בכרזות הרשמיות והפעילו טריילר ב-4K בלחיצה אחת</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="סגור ספריית טריילרים"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Search Input & Category Filters */}
            <div className="p-4 sm:p-5 space-y-3.5 border-b border-white/10 bg-black/50">
              <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" aria-hidden="true" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חפש כרזה או טריילר לפי שם סרט, שם באנגלית, ז'אנר..."
                  aria-label="חפש כרזה או טריילר לסרט"
                  className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-all text-right shadow-inner"
                  autoFocus
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="סינון קטגוריות טריילרים">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    aria-label={`קטגוריית טריילרים ${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-black'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Poster Grid (כרזות סרטים רשמיות 2:3) */}
            <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 overflow-y-auto custom-scrollbar flex-1">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`צפה בטריילר לסרט ${item.title}`}
                  onClick={() => handleSelectTrailer(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectTrailer(item);
                    }
                  }}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-cyan-400/60 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_30px_rgba(6,182,212,0.25)] flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {/* Vertical Poster Container (כרזה) */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={item.poster}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.backdrop || '/posters/default.svg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-amber-400/30">
                        <Star size={10} className="fill-current" />
                        {item.rating}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/80 backdrop-blur-md text-white text-[9px] font-mono font-bold shadow-sm">
                        4K
                      </span>
                    </div>

                    {/* Center Hover Play Orb */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Gradient Shade */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none" />
                  </div>

                  {/* Poster Title & Details */}
                  <div className="p-3 bg-neutral-950/90 flex flex-col gap-1.5 z-10 border-t border-white/5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-cyan-300 font-medium">{item.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={9} />
                        {item.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-3 bg-black/70 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" />
                <span>מוצגות {filtered.length} כרזות קולנוע רשמיות באיכות 4K HDR</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">קיצור דרך: מקש T / א</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default TrailerPickerModal;

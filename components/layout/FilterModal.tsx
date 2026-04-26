'use client';

import React from 'react';
import { Filter, X, Film, Star, Calendar, ChevronDown, RotateCcw, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  year: string;
  setYear: (year: string) => void;
  genres: string[];
  years: string[];
}

export default function FilterModal({
  isOpen,
  onClose,
  selectedGenre,
  setSelectedGenre,
  minRating,
  setMinRating,
  year,
  setYear,
  genres,
  years,
}: FilterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop with intense black */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[900px] bg-black border border-white/10 rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Holographic Overlays (YUV-DESIGN Pink) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-yellow/10 pointer-events-none opacity-50" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="p-8 sm:p-12 relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
              <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full opacity-50" />
                    <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                      <Filter className="text-off-white" size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-4xl md:text-5xl font-display text-off-white leading-none tracking-tight mb-2 uppercase">Movie Filters</h3>
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-[10px] text-primary font-display uppercase tracking-[0.3em]">Precision Search</p>
                      <Sparkles size={10} className="text-yellow" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="group w-14 h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary text-off-white transition-all border border-white/10"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Genre Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-3 text-off-white/40 font-display text-xs uppercase tracking-[0.2em]">
                      <Film size={14} className="text-primary" />
                      Categories
                    </label>
                    <span className="text-[10px] text-primary font-display bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">{selectedGenre}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {genres.map(g => (
                      <button 
                        key={g} 
                        onClick={() => setSelectedGenre(g)}
                        className={`group relative px-5 py-4 rounded-full text-sm font-display transition-all border overflow-hidden uppercase tracking-wider ${selectedGenre === g ? 'bg-primary border-primary text-off-white shadow-[0_10px_30px_rgba(255,20,100,0.3)]' : 'bg-white/5 border-white/10 text-off-white/40 hover:border-white/20 hover:bg-white/10 hover:text-off-white'}`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {selectedGenre === g && <Check size={14} className="animate-in zoom-in duration-300" />}
                          {g}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="space-y-12">
                  {/* Rating Section */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <label className="flex items-center gap-3 text-off-white/40 font-display text-xs uppercase tracking-[0.2em]">
                        <Star size={14} className="text-yellow" />
                        Min Rating
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-display text-off-white">{minRating}</span>
                        <span className="text-xs text-yellow font-display">.0+</span>
                      </div>
                    </div>
                    <div className="relative pt-4 pb-2 px-1">
                      <input 
                        type="range" 
                        min="0" max="9" step="1"
                        value={minRating}
                        onChange={(e) => setMinRating(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary relative z-10" 
                      />
                      <div className="flex justify-between mt-6">
                        {[0, 2, 4, 6, 8].map(n => (
                          <div key={n} className="flex flex-col items-center gap-2">
                            <div className={`w-1 h-3 rounded-full transition-colors ${minRating >= n ? 'bg-yellow' : 'bg-white/10'}`} />
                            <span className={`text-[10px] font-display transition-colors ${minRating >= n ? 'text-off-white' : 'text-off-white/20'}`}>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Year Section */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <label className="flex items-center gap-3 text-off-white/40 font-display text-xs uppercase tracking-[0.2em]">
                        <Calendar size={14} className="text-primary" />
                        Release Year
                      </label>
                    </div>
                    <div className="flex gap-2 p-2 bg-white/5 rounded-full border border-white/10">
                      {years.map(y => (
                        <button 
                          key={y} 
                          onClick={() => setYear(y)}
                          className={`flex-1 py-3 rounded-full text-[10px] font-display transition-all relative uppercase tracking-widest ${year === y ? 'bg-primary text-off-white shadow-xl' : 'text-off-white/40 hover:text-off-white'}`}
                        >
                          {y === 'הכל' ? 'All' : y}
                          {year === y && (
                            <motion.div 
                              layoutId="activeYear"
                              className="absolute inset-0 bg-white/10 rounded-full -z-10"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* Action Buttons */}
              <footer className="mt-16 flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={() => {
                    setSelectedGenre('הכל');
                    setMinRating(0);
                    setYear('הכל');
                  }}
                  className="w-full sm:w-auto px-10 py-6 rounded-full bg-white/5 hover:bg-white/10 text-off-white/60 hover:text-off-white font-display text-xs uppercase tracking-[0.2em] transition-all border border-white/10 flex items-center justify-center gap-4 group"
                >
                  <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-700" />
                  Reset
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 w-full py-6 rounded-full bg-primary text-off-white font-display text-lg shadow-[0_20px_50px_rgba(255,20,100,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group overflow-hidden relative uppercase tracking-widest"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10">Apply Filters</span>
                  <ChevronDown size={24} className="rotate-[-90deg] group-hover:-translate-x-1 transition-transform relative z-10" />
                </button>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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
          {/* Backdrop with intense refraction */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[20px] saturate-[150%]"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[900px] bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Holographic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="p-8 sm:p-12 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Filter className="text-black" size={24} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-2 font-outfit text-right">מסנן קולנועי</h3>
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">AI-POWERED OPTIMIZATION</p>
                      <Sparkles size={10} className="text-primary" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="group w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all border border-white/5"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Genre Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                      <Film size={14} className="text-primary" />
                      ז&apos;אנרים
                    </label>
                    <span className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md">{selectedGenre}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {genres.map(g => (
                      <button 
                        key={g} 
                        onClick={() => setSelectedGenre(g)}
                        className={`group relative px-5 py-4 rounded-2xl text-[12px] font-bold transition-all border overflow-hidden ${selectedGenre === g ? 'bg-white border-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'}`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {selectedGenre === g && <Check size={14} className="animate-in zoom-in duration-300" />}
                          {g}
                        </span>
                        {selectedGenre !== g && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="space-y-10">
                  {/* Rating Section */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                        <Star size={14} className="text-primary" />
                        דירוג מינימלי
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black text-white font-outfit">{minRating}</span>
                        <span className="text-[10px] text-slate-500 font-bold">.0+</span>
                      </div>
                    </div>
                    <div className="relative pt-4 pb-2 px-1">
                      <input 
                        type="range" 
                        min="0" max="9" step="1"
                        value={minRating}
                        onChange={(e) => setMinRating(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary relative z-10" 
                      />
                      <div className="flex justify-between mt-6">
                        {[0, 2, 4, 6, 8].map(n => (
                          <div key={n} className="flex flex-col items-center gap-2">
                            <div className={`w-[1px] h-3 rounded-full transition-colors ${minRating >= n ? 'bg-primary' : 'bg-slate-800'}`} />
                            <span className={`text-[10px] font-black transition-colors ${minRating >= n ? 'text-slate-300' : 'text-slate-600'}`}>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Year Section */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                        <Calendar size={14} className="text-primary" />
                        תקופה
                      </label>
                    </div>
                    <div className="flex gap-2 p-1 bg-white/[0.02] rounded-[20px] border border-white/5">
                      {years.map(y => (
                        <button 
                          key={y} 
                          onClick={() => setYear(y)}
                          className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all relative ${year === y ? 'bg-white/10 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {y === 'הכל' ? 'כל השנים' : `עונת ${y}`}
                          {year === y && (
                            <motion.div 
                              layoutId="activeYear"
                              className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 -z-10"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* Action Buttons */}
              <footer className="mt-16 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => {
                    setSelectedGenre('הכל');
                    setMinRating(0);
                    setYear('הכל');
                  }}
                  className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white font-black text-[11px] uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-3 group"
                >
                  <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-700" />
                  איפוס הגדרות
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 w-full py-5 rounded-3xl bg-gradient-to-r from-primary to-orange-600 text-black font-black text-sm shadow-[0_20px_50px_rgba(255,159,10,0.3)] hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10">הפעלת מסננים</span>
                  <ChevronDown size={20} className="rotate-[-90deg] group-hover:-translate-x-1 transition-transform relative z-10" />
                </button>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

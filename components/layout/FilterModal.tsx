'use client';

import React from 'react';
import { Filter, X, Film, Star, Calendar, ChevronDown } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 w-screen h-screen">
      <div 
        className="absolute inset-0 bg-[#080808]/80 backdrop-blur-2xl animate-in fade-in duration-700"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[820px] bg-[#0F0F0F] border border-white/10 rounded-[48px] shadow-[0_50px_120px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-[#FF9F0A] to-transparent opacity-50" />
        
        <div className="p-12">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FF9F0A] to-[#FF7A00] flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <Filter className="text-black" size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-2 text-right">מסנן קולנועי</h3>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A] animate-pulse" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">מבצע אופטימיזציה לתוצאות 2026</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="group p-4 rounded-full bg-white/[0.03] hover:bg-[#FF3B30]/10 text-slate-500 hover:text-[#FF3B30] transition-all border border-white/5 hover:border-[#FF3B30]/20">
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </header>

          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-5 space-y-8">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                  <Film size={14} className="text-[#FF9F0A]" />
                  פרופיל ז&apos;אנרים
                </label>
                <span className="text-[10px] text-slate-600 font-bold">{selectedGenre}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {genres.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setSelectedGenre(g)}
                    className={`group flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black transition-all border relative overflow-hidden ${selectedGenre === g ? 'bg-white border-white text-black shadow-2xl' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:text-white'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${selectedGenre === g ? 'bg-black' : 'bg-slate-800 group-hover:bg-[#FF9F0A]'}`} />
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 flex flex-col gap-12">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                    <Star size={14} className="text-[#FF9F0A]" />
                    סף דירוג מבקרים
                  </label>
                  <div className="px-3 py-1 rounded-full bg-[#FF9F0A]/10 border border-[#FF9F0A]/20">
                    <span className="text-xs font-black text-[#FF9F0A]">{minRating}.0+</span>
                  </div>
                </div>
                <div className="relative px-2">
                    <input 
                    type="range" 
                    min="0" max="9" step="1"
                    value={minRating}
                    onChange={(e) => setMinRating(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#FF9F0A] relative z-10" 
                  />
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#FF9F0A] to-transparent opacity-20 pointer-events-none" style={{ width: `${(minRating/9)*100}%` }} />
                  <div className="flex justify-between mt-4">
                    {[0, 3, 6, 9].map(n => (
                      <div key={n} className="flex flex-col items-center gap-1.5">
                        <div className={`w-[2px] h-2 rounded-full ${minRating >= n ? 'bg-[#FF9F0A]' : 'bg-slate-800'}`} />
                        <span className={`text-[10px] font-bold ${minRating >= n ? 'text-slate-300' : 'text-slate-600'}`}>{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">
                  <Calendar size={14} className="text-[#FF9F0A]" />
                  תקופה קולנועית
                </label>
                <div className="flex gap-3">
                  {years.map(y => (
                    <button 
                      key={y} 
                      onClick={() => setYear(y)}
                      className={`flex-1 py-4 rounded-2xl text-[11px] font-black transition-all border relative group ${year === y ? 'bg-[#FF9F0A] text-black border-[#FF9F0A] shadow-xl shadow-orange-500/20' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:text-white'}`}
                    >
                      עונת {y}
                      {year === y && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#FF9F0A]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-6">
            <button 
              onClick={() => {
                setSelectedGenre('הכל');
                setMinRating(0);
                setYear('2026');
              }}
              className="px-8 py-5 rounded-[24px] bg-white/[0.03] text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-white/[0.06] hover:text-white transition-all border border-white/5"
            >
              איפוס הכל
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-5 rounded-[24px] bg-gradient-to-r from-[#FF9F0A] to-[#FF7A00] text-black font-black text-sm shadow-[0_20px_50px_rgba(255,159,10,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <span>הפעל מסנן</span>
              <ChevronDown size={20} className="rotate-90 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

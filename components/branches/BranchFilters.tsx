'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Filter, Navigation } from 'lucide-react';

interface BranchFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (s: boolean) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  selectedFacility: string | null;
  setSelectedFacility: (f: string | null) => void;
  regions: Record<string, string>;
  allFacilities: string[];
  facilityIcons: Record<string, { icon: React.ElementType, label: string }>;
  userCoords: { lat: number, lng: number } | null;
  isLocating: boolean;
  onRefreshLocation: () => void;
}

export function BranchFilters({
  searchQuery, setSearchQuery, 
  showOnlyFavorites, setShowOnlyFavorites,
  selectedRegion, setSelectedRegion,
  selectedFacility, setSelectedFacility,
  regions, allFacilities, facilityIcons,
  userCoords, isLocating, onRefreshLocation
}: BranchFiltersProps) {
  return (
    <header className="mb-12 relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,159,10,0.15)] backdrop-blur-xl"
          >
            <Navigation className="w-10 h-10 text-primary animate-pulse" />
          </motion.div>
          <div className="text-right">
            <h1 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-none mb-3">איתור סניפים</h1>
            <p className="text-slate-400 text-lg font-medium">גלה את חווית הקולנוע הקרובה אליך</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4" dir="rtl">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="חיפוש לפי עיר או סניף..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm text-right"
            />
          </div>
          <button 
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-sm border transition-all ${
              showOnlyFavorites 
                ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(255,159,10,0.2)]' 
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.05]'
            }`}
          >
            <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-primary' : ''}`} />
            מועדפים
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5 justify-end" dir="rtl">
          {Object.entries(regions).map(([key, label]) => (
            <button 
              key={key}
              onClick={() => setSelectedRegion(key)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                selectedRegion === key 
                  ? 'bg-primary text-white shadow-[0_8px_20px_rgba(255,159,10,0.3)]' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <Filter className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-end">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {allFacilities.map(f => (
              <button 
                key={f}
                onClick={() => setSelectedFacility(f === selectedFacility ? null : f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center gap-2 border ${
                  selectedFacility === f 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {facilityIcons[f]?.icon && React.createElement(facilityIcons[f].icon, { className: "w-3 h-3" })}
                {facilityIcons[f]?.label || f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 p-3 pr-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className={`w-2 h-2 rounded-full ${userCoords ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {userCoords ? 'GPS Active' : 'Locating...'}
            </span>
            <button 
              onClick={onRefreshLocation}
              disabled={isLocating}
              className="mr-4 text-primary hover:text-white transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-lg"
            >
              <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              עדכון
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

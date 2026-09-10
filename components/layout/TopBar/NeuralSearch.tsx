'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight, BrainCircuit } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { useBookingStore } from '@/lib/store';
import { executeNeuralSearch } from '@/app/actions/neuralSearchActions';
import NeuralEmotionMatrix from './NeuralEmotionMatrix';
import { Movie } from '@/lib/tmdb';

interface NeuralSearchProps {
  onOpenFilter: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function NeuralSearch({
  onOpenFilter,
  isMobile,
  onCloseMobile,
}: NeuralSearchProps) {
  const setSelectedMovie = useBookingStore((state) => state.setSelectedMovie);
  const allMovies = useBookingStore((state) => state.allMovies);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Matrix State
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [matrixMovies, setMatrixMovies] = useState<Movie[]>([]);
  const [matrixAnalysis, setMatrixAnalysis] = useState('');

  const handleNeuralScan = async () => {
    if (searchQuery.trim().length < 3) return;
    
    setIsScanning(true);
    
    try {
      const res = await executeNeuralSearch({
        prompt: searchQuery,
        movies: allMovies.map(m => ({ id: m.id, title: m.title || m.displayTitle || "", overview: m.overview || "", genre_ids: m.genre_ids || [] }))
      });
      
      if (res.success && res.data) {
        const matched = allMovies.filter(m => res.data!.matchedIds.includes(m.id));
        setMatrixMovies(matched);
        setMatrixAnalysis(res.data.analysis);
        setIsMatrixOpen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNeuralScan();
    }
  };

  return (
    <div className={`relative flex-1 group ${isMobile ? 'w-full' : 'max-w-2xl xl:max-w-3xl'} font-inter`}>
      <div className="relative flex items-center">
        {/* Optical ambient radial glow border */}
        <motion.div
          animate={{ opacity: isSearchFocused ? 1 : 0, scale: isSearchFocused ? 1.01 : 0.99 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/50 via-purple-500/30 to-blue-500/30 blur-[24px] pointer-events-none"
        />

        {isMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="סגור חיפוש נייד"
            className="absolute right-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        <Search
          aria-hidden="true"
          className={`absolute ${isMobile ? 'right-10' : 'right-4 sm:right-5'} w-4.5 h-4.5 transition-all duration-300 ${
            isSearchFocused ? 'text-primary scale-110' : 'text-slate-300'
          }`}
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? 'תאר לנו מה בא לך לראות...' : 'תאר לנו איזה סרט בא לך לראות (למשל: "בא לי סרט חלל מטורף")...'}
          aria-label="חיפוש נוירלי חכם לסרטים"
          className={`w-full bg-[#12131a]/90 backdrop-blur-xl border border-white/15 rounded-2xl ${
            isMobile ? 'py-2.5 pr-14 pl-24 text-xs' : 'py-3 pr-12 pl-44 text-sm'
          } text-white focus:outline-none focus:border-primary/80 focus:bg-[#161722] transition-all duration-300 placeholder:text-slate-400 font-medium tracking-tight shadow-xl`}
        />

        <div className="absolute left-2.5 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNeuralScan();
            }}
            disabled={isScanning || searchQuery.trim().length < 3}
            aria-label="הפעל סריקה נוירלית"
            className={`flex items-center gap-1.5 px-3 ${isMobile ? 'py-1.5 text-[11px]' : 'py-2 text-xs'} rounded-xl font-bold transition-all shadow-md ${
              isScanning || searchQuery.trim().length < 3
                ? 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border-zinc-700/60'
                : 'bg-primary text-black hover:bg-primary/90 hover:scale-102 border-primary/50'
            } border`}
          >
            {isScanning ? <LoadingIndicator variant="spinner" size={14} color="#000000" label="סורק..." /> : <BrainCircuit size={14} aria-hidden="true" />}
            <span className="hidden sm:inline">סריקה נוירלית</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFilter();
            }}
            aria-label="פתח מסנני סרטים מתקדמים"
            title="מסננים"
            className={`${
              isMobile ? 'w-8 h-8' : 'w-9 h-9'
            } flex items-center justify-center rounded-xl border bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border-white/10 active:scale-95 transition-all`}
          >
            <SlidersHorizontal size={isMobile ? 15 : 17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <NeuralEmotionMatrix
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        matchedMovies={matrixMovies}
        analysis={matrixAnalysis}
        onSelectMovie={(movie) => {
          setSelectedMovie(movie);
          setSearchQuery('');
        }}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
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
    <div className={`relative flex-1 group ${isMobile ? 'w-full' : 'max-w-5xl'} font-inter`}>
      <div className="relative flex items-center">
        {/* Optical ambient radial glow border */}
        <motion.div
          animate={{ opacity: isSearchFocused ? 1 : 0, scale: isSearchFocused ? 1.01 : 0.99 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-primary/50 via-purple-500/30 to-blue-500/30 blur-[30px] pointer-events-none"
        />

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="absolute right-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}

        <Search
          className={`absolute ${isMobile ? 'right-12' : 'right-6'} w-5 h-5 transition-all duration-300 ${
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
          className={`w-full bg-[#12131a] border border-white/20 rounded-[28px] ${
            isMobile ? 'py-3.5 pr-20 pl-24 text-sm' : 'py-6 pr-16 pl-48 text-base'
          } text-white focus:outline-none focus:border-primary focus:bg-[#161722] transition-all duration-300 placeholder:text-slate-400 font-bold tracking-tight shadow-3xl`}
        />

        <div className="absolute left-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNeuralScan();
            }}
            disabled={isScanning || searchQuery.trim().length < 3}
            className={`flex items-center gap-2 px-4 ${isMobile ? 'py-2' : 'py-3'} rounded-2xl font-black text-xs md:text-sm transition-all shadow-xl ${
              isScanning || searchQuery.trim().length < 3
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700'
                : 'bg-primary text-black hover:bg-primary/90 hover:scale-105 border-primary/50'
            } border`}
          >
            {isScanning ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
            <span className="hidden sm:inline">סריקה נוירלית</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFilter();
            }}
            className={`${
              isMobile ? 'w-9 h-9' : 'w-12 h-12'
            } flex items-center justify-center rounded-2xl border bg-zinc-850 text-slate-200 hover:bg-zinc-800 border-zinc-700 active:scale-95 transition-transform`}
          >
            <SlidersHorizontal size={isMobile ? 16 : 20} />
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

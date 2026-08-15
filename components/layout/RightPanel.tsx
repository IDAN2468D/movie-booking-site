'use client';

import React, { useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { MapPin, Clapperboard, X } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { getImageUrl } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { MarkerHighlight } from '../fx/MarkerHighlight';
import CineSyncDashboard from '@/components/premium/cinesync/CineSyncDashboard';
import { RightPanelLiveCinemaCard } from './RightPanelLiveCinemaCard';

export default function RightPanel() {
  const { 
    selectedMovie, 
    setSelectedMovie, 
    location, 
    selectedSeats,
    selectedShowtime,
    setDraggingMovieName,
    draggingMovieName
  } = useBookingStore();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const seatCount = selectedSeats.length;
  const showtimeId = selectedShowtime || "default-st-1";
  const userId = "current-user-id";

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!panelRef.current) return;
    const cards = panelRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const movieData = e.dataTransfer.getData('movie');
    if (movieData) {
      try {
        const movie = JSON.parse(movieData);
        setSelectedMovie(movie);
        setDraggingMovieName(null);
      } catch (err) {
        console.error("Failed to parse dropped movie:", err);
      }
    }
  };

  return (
    <aside 
      ref={panelRef}
      onPointerMove={handlePointerMove}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`hidden xl:flex h-screen w-[440px] 2xl:w-[480px] 3xl:w-[520px] bg-black/10 backdrop-blur-3xl saturate-[200%] brightness-110 border-r border-white/10 flex-col p-6 lg:p-8 z-40 flex-shrink-0 shadow-2xl relative overflow-y-auto custom-scrollbar font-inter transition-colors duration-500 dir-rtl ${
        isDraggingOver ? 'bg-primary/5 border-primary/30' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-2xl font-black text-white tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-l from-white to-white/60">
          קולנוע בשידור חי
        </h2>
        <div className="flex items-center gap-2 text-[#FF9F0A] bg-[#FF9F0A]/10 px-4 py-2 rounded-2xl border border-[#FF9F0A]/20 backdrop-blur-md shadow-lg">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">{location}</span>
        </div>
      </div>

      {!selectedMovie ? (
        <div 
          className={`gradient-border-card group flex-1 flex flex-col items-center justify-center text-center p-8 rounded-[40px] border transition-all duration-500 mb-8 relative overflow-hidden ${
            isDraggingOver 
              ? 'bg-primary/10 border-primary/50 shadow-2xl scale-[1.02]' 
              : 'bg-white/[0.02] border-white/5 shadow-xl'
          }`}
        >
          <div className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
            style={{
              background: 'radial-gradient(300px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.95), rgba(6, 182, 212, 0.8), transparent 70%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-white/5 text-primary border border-white/10 relative z-10">
            <Clapperboard className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white mb-3 font-outfit relative z-10">
            {draggingMovieName ? `מוכנים ל-${draggingMovieName}?` : 'מוכנים לסרט בשידור חי?'}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
            גרור סרט לכאן או בחר מהלוח כדי להתחיל את חווית הצפייה בשידור חי.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black text-white font-outfit truncate">
              שידור חי: <span className="text-primary">{selectedMovie.displayTitle}</span>
            </h3>
            <button 
              onClick={() => setSelectedMovie(null)}
              aria-label="החלף סרט שנבחר"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-slate-300"
            >
              <span>החלף</span>
              <X className="w-3 h-3 text-primary" aria-hidden="true" />
            </button>
          </div>

          <motion.div 
            key={selectedMovie.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-border-card group mb-6 relative rounded-[36px] overflow-hidden aspect-video shadow-2xl border border-white/10"
          >
            <div className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
              style={{
                background: 'radial-gradient(350px circle at var(--x, 50%) var(--y, 50%), rgba(6, 182, 212, 0.95), rgba(168, 85, 247, 0.8), transparent 70%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            <NextImage 
              src={getImageUrl(selectedMovie.backdrop_path || selectedMovie.poster_path, 'w500')} 
              alt={selectedMovie.displayTitle}
              fill
              sizes="400px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 right-4 text-right z-20">
              <h3 className="text-xl font-black text-white">{selectedMovie.displayTitle}</h3>
              <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded text-[9px] font-black text-primary uppercase">
                שידור חי HD 120Hz
              </span>
            </div>
          </motion.div>

          <div className="space-y-6 flex-1">
            <CineSyncDashboard />
            <RightPanelLiveCinemaCard showtimeId={showtimeId} userId={userId} seatCount={seatCount} />

            <Link 
              href="/checkout"
              aria-label={seatCount > 0 ? `הזמן ${seatCount} כרטיסי שידור חי` : "בחר מושבים בשידור חי למעבר לתשלום"}
              className={`block w-full mt-6 h-16 rounded-2xl font-black flex items-center justify-center transition-all duration-300 shadow-2xl relative overflow-hidden ${
                seatCount > 0 
                  ? 'bg-primary text-black shadow-primary/30 hover:scale-[1.02]' 
                  : 'bg-white/10 text-white/40 pointer-events-none border border-white/5'
              }`}
            >
              <div className="relative z-10 flex flex-col items-center">
                {seatCount > 0 ? (
                  <MarkerHighlight color="rgba(0,0,0,0.06)" delay={0.1} strokeWidth={4}>
                    <span className="text-base font-black text-black">
                      {`הזמן ${seatCount} כרטיסי שידור חי`}
                    </span>
                  </MarkerHighlight>
                ) : (
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">בחר מושבים בשידור חי</span>
                )}
              </div>
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}

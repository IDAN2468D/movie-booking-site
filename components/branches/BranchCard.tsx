'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Heart, Clock, ExternalLink, Ticket, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Cinema } from '@/lib/actions/cinemas';
import { Movie } from '@/lib/tmdb';

interface BranchCardProps {
  branch: Cinema;
  isSelected: boolean;
  isFav: boolean;
  isOpen: boolean;
  distance: string | null;
  selectedMovie: Movie | null;
  onToggleFav: (id: string) => void;
  onSetLocation: (loc: string) => void;
  onSetSelectedBranch: (id: string) => void;
  facilityIcons: Record<string, { icon: React.ElementType, label: string }>;
}

export function BranchCard({
  branch, isSelected, isFav, isOpen, distance, 
  selectedMovie, onToggleFav, onSetLocation, 
  onSetSelectedBranch, facilityIcons
}: BranchCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      id={`branch-${branch._id}`}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`gradient-border-card group relative p-0.5 rounded-[2.5rem] cursor-pointer transition-all duration-700 ${
        isSelected 
          ? 'bg-gradient-to-br from-primary via-cyan-500 to-primary shadow-[0_20px_60px_rgba(255,159,10,0.15)]' 
          : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      {/* Dynamic Cursor-Tracked Radial Gradient Mask */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: 'radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.95), rgba(6, 182, 212, 0.8), transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative h-full bg-[#111112] rounded-[2.4rem] p-6 overflow-hidden flex flex-col border border-white/5 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-2">
              <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${
                isSelected ? 'bg-primary text-white' : 'bg-white/10 text-primary'
              }`}>
                {branch.feature}
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.floor(branch.rating || 5) ? 'text-primary fill-primary' : 'text-slate-800'}`} />
                ))}
                <span className="text-[9px] font-black text-slate-500 mr-1">{branch.rating}</span>
              </div>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFav(branch._id); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFav ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-slate-600 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-primary' : ''}`} />
            </button>
          </div>

          <h3 className="text-2xl font-black text-white font-outfit mb-1 group-hover:text-primary transition-colors text-right">
            {branch.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 mb-6 justify-end">
            <span className="font-bold text-xs">{branch.address}, {branch.city}</span>
            <MapPin className="w-3.5 h-3.5 text-primary/60" />
          </div>

          <div className="flex items-center gap-3 mb-6 justify-end">
            {distance && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase">
                <Navigation className="w-3.5 h-3.5" />
                <span>{distance} ק&quot;מ</span>
              </div>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
              isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{isOpen ? 'פתוח עכשיו' : 'סגור'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {selectedMovie ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetSelectedBranch(branch._id);
                  router.push(`/book/${selectedMovie.id}/${branch._id}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs bg-primary text-white shadow-lg transition-all duration-500"
              >
                <Ticket size={16} />
                בחר סניף להזמנה
              </motion.button>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSetLocation(`${branch.name}, ישראל`);
                  router.push('/');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs transition-all duration-500 ${
                  isSelected ? 'bg-white text-black' : 'bg-primary text-white shadow-lg'
                }`}
              >
                {isSelected ? 'הסניף הנבחר' : 'הפוך לסניף שלי'}
                {!isSelected && <ChevronRight className="w-4 h-4 mr-2" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

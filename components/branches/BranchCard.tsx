'use client';

import React from 'react';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative p-0.5 rounded-[2.5rem] cursor-pointer transition-all duration-700 ${
        isSelected 
          ? 'bg-gradient-to-br from-primary via-cyan-500 to-primary shadow-[0_20px_60px_rgba(255,159,10,0.15)]' 
          : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      <div className="relative h-full bg-[#111112] rounded-[2.4rem] p-6 overflow-hidden flex flex-col border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none rotate-12">
          <Image 
            src={branch.image} 
            alt={branch.name} 
            fill 
            sizes="160px"
            className="object-cover rounded-full" 
          />
        </div>

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
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(branch._id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFav ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-slate-600 border border-white/5 hover:text-white'
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

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">שעות פעילות</span>
              <span className="text-[10px] font-bold text-slate-300">{branch.hours}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">טלפון</span>
              <span className="text-[10px] font-bold text-slate-300">{branch.phone}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-end">
            {branch.facilities?.slice(0, 3).map((f: string) => (
              <div key={f} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-colors" title={facilityIcons[f]?.label}>
                {facilityIcons[f]?.icon && React.createElement(facilityIcons[f].icon, { className: "w-4 h-4" })}
              </div>
            ))}
            {branch.facilities && branch.facilities.length > 3 && (
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-600">
                +{branch.facilities.length - 3}
              </div>
            )}
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
                data-testid="select-branch-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetSelectedBranch(branch._id);
                  router.push(`/book/${selectedMovie.id}/${branch._id}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs bg-primary text-white shadow-[0_10px_30px_rgba(255,159,10,0.2)] transition-all duration-500 group"
              >
                <Ticket size={16} className="group-hover:rotate-12 transition-transform" />
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
                  isSelected ? 'bg-white text-black' : 'bg-primary text-white shadow-[0_10px_30px_rgba(255,159,10,0.2)]'
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

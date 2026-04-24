'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MapPin, X, Star, Zap, Navigation } from 'lucide-react';
import { CINEMA_BRANCHES } from '@/lib/constants';
import { useBookingStore } from '@/lib/store';

interface BranchSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BranchSelector({ isOpen, onClose }: BranchSelectorProps) {
  const { location, setLocation } = useBookingStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[70] p-8"
          >
            <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                      <MapPin className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white font-outfit tracking-tight">בחר סניף</h2>
                      <p className="text-slate-400 text-sm font-medium">מצא את החוויה הקולנועית הקרובה אליך</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CINEMA_BRANCHES.map((branch) => {
                    const isSelected = location === `${branch.name}, ישראל`;
                    
                    return (
                      <motion.button
                        key={branch.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setLocation(`${branch.name}, ישראל`);
                          onClose();
                        }}
                        className={`flex items-start gap-4 p-5 rounded-[28px] border transition-all duration-500 text-right group ${
                          isSelected 
                            ? 'bg-primary border-primary shadow-[0_10px_40px_rgba(255,159,10,0.3)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border relative ${isSelected ? 'border-background/20' : 'border-white/10'}`}>
                          <Image 
                            src={branch.image} 
                            alt={branch.name} 
                            fill
                            className="object-cover" 
                          />
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-background/20 text-background' : 'bg-primary/20 text-primary'
                            }`}>
                              {branch.feature}
                            </span>
                            {isSelected && <Zap className="w-3 h-3 text-background fill-background" />}
                          </div>
                          <h3 className={`font-black text-lg truncate ${isSelected ? 'text-background' : 'text-white'}`}>
                            {branch.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Navigation className={`w-3 h-3 ${isSelected ? 'text-background/70' : 'text-slate-400'}`} />
                            <span className={isSelected ? 'text-background/70' : 'text-slate-400'}>
                              {branch.address}, {branch.city}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center shadow-lg">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">מערכת כרטוס אונליין</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">זמין ב-4K HDR</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Ticket, ChevronLeft, ChevronRight, CheckCircle2, CreditCard, Popcorn } from 'lucide-react';
import { CINEMA_BRANCHES } from '@/lib/constants';
import { useBookingStore } from '@/lib/store';
import { Movie } from '@/lib/tmdb';
import Image from 'next/image';

interface BookingWizardProps {
  movie: Movie;
  onComplete?: () => void;
}

const SHOWTIMES = ['16:00', '18:30', '19:30', '21:00', '22:45'];

export const BookingWizard = ({ movie, onComplete }: BookingWizardProps) => {
  const { 
    setSelectedMovie, setSelectedBranchId, setSelectedShowtime, 
    selectedBranchId, selectedShowtime, selectedSeats, toggleSeat 
  } = useBookingStore();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setSelectedMovie(movie);
  }, [movie, setSelectedMovie]);

  const selectedBranch = CINEMA_BRANCHES.find(b => b.id === selectedBranchId);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5);
      if (onComplete) onComplete();
    }, 2000);
  };

  const renderBranchStep = () => (
    <div className="space-y-4">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">בחר סניף</p>
      <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto no-scrollbar pr-1">
        {CINEMA_BRANCHES.slice(0, 5).map(branch => (
          <button
            key={branch.id}
            onClick={() => { setSelectedBranchId(branch.id); nextStep(); }}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              selectedBranchId === branch.id 
                ? 'bg-primary/20 border-primary/50 text-primary' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3 text-right">
              <MapPin size={14} className={selectedBranchId === branch.id ? 'text-primary' : 'text-slate-500'} />
              <div>
                <p className="text-xs font-bold">{branch.name}</p>
                <p className="text-[9px] text-slate-500">{branch.city}</p>
              </div>
            </div>
            <ChevronRight size={14} className="opacity-40" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderTimeStep = () => (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">שעות הקרנה - היום</p>
        <div className="flex flex-wrap gap-2">
          {SHOWTIMES.map(time => (
            <button
              key={time}
              onClick={() => { setSelectedShowtime(time); nextStep(); }}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                selectedShowtime === time 
                  ? 'bg-primary text-background border-primary' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <button onClick={prevStep} className="text-[10px] font-black text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
          <ChevronLeft size={12} /> חזור לסניפים
        </button>
      </div>
    </div>
  );

  const renderSeatStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full mb-8" />
        <div className="grid grid-cols-8 gap-1.5 justify-center max-w-[240px] mx-auto">
          {Array.from({ length: 32 }).map((_, i) => {
            const seatId = `${String.fromCharCode(65 + Math.floor(i / 8))}${i % 8 + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            return (
              <button
                key={seatId}
                onClick={() => toggleSeat(seatId)}
                className={`w-6 h-6 rounded-md border text-[8px] font-bold transition-all ${
                  isSelected 
                    ? 'bg-primary border-primary text-background shadow-[0_0_10px_rgba(255,159,10,0.4)]' 
                    : 'bg-white/5 border-white/10 text-slate-600 hover:border-primary/50'
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <button onClick={prevStep} className="text-[10px] font-black text-slate-500 flex items-center gap-1">
          <ChevronLeft size={12} /> חזור לשעות
        </button>
        <button 
          disabled={selectedSeats.length === 0}
          onClick={nextStep}
          className="bg-primary text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
        >
          המשך לסיכום
        </button>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-3xl p-5 border border-white/10 space-y-4">
        <div className="flex gap-4">
          <div className="w-16 h-24 rounded-xl overflow-hidden relative border border-white/10">
            <Image src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
          </div>
          <div className="flex-1 text-right">
            <h4 className="text-sm font-black text-white mb-1">{movie.title}</h4>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                {selectedBranch?.name} <MapPin size={10} />
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                {selectedShowtime} - אולם IMAX <Clock size={10} />
              </p>
              <p className="text-[10px] text-primary font-bold">
                מושבים: {selectedSeats.join(', ')}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-xs font-black text-white">סה"כ לתשלום: ₪{(selectedSeats.length * 45).toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-slate-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">Secure Pay</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 bg-white/5 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
          שינוי
        </button>
        <button 
          onClick={handleFinish}
          disabled={isProcessing}
          className="flex-1 bg-primary text-background py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          {isProcessing ? 'מעבד...' : 'אשר ושלם'}
          <Ticket size={14} />
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-8 space-y-4"
    >
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
        <CheckCircle2 className="text-green-500 w-10 h-10" />
      </div>
      <div>
        <h4 className="text-xl font-black text-white mb-2">ההזמנה בוצעה בהצלחה!</h4>
        <p className="text-xs text-slate-400 leading-relaxed">הכרטיסים נשלחו למייל שלך ומופיעים באזור האישי. תהנו מהסרט!</p>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <button 
          onClick={() => window.location.href = '/tickets'}
          className="w-full bg-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
        >
          צפייה בכרטיסים שלי
        </button>
        <button 
          onClick={() => window.location.href = '/food'}
          className="w-full bg-primary/20 text-primary py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/30 flex items-center justify-center gap-2"
        >
          <Popcorn size={14} />
          הזמן נשנושים למקום
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-3xl rounded-[32px] border border-white/5 p-6 overflow-hidden relative" dir="rtl">
      {/* Step Indicator */}
      {step < 5 && (
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && renderBranchStep()}
          {step === 2 && renderTimeStep()}
          {step === 3 && renderSeatStep()}
          {step === 4 && renderSummaryStep()}
          {step === 5 && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

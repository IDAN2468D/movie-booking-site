'use client';

import React from 'react';
import NextImage from 'next/image';
import { Calendar, Clock, Ticket, ArrowRight, Zap } from 'lucide-react';
import { Movie } from '@/lib/tmdb';

interface OrderSummaryProps {
  movie: Movie;
  seats: string[];
  seatCount: number;
  ticketPrice: number;
  foodTotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onPayment: () => void;
  priceInsights?: string[];
}

export const OrderSummary = ({
  movie, seats, seatCount, ticketPrice, foodTotal, tax, total, isProcessing, onPayment, priceInsights = []
}: OrderSummaryProps) => {
  return (
    <div 
      className="rounded-[40px] p-10 border border-white/5 relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.4)'
      }}
    >
       <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16" />
       
       <h3 className="text-xl font-bold text-white mb-8 tracking-tight">סיכום הזמנה</h3>
       
       <div className="flex gap-4 mb-8 flex-row-reverse">
          <div className="w-20 h-28 relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <NextImage 
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={movie.title} 
              fill
              sizes="80px"
              className="object-cover" 
            />
          </div>
          <div className="flex-1 py-1 text-right">
            <h4 className="text-white font-black text-sm mb-2">{movie.title}</h4>
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                <Calendar size={10} className="text-primary" /> {new Date().toLocaleDateString('he-IL', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                <Clock size={10} className="text-primary" /> 19:30 • IMAX
              </p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                <Ticket size={10} className="text-primary" /> {seats.join(', ')}
              </p>
            </div>
          </div>
       </div>

       <div className="space-y-4 pt-6 border-t border-white/5">
          <Row label={`כרטיסים (${seatCount}x)`} value={`₪${(seatCount * ticketPrice).toFixed(2)}`} />
          {foodTotal > 0 && <Row label="אוכל ונשנושים" value={`₪${foodTotal.toFixed(2)}`} />}
          <Row label="מיסים ועמלות (17%)" value={`₪${tax.toFixed(2)}`} />
          
          <div className="pt-6 mt-2 border-t border-white/5 flex justify-between items-end flex-row-reverse">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">סכום כולל</p>
                <p className="text-3xl font-black text-white tracking-tighter">₪{total.toFixed(2)}</p>
             </div>
             {priceInsights.length > 0 && (
                <div className="px-3 py-1 bg-cyan-400/20 text-cyan-400 text-[10px] font-black rounded-full border border-cyan-400/30">
                   מחיר דינמי
                </div>
              )}
          </div>

          {priceInsights.length > 0 && (
             <div className="mt-4 space-y-2">
               {priceInsights.map((insight, i) => (
                 <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5 flex-row-reverse">
                   <Zap size={10} className="text-cyan-400 fill-cyan-400/20" />
                   <p className="text-[9px] text-slate-400 font-bold text-right">{insight}</p>
                 </div>
               ))}
             </div>
           )}
       </div>

       <button 
        onClick={onPayment}
        disabled={isProcessing}
        className="w-full mt-10 py-5 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-[#FF7A00] transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-row-reverse"
       >
         {isProcessing ? (
           <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
         ) : (
           <>
             השלם תשלום
            <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
           </>
         )}
       </button>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm flex-row-reverse">
     <span className="text-slate-500 font-medium">{label}</span>
     <span className="text-white font-bold">{value}</span>
  </div>
);

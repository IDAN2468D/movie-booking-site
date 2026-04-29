'use client';

import React from 'react';
import NextImage from 'next/image';
import { Calendar, Clock, ArrowRight, Zap, MapPin, Armchair } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="rounded-[40px] border border-white/[0.08] relative overflow-hidden group/card"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(60px) saturate(200%)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.04)'
      }}
    >
       {/* Ambient Glow Effects */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1464]/[0.06] rounded-full blur-[100px] -mr-32 -mt-32 opacity-60 group-hover/card:opacity-100 transition-opacity duration-1000" />
       <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/[0.04] rounded-full blur-[80px] -ml-24 -mb-24" />

       {/* Movie Poster Hero Section */}
       <div className="relative h-44 overflow-hidden">
         <NextImage 
           src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path || movie.poster_path}`} 
           alt={movie.displayTitle} 
           fill
           sizes="(max-width: 768px) 100vw, 500px"
           className="object-cover" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0A0A0A]" />
         
         {/* Movie Title Overlay */}
         <div className="absolute bottom-0 right-0 left-0 p-8 text-right">
           <h4 className="text-white font-black text-xl leading-tight font-rubik drop-shadow-2xl mb-2">{movie.displayTitle}</h4>
           <div className="flex items-center gap-3 flex-row-reverse">
             <span className="px-3 py-1 bg-[#E5FF00]/20 text-[#E5FF00] text-[9px] font-black rounded-full border border-[#E5FF00]/30 uppercase tracking-widest font-anton">IMAX</span>
           </div>
         </div>
       </div>
       
       {/* Content Section */}
       <div className="p-8 pt-6">
         {/* Booking Details Grid */}
         <div className="grid grid-cols-2 gap-3 mb-8">
           <DetailChip icon={<Calendar size={13} />} label="תאריך" value={new Date().toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })} />
           <DetailChip icon={<Clock size={13} />} label="שעה" value="19:30" />
           <DetailChip icon={<Armchair size={13} />} label="מושבים" value={seats.join(', ')} />
           <DetailChip icon={<MapPin size={13} />} label="אולם" value="IMAX 1" />
         </div>

         {/* Divider */}
         <div className="h-px bg-gradient-to-l from-transparent via-white/10 to-transparent mb-6" />

         {/* Price Breakdown */}
         <div className="space-y-4">
           <PriceRow label={`כרטיסים (${seatCount}x)`} value={`₪${(seatCount * ticketPrice).toFixed(2)}`} />
           {foodTotal > 0 && <PriceRow label="אוכל ונשנושים" value={`₪${foodTotal.toFixed(2)}`} highlight />}
           <PriceRow label="מע״מ (17%)" value={`₪${tax.toFixed(2)}`} muted />
           
           {/* Total Section */}
           <div className="pt-6 mt-2 border-t border-white/[0.06]">
             <div className="flex justify-between items-end flex-row-reverse">
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 font-rubik">סכום כולל לתשלום</p>
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-[10px] text-white/30 font-bold">₪</span>
                    <span className="text-4xl font-black text-white tracking-tighter font-anton">{total.toFixed(2)}</span>
                  </div>
                </div>
                {priceInsights.length > 0 && (
                  <div className="px-4 py-1.5 bg-[#0AEFFF]/10 text-[#0AEFFF] text-[9px] font-black rounded-full border border-[#0AEFFF]/30 uppercase tracking-widest font-anton flex items-center gap-2">
                    <Zap size={10} className="fill-[#0AEFFF]/30" />
                    DYNAMIC
                  </div>
                )}
             </div>
           </div>

           {/* Price Insights */}
           {priceInsights.length > 0 && (
              <div className="mt-4 space-y-2">
                {priceInsights.map((insight, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-2xl border border-white/[0.04] flex-row-reverse hover:bg-white/[0.06] transition-colors"
                  >
                    <Zap size={11} className="text-[#0AEFFF] fill-[#0AEFFF]/20 shrink-0" />
                    <p className="text-[10px] text-white/50 font-bold text-right flex-1 font-rubik">{insight}</p>
                  </motion.div>
                ))}
              </div>
           )}
         </div>

         {/* CTA Button */}
         <motion.button 
           whileHover={{ scale: 1.02, y: -2 }}
           whileTap={{ scale: 0.98 }}
           onClick={onPayment}
           disabled={isProcessing}
           className="w-full mt-8 h-16 bg-[#FF1464] text-white rounded-[20px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#FF1464]/30 hover:shadow-[0_20px_60px_rgba(255,20,100,0.4)] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex-row-reverse relative overflow-hidden font-rubik"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] -translate-x-full group-hover:animate-shimmer z-10" style={{ backgroundSize: '200% 100%' }} />
            
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-20">השלם תשלום</span>
                <ArrowRight size={16} className="relative z-20 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
       </div>
    </motion.div>
  );
};

/* ── Sub-Components ── */

const DetailChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-3.5 text-right hover:bg-white/[0.05] transition-colors">
    <div className="flex items-center gap-2 flex-row-reverse mb-1.5">
      <span className="text-[#FF1464]">{icon}</span>
      <span className="text-[9px] font-black text-white/25 uppercase tracking-widest font-anton">{label}</span>
    </div>
    <p className="text-sm font-black text-white font-rubik truncate">{value}</p>
  </div>
);

const PriceRow = ({ label, value, highlight, muted }: { label: string; value: string; highlight?: boolean; muted?: boolean }) => (
  <div className="flex justify-between items-center text-sm flex-row-reverse">
     <span className={`font-bold font-rubik ${muted ? 'text-white/25' : 'text-white/45'}`}>{label}</span>
     <span className={`font-black font-anton tracking-wider ${
       highlight ? 'text-[#E5FF00]' : muted ? 'text-white/30' : 'text-white'
     }`}>{value}</span>
  </div>
);

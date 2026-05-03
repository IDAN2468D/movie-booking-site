'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ChevronRight, Clapperboard, X } from 'lucide-react';
import SeatMap from '../booking/SeatMap';
import ShowtimeSelector from '../booking/ShowtimeSelector';
import { useSession } from 'next-auth/react';

import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import { MarkerHighlight } from '../fx/MarkerHighlight';
const runningShows = [
  { id: 1, title: 'דדפול & וולברין', time: '14:30', screen: 'אולם 4', type: 'IMAX', language: 'אנגלית', seats: '20/30' },
  { id: 2, title: 'הקול בראש 2', time: '16:00', screen: 'אולם 1', type: '4DX', language: 'אנגלית', seats: '15/30' },
  { id: 3, title: 'בורדרלנדס', time: '18:15', screen: 'אולם 2', type: '3D', language: 'אנגלית', seats: '28/30' },
];
export default function RightPanel() {
  useSession();
  const { 
    selectedMovie, setSelectedMovie, selectedSeats, location, 
    draggingMovieName, selectedFood, updateFoodQuantity
  } = useBookingStore();
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const dragCounter = React.useRef(0);

  const seatCount = selectedSeats.length;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDraggingOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);
    const movieData = e.dataTransfer.getData('movie');
    if (movieData) {
      try {
        const movie = JSON.parse(movieData);
        setSelectedMovie(movie);
      } catch (err) {
        console.error('Failed to parse movie data', err);
      }
    }
  };

  return (
    <aside 
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-[480px] h-screen bg-[#0F0F0F]/80 backdrop-blur-3xl saturate-[200%] brightness-110 border-r border-white/10 flex flex-col p-8 overflow-y-auto hidden xl:flex text-right relative transition-all duration-700 ${
        isDraggingOver ? 'ring-2 ring-primary/50 ring-inset shadow-[0_0_100px_rgba(255,159,10,0.1)]' : ''
      }`} 
      dir="rtl"
    >
      {/* Holographic Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Drop Zone Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 bg-primary/5 backdrop-blur-2xl flex items-center justify-center p-8 pointer-events-none transition-all duration-500">
          <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-[48px] flex flex-col items-center justify-center bg-primary/5 animate-pulse shadow-[inset_0_0_40px_rgba(255,159,10,0.1)]">
            <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 border border-primary/30 rotate-12 transition-transform duration-500 group-hover:rotate-0">
              <Clapperboard className="text-primary w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">
              {selectedMovie ? 'להחליף ל-' : 'מוכנים ל-'}
              <span className="text-primary">{draggingMovieName || 'סרט זה'}</span>?
            </h3>
            <p className="text-sm text-primary font-bold opacity-80 uppercase tracking-widest">שחרר כאן כדי להמשיך</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10 relative">
        <h2 className="text-2xl font-black text-white tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-l from-white to-white/60">קולנוע בשידור חי</h2>
        <div className="flex items-center gap-2 text-[#FF9F0A] bg-[#FF9F0A]/10 px-4 py-2 rounded-2xl border border-[#FF9F0A]/20 backdrop-blur-md shadow-lg shadow-orange-500/5">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">{location}</span>
        </div>
      </div>

      {!selectedMovie ? (
        <div 
          className={`flex-1 flex flex-col items-center justify-center text-center p-8 rounded-[48px] border transition-all duration-700 mb-8 relative group overflow-hidden ${
            isDraggingOver 
              ? 'bg-primary/10 border-primary/50 shadow-[0_0_60px_rgba(255,159,10,0.15)] scale-[1.02]' 
              : 'bg-white/[0.02] border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)]'
          }`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-700 border ${
            isDraggingOver 
              ? 'bg-primary text-background border-primary scale-110 rotate-0 shadow-2xl shadow-primary/20' 
              : 'bg-white/5 text-slate-500 border-white/5 -rotate-6'
          }`}>
             <Clapperboard className="w-10 h-10" />
          </div>
          <h3 className={`text-xl font-black mb-3 transition-colors font-outfit ${isDraggingOver ? 'text-primary' : 'text-white'}`}>
            {draggingMovieName ? `מוכנים ל-${draggingMovieName}?` : 'מוכנים לסרט?'}
          </h3>
          <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed font-medium">גרור סרט לכאן או בחר מהלוח כדי להתחיל את חווית ההזמנה היוקרתית שלך.</p>
          
          {/* Decorative Gradient */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-black text-white font-outfit">
              מוכנים ל-<span className="text-primary tracking-tight">{selectedMovie.displayTitle}</span>!
            </h3>
            <button 
              onClick={() => setSelectedMovie(null)}
              className="group/btn flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all active:scale-95"
            >
              <span className="text-[9px] font-black text-slate-400 group-hover/btn:text-white uppercase tracking-widest transition-colors">החלף סרט</span>
              <X className="w-3 h-3 text-slate-500 group-hover/btn:text-primary transition-colors" />
            </button>
          </div>
          <motion.div 
            key={selectedMovie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative rounded-[48px] overflow-hidden aspect-video group shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            <NextImage 
              src={selectedMovie.backdrop_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80'} 
              alt={selectedMovie.displayTitle}
              fill
              sizes="400px"
              className="object-cover group-hover:scale-110 transition-transform duration-1000 saturate-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 right-6 text-right">
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1 drop-shadow-2xl">{selectedMovie.displayTitle}</h3>
              <div className="flex items-center gap-2 justify-end">
                <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded text-[10px] font-black text-primary uppercase tracking-tighter">PREMIUM EXPERIENCE</span>
                <p className="text-xs text-slate-300 font-bold">{selectedMovie.release_date?.split('-')[0] || 'TBA'}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8 flex-1">
            {/* Cinema Selector Card */}
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent rounded-[40px] p-8 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md relative overflow-hidden">
               {/* Holographic overlay inside card */}
               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-30 pointer-events-none" />
               
               {/* Scroll Indicator (matches user's image) */}

               <div className="flex items-center gap-4 mb-10 relative">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                    <Calendar className="text-primary w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">מיקום נוכחי</p>
                    <p className="text-lg text-white font-black tracking-tight">קולנוע נייטהוק</p>
                  </div>
               </div>
               
               <div id="booking-section" className="space-y-10 relative">
                 <ShowtimeSelector />
                 
                 <div className="pt-10 border-t border-white/10">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-60">בחירת מושבים</h3>
                       <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,159,10,0.5)]" />
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">נבחר</span>
                        </div>
                      </div>
                    </div>
                    <SeatMap />
                 </div>

                 <div className="pt-10 border-t border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-60">תוספות לנשנוש</h3>
                      <span className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-tighter animate-pulse">הטבה בהזמנה מראש</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {[
                        { id: 1, name: 'פופקורן', price: '₪25', icon: '🍿' },
                        { id: 2, name: 'שתייה', price: '₪15', icon: '🥤' },
                        { id: 3, name: 'נאצ׳וס', price: '₪30', icon: '🌮' },
                      ].map((snack) => {
                        const quantity = selectedFood.find(f => f.id === snack.id)?.quantity || 0;
                        return (
                          <button 
                            key={snack.id} 
                            onClick={() => updateFoodQuantity(snack.id, 1)}
                            className={`flex-shrink-0 relative bg-white/[0.03] border p-5 rounded-[32px] transition-all duration-500 text-center min-w-[110px] group active:scale-95 overflow-hidden ${
                              quantity > 0 
                                ? 'border-primary/40 bg-primary/10 shadow-[0_10px_30px_rgba(255,159,10,0.1),inset_0_0_20px_rgba(255,159,10,0.05)]' 
                                : 'border-white/5 hover:border-white/20'
                            }`}
                          >
                            {/* Inner Glow for selected */}
                            {quantity > 0 && <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />}
                            
                            {quantity > 0 && (
                              <div className="absolute top-3 left-3 w-7 h-7 bg-primary text-background rounded-xl text-[11px] font-black flex items-center justify-center shadow-xl shadow-primary/20 animate-in zoom-in spin-in-90 duration-500">
                                {quantity}
                              </div>
                            )}
                            <div className="text-3xl mb-3 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500 ease-out">{snack.icon}</div>
                            <p className="text-[11px] text-white font-black tracking-tight mb-1">{snack.name}</p>
                            <p className="text-[11px] text-primary font-black opacity-80">{snack.price}</p>
                          </button>
                        );
                      })}
                    </div>
                 </div>
               </div>

               <Link 
                href="/checkout"
                className={`block w-full mt-10 h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] font-black flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-[0.95] relative overflow-hidden group ${
                  seatCount > 0 
                    ? 'bg-primary text-black shadow-[0_20px_50px_rgba(255,159,10,0.3)] hover:shadow-[0_25px_60px_rgba(255,159,10,0.4)] hover:-translate-y-1' 
                    : 'bg-white/10 text-white/40 pointer-events-none border border-white/5'
                }`}
               >
                 {/* Premium Liquid Glass Effects */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-30 z-10 pointer-events-none" />
                 <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group:animate-shimmer z-20" style={{ backgroundSize: '200% 100%' }} />
 
                 <div className="relative z-30 flex flex-col items-center text-center">
                    {seatCount > 0 ? (
                      <>
                        <span className="text-[9px] md:text-sm font-black uppercase tracking-widest text-black/70 font-rubik leading-none mb-0.5 md:mb-1">חווית צפייה פרמיום</span>
                        <div className="relative">
                          <MarkerHighlight color="rgba(0,0,0,0.06)" delay={0.1} strokeWidth={4}>
                            <span className="text-base md:text-2xl font-black font-rubik text-black block tracking-tight">
                              {`הזמן ${seatCount} כרטיסים`}
                            </span>
                          </MarkerHighlight>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm md:text-base font-black font-rubik uppercase tracking-widest text-white/50">בחר מושבים להמשך</span>
                    )}
                 </div>
               </Link>


            </div>
          </div>
        </>
      )}

      </aside>
  );
}


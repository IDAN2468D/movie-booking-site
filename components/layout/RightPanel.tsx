'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ChevronRight, Clapperboard } from 'lucide-react';
import SeatMap from '../booking/SeatMap';
import ShowtimeSelector from '../booking/ShowtimeSelector';

import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';

const runningShows = [
  { id: 1, title: 'דדפול & וולברין', time: '14:30', screen: 'אולם 4', type: 'IMAX', language: 'אנגלית', seats: '20/30' },
  { id: 2, title: 'הקול בראש 2', time: '16:00', screen: 'אולם 1', type: '4DX', language: 'אנגלית', seats: '15/30' },
  { id: 3, title: 'בורדרלנדס', time: '18:15', screen: 'אולם 2', type: '3D', language: 'אנגלית', seats: '28/30' },
];

export default function RightPanel() {
  const { selectedMovie, selectedSeats, location } = useBookingStore();
  const seatCount = selectedSeats.length;

  return (
    <aside className="w-[400px] h-screen bg-[#1A1A1A] border-r border-white/5 flex flex-col p-8 overflow-y-auto hidden xl:flex text-right" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">קולנוע בשידור חי</h2>
        <div className="flex items-center gap-2 text-[#FF9F0A] bg-[#FF9F0A]/10 px-3 py-1.5 rounded-xl border border-[#FF9F0A]/20">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-bold">{location}</span>
        </div>
      </div>

      {!selectedMovie ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-[40px] border border-dashed border-white/10 mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
             <Clapperboard className="text-slate-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">מוכנים לסרט?</h3>
          <p className="text-xs text-slate-500 max-w-[200px]">בחרו סרט מהלוח כדי להתחיל את חווית ההזמנה היוקרתית שלכם.</p>
        </div>
      ) : (
        <>
          <div className="mb-8 relative rounded-[40px] overflow-hidden aspect-video group shadow-2xl">
            <NextImage 
              src={selectedMovie.backdrop_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80'} 
              alt={selectedMovie.title}
              fill
              sizes="400px"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
            <div className="absolute bottom-4 right-4 text-right">
              <h3 className="text-xl font-bold text-white">{selectedMovie.title}</h3>
              <p className="text-xs text-slate-400">{selectedMovie.release_date.split('-')[0]}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Cinema Selector Card */}
            <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] rounded-3xl p-6 border border-white/5 shadow-xl text-right">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#FF9F0A]/10 rounded-2xl flex items-center justify-center border border-[#FF9F0A]/20">
                    <Calendar className="text-[#FF9F0A] w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold">מיקום נוכחי</p>
                    <p className="text-sm text-white font-black">קולנוע נייטהוק</p>
                  </div>
               </div>
               
               <div className="space-y-8">
                 <ShowtimeSelector />
                 
                 <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest">בחירת מושבים</h3>
                       <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-[10px] text-slate-500 font-bold uppercase">נבחר</span>
                        </div>
                      </div>
                    </div>
                    <SeatMap />
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">תוספות לנשנוש</h3>
                      <span className="text-[10px] text-primary font-black">הטבה בהזמנה מראש</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {[
                        { id: 'popcorn', name: 'פופקורן', price: '₪25', icon: '🍿' },
                        { id: 'soda', name: 'שתייה', price: '₪15', icon: '🥤' },
                        { id: 'nachos', name: 'נאצ׳וס', price: '₪30', icon: '🌮' },
                      ].map((snack) => (
                        <button key={snack.id} className="flex-shrink-0 bg-white/5 border border-white/5 p-4 rounded-3xl hover:border-primary/30 transition-all text-center min-w-[100px] group active:scale-95">
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{snack.icon}</div>
                          <p className="text-[10px] text-white font-bold">{snack.name}</p>
                          <p className="text-[10px] text-primary font-black mt-1">{snack.price}</p>
                        </button>
                      ))}
                    </div>
                 </div>
               </div>

               <Link 
                href="/checkout"
                className={`block w-full mt-10 py-5 rounded-2xl font-black text-xs text-center tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
                  seatCount > 0 
                    ? 'bg-[#FF9F0A] hover:bg-[#FF7A00] text-background shadow-orange-500/20' 
                    : 'bg-white/5 text-slate-500 pointer-events-none border border-white/5 shadow-none'
                }`}
               >
                 {seatCount > 0 ? `הזמן ${seatCount} כרטיסים` : 'בחר מושבים'}
               </Link>
            </div>
          </div>
        </>
      )}

        {/* Current Running Shows */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">מוקרן כעת</h3>
            <button className="text-[10px] text-slate-500 font-bold hover:text-white transition-colors">צפה בהכל</button>
          </div>
          
          <div className="space-y-3">
            {runningShows.map((show) => (
              <div key={show.id} className="group flex items-center justify-between p-4 rounded-2xl bg-[#2C2C2C]/50 border border-white/5 hover:border-[#FF9F0A]/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF9F0A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-bold group-hover:text-[#FF9F0A] transition-colors">{show.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{show.language} • {show.type} • {show.seats} מקומות</p>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                   <p className="text-xs text-white font-black">{show.time}</p>
                   <ChevronRight className="w-4 h-4 text-slate-600 group-hover:-translate-x-1 transition-transform rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
  );
}

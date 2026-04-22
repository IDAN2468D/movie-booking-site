'use client';

import React from 'react';
import { Calendar, Clock, Monitor } from 'lucide-react';

import { useBookingStore } from '@/lib/store';

const showtimes = [
  { time: '10:30', type: '2D', price: '₪45' },
  { time: '13:15', type: '3D', price: '₪55' },
  { time: '16:45', type: 'IMAX', price: '₪75' },
  { time: '19:30', type: '4DX', price: '₪85' },
  { time: '22:15', type: '2D', price: '₪45' },
];

export default function ShowtimeSelector() {
  const { selectedShowtime, setSelectedShowtime } = useBookingStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          היום, 21 באוקטובר
        </h3>
        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">5 הקרנות</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {showtimes.map((show) => (
          <button
            key={show.time}
            onClick={() => setSelectedShowtime(show.time)}
            className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
              selectedShowtime === show.time
                ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-colors ${
                selectedShowtime === show.time ? 'bg-background/20' : 'bg-white/5'
              }`}>
                <Clock size={18} className={selectedShowtime === show.time ? 'text-background' : 'text-primary'} />
              </div>
              <div className="text-right">
                <p className={`font-bold ${selectedShowtime === show.time ? 'text-background' : 'text-white'}`}>
                  {show.time}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Monitor size={12} className={selectedShowtime === show.time ? 'text-background/60' : 'text-slate-500'} />
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                    selectedShowtime === show.time ? 'text-background/60' : 'text-slate-500'
                  }`}>
                    {show.type} • אולם 04
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`text-sm font-black ${
              selectedShowtime === show.time ? 'text-background' : 'text-primary'
            }`}>
              {show.price}
            </div>

            {selectedShowtime === show.time && (
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full border-2 border-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

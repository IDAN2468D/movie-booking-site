'use client';

import React from 'react';
import ActiveTicketCountdown from '@/components/booking/ActiveTicketCountdown';

interface TicketData {
  _id?: string;
  showtimeDate?: string;
  showtimeAt?: string;
  showtime?: string;
  movieTitle?: string;
  movie?: { title?: string };
  seats?: string[];
  price?: number;
}

export function ProfileTicketCard({
  data,
  isActive = false,
}: {
  data: TicketData;
  isActive?: boolean;
}) {
  let showtimeStr = data.showtimeDate || data.showtimeAt;

  if (!showtimeStr && data.showtime) {
    const [hours, minutes] = data.showtime.split(':');
    const d = new Date();
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    if (d.getTime() <= Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    showtimeStr = d.toISOString();
  } else if (!showtimeStr) {
    showtimeStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }

  return (
    <div className="relative p-8 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_0_30px_rgba(255,255,255,0.05)] overflow-hidden group">
      {isActive && (
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/10 to-transparent blur-[50px] pointer-events-none group-hover:from-violet-500/20 transition-colors duration-700" />
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-['Inter'] text-violet-300 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-400/20">
              {isActive ? 'פעיל' : 'היסטוריה'}
            </span>
            <h3 className="text-2xl font-['Outfit'] font-black text-white mt-4">
              {data.movieTitle || data.movie?.title || 'סרט'}
            </h3>
          </div>
          <div className="text-left font-['Outfit']">
            <div className="text-sm text-white/50">מושבים</div>
            <div className="text-lg font-bold text-white">
              {data.seats?.join(', ') || 'N/A'}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-sm font-['Inter'] text-white/40 mb-4 uppercase tracking-widest">
              זמן נותר להקרנה
            </p>
            <ActiveTicketCountdown showtime={showtimeStr} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTicketCard;

'use client';

import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface Booking {
  movie: string;
  date: string;
  points: number;
}

interface ActivityHistoryProps {
  bookings: Booking[];
  isLoading: boolean;
  onShowFull: () => void;
}

export const ActivityHistory = ({ bookings, isLoading, onShowFull }: ActivityHistoryProps) => {
  return (
    <div 
      className="rounded-[48px] p-10 border border-white/5 flex flex-col h-full overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(25px) saturate(150%)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
      }}
    >
       <h3 className="text-xl font-bold text-white mb-8 tracking-tight">פעילות אחרונה</h3>
       
       <div className="flex-1 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-slate-500 font-bold">טוען פעילות...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <Zap size={24} className="text-slate-700 mb-4" />
              <p className="text-xs text-slate-500 font-medium text-center">אין פעילות אחרונה להצגה. הזמן סרט כדי לצבור נקודות!</p>
            </div>
          ) : (
            bookings.slice(0, 5).map((activity, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 flex-row group"
              >
                <div className="flex items-center gap-4 flex-row">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                      <Zap size={20} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white font-bold">הזמנת סרט</p>
                      <p className="text-[10px] text-slate-500 font-medium">{activity.movie} • {activity.date}</p>
                    </div>
                </div>
                <span className="text-sm font-black text-primary">+{activity.points}</span>
              </div>
            ))
          )}
       </div>
       
        <button 
         onClick={onShowFull}
         className="w-full mt-10 p-5 rounded-2xl bg-primary/10 border border-primary/20 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          היסטוריה מלאה
        </button>
    </div>
  );
};

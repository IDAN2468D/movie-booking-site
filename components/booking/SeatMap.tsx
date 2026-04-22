'use client';

import { useBookingStore } from '@/lib/store';

export default function SeatMap() {
  const { selectedSeats, toggleSeat } = useBookingStore();
  
  // Mock occupied seats
  const occupiedSeats = ['s-5', 's-12', 's-13', 's-24', 's-31'];

  const seats = Array.from({ length: 48 }, (_, i) => ({
    id: `s-${i}`,
    row: String.fromCharCode(65 + Math.floor(i / 8)),
    number: (i % 8) + 1,
    status: occupiedSeats.includes(`s-${i}`) 
      ? 'occupied' 
      : selectedSeats.includes(`s-${i}`) 
      ? 'selected' 
      : 'available',
  }));

  return (
    <div className="flex flex-col items-center py-6 px-4 bg-[#2C2C2C]/50 rounded-3xl border border-white/5">
      <div className="w-full text-center mb-8">
        <div className="w-4/5 h-1.5 bg-gradient-to-r from-transparent via-[#FF9F0A]/40 to-transparent mx-auto rounded-full shadow-[0_4px_12px_rgba(255,159,10,0.2)]" />
        <span className="text-[10px] text-slate-500 mt-2 block font-bold tracking-[0.2em]">המסך בכיוון זה</span>
      </div>

      <div className="grid grid-cols-8 gap-3 mb-8">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.status === 'occupied'}
            onClick={() => toggleSeat(seat.id)}
            className={`w-8 h-8 rounded-lg transition-all duration-300 transform ${
              seat.status === 'selected' 
                ? 'bg-[#FF9F0A] shadow-[0_0_15px_rgba(255,159,10,0.4)] scale-110' 
                : seat.status === 'occupied'
                ? 'bg-white/5 cursor-not-allowed border border-white/5'
                : 'bg-white/10 hover:bg-white/20 border border-white/5'
            }`}
            title={`${seat.row}${seat.number}`}
          />
        ))}
      </div>

      <div className="flex justify-between w-full px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/10" />
          <span className="text-[10px] text-slate-400 font-bold">פנוי</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#FF9F0A]" />
          <span className="text-[10px] text-slate-400 font-bold">נבחר</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/5" />
          <span className="text-[10px] text-slate-400 font-bold">תפוס</span>
        </div>
      </div>
    </div>
  );
}

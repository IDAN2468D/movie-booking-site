'use client';

import React from 'react';
import { Seat, Friend, FriendSatisfaction } from '@/types/seatingGame';
import { SeatTile } from './SeatTile';
import { ScreenShare, Crown, Sparkles, Footprints, Video } from 'lucide-react';

interface CinemaGridProps {
  seats: Seat[];
  assignedSeats: Record<string, string>;
  friends: Friend[];
  satisfactions: Record<string, FriendSatisfaction>;
  selectedFriendId: string | null;
  draggedFriendId: string | null;
  onSeatClick: (seatId: string) => void;
  onDropFriend: (friendId: string, seatId: string) => void;
}

export const CinemaGrid: React.FC<CinemaGridProps> = ({
  seats,
  assignedSeats,
  friends,
  satisfactions,
  selectedFriendId,
  draggedFriendId,
  onSeatClick,
  onDropFriend,
}) => {
  const rows = ['A', 'B', 'C', 'D'];

  const getOccupant = (seatId: string): Friend | null => {
    const friendId = assignedSeats[seatId];
    if (!friendId) return null;
    return friends.find((f) => f.id === friendId) || null;
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-7 relative overflow-hidden">
      {/* Dynamic Cinema Light Beam Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-56 bg-gradient-to-b from-cyan-500/15 via-teal-500/5 to-transparent blur-2xl pointer-events-none" />

      {/* Futuristic 3D Cinema Screen Header */}
      <div className="flex flex-col items-center relative z-10">
        <div className="relative w-full max-w-2xl">
          {/* Curved Glowing Cinema Screen Bar */}
          <div className="h-5 bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-400 rounded-b-[40px] shadow-[0_15px_45px_rgba(6,182,212,0.6)] border-b-2 border-white/80 flex items-center justify-center relative overflow-hidden">
            {/* Animated light reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </div>

          {/* Screen Title Badge */}
          <div className="flex justify-center -mt-2">
            <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-widest shadow-xl uppercase">
              <Video className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              מסך הקולנוע (Screen 1)
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">כיוון הצפייה בסרט</p>
      </div>

      {/* Interactive Cinema Hall Seat Grid (Rows A-D) */}
      <div className="flex flex-col gap-4 relative z-10 px-1">
        {rows.map((rowLabel) => {
          const rowSeats = seats.filter((s) => s.row === rowLabel);
          const leftCol = rowSeats.filter((s) => s.col <= 4);
          const rightCol = rowSeats.filter((s) => s.col > 4);
          const isVipRow = rowLabel === 'C' || rowLabel === 'D';

          return (
            <div key={rowLabel} className="flex items-center gap-3">
              {/* Row Label Badge */}
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs font-mono border shadow-md flex-shrink-0 ${
                  isVipRow
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/10'
                    : 'bg-slate-800/90 border-slate-700 text-slate-300'
                }`}
                title={isVipRow ? 'שורת VIP' : `שורה ${rowLabel}`}
              >
                {rowLabel}
              </div>

              {/* Left Block (Cols 1-4) */}
              <div className="grid grid-cols-4 gap-3 flex-1">
                {leftCol.map((seat) => {
                  const occupant = getOccupant(seat.id);
                  const sat = occupant ? satisfactions[occupant.id] : undefined;
                  return (
                    <SeatTile
                      key={seat.id}
                      seat={seat}
                      occupant={occupant}
                      satisfaction={sat}
                      isSelectedTarget={Boolean(selectedFriendId)}
                      onSeatClick={onSeatClick}
                      onDropFriend={onDropFriend}
                      draggedFriendId={draggedFriendId}
                    />
                  );
                })}
              </div>

              {/* Central Illuminated Aisle Corridor */}
              <div className="w-6 sm:w-10 flex flex-col items-center justify-center text-slate-600 my-auto">
                <div className="h-full w-[2px] bg-gradient-to-b from-cyan-500/40 via-teal-500/20 to-transparent my-1" />
                <Footprints className="w-4 h-4 text-cyan-400/70 rotate-90 my-1" />
                <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-500/20 to-cyan-500/40 my-1" />
              </div>

              {/* Right Block (Cols 5-8) */}
              <div className="grid grid-cols-4 gap-3 flex-1">
                {rightCol.map((seat) => {
                  const occupant = getOccupant(seat.id);
                  const sat = occupant ? satisfactions[occupant.id] : undefined;
                  return (
                    <SeatTile
                      key={seat.id}
                      seat={seat}
                      occupant={occupant}
                      satisfaction={sat}
                      isSelectedTarget={Boolean(selectedFriendId)}
                      onSeatClick={onSeatClick}
                      onDropFriend={onDropFriend}
                      draggedFriendId={draggedFriendId}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleek Cinema Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-800/80 pt-5 text-xs text-slate-300 relative z-10">
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>אזור מרכז המסך</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Footprints className="w-4 h-4 text-teal-400" />
          <span>מושבי מעבר (עמודות 1, 8)</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>מושבי VIP (שורות C, D)</span>
        </div>
      </div>
    </div>
  );
};

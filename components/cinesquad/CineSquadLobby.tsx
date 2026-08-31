'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Film, Calendar, Armchair } from 'lucide-react';
import { SquadRoom } from '@/lib/schemas/cinesquad.schema';
import { claimSquadSeat } from '@/lib/actions/cinesquadActions';
import { SquadSplitLedger } from './SquadSplitLedger';
import { SquadInviteModal } from './SquadInviteModal';

interface CineSquadLobbyProps {
  initialRoom: SquadRoom;
  currentUserId?: string;
}

const AVAILABLE_SEATS = ['D3', 'D4', 'D5', 'D6', 'E3', 'E4', 'E5', 'E6'];

export function CineSquadLobby({ initialRoom, currentUserId = 'user-host-1' }: CineSquadLobbyProps) {
  const [room, setRoom] = useState<SquadRoom>(initialRoom);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleSelectSeat = async (seatId: string) => {
    setIsClaiming(true);
    const res = await claimSquadSeat({
      roomId: room.roomId,
      userId: currentUserId,
      seatId,
    });
    if (res.success && res.data) {
      setRoom(res.data);
    }
    setIsClaiming(false);
  };

  const handleAuthorize = (memberId: string) => {
    setRoom((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.userId === memberId ? { ...m, paymentStatus: 'authorized' } : m
      ),
    }));
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Top Room Banner */}
      <div className="p-6 md:p-8 rounded-[36px] bg-black/60 backdrop-blur-3xl border border-primary/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary text-xs font-black">
            <Users size={16} />
            <span>סנכרון סקוואד חי (CineSquad Sync)</span>
          </div>
          <h1 className="text-3xl font-black text-white font-rubik">{room.movieTitle}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-off-white/70 font-medium">
            <span className="flex items-center gap-1"><Calendar size={14} /> {room.showtimeLabel}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Film size={14} /> {room.hallName}</span>
          </div>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-black font-black text-sm shadow-[0_0_20px_rgba(255,159,10,0.4)] transition-all active:scale-95 shrink-0"
        >
          <UserPlus size={18} />
          <span>הזמן חבר לסקוואד</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seats Selector for Squad */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[36px] bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white font-rubik flex items-center gap-2">
              <Armchair size={20} className="text-cyan-400" />
              בחירת מושבים משותפת לסקוואד
            </h3>
            <span className="text-xs text-off-white/60">נעילה בזמן אמת</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {AVAILABLE_SEATS.map((seatId) => {
              const occupant = room.members.find((m) => m.selectedSeat === seatId);
              const isMine = occupant?.userId === currentUserId;

              return (
                <button
                  key={seatId}
                  disabled={isClaiming || (!!occupant && !isMine)}
                  onClick={() => handleSelectSeat(seatId)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    isMine
                      ? 'bg-primary text-black border-primary font-black shadow-[0_0_15px_rgba(255,159,10,0.6)]'
                      : occupant
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <span className="text-base font-mono font-black">{seatId}</span>
                  <span className="text-[10px] truncate max-w-[90px]">
                    {isMine ? 'המושב שלך' : occupant ? occupant.name : 'פנוי לתפיסה'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Split Ledger */}
        <div className="space-y-6">
          <SquadSplitLedger room={room} onAuthorizePayment={handleAuthorize} />
        </div>
      </div>

      <SquadInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        roomId={room.roomId}
        movieTitle={room.movieTitle}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Seat, Friend, FriendSatisfaction } from '@/types/seatingGame';
import { Crown, Sparkles, UserCheck, AlertTriangle } from 'lucide-react';

interface SeatTileProps {
  seat: Seat;
  occupant: Friend | null;
  satisfaction?: FriendSatisfaction;
  isSelectedTarget?: boolean;
  onSeatClick: (seatId: string) => void;
  onDropFriend: (friendId: string, seatId: string) => void;
  draggedFriendId: string | null;
}

export const SeatTile: React.FC<SeatTileProps> = ({
  seat,
  occupant,
  satisfaction,
  isSelectedTarget,
  onSeatClick,
  onDropFriend,
  draggedFriendId,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const friendId = e.dataTransfer.getData('text/plain') || draggedFriendId;
    if (friendId) {
      onDropFriend(friendId, seat.id);
    }
  };

  const isHappy = satisfaction && satisfaction.score >= 70;

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onSeatClick(seat.id)}
      className={`relative group flex flex-col items-center justify-between p-2 rounded-2xl border transition-all cursor-pointer select-none min-h-[70px] sm:min-h-[78px] ${
        occupant
          ? isHappy
            ? 'bg-slate-900/95 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/50'
            : 'bg-slate-900/95 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50'
          : isDragOver || isSelectedTarget
          ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400 scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          : seat.isVip
          ? 'bg-gradient-to-b from-amber-950/30 via-slate-900/80 to-slate-950 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
          : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-600 hover:bg-slate-800/60'
      }`}
    >
      {/* Top Header: Seat Badge & VIP indicator */}
      <div className="w-full flex items-center justify-between px-1">
        <span className="text-[10px] font-mono font-bold text-slate-400">{seat.id}</span>
        {seat.isVip && <Crown className="w-3 h-3 text-amber-400" />}
      </div>

      {/* Main Content Area */}
      {occupant ? (
        <div className="flex flex-col items-center my-0.5 relative z-10">
          <div
            className="w-8 h-8 rounded-full overflow-hidden border-2 shadow-md relative"
            style={{ borderColor: occupant.color }}
          >
            <Image
              src={occupant.avatar}
              alt={occupant.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="text-[11px] font-bold text-white truncate max-w-[55px] mt-0.5">
            {occupant.name}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center my-2">
          {seat.isCenter ? (
            <Sparkles className="w-4 h-4 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
          ) : (
            <div className="w-5 h-3 rounded-t-md border-t-2 border-slate-700 group-hover:border-slate-500 transition-colors" />
          )}
        </div>
      )}

      {/* Footer Pill Status */}
      {occupant && satisfaction && (
        <div
          className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
            isHappy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {satisfaction.score}%
        </div>
      )}

      {/* Tooltip on Hover */}
      {occupant && satisfaction && (
        <div className="absolute -top-10 z-30 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl shadow-2xl whitespace-nowrap pointer-events-none">
          {isHappy ? (
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>
            {occupant.name}: {satisfaction.reasonText} ({satisfaction.score}%)
          </span>
        </div>
      )}
    </motion.div>
  );
};

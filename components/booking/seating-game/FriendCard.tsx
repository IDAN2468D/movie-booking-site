'use client';

import React from 'react';
import Image from 'next/image';
import { Friend, FriendSatisfaction } from '@/types/seatingGame';
import { GripVertical, CheckCircle2, AlertCircle, Sparkles, Footprints, Crown, Users, EyeOff } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
  isSelected?: boolean;
  isDragging?: boolean;
  satisfaction?: FriendSatisfaction;
  onSelect?: (friendId: string) => void;
  onDragStart?: (e: React.DragEvent, friendId: string) => void;
  onDragEnd?: () => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  isSelected,
  isDragging,
  satisfaction,
  onSelect,
  onDragStart,
  onDragEnd,
}) => {
  const getPrefIcon = () => {
    switch (friend.preference) {
      case 'center': return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'aisle': return <Footprints className="w-3.5 h-3.5 text-teal-400" />;
      case 'back_row': return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'avoid_front': return <EyeOff className="w-3.5 h-3.5 text-rose-400" />;
      case 'next_to': return <Users className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, friend.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect?.(friend.id)}
      className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? 'opacity-40 scale-95 border-cyan-500/50'
          : isSelected
          ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25 scale-[1.02]'
          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Right side in RTL: Avatar + Name + Preference */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="relative w-11 h-11 rounded-full overflow-hidden border-2 flex-shrink-0 shadow-md"
          style={{ borderColor: friend.color }}
        >
          <Image
            src={friend.avatar}
            alt={friend.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-white truncate">{friend.name}</h4>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5 text-slate-300 text-xs truncate">
            {getPrefIcon()}
            <span className="truncate text-[11px] font-medium">{friend.preferenceText}</span>
          </div>
        </div>
      </div>

      {/* Left side in RTL: Score badge (if placed) & Drag Grip */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {satisfaction && (
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${
              satisfaction.score >= 70
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {satisfaction.score >= 70 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {satisfaction.score}%
          </span>
        )}
        <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
      </div>

      {/* Selection Glow Indicator */}
      {isSelected && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
      )}
    </div>
  );
};

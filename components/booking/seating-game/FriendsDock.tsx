'use client';

import React from 'react';
import { Friend, FriendSatisfaction } from '@/types/seatingGame';
import { FriendCard } from './FriendCard';
import { Sparkles, RotateCcw, Users, MousePointerClick, CheckCircle2 } from 'lucide-react';

interface FriendsDockProps {
  unassignedFriends: Friend[];
  allFriends: Friend[];
  selectedFriendId: string | null;
  draggedFriendId: string | null;
  satisfactions: Record<string, FriendSatisfaction>;
  onSelectFriend: (friendId: string) => void;
  onDragStartFriend: (e: React.DragEvent, friendId: string) => void;
  onDragEndFriend: () => void;
  onDropToDock: (friendId: string) => void;
  onAutoArrange: () => void;
  onReset: () => void;
}

export const FriendsDock: React.FC<FriendsDockProps> = ({
  unassignedFriends,
  allFriends,
  selectedFriendId,
  draggedFriendId,
  satisfactions,
  onSelectFriend,
  onDragStartFriend,
  onDragEndFriend,
  onDropToDock,
  onAutoArrange,
  onReset,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const friendId = e.dataTransfer.getData('text/plain') || draggedFriendId;
    if (friendId) {
      onDropToDock(friendId);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">חברים להושבה</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="font-mono text-cyan-400 font-bold">{unassignedFriends.length}</span> מתוך{' '}
              <span className="font-mono">{allFriends.length}</span> חברים טרם שובצו
            </p>
          </div>
        </div>
      </div>

      {/* Dedicated Action Buttons Row (No squishing/wrapping!) */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onAutoArrange}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>סידור אוטומטי חכם</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-slate-700/70 whitespace-nowrap shadow-md"
          title="איפוס כל השיבוצים"
        >
          <RotateCcw className="w-4 h-4" />
          <span>איפוס</span>
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="flex items-center gap-2.5 text-slate-300 text-xs bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 shadow-inner">
        <MousePointerClick className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
        <span>לחצו על חבר ואז על מושב, או גררו ישירות לאולם.</span>
      </div>

      {/* Unassigned Friends List Container */}
      <div className="flex flex-col gap-3 min-h-[200px] max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {unassignedFriends.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-emerald-500/40 rounded-2xl bg-emerald-950/20 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
            <p className="text-emerald-300 font-extrabold text-base">כל החברים שובצו!</p>
            <p className="text-slate-400 text-xs mt-1">גררו חבר חזרה לכאן כדי לשחרר את מושבו.</p>
          </div>
        ) : (
          unassignedFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              isSelected={selectedFriendId === friend.id}
              isDragging={draggedFriendId === friend.id}
              satisfaction={satisfactions[friend.id]}
              onSelect={onSelectFriend}
              onDragStart={onDragStartFriend}
              onDragEnd={onDragEndFriend}
            />
          ))
        )}
      </div>
    </div>
  );
};

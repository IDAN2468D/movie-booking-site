'use client';

import React from 'react';
import { Friend, FriendSatisfaction } from '@/types/seatingGame';
import { CheckCircle2, AlertCircle, HelpCircle, MapPin } from 'lucide-react';

interface SatisfactionBreakdownProps {
  friends: Friend[];
  assignedSeats: Record<string, string>;
  satisfactions: Record<string, FriendSatisfaction>;
}

export const SatisfactionBreakdown: React.FC<SatisfactionBreakdownProps> = ({
  friends,
  assignedSeats,
  satisfactions,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <span>פירוט שביעות רצון החברים</span>
        </h3>
        <span className="text-xs text-slate-400">ניתוח העדפות בזמן אמת</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {friends.map((friend) => {
          const seatId = Object.keys(assignedSeats).find((s) => assignedSeats[s] === friend.id);
          const sat = satisfactions[friend.id];
          const isPlaced = Boolean(seatId && sat);
          const isHappy = sat?.score >= 70;

          return (
            <div
              key={friend.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                isPlaced
                  ? isHappy
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: friend.color }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-sm text-white truncate">{friend.name}</span>
                  {isPlaced ? (
                    <span className="text-xs font-mono font-bold flex items-center gap-1">
                      {isHappy ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {sat.score}%
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      טרם שובץ
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-0.5 truncate">{friend.preferenceText}</p>

                {isPlaced && (
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-300 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="font-mono font-bold text-cyan-300 me-1">{seatId}:</span>
                    <span className="truncate">{sat.reasonText}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

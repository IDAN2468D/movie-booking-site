'use client';

import React from 'react';
import { SquadMember, SquadRoom } from '@/lib/schemas/cinesquad.schema';
import { CreditCard, CheckCircle2, Clock, Utensils, Ticket } from 'lucide-react';

interface SquadSplitLedgerProps {
  room: SquadRoom;
  onAuthorizePayment?: (memberId: string) => void;
}

export function SquadSplitLedger({ room, onAuthorizePayment }: SquadSplitLedgerProps) {
  const totalTickets = room.members.reduce((acc, m) => acc + m.ticketAmount, 0);
  const totalConcessions = room.members.reduce((acc, m) => acc + m.concessionAmount, 0);
  const grandTotal = totalTickets + totalConcessions;

  return (
    <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-3xl border border-white/15 shadow-2xl space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white font-rubik flex items-center gap-2">
          פיצול חשבון חכם (Smart Ledger)
        </h3>
        <span className="text-sm font-mono font-black text-primary">סה״כ ₪{grandTotal}</span>
      </div>

      {/* Members Ledger List */}
      <div className="space-y-3">
        {room.members.map((member: SquadMember) => {
          const isPaid = member.paymentStatus === 'authorized' || member.paymentStatus === 'completed';
          const memberTotal = member.ticketAmount + member.concessionAmount;

          return (
            <div
              key={member.userId}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/30 to-cyan-500/30 border border-white/20 flex items-center justify-center text-sm font-black text-white">
                  {member.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white">{member.name}</p>
                    {member.isHost && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        מארח
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-off-white/60">
                    מושב: {member.selectedSeat ? <span className="text-cyan-300 font-mono font-bold">{member.selectedSeat}</span> : 'טרם נבחר'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left">
                  <span className="text-sm font-black text-white font-mono block">₪{memberTotal}</span>
                  <span className="text-[10px] text-off-white/40 block">
                    (כרטיס ₪{member.ticketAmount} + מזנון ₪{member.concessionAmount})
                  </span>
                </div>

                {isPaid ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 size={14} />
                    <span>אושר</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onAuthorizePayment && onAuthorizePayment(member.userId)}
                    className="flex items-center gap-1 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all"
                  >
                    <CreditCard size={14} />
                    <span>אשר תשלום</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-bold text-off-white/70">
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-cyan-400" />
          <span>מחיר כרטיס אחיד: ₪{room.ticketUnitPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <Utensils size={16} className="text-amber-400" />
          <span>סנכרון תוספות מזנון אישי</span>
        </div>
      </div>
    </div>
  );
}

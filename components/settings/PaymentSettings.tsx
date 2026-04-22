'use client';

import React from 'react';
import { CreditCard, Plus, Trash2, Star, Receipt } from 'lucide-react';

const INITIAL_CARDS = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8910', expiry: '03/26', isDefault: false },
];

const recentPayments = [
  { id: 1, movie: 'מייקל', date: '21/04/2026', amount: 85, seats: 2 },
  { id: 2, movie: 'אווטאר: אש ואפר', date: '18/04/2026', amount: 150, seats: 3 },
  { id: 3, movie: 'הקול בראש 2', date: '10/04/2026', amount: 55, seats: 1 },
];

export default function PaymentSettings() {
  const [cards, setCards] = React.useState(INITIAL_CARDS);
  return (
    <div className="space-y-8">
      {/* Saved Payment Methods */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <CreditCard size={20} className="text-[#FF9F0A]" />
          אמצעי תשלום
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
                card.isDefault
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                  card.type === 'Visa' ? 'bg-blue-600/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {card.type === 'Visa' ? 'VISA' : 'MC'}
                </div>
                <div>
                  <p className="text-white font-bold text-sm flex items-center gap-2">
                    •••• •••• •••• {card.last4}
                    {card.isDefault && (
                      <span className="text-[9px] font-black text-[#FF9F0A] bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">ברירת מחדל</span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500">תוקף: {card.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!card.isDefault && (
                  <button className="text-[10px] font-bold text-slate-400 hover:text-[#FF9F0A] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                    <Star size={14} />
                  </button>
                )}
                <button 
                  onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl border-2 border-dashed border-white/10 text-slate-400 hover:text-[#FF9F0A] hover:border-primary/30 transition-all group">
            <Plus size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold">הוסף כרטיס חדש</span>
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass rounded-[32px] p-10 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <Receipt size={20} className="text-[#FF9F0A]" />
          היסטוריית תשלומים
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </h3>

        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div>
                <p className="text-sm text-white font-bold">{payment.movie}</p>
                <p className="text-[10px] text-slate-500">{payment.date} · {payment.seats} כרטיסים</p>
              </div>
              <p className="text-sm font-black text-[#FF9F0A]">₪{payment.amount}</p>
            </div>
          ))}
        </div>

        <button className="mt-6 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
          הצג את כל ההיסטוריה →
        </button>
      </div>
    </div>
  );
}

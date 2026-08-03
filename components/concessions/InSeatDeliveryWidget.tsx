'use client';

import React, { useState } from 'react';
import { ShoppingBag, Clock, MapPin, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { calculatePredictiveDelivery, DeliverySchedule } from '@/lib/concessions/predictivePrep';

export const InSeatDeliveryWidget: React.FC<{ seatId?: string }> = ({ seatId = 'F-12' }) => {
  const [timing, setTiming] = useState<'before_movie' | 'intermission'>('before_movie');
  const [schedule, setSchedule] = useState<DeliverySchedule>(() =>
    calculatePredictiveDelivery(Date.now() + 15 * 60 * 1000, 'before_movie', seatId, 2)
  );

  const handleTimingChange = (newTiming: 'before_movie' | 'intermission') => {
    setTiming(newTiming);
    setSchedule(calculatePredictiveDelivery(Date.now() + 15 * 60 * 1000, newTiming, seatId, 2));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-black/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShoppingBag className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-amber-300">SmartTray: משלוח חכם למושב</h3>
            <p className="text-xs text-gray-400">תזמון אוטונומי של הכנת המזון למושב {seatId}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs text-gray-400 block mb-2 font-bold">בחר מועד הגשה למושב:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTimingChange('before_movie')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                timing === 'before_movie'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-amber-500/40 text-gray-300'
              }`}
            >
              לפני תחילת הסרט
            </button>
            <button
              onClick={() => handleTimingChange('intermission')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                timing === 'intermission'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-amber-500/40 text-gray-300'
              }`}
            >
              בזמן ההפסקה
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-gray-300 font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>שעת הגשה משוערת:</span>
            </span>
            <span className="font-bold text-amber-300 text-base">{schedule.exactDeliveryTime}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-500/20">
            <span className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>מיקום מושב:</span>
            </span>
            <span className="font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">{schedule.seatId}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-400 pt-1">
            <Truck className="w-3.5 h-3.5" />
            <span>זמן הכנה משוער במטבח: {schedule.estimatedPrepTimeMinutes} דקות</span>
          </div>
        </div>
      </div>
    </div>
  );
};

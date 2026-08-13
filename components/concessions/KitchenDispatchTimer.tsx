'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flame, Navigation, CheckCircle2 } from 'lucide-react';

interface KitchenDispatchTimerProps {
  initialSeconds?: number;
}

export const KitchenDispatchTimer: React.FC<KitchenDispatchTimerProps> = ({
  initialSeconds = 180,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStep = () => {
    if (secondsLeft > 120) return { title: 'ההזמנה נקלטה במטבח', desc: 'צוות השפים מכין את המנות', icon: Flame, color: 'text-amber-400' };
    if (secondsLeft > 30) return { title: 'הכנה אקספרס קולנועית', desc: 'אריזה במגש תרמי מבודד', icon: Clock, color: 'text-cyan-400' };
    if (secondsLeft > 0) return { title: 'משלוח בדרך למושב!', desc: 'השליח נכנס לאולם', icon: Navigation, color: 'text-emerald-400 animate-pulse' };
    return { title: 'ההזמנה הגיעה למושב!', desc: 'בתיאבון וצפייה מהנה', icon: CheckCircle2, color: 'text-emerald-400' };
  };

  const stepInfo = getStep();
  const IconComp = stepInfo.icon;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 text-right shadow-lg my-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${stepInfo.color}`}>
            <IconComp className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">{stepInfo.title}</h5>
            <p className="text-[10px] text-gray-400">{stepInfo.desc}</p>
          </div>
        </div>

        <div className="text-left font-mono font-bold text-amber-400 text-sm">
          {mins}:{secs < 10 ? '0' : ''}{secs}
        </div>
      </div>
    </div>
  );
};

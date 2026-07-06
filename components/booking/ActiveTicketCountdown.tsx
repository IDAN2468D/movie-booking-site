"use client";

import { useEffect, useState } from "react";

interface ActiveTicketCountdownProps {
  showtime: string | Date;
}

export default function ActiveTicketCountdown({ showtime }: ActiveTicketCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(showtime).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [showtime]);

  return (
    <div className="flex gap-4 justify-center items-center font-['Outfit'] mt-4" dir="ltr">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-white/30 text-2xl font-black mb-6 animate-pulse">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-white/30 text-2xl font-black mb-6 animate-pulse">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-white/30 text-2xl font-black mb-6 animate-pulse">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-16 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-md">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</span>
    </div>
  );
}

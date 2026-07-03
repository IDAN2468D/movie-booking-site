'use client';

import React from 'react';

export default function SeatLegend() {
  const legendItems = [
    { color: 'bg-white/10', label: 'פנוי' },
    { color: 'bg-primary shadow-[0_0_15px_rgba(255,20,100,0.5)]', label: 'נבחר' },
    { color: 'bg-cyan-400 shadow-[0_0_15px_rgba(10,239,255,0.5)]', label: 'שותף' },
    { color: 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.12)] opacity-40', label: 'תפוס' }
  ];

  return (
    <div className="flex justify-between w-full max-w-sm px-4 py-5 bg-white/[0.03] rounded-3xl border-[0.5px] border-white/20 backdrop-blur-[40px] text-xs z-10">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-md ${item.color}`} />
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

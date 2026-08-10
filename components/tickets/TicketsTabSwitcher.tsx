'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TicketsTabSwitcherProps {
  activeTab: 'countdown' | 'qr' | 'memory';
  setActiveTab: (tab: 'countdown' | 'qr' | 'memory') => void;
  ticketStyle: 'quantum' | 'holographic' | 'vault';
  setTicketStyle: (style: 'quantum' | 'holographic' | 'vault') => void;
}

export const TicketsTabSwitcher: React.FC<TicketsTabSwitcherProps> = ({
  activeTab,
  setActiveTab,
  ticketStyle,
  setTicketStyle,
}) => {
  return (
    <div className="flex flex-col items-center w-full mb-8">
      {/* Active Mode Tabs */}
      <div className="w-full max-w-md mb-6 bg-black/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl flex gap-1.5 shadow-2xl">
        {([
          { id: 'countdown', label: 'קדימון וזמן' },
          { id: 'qr', label: 'כרטיס כניסה' },
          { id: 'memory', label: 'קפסולת זיכרון' }
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-center transition-colors duration-300 focus:outline-none ${
                isActive ? 'text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="globalTicketTab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_20px_rgba(255,159,10,0.5)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ticket Style Tabs */}
      <div className="w-full max-w-xs bg-black/40 backdrop-blur-2xl border border-white/5 p-1 rounded-xl flex gap-1 shadow-md">
        {([
          { id: 'quantum', label: 'קוונטי' },
          { id: 'holographic', label: 'הולוגרפי 3D' },
          { id: 'vault', label: 'כספת Offline' }
        ] as const).map((style) => {
          const isActive = ticketStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setTicketStyle(style.id)}
              className={`relative flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-center transition-colors duration-300 focus:outline-none ${
                isActive ? 'text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="ticketStyleTab"
                  className="absolute inset-0 bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

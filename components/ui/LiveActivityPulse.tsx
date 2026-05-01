'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, Zap } from 'lucide-react';

export default function LiveActivityPulse() {
  const [count, setCount] = useState(124);
  const [activeIcon, setActiveIcon] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    
    const iconInterval = setInterval(() => {
      setActiveIcon(prev => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(iconInterval);
    };
  }, []);

  const icons = [
    { Icon: Users, label: 'צופים כרגע' },
    { Icon: Eye, label: 'מתעניינים' },
    { Icon: Zap, label: 'הזמנות חמות' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl saturate-[1.5]"
    >
      <div className="relative">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 overflow-hidden h-4">
          <AnimatePresence mode="wait">
            {(() => {
              const CurrentIcon = icons[activeIcon].Icon;
              return (
                <motion.div
                  key={activeIcon}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <CurrentIcon size={10} className="text-primary" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">
                    {icons[activeIcon].label}
                  </span>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
        <span className="text-sm font-black text-white tracking-tighter tabular-nums">
          {count} <span className="text-[10px] text-white/60">משתמשים</span>
        </span>
      </div>
    </motion.div>
  );
}

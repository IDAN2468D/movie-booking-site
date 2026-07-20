'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSplinterStore } from '@/lib/store/splinterStore';
import { playShatterEffect } from '@/lib/utils/acoustics/shatterSound';
import { QrCode, Sparkles, Share2 } from 'lucide-react';

interface TicketSplinterCoreProps {
  parentTicketId: string;
  splinterCount: number;
  children: React.ReactNode;
}

export default function TicketSplinterCore({ parentTicketId, splinterCount, children }: TicketSplinterCoreProps) {
  const { splinters, initializeSplinters, detachSplinter } = useSplinterStore();
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    initializeSplinters(splinterCount);
    fetch('/api/tickets/splinter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentTicketId, count: splinterCount })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        const tokenMap: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.data.forEach((s: any) => { tokenMap[s.splinterId] = s.claimToken; });
        setTokens(tokenMap);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentTicketId, splinterCount]);

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-[1200px] h-[700px] flex justify-center mt-10">
      {/* Main Ticket */}
      <motion.div className="relative z-10 w-full" layout>
        {children}
      </motion.div>
      
      {/* Draggable Splinters behind the ticket */}
      {Object.values(splinters).map((splinter, i) => (
        <DraggableSplinter 
          key={splinter.id}
          id={splinter.id}
          index={i}
          total={splinterCount}
          isDetached={splinter.isDetached}
          claimToken={tokens[splinter.id]}
          onDetach={(id) => {
            playShatterEffect();
            detachSplinter(id, tokens[id]);
          }}
        />
      ))}
    </div>
  );
}

function DraggableSplinter({ id, index, total, isDetached, claimToken, onDetach }: { id: string, index: number, total: number, isDetached: boolean, claimToken?: string, onDetach: (id: string) => void }) {
  const controls = useAnimation();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any, info: any) => {
    if (isDetached) return;
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (distance > 120) {
      onDetach(id);
    } else {
      controls.start({ x: 0, y: 0, rotate: angle, transition: { type: 'spring', stiffness: 400, damping: 25 } });
    }
  };

  // Pre-calculate rotation and offset for the "deck of cards" look
  const angle = (index - (total - 1) / 2) * 15; 
  const yOffset = Math.abs(index - (total - 1) / 2) * 15;
  const xOffset = (index - (total - 1) / 2) * 40;

  return (
    <motion.div
      drag={!isDetached}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: xOffset, y: yOffset, rotate: angle, opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={!isDetached ? { scale: 1.05, y: yOffset - 30, zIndex: 30 } : {}}
      className={`absolute top-12 w-[300px] rounded-[36px] overflow-hidden cursor-grab active:cursor-grabbing border transition-colors duration-500 group ${
        isDetached 
          ? 'border-cyan-400/60 shadow-[0_0_60px_rgba(34,211,238,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] bg-[#08222d]/80' 
          : 'border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] bg-neutral-950/60'
      }`}
      style={{
        backdropFilter: 'blur(40px) saturate(250%) brightness(105%) contrast(110%)',
        transformStyle: 'preserve-3d',
        zIndex: isDetached ? 40 : 5 - Math.abs(index),
        willChange: 'transform, opacity'
      }}
    >
      {/* Specular Glint */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)' }} />
      
      {/* Background ambient mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* Content Area */}
      <div className="p-6 relative z-10 flex flex-col h-full min-h-[380px]">
        {isDetached ? (
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-black text-sm tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                כרטיס פעיל
              </span>
            </div>
            
            <div className="p-4 bg-white rounded-[24px] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-500">
              <QrCode size={100} className="text-black" />
            </div>
            
            <div className="w-full space-y-2 mt-4">
              <div className="text-[10px] text-cyan-200/50 uppercase tracking-widest text-center font-bold">קוד זיהוי מאובטח</div>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] text-cyan-300 font-mono break-all text-center leading-relaxed shadow-inner">
                {claimToken}
              </div>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://movie-booking.com/claim?token=${claimToken}`);
                const el = document.getElementById(`share-text-${id}`);
                if (el) {
                  el.innerText = 'הועתק ללוח!';
                  setTimeout(() => { if (el) el.innerText = 'שתף כרטיס'; }, 2000);
                }
              }}
              className="w-full mt-4 py-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Share2 size={16} />
              <span id={`share-text-${id}`}>שתף כרטיס</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] space-y-5 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/50 transition-all duration-500 group-hover:scale-110">
              <Share2 size={24} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-center font-outfit text-white text-sm font-black tracking-[0.2em] uppercase drop-shadow-md">
                גרור לפיצול
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
                אורח {index + 1}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

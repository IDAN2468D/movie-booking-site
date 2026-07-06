'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { BrainCircuit, Sparkles, Smile, Skull, Flame, Heart, Compass } from 'lucide-react';

interface MoodBubble {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  colors: [string, string];
  defaultX: number;
  defaultY: number;
}

const AVAILABLE_MOODS: MoodBubble[] = [
  { id: 'adrenaline', name: 'אדרנלין', icon: <Flame size={14} />, color: 'from-orange-500 to-red-600', colors: ['#f97316', '#dc2626'], defaultX: -120, defaultY: -100 },
  { id: 'drama', name: 'דרמה עמוקה', icon: <Compass size={14} />, color: 'from-blue-600 to-indigo-700', colors: ['#2563eb', '#4338ca'], defaultX: 130, defaultY: -90 },
  { id: 'laugh', name: 'קומדיה', icon: <Smile size={14} />, color: 'from-yellow-400 to-orange-500', colors: ['#facc15', '#f97316'], defaultX: -140, defaultY: 60 },
  { id: 'horror', name: 'מתח ואימה', icon: <Skull size={14} />, color: 'from-red-600 to-purple-900', colors: ['#dc2626', '#581c87'], defaultX: 120, defaultY: 80 },
  { id: 'romance', name: 'רומנטיקה', icon: <Heart size={14} />, color: 'from-pink-500 to-rose-600', colors: ['#ec4899', '#e11d48'], defaultX: 0, defaultY: -140 },
  { id: 'scifi', name: 'מדע בדיוני', icon: <Sparkles size={14} />, color: 'from-cyan-400 to-blue-600', colors: ['#22d3ee', '#2563eb'], defaultX: 0, defaultY: 130 },
];

export default function NeuralMoodOrbit() {
  const { activeMoods, setActiveMoods } = useBookingStore();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const dropZoneRadius = 90;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = (_event: any, info: PanInfo, moodId: string) => {
    setDraggingId(moodId);
    setDragOffset({ x: info.offset.x, y: info.offset.y });
  };

  const handleDragEnd = (_event: unknown, info: PanInfo, moodId: string) => {
    setDraggingId(null);
    setDragOffset({ x: 0, y: 0 });
    const x = info.offset.x;
    const y = info.offset.y;
    const distance = Math.sqrt(x * x + y * y);
    const isCurrentlyActive = activeMoods.includes(moodId);

    if (distance < dropZoneRadius) {
      if (!isCurrentlyActive) {
        setActiveMoods([...activeMoods, moodId]);
      }
    } else {
      if (isCurrentlyActive) {
        setActiveMoods(activeMoods.filter((m) => m !== moodId));
      }
    }
  };

  // Determine current active colors
  const activeColors = AVAILABLE_MOODS.filter((m) => activeMoods.includes(m.id)).map((m) => m.colors);
  const baseColor1 = activeColors[0]?.[0] || 'rgba(255,20,100,0.2)';
  const baseColor2 = activeColors[0]?.[1] || 'rgba(0,180,255,0.2)';

  // Liquid Border Radius based on drag/active states
  const isClose = draggingId ? Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y) < 180 : false;
  const borderRadiusStyle = isClose 
    ? '42% 58% 45% 55% / 45% 48% 52% 55%'
    : activeMoods.length > 0
    ? '48% 52% 46% 54% / 52% 48% 52% 48%'
    : '50% 50% 50% 50% / 50% 50% 50% 50%';

  return (
    <div 
      className="relative w-full max-w-lg h-[450px] bg-black/40 backdrop-blur-[40px] rounded-[48px] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-1000"
      ref={constraintsRef}
      style={{
        background: activeMoods.length > 0 
          ? `radial-gradient(circle at center, ${baseColor1}22 0%, ${baseColor2}11 50%, rgba(5,5,5,0.4) 100%)`
          : 'rgba(0,0,0,0.4)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />

      {/* Dynamic Morphing Liquid Aura */}
      <AnimatePresence>
        {activeMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute w-64 h-64 blur-3xl pointer-events-none rounded-full transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle, ${baseColor1}88 0%, ${baseColor2}44 60%, transparent 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Central Gravity Well (Drop Zone) */}
      <motion.div 
        className={`w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-700 relative`}
        style={{
          borderRadius: borderRadiusStyle,
          borderColor: activeMoods.length > 0 ? `${baseColor1}aa` : 'rgba(255,255,255,0.2)',
          background: activeMoods.length > 0 ? `${baseColor1}11` : 'rgba(255,255,255,0.02)',
          boxShadow: activeMoods.length > 0 ? `0 0 40px ${baseColor1}44, inset 0 0 20px ${baseColor2}22` : 'none'
        }}
        animate={{
          scale: activeMoods.length > 0 ? [1, 1.05, 1] : 1,
          rotate: activeMoods.length > 0 ? 360 : 0
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 25, ease: 'linear' },
          scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        }}
      >
        <BrainCircuit className={`w-10 h-10 transition-colors duration-500`} style={{ color: activeMoods.length > 0 ? baseColor1 : '#64748b' }} />
        <span className="text-[10px] font-black tracking-widest text-slate-400 mt-2 uppercase">
          {activeMoods.length > 0 ? 'ליבה פעילה' : 'ליבת הרגש'}
        </span>
        <span className="text-[8px] font-bold text-slate-500 mt-1">גרור לכאן בועות</span>

        <div className="absolute w-[240px] h-[240px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-white/5 pointer-events-none" />
      </motion.div>

      {/* Draggable Mood Bubbles */}
      {AVAILABLE_MOODS.map((mood) => {
        const isActive = activeMoods.includes(mood.id);
        
        return (
          <motion.div
            key={mood.id}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.4}
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(e, info, mood.id)}
            onDragEnd={(e, info) => handleDragEnd(e, info, mood.id)}
            initial={{ x: mood.defaultX, y: mood.defaultY }}
            animate={{
              x: isActive ? 0 : mood.defaultX,
              y: isActive ? 0 : mood.defaultY,
              scale: isActive ? 1.15 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: isActive ? 80 : 100,
              damping: isActive ? 12 : 15
            }}
            style={{ position: 'absolute' }}
            className={`cursor-grab active:cursor-grabbing w-24 h-24 rounded-full bg-gradient-to-br ${mood.color} p-[1px] shadow-lg flex items-center justify-center z-20 group`}
          >
            <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-2 text-center transition-colors duration-500 group-hover:bg-black/60">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 text-white bg-gradient-to-br ${mood.color} shadow-md`}>
                {mood.icon}
              </div>
              <span className="text-[9px] font-black text-white whitespace-nowrap">
                {mood.name}
              </span>
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse pointer-events-none" />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

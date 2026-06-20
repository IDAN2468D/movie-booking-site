'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { BrainCircuit, Sparkles, Smile, Skull, Flame, Heart, Compass, Star } from 'lucide-react';

interface MoodBubble {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  defaultX: number;
  defaultY: number;
}

const AVAILABLE_MOODS: MoodBubble[] = [
  { id: 'adrenaline', name: 'אדרנלין', icon: <Flame size={14} />, color: 'from-orange-500 to-red-600', defaultX: -120, defaultY: -100 },
  { id: 'drama', name: 'דרמה עמוקה', icon: <Compass size={14} />, color: 'from-blue-600 to-indigo-700', defaultX: 130, defaultY: -90 },
  { id: 'laugh', name: 'קומדיה', icon: <Smile size={14} />, color: 'from-yellow-400 to-orange-500', defaultX: -140, defaultY: 60 },
  { id: 'horror', name: 'מתח ואימה', icon: <Skull size={14} />, color: 'from-red-600 to-purple-900', defaultX: 120, defaultY: 80 },
  { id: 'romance', name: 'רומנטיקה', icon: <Heart size={14} />, color: 'from-pink-500 to-rose-600', defaultX: 0, defaultY: -140 },
  { id: 'scifi', name: 'מדע בדיוני', icon: <Sparkles size={14} />, color: 'from-cyan-400 to-blue-600', defaultX: 0, defaultY: 130 },
];

export default function NeuralMoodOrbit() {
  const { activeMoods, setActiveMoods } = useBookingStore();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Center Drop Zone Coordinates
  const dropZoneRadius = 90;

  const handleDragEnd = (event: any, info: any, moodId: string) => {
    // Check distance to center (0,0 of container)
    const x = info.offset.x;
    const y = info.offset.y;
    const distance = Math.sqrt(x * x + y * y);

    const isCurrentlyActive = activeMoods.includes(moodId);

    // If dragged near the center, active the mood
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

  return (
    <div className="relative w-full max-w-lg h-[450px] bg-black/40 backdrop-blur-[40px] rounded-[48px] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden" ref={constraintsRef}>
      
      {/* Decorative refractions */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />

      {/* Central Gravity Well (Drop Zone) */}
      <motion.div 
        className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 border-dashed transition-all duration-700 relative ${
          activeMoods.length > 0
            ? 'border-primary/50 bg-primary/5 shadow-[0_0_50px_rgba(255,20,100,0.2)]'
            : 'border-white/20 bg-white/[0.02]'
        }`}
        animate={{
          scale: activeMoods.length > 0 ? [1, 1.05, 1] : 1,
          rotate: activeMoods.length > 0 ? 360 : 0
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 25, ease: 'linear' },
          scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        }}
      >
        {/* Core Glow Ring */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-primary/10 to-cyan-500/10 blur-xl opacity-80 pointer-events-none" />

        <BrainCircuit className={`w-10 h-10 transition-colors duration-500 ${activeMoods.length > 0 ? 'text-primary' : 'text-slate-500'}`} />
        <span className="text-[10px] font-black tracking-widest text-slate-400 mt-2 uppercase">
          {activeMoods.length > 0 ? 'ליבה פעילה' : 'ליבת הרגש'}
        </span>
        <span className="text-[8px] font-bold text-slate-500 mt-1">גרור לכאן בועות</span>

        {/* Orbit indicator lines */}
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
              
              {/* Highlight state overlay */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse pointer-events-none" />
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Aura background element */}
      <AnimatePresence>
        {activeMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary blur-[80px] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

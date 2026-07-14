"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Film, X } from "lucide-react";
import { useAcousticFeedback } from "@/hooks/useAcousticFeedback";
import { CoStarRelation } from "@/app/actions/actorChemistryActions";

interface ActorChemistryMatrixProps {
  actorName: string;
  actorAvatar: string;
  coStars: CoStarRelation[];
}

export function ActorChemistryMatrix({
  actorName,
  actorAvatar,
  coStars,
}: ActorChemistryMatrixProps) {
  const { playBassDrop, playSpatialClick } = useAcousticFeedback();
  const [activeRelation, setActiveRelation] = useState<CoStarRelation | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    coStars.reduce((acc, c, i) => {
      const angle = (i * 2 * Math.PI) / coStars.length;
      const radius = 130;
      acc[c.actorId] = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );

  const handleDrag = (id: string, info: { delta: { x: number; y: number } }) => {
    const current = positions[id];
    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: current.x + info.delta.x,
        y: current.y + info.delta.y,
      },
    }));
  };

  const handleDragEnd = (id: string, relation: CoStarRelation) => {
    const current = positions[relation.actorId];
    const distance = Math.sqrt(current.x * current.x + current.y * current.y);
    
    if (distance < 70) {
      playBassDrop();
      playSpatialClick(undefined, { x: current.x / 10, y: current.y / 10, z: 0 });
      setActiveRelation(relation);
      
      setPositions((prev) => ({
        ...prev,
        [relation.actorId]: { x: 0, y: 0 },
      }));
    } else {
      const i = coStars.findIndex((c) => c.actorId === relation.actorId);
      const angle = (i * 2 * Math.PI) / coStars.length;
      const radius = 130;
      setPositions((prev) => ({
        ...prev,
        [relation.actorId]: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
      }));
    }
  };

  return (
    <div ref={containerRef} className="mt-16 w-full relative select-none" dir="rtl">
      <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-3 font-['Outfit']">
        <Sparkles className="text-[#00F0FF] animate-pulse" />
        <span style={{ textShadow: "0 0 15px rgba(0, 240, 255, 0.4)" }}>
          קשרים קולנועיים
        </span>
      </h2>

      {/* Physics Board */}
      <div className="relative w-full h-[380px] rounded-[2.5rem] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] overflow-hidden flex items-center justify-center">
        {/* Neon Vector SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {coStars.map((c) => {
            const pos = positions[c.actorId] || { x: 0, y: 0 };
            return (
              <line
                key={c.actorId}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${pos.x}px)`}
                y2={`calc(50% + ${pos.y}px)`}
                stroke="url(#neonGlow)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Central Core (Main Actor) */}
        <div className="relative w-28 h-28 rounded-full border-4 border-white/20 shadow-[0_0_35px_rgba(0,240,255,0.4)] z-10 bg-neutral-900 overflow-hidden">
          <Image 
            src={actorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
            alt={actorName}
            fill
            className="object-cover"
            sizes="112px"
          />
          <div className="absolute inset-0 bg-[#00F0FF]/10 mix-blend-overlay" />
        </div>

        {/* Co-Star Bubbles */}
        {coStars.map((c) => {
          const pos = positions[c.actorId] || { x: 0, y: 0 };
          return (
            <motion.div
              key={c.actorId}
              drag
              dragMomentum={false}
              dragElastic={0.4}
              dragConstraints={containerRef}
              onDrag={(e, info) => handleDrag(c.actorId, info)}
              onDragEnd={() => handleDragEnd(c.actorId, c)}
              animate={{ x: pos.x, y: pos.y }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="absolute w-20 h-20 rounded-full border-2 border-[#00F0FF]/40 cursor-grab active:cursor-grabbing z-20 overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] group will-change-transform transform-gpu"
            >
              <Image
                src={c.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                alt={c.name}
                fill
                className="object-cover pointer-events-none group-hover:scale-105 transition-transform"
                sizes="80px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-200 block truncate px-1 font-['Inter']">
                  {c.name.split(" ")[0]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Collaboration Detail Panel Overlay (Liquid Glass 4.0 Modal) */}
      <AnimatePresence>
        {activeRelation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-6 bottom-6 p-6 rounded-[2rem] backdrop-blur-[50px] bg-neutral-950/90 border border-white/20 shadow-2xl z-30 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                  <Image src={activeRelation.avatarUrl} alt={activeRelation.name} fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-['Outfit']">חיבור עם {activeRelation.name}</h4>
                  <p className="text-xs text-gray-400 font-['Inter']">מדד כימיה: {activeRelation.chemistryScore}%</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveRelation(null)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5 font-['Outfit']">
                <Film size={14} className="text-[#00F0FF]" />
                סרטים משותפים:
              </p>
              {activeRelation.collaborations.map((col, idx) => (
                <Link
                  key={idx}
                  href={`/movie/${col.movieId}`}
                  className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all text-right"
                >
                  <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <Image src={col.posterUrl} alt={col.title} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h5 className="text-sm font-bold text-white font-['Outfit']">{col.title}</h5>
                    <p className="text-xs text-gray-400 font-['Inter'] mt-1">
                      {actorName}: <span className="text-gray-200">{col.characterName}</span> | {activeRelation.name}: <span className="text-gray-200">{col.coStarCharacterName}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

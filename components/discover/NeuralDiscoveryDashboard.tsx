"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { getNeuralMovies } from "@/app/actions/neuralDiscoveryActions";

interface MovieNode {
  id: string;
  title: string;
  match: number;
  collection: string;
  image: string;
}

const EMOTION_BUBBLES = [
  { id: "intense", label: "אינטנסיבי ומהיר", color: "from-red-500 to-orange-500", shadow: "rgba(239,68,68,0.5)" },
  { id: "thoughtful", label: "מחשבתי ועתידני", color: "from-purple-500 to-indigo-500", shadow: "rgba(168,85,247,0.5)" },
  { id: "emotional", label: "מרגש ואופטימי", color: "from-emerald-400 to-teal-500", shadow: "rgba(52,211,153,0.5)" },
  { id: "dark", label: "אפל ומותח", color: "from-slate-600 to-black", shadow: "rgba(71,85,105,0.8)" },
  { id: "nostalgic", label: "נוסטלגי", color: "from-amber-400 to-yellow-600", shadow: "rgba(251,191,36,0.5)" },
];

export function NeuralDiscoveryDashboard({ userId }: { userId: string }) {
  const [results, setResults] = useState<MovieNode[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  
  const coreRef = useRef<HTMLDivElement>(null);
  const coreAnimation = useAnimation();

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, bubble: typeof EMOTION_BUBBLES[0]) => {
    if (!coreRef.current) return;
    
    const coreRect = coreRef.current.getBoundingClientRect();
    const bubbleRect = (event.target as HTMLElement).getBoundingClientRect();
    
    // Check intersection
    const isIntersecting = !(
      bubbleRect.right < coreRect.left || 
      bubbleRect.left > coreRect.right || 
      bubbleRect.bottom < coreRect.top || 
      bubbleRect.top > coreRect.bottom
    );

    if (isIntersecting) {
      // Absorb animation
      setIsAbsorbing(true);
      setActiveMood(bubble.label);
      
      coreAnimation.start({
        scale: [1, 1.15, 1],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: { duration: 0.6, ease: "easeInOut" }
      });

      startTransition(async () => {
        setErrorMsg(null);
        // Default tension and pace since they are removed from UI
        const res = await getNeuralMovies(userId, { mood: bubble.label, tension: 50, pace: 50 });
        if (res.success && res.data) {
          setResults(res.data);
        } else if (res.error) {
          setErrorMsg(res.error);
          setResults([]);
        }
        setTimeout(() => setIsAbsorbing(false), 800);
      });
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#05070B] text-white font-['Inter',_sans-serif] p-4 md:p-8 overflow-hidden relative" dir="rtl">
      {/* Hyper-Refraction Layer (Glass Backdrop) */}
      <div className="absolute inset-0 z-0 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col h-full">
        <header className="mb-12 text-center pt-8">
          <h1 className="text-4xl md:text-5xl font-['Outfit'] font-bold leading-relaxed mb-4 text-transparent bg-clip-text bg-gradient-to-l from-[#00F0FF] to-blue-500 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            מנוע תגליות נוירוני
          </h1>
          <p className="text-gray-400 font-['Inter'] text-lg leading-relaxed max-w-2xl mx-auto">
            גרור בועת רגש אל ליבת המחשבה וסנכרן את התודעה שלך לחוויה הקולנועית הבאה.
          </p>
        </header>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 backdrop-blur-md text-center">
            {errorMsg}
          </div>
        )}

        {/* Interaction Area */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-16">
          
          {/* Emotion Bubbles Palette */}
          <div className="flex flex-wrap justify-center lg:flex-col gap-6 lg:w-1/3">
            {EMOTION_BUBBLES.map((bubble) => (
              <motion.div
                key={bubble.id}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, bubble)}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.15, zIndex: 50, filter: "brightness(1.2)" }}
                className={`cursor-grab active:cursor-grabbing px-6 py-4 rounded-full bg-gradient-to-r ${bubble.color} border border-white/[0.12] flex items-center justify-center`}
                style={{ 
                  boxShadow: `0 10px 30px -10px ${bubble.shadow}, inset 0 0 0 1px rgba(255, 255, 255, 0.15)` 
                }}
              >
                <span className="font-['Outfit'] font-bold text-white text-lg tracking-wide drop-shadow-md pointer-events-none">
                  {bubble.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Thought Core */}
          <div className="flex items-center justify-center lg:w-2/3 relative h-[300px] md:h-[400px]">
            {/* Core Glow Base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00F0FF]/10 via-transparent to-transparent pointer-events-none" />
            
            <motion.div
              ref={coreRef}
              animate={coreAnimation}
              className={`w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/[0.15] flex items-center justify-center relative backdrop-blur-[20px] transition-all duration-500 ${isAbsorbing || isPending ? 'shadow-[0_0_80px_rgba(0,240,255,0.6)] border-[#00F0FF]' : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,240,255,0.2)]'}`}
              style={{
                background: isAbsorbing || isPending 
                  ? 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, rgba(5,7,11,0.6) 70%)' 
                  : 'rgba(5, 7, 11, 0.4)'
              }}
            >
              {/* Inner Core Pulse */}
              <motion.div 
                animate={{ 
                  scale: isPending ? [1, 1.2, 1] : [1, 1.05, 1],
                  opacity: isPending ? [0.5, 1, 0.5] : [0.3, 0.5, 0.3]
                }}
                transition={{ repeat: Infinity, duration: isPending ? 1 : 3, ease: "easeInOut" }}
                className="absolute inset-4 rounded-full bg-[#00F0FF]/20 blur-xl pointer-events-none"
              />
              
              <div className="text-center z-10 pointer-events-none">
                {isPending ? (
                  <span className="font-['Outfit'] font-bold text-[#00F0FF] text-xl animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">מסנכרן תודעה...</span>
                ) : activeMood ? (
                  <span className="font-['Outfit'] font-bold text-[#00F0FF] text-xl drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">{activeMood}</span>
                ) : (
                  <span className="font-['Outfit'] font-bold text-gray-400 text-lg opacity-70">גרור רגש לכאן</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Results Presentation */}
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full backdrop-blur-[40px] bg-neutral-950/40 border border-white/[0.12] rounded-3xl p-8 mb-12"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.15)' }}
          >
            <h2 className="text-2xl font-bold font-['Outfit'] text-white mb-6">תגלית נוירונית מסונכרנת</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((movie, idx) => (
                <motion.div 
                  key={movie.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/[0.12] cursor-pointer"
                  style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.4)' }}
                >
                  <Image src={movie.image} alt={movie.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/50 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] font-['Inter'] text-xs font-bold rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                        {movie.collection}
                      </span>
                      <span className="text-[#00F0FF] font-mono text-sm font-bold drop-shadow-md">
                        {movie.match}% התאמה
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-['Outfit'] text-white">{movie.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

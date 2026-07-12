"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { BubbleToken } from "@/lib/validations/discovery";
import { useHapticStore } from "@/lib/store/hapticStore";

interface EmotionBubblesProps {
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, bubble: BubbleToken) => void;
  onDrag?: (event: any, info: PanInfo, bubble: BubbleToken) => void;
}

export const DISCOVERY_BUBBLES: BubbleToken[] = [
  { id: "action", type: "genre", value: 28, label: "פעולה" },
  { id: "scifi", type: "genre", value: 878, label: "מדע בדיוני" },
  { id: "comedy", type: "genre", value: 35, label: "קומדיה" },
  { id: "drama", type: "genre", value: 18, label: "דרמה" },
  { id: "horror", type: "genre", value: 27, label: "אימה" },
  { id: "short", type: "runtime", value: 90, label: "עד שעה וחצי" },
  { id: "epic", type: "runtime", value: 180, label: "אפי וארוך" },
  { id: "top-rated", type: "rating", value: 8.5, label: "יצירת מופת" },
  { id: "good", type: "rating", value: 7.0, label: "מומלץ" },
];

export function EmotionBubbles({ onDragEnd, onDrag }: EmotionBubblesProps) {
  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null);
  const bubbleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const unsub = useHapticStore.subscribe((state) => {
      if (activeBubbleId && bubbleRefs.current[activeBubbleId]) {
        bubbleRefs.current[activeBubbleId]!.style.transform = `translate3d(${state.offsetX}px, ${state.offsetY}px, 0)`;
        bubbleRefs.current[activeBubbleId]!.style.willChange = "transform";
      }
    });
    return unsub;
  }, [activeBubbleId]);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 z-50">
      {DISCOVERY_BUBBLES.map((bubble) => {
        let gradient = "from-neutral-700 to-neutral-900";
        if (bubble.type === "genre") gradient = "from-violet-500 to-fuchsia-600";
        if (bubble.type === "runtime") gradient = "from-blue-500 to-cyan-500";
        if (bubble.type === "rating") gradient = "from-amber-400 to-orange-600";
        
        return (
          <motion.div
            key={bubble.id}
            drag
            dragSnapToOrigin
            onDragStart={() => setActiveBubbleId(bubble.id)}
            onDrag={(e, info) => onDrag?.(e, info, bubble)}
            onDragEnd={(e, info) => {
              setActiveBubbleId(null);
              if (bubbleRefs.current[bubble.id]) {
                bubbleRefs.current[bubble.id]!.style.transform = 'translate3d(0,0,0)';
              }
              onDragEnd(e, info, bubble);
            }}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.15, zIndex: 100, filter: "brightness(1.3)" }}
            className={`cursor-grab active:cursor-grabbing px-6 py-3 rounded-full flex items-center justify-center relative`}
          >
            {/* Shaking Background Layer */}
            <div 
              ref={(el) => { bubbleRefs.current[bubble.id] = el; }} 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} border border-white/[0.2] overflow-hidden transform-gpu z-0 pointer-events-none`}
              style={{ 
                boxShadow: `0 10px 25px -5px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2)` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
            </div>
            
            {/* Stable Text Layer */}
            <span className="font-['Outfit'] font-bold text-white text-md tracking-wide drop-shadow-md pointer-events-none relative z-10">
              {bubble.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

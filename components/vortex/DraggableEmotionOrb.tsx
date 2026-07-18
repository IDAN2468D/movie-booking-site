"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useVortexStore } from "@/lib/store/vortexStore";
import { useVortexAcoustics } from "@/hooks/useVortexAcoustics";
import { ValidEmotions } from "@/lib/validations/emotionVortex";

// Emotion to Color Mapping
export const emotionColors: Record<string, string> = {
  "Mind-Blowing": "rgba(138, 92, 255, 1)", // ai-purple
  "Tearjerker": "rgba(0, 209, 255, 1)",    // data-blue
  "Visceral": "rgba(255, 46, 91, 1)",      // volatility-red
  "Heartwarming": "rgba(0, 255, 163, 1)",  // growth-neon
  "Terrifying": "rgba(255, 180, 171, 1)",  // error
};

interface Props {
  emotion: typeof ValidEmotions[number];
  onDropInVortex: (emotion: string) => void;
}

export default function DraggableEmotionOrb({ emotion, onDropInVortex }: Props) {
  const { setActiveEmotion, isSwallowed } = useVortexStore();
  const { playSuctionRamp } = useVortexAcoustics();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const scale = useTransform(() => {
    const dist = Math.sqrt(x.get() ** 2 + y.get() ** 2);
    // Shrink slightly as it gets closer to center or moves far away
    return Math.max(0.6, 1 - dist / 800);
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) {
      setActiveEmotion(emotion);
    } else {
      setActiveEmotion(null);
    }
  }, [isDragging, emotion, setActiveEmotion]);

  const baseColor = emotionColors[emotion];
  const bgColor = baseColor.replace("1)", "0.2)");
  const glowColor = baseColor.replace("1)", "0.5)");

  return (
    <motion.div
      drag={!isSwallowed}
      dragElastic={0.2}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragSnapToOrigin
      onDragStart={() => setIsDragging(true)}
      onDrag={(event, info) => {
        const dist = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
        // Throttle audio slightly so it doesn't clip
        if (dist > 150 && Math.random() > 0.9) {
          playSuctionRamp(Math.min(1, dist / 400));
        }
      }}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        const dist = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
        // If dragged high enough upwards towards the center (e.g. y < -150)
        if (info.offset.y < -150) {
          onDropInVortex(emotion);
        }
      }}
      style={{
        x,
        y,
        scale,
        backgroundColor: bgColor,
        boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.5)`,
      }}
      className={`
        relative w-20 h-20 rounded-full cursor-grab active:cursor-grabbing
        flex items-center justify-center text-xs font-bold text-center
        backdrop-blur-md border border-white/30
        transition-colors duration-300 select-none
      `}
    >
      <span className="pointer-events-none drop-shadow-md text-white px-2 leading-tight">
        {emotion}
      </span>
    </motion.div>
  );
}

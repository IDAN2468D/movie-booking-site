"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Subtitle {
  id: number;
  text: string;
  intensity: "low" | "medium" | "high";
  duration: number; // ms
}

const mockSubtitles: Subtitle[] = [
  { id: 1, text: "The universe is expanding...", intensity: "low", duration: 2500 },
  { id: 2, text: "But our time...", intensity: "medium", duration: 2000 },
  { id: 3, text: "IS RUNNING OUT!", intensity: "high", duration: 1500 },
  { id: 4, text: "", intensity: "low", duration: 500 },
  { id: 5, text: "They thought it was a myth.", intensity: "low", duration: 2500 },
  { id: 6, text: "They were wrong.", intensity: "high", duration: 2000 },
];

export function KineticTypography() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const playSequence = (index: number) => {
      if (index >= mockSubtitles.length) {
        // Loop for demo purposes
        setCurrentIndex(0);
        timeout = setTimeout(() => playSequence(1), mockSubtitles[0].duration);
        return;
      }
      
      setCurrentIndex(index);
      timeout = setTimeout(() => playSequence(index + 1), mockSubtitles[index].duration);
    };

    timeout = setTimeout(() => playSequence(0), 1000);

    return () => clearTimeout(timeout);
  }, []);

  const currentSub = mockSubtitles[currentIndex];

  if (!currentSub || !currentSub.text) return null;

  // Render individual letters for high intensity for shattering effect
  const renderText = () => {
    if (currentSub.intensity === "high") {
      return currentSub.text.split("").map((char, i) => (
        <motion.span
          key={`${currentSub.id}-${i}`}
          initial={{ opacity: 0, y: 50, scale: 0.5, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            y: [0, -10, 10, -5, 5, 0],
            x: [0, -5, 5, -2, 2, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
          }}
          transition={{
            duration: 0.4,
            ease: "circOut",
            delay: i * 0.03,
          }}
          className="inline-block"
          style={{ textShadow: "0 0 20px rgba(255, 0, 0, 0.8)" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ));
    }

    // Normal rendering for low/medium
    return (
      <motion.span
        key={currentSub.id}
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          filter: currentSub.intensity === "medium" ? ["blur(8px)", "blur(0px)", "blur(2px)", "blur(0px)"] : "blur(0px)",
          scale: currentSub.intensity === "medium" ? [0.9, 1.05, 1] : 1
        }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.5 }}
      >
        {currentSub.text}
      </motion.span>
    );
  };

  return (
    <div className="absolute inset-x-0 bottom-12 z-30 flex justify-center items-end pointer-events-none px-8" dir="ltr">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentSub.id}
          className={`font-['Outfit'] text-center uppercase tracking-widest font-bold 
            ${currentSub.intensity === 'high' ? 'text-4xl text-red-500 font-black flex justify-center' : 
              currentSub.intensity === 'medium' ? 'text-2xl text-cyan-100' : 'text-xl text-white/70'}
          `}
        >
          {renderText()}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}

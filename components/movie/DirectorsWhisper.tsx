"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateTrailerTriviaAction } from "@/app/actions/trailerTriviaActions";
import { TrailerTriviaItem } from "@/lib/validations/trivia";
import { Info } from "lucide-react";

export function DirectorsWhisper({ movieTitle }: { movieTitle: string }) {
  const [trivia, setTrivia] = useState<TrailerTriviaItem[]>([]);
  const [activeTrivia, setActiveTrivia] = useState<TrailerTriviaItem | null>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Fetch trivia instantly using Gemini Flash Lite
    generateTrailerTriviaAction(movieTitle).then((res) => {
      if (res.success && res.data) {
        setTrivia(res.data);
      }
    });
  }, [movieTitle]);

  useEffect(() => {
    if (trivia.length === 0) return;

    let startTime = performance.now();

    const loop = (time: number) => {
      // Simulate elapsed time in seconds (since trailer autoplay starts immediately)
      const elapsedSeconds = (time - startTime) / 1000;
      timeRef.current = elapsedSeconds;

      // Find if there is an active trivia for this time window (show for 4 seconds)
      const currentTrivia = trivia.find(
        (t) => elapsedSeconds >= t.timeInSeconds && elapsedSeconds <= t.timeInSeconds + 4
      );

      if (currentTrivia) {
        setActiveTrivia(currentTrivia);
      } else {
        setActiveTrivia(null);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [trivia]);

  return (
    <AnimatePresence>
      {activeTrivia && (
        <motion.div
          key={activeTrivia.timeInSeconds}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-16 right-8 z-50 max-w-sm"
          style={{ willChange: "transform, opacity" }}
          dir="rtl"
        >
          <div className="flex items-start gap-3 p-4 rounded-[1.5rem] bg-black/40 backdrop-blur-[24px] saturate-[200%] border border-white/[0.15] shadow-[0_15px_40px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="w-8 h-8 rounded-full bg-[#0AEFFF]/20 border border-[#0AEFFF]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(10,239,255,0.3)]">
              <Info className="text-[#0AEFFF]" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0AEFFF] font-['Outfit'] mb-1">
                הערת במאי
              </p>
              <p className="text-sm text-white/90 font-['Inter'] leading-relaxed drop-shadow-md">
                {activeTrivia.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

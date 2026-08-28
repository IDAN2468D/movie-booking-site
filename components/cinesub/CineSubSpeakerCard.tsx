"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2, UserCheck, Sparkles } from "lucide-react";
import { SubtitleCue, SpeakerColorMap } from "@/lib/schemas/subtitleSync";
import { SubtitleFontSize } from "@/lib/store/subtitleStore";

interface Props {
  cue: SubtitleCue;
  fontSize: SubtitleFontSize;
  isStealthMode: boolean;
}

const fontClasses: Record<SubtitleFontSize, string> = {
  sm: "text-lg md:text-xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl font-bold",
  xl: "text-4xl md:text-5xl font-extrabold",
};

export const CineSubSpeakerCard: React.FC<Props> = ({ cue, fontSize, isStealthMode }) => {
  const colorClass = SpeakerColorMap[cue.speaker] || SpeakerColorMap["Default"];

  return (
    <motion.div
      key={cue.id}
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full max-w-3xl mx-auto p-6 md:p-8 rounded-3xl transition-all duration-300 ${
        isStealthMode
          ? "bg-neutral-950/90 border border-neutral-800 shadow-none"
          : "bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]"
      }`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-3.5 py-1 text-xs font-bold rounded-full border bg-gradient-to-r ${colorClass} flex items-center gap-1.5 shadow-sm`}>
            <UserCheck className="w-3.5 h-3.5" />
            {cue.speaker}
          </span>

          {cue.isMusicOrEffect && (
            <span className="px-3 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> אפקט קולי
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>דיוק {(cue.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Hebrew Translated Text */}
      <p
        className={`${fontClasses[fontSize]} text-amber-300 drop-shadow-[0_2px_14px_rgba(251,191,36,0.35)] leading-relaxed tracking-wide mb-3`}
      >
        {cue.translatedText}
      </p>

      {/* Original Spoken Dialogue */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 italic">
        <span>&ldquo;{cue.originalText}&rdquo;</span>
        <span className="text-[10px] font-mono opacity-60">
          +{Math.round(cue.startTimeMs / 1000)}s
        </span>
      </div>
    </motion.div>
  );
};

export default CineSubSpeakerCard;

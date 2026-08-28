"use client";

import React from "react";
import { Cpu, Wifi, Radio } from "lucide-react";

interface Props {
  isTranscribing: boolean;
  isRecording: boolean;
  activeCuesCount: number;
}

export const CineSubTelemetryHud: React.FC<Props> = ({
  isTranscribing,
  isRecording,
  activeCuesCount,
}) => {
  return (
    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-300">Gemini 3.5 Audio</span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
        <Wifi className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isTranscribing ? "מעבד נתחים..." : isRecording ? "סנכרון פעיל" : "המתנה"}</span>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
        <Radio className="w-3.5 h-3.5 text-amber-400" />
        <span>{activeCuesCount} שורות סונכרנו</span>
      </div>
    </div>
  );
};

export default CineSubTelemetryHud;

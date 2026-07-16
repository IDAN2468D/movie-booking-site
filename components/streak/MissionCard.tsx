"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";
import { Mission } from "@/lib/validations/streakValidation";

interface MissionCardProps {
  mission: Mission;
  onClaim: (missionId: string) => void;
  isPending: boolean;
}

export default function MissionCard({
  mission,
  onClaim,
  isPending,
}: MissionCardProps) {
  const progressPercent = Math.min(
    (mission.progress / mission.target) * 100,
    100
  );
  const isReady = mission.progress >= mission.target && !mission.completed;
  const circumference = 2 * Math.PI * 18; // radius = 18

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="relative p-4 rounded-xl backdrop-blur-3xl saturate-[250%]
        brightness-105 border border-white/[0.12] bg-neutral-950/40"
      style={{
        boxShadow: mission.completed
          ? "inset 0 0 0 1px rgba(34,197,94,0.2), 0 8px 24px -8px rgba(0,0,0,0.4)"
          : "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px -8px rgba(0,0,0,0.4)",
      }}
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        {/* Circular progress ring */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 -rotate-90 transform-gpu" viewBox="0 0 40 40">
            {/* Background ring */}
            <circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            {/* Progress ring */}
            <circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke={mission.completed ? "#22c55e" : "#f97316"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (progressPercent / 100) * circumference
              }
              className="transition-all duration-700"
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {mission.completed ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <span className="text-[10px] font-bold text-white/60 font-[Inter]">
                {mission.progress}/{mission.target}
              </span>
            )}
          </div>
        </div>

        {/* Mission info */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-bold font-[Outfit] leading-tight ${
              mission.completed ? "text-white/40 line-through" : "text-white"
            }`}
          >
            {mission.title}
          </h4>
          <p className="text-xs text-white/40 font-[Inter] mt-0.5 leading-relaxed">
            {mission.description}
          </p>
        </div>

        {/* Reward / Claim button */}
        {isReady ? (
          <motion.button
            onClick={() => onClaim(mission.missionId)}
            disabled={isPending}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg
              text-xs font-bold font-[Outfit] border
              border-yellow-400/30 text-yellow-400
              disabled:opacity-40"
            style={{ background: "rgba(234, 179, 8, 0.12)" }}
          >
            <Gift size={12} />
            אסוף
          </motion.button>
        ) : mission.completed ? (
          <span className="text-xs text-green-400/60 font-[Inter]">הושלם ✓</span>
        ) : (
          <span className="text-xs text-white/30 font-[Inter]">
            +{mission.reward}
          </span>
        )}
      </div>
    </motion.div>
  );
}

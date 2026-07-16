"use client";

import React, { useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Award, TrendingUp } from "lucide-react";
import { useStreakStore } from "@/lib/store/streakStore";
import {
  dailyCheckInAction,
  getStreakDataAction,
  claimMissionAction,
} from "@/app/actions/streakActions";
import StreakFlame from "./StreakFlame";
import MissionCard from "./MissionCard";

export default function StreakDashboard() {
  const data = useStreakStore((s) => s.streakData);
  const isLoading = useStreakStore((s) => s.isLoading);
  const checkInResult = useStreakStore((s) => s.checkInResult);
  const setStreakData = useStreakStore((s) => s.setStreakData);
  const setLoading = useStreakStore((s) => s.setLoading);
  const setCheckInResult = useStreakStore((s) => s.setCheckInResult);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    getStreakDataAction("demo-user").then((res) => {
      if (res.success && res.data) setStreakData(res.data);
    });
  }, [setStreakData, setLoading]);

  const handleCheckIn = useCallback(() => {
    startTransition(async () => {
      const res = await dailyCheckInAction("demo-user");
      if (res.success && res.data) {
        setCheckInResult({ streak: res.data.streak, points: res.data.points });
        // Refresh streak data
        const fresh = await getStreakDataAction("demo-user");
        if (fresh.success && fresh.data) setStreakData(fresh.data);
        setTimeout(() => setCheckInResult(null), 3000);
      }
    });
  }, [setCheckInResult, setStreakData]);

  const handleClaim = useCallback(
    (missionId: string) => {
      startTransition(async () => {
        await claimMissionAction("demo-user", missionId);
        const fresh = await getStreakDataAction("demo-user");
        if (fresh.success && fresh.data) setStreakData(fresh.data);
      });
    },
    [setStreakData]
  );

  const playCheckInSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch { /* silent */ }
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-white/20 border-t-orange-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Streak Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl backdrop-blur-3xl saturate-[250%]
          brightness-105 bg-neutral-950/40 border border-white/[0.12]
          flex items-center gap-5"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.3)",
        }}
      >
        <StreakFlame streak={data.currentStreak} size={56} />

        <div className="flex-1">
          <h2 className="text-2xl font-black text-white font-[Outfit] tracking-tight">
            {data.currentStreak} ימים ברצף
          </h2>
          <p className="text-xs text-white/40 font-[Inter] mt-0.5 flex items-center gap-1.5">
            <Award size={12} className="text-yellow-400" />
            שיא: {data.longestStreak} ימים
            <span className="mx-1">·</span>
            <TrendingUp size={12} className="text-green-400" />
            מכפיל: ×{data.multiplier}
          </p>
        </div>

        {/* Check-in button */}
        <motion.button
          onClick={() => {
            handleCheckIn();
            playCheckInSound();
          }}
          disabled={data.checkedInToday || isPending}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
            font-[Outfit] font-bold text-sm border
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors"
          style={{
            background: data.checkedInToday
              ? "rgba(34, 197, 94, 0.1)"
              : "rgba(249, 115, 22, 0.15)",
            borderColor: data.checkedInToday
              ? "rgba(34, 197, 94, 0.2)"
              : "rgba(249, 115, 22, 0.3)",
            color: data.checkedInToday ? "#4ade80" : "#fb923c",
          }}
        >
          <Zap size={14} />
          {data.checkedInToday ? "✓ בוצע" : "צ'ק-אין"}
        </motion.button>
      </motion.div>

      {/* Check-in success toast */}
      <AnimatePresence>
        {checkInResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20
              text-center text-sm font-[Outfit] text-orange-300"
          >
            🔥 רצף {checkInResult.streak} ימים! +{checkInResult.points} נקודות
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone badges */}
      <div className="flex items-center gap-2">
        {[7, 30, 100].map((milestone) => (
          <div
            key={milestone}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-[Outfit]
              border transition-all ${
              data.currentStreak >= milestone
                ? "border-orange-400/30 text-orange-400 bg-orange-500/10"
                : "border-white/5 text-white/20 bg-white/[0.02]"
            }`}
          >
            {milestone}🔥
          </div>
        ))}
      </div>

      {/* Missions */}
      <div>
        <h3 className="text-sm font-bold text-white/60 font-[Outfit] mb-3">
          📋 משימות פעילות
        </h3>
        <div className="space-y-2.5">
          {data.missions.map((mission) => (
            <MissionCard
              key={mission.missionId}
              mission={mission}
              onClaim={handleClaim}
              isPending={isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

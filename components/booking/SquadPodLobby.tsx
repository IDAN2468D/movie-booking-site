"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, ShieldCheck, Sparkles } from "lucide-react";
import { createSquadPodAction } from "@/app/actions/squadPodActions";
import { SquadPodSession } from "@/lib/validations/squadPod";

interface SquadPodLobbyProps {
  movieTitle: string;
  movieId: number;
}

export function SquadPodLobby({ movieTitle, movieId }: SquadPodLobbyProps) {
  const [session, setSession] = useState<SquadPodSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreatePod = async () => {
    setLoading(true);
    const res = await createSquadPodAction(movieTitle, movieId);
    if (res.success && res.data) {
      setSession(res.data);
    }
    setLoading(false);
  };

  const handleCopyLink = () => {
    if (!session) return;
    navigator.clipboard.writeText(`${window.location.origin}/booking?podId=${session.podId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-6 bg-neutral-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" dir="rtl">
      {!session ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-outfit text-xl font-bold text-white mb-2">
            לובי צפייה קבוצתי (Squad Pod)
          </h3>
          <p className="text-sm text-white/60 mb-6">
            פתחו חדר צפייה משותף בלייב, בחרו מושבים יחד עם חברים וחלקו את התשלום בקופה בקלות.
          </p>
          <button
            onClick={handleCreatePod}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            {loading ? "יוצר חדר קבוצתי..." : "צור חדר קבוצתי חדש"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs text-cyan-400 font-mono font-bold">חדר פעיל: {session.podId}</span>
              <h4 className="font-outfit text-lg font-bold text-white">{session.title}</h4>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs text-white transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "הועתק!" : "שתף קישור"}
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 font-medium">חברי הלובי בחיבור לייב:</label>
            {session.members.map((member) => (
              <motion.div
                key={member.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{member.avatar}</span>
                  <span className="text-sm font-semibold text-white">{member.name}</span>
                  {member.isHost && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      מארח
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    מושב: {member.selectedSeat || "בוחר..."}
                  </span>
                  {member.paidStatus ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> שולם
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-medium">ממתין לתשלום</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

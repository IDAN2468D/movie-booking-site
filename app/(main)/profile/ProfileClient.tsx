"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { MemoryShard, BookingMemory } from "@/components/profile/MemoryShard";
import { getUserMemoriesAction } from "@/app/actions/memoryActions";
import SettingsMatrix from "@/components/settings/SettingsMatrix";
import ProfileTicketCard from "@/components/profile/ProfileTicketCard";
import CineStatsContainer from "@/components/profile/CineStatsContainer";
import { ExternalSyncSettings } from "@/components/profile/ExternalSyncSettings";

interface ProfileClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeTickets: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeMatches: any[];
}

type TabType = "active" | "stats" | "matches" | "history" | "settings";

export default function ProfileClient({ activeTickets, history, activeMatches }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [memories, setMemories] = useState<BookingMemory[] | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (activeTab === "history" && !memories && session?.user?.id) {
      getUserMemoriesAction(session.user.id).then((res: { success: boolean; data?: BookingMemory[] }) => {
        if (res.success && res.data) {
          setMemories(res.data);
        } else {
          setMemories([]);
        }
      });
    }
  }, [activeTab, session?.user?.id, memories]);

  const tabs = [
    { id: "active", label: "כרטיסים פעילים", count: activeTickets.length },
    { id: "stats", label: "סטטיסטיקות ותגים 🏆", count: "" },
    { id: "matches", label: "התאמות", count: activeMatches.length },
    { id: "history", label: "היסטוריה", count: history.length },
    { id: "settings", label: "הגדרות", count: "" },
  ] as const;

  return (
    <div className="w-full relative" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-3 md:gap-4 mb-8 border-b border-white/10 pb-4 relative z-20 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`relative px-5 py-2.5 rounded-2xl font-['Outfit'] font-bold text-sm md:text-base transition-colors shrink-0 ${
              activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white/10 border border-white/20 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.label}
              {tab.count !== "" && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-violet-500 text-white" : "bg-white/10 text-white/50"}`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
            >
              {activeTickets.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm">
                  <div className="text-4xl mb-4 opacity-50">🎫</div>
                  <p className="text-white/50 font-['Inter'] text-lg">אין לך כרטיסים פעילים כרגע.</p>
                </div>
              ) : (
                activeTickets.map((ticket) => (
                  <ProfileTicketCard key={ticket._id} data={ticket} isActive />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CineStatsContainer />
            </motion.div>
          )}

          {activeTab === "matches" && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {activeMatches.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm">
                  <div className="text-4xl mb-4 opacity-50">✨</div>
                  <p className="text-white/50 font-['Inter'] text-lg">אין התאמות פעילות כרגע.</p>
                </div>
              ) : (
                activeMatches.map((match) => (
                  <div key={match._id} className="p-6 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-2">חדר: {match.roomCode}</h3>
                    <p className="text-emerald-400">התאמה קוונטית! ✨</p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {memories === null ? (
                <div className="col-span-full py-10 flex justify-center text-cyan-400">טוען זיכרונות קולנועיים...</div>
              ) : memories.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm">
                  <div className="text-4xl mb-4 opacity-50">🎞️</div>
                  <p className="text-white/50 font-['Inter'] text-lg">אין זיכרונות קולנועיים עדיין.</p>
                </div>
              ) : (
                memories.map((memory) => (
                  <MemoryShard key={memory.id} booking={memory} />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <ExternalSyncSettings userId={session?.user?.id || 'default_user'} />
              <SettingsMatrix userEmail={session?.user?.email || "user@example.com"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

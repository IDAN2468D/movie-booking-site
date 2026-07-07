"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActiveTicketCountdown from "@/components/booking/ActiveTicketCountdown";
import SettingsMatrix from "@/components/settings/SettingsMatrix";

interface ProfileClientProps {
  activeTickets: any[];
  history: any[];
  activeMatches: any[];
}

export default function ProfileClient({ activeTickets, history, activeMatches }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"active" | "matches" | "history" | "settings">("active");

  const tabs = [
    { id: "active", label: "כרטיסים פעילים", count: activeTickets.length },
    { id: "matches", label: "התאמות", count: activeMatches.length },
    { id: "history", label: "היסטוריה", count: history.length },
    { id: "settings", label: "הגדרות", count: "" }
  ] as const;

  return (
    <div className="w-full relative" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 relative z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-6 py-3 rounded-2xl font-['Outfit'] font-bold text-lg transition-colors ${
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
                <EmptyState message="אין לך כרטיסים פעילים כרגע." />
              ) : (
                activeTickets.map(ticket => (
                  <TicketCard key={ticket._id} data={ticket} isActive />
                ))
              )}
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
                <EmptyState message="אין התאמות פעילות כרגע." />
              ) : (
                activeMatches.map(match => (
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
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
            >
              {history.length === 0 ? (
                <EmptyState message="אין היסטוריית הזמנות." />
              ) : (
                history.map(ticket => (
                  <TicketCard key={ticket._id} data={ticket} />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <SettingsMatrix key="settings" userEmail="user@example.com" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TicketCard({ data, isActive = false }: { data: any, isActive?: boolean }) {
  let showtimeStr = data.showtimeDate || data.showtimeAt;
  
  if (!showtimeStr && data.showtime) {
    const [hours, minutes] = data.showtime.split(':');
    const d = new Date();
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    // If the time has already passed today, set it to tomorrow
    if (d.getTime() <= Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    showtimeStr = d.toISOString();
  } else if (!showtimeStr) {
    showtimeStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours fallback
  }
  
  return (
    <div className="relative p-8 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_0_30px_rgba(255,255,255,0.05)] overflow-hidden group">
      {isActive && (
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/10 to-transparent blur-[50px] pointer-events-none group-hover:from-violet-500/20 transition-colors duration-700" />
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-['Inter'] text-violet-300 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-400/20">
              {isActive ? 'פעיל' : 'היסטוריה'}
            </span>
            <h3 className="text-2xl font-['Outfit'] font-black text-white mt-4">{data.movieTitle || 'סרט'}</h3>
          </div>
          <div className="text-left font-['Outfit']">
            <div className="text-sm text-white/50">מושבים</div>
            <div className="text-lg font-bold text-white">
              {data.seats?.join(', ') || 'N/A'}
            </div>
          </div>
        </div>
        
        {isActive && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-sm font-['Inter'] text-white/40 mb-4 uppercase tracking-widest">זמן נותר להקרנה</p>
            <ActiveTicketCountdown showtime={showtimeStr} />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm">
      <div className="text-4xl mb-4 opacity-50">🎫</div>
      <p className="text-white/50 font-['Inter'] text-lg">{message}</p>
    </div>
  );
}

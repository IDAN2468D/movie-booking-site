"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ActivityHistory } from "@/components/rewards/ActivityHistory";
import { MovieCraftGame } from "@/components/rewards/MovieCraftGame";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

interface Activity {
  movie: string;
  date: string;
  points: number;
}

export function CombinedRewardsSection() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    // If no session, wait a frame and stop loading
    if (!session) {
      requestAnimationFrame(() => setIsLoading(false));
      return;
    }
    
    const fetchData = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12 pb-20 relative z-10"
      >
        {/* Activity History on the side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <ActivityHistory 
            bookings={bookings} 
            isLoading={isLoading} 
            onShowFull={() => setShowFullHistory(true)} 
          />
        </motion.div>

        {/* MovieCraft Game in the main area */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-8"
        >
          <MovieCraftGame />
        </motion.div>
        
      </motion.div>

      {/* Full Activity History Overlay Modal */}
      <AnimatePresence>
        {showFullHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setShowFullHistory(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg h-[500px] flex flex-col backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-[#05070B]/90 border border-white/[0.12] rounded-3xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),_0_0_40px_rgba(0,240,255,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-white font-['Outfit']">היסטוריית פעילות מלאה</h3>
                <button
                  onClick={() => setShowFullHistory(false)}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Zap size={32} className="text-slate-700 mb-4" />
                    <p className="text-sm text-slate-500 font-medium">אין פעילות להצגה במערכת.</p>
                  </div>
                ) : (
                  bookings.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all flex-row group"
                    >
                      <div className="flex items-center gap-4 flex-row">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#00F0FF] transition-colors">
                          <Zap size={18} />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white font-bold">הזמנת סרט</p>
                          <p className="text-[11px] text-slate-500 font-medium">{activity.movie} • {activity.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#00F0FF] font-mono">+{activity.points}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

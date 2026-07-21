"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdgeNodeLoad } from "@/app/api/splinter-load/route";

interface SplinterData {
  timestamp: number;
  totalActiveRequests: number;
  predictedSpikePct: number;
  nodes: EdgeNodeLoad[];
}

export function SplinterNetworkVisualizer() {
  const [data, setData] = useState<SplinterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLoadData = async () => {
      try {
        const res = await fetch("/api/splinter-load");
        const json = await res.json();
        if (json.success && isMounted) {
          setData(json.data);
          setError(null);
        } else if (isMounted) {
          setError(json.error || "Failed to fetch splinter metrics");
        }
      } catch (err) {
        if (isMounted) setError("Network error accessing splinter matrix");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLoadData();
    const interval = setInterval(fetchLoadData, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusBadge = (status: EdgeNodeLoad["status"]) => {
    switch (status) {
      case "critical":
        return { text: "עומס קריטי", color: "bg-red-500/20 text-red-300 border-red-500/40" };
      case "warning":
        return { text: "עומס בינוני", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
      default:
        return { text: "תקין - רשת קוונטית", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    }
  };

  if (loading && !data) {
    return (
      <div className="w-full p-8 rounded-3xl backdrop-blur-[40px] bg-neutral-950/40 border border-white/[0.12] text-center text-white/60 animate-pulse font-inter">
        מתחבר לרשת שרתי ה-Edge...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full p-6 rounded-3xl bg-red-950/30 border border-red-500/30 text-red-300 font-inter text-center">
        {error}
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full p-8 rounded-[32px] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-inter">
              Edge Splinter Engine v8.0
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-outfit mt-1">
            אלגוריתם פיצול עומסים חיזוי (Predictive Splintering)
          </h2>
        </div>

        {data && (
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-5 py-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-white/50 block font-inter uppercase">בקשות פעילות ברשת</span>
              <span className="text-xl font-bold font-outfit text-white">
                {data.totalActiveRequests.toLocaleString()} req/s
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] text-white/50 block font-inter uppercase">חיזוי זינוק ביקושים</span>
              <span className="text-xl font-bold font-outfit text-amber-400">
                +{data.predictedSpikePct}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nodes Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {data?.nodes.map((node) => {
            const badge = getStatusBadge(node.status);
            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all space-y-4 overflow-hidden group"
              >
                {/* Background Specular Glow */}
                <div 
                  className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity ${
                    node.status === "critical" ? "bg-red-500/20" : node.status === "warning" ? "bg-amber-500/20" : "bg-cyan-500/10"
                  }`} 
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white font-outfit">{node.region}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${badge.color} font-inter`}>
                    {badge.text}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/70 font-inter">
                    <span>ניצול קיבולת Edge</span>
                    <span className="font-bold font-outfit text-white">{node.capacityPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        node.capacityPct > 85 ? "bg-red-500" : node.capacityPct > 60 ? "bg-amber-400" : "bg-cyan-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${node.capacityPct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.05] text-xs font-inter">
                  <div>
                    <span className="text-white/40 text-[10px] block">עומס נוכחי</span>
                    <span className="text-white font-medium">{node.activeRequests} req</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] block">שחיקת שיהוי</span>
                    <span className="text-cyan-300 font-medium font-outfit">{node.latencyMs} ms</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudOff, RefreshCw, HardDriveDownload, CheckCircle2 } from "lucide-react";

export function OfflineSyncCylinder() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => setSwRegistered(true))
        .catch(console.error);

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          setIsSyncing(false);
          setSyncComplete(true);
          setTimeout(() => setSyncComplete(false), 5000);
        }
      });
    }
  }, []);

  const handleSync = () => {
    if (!swRegistered || !navigator.serviceWorker.controller) {
      alert("Service Worker אינו פעיל עדיין. נסה לרענן את העמוד.");
      return;
    }
    
    setIsSyncing(true);
    setSyncComplete(false);
    
    // Send message to SW to precache heavy media
    navigator.serviceWorker.controller.postMessage({
      type: 'PRECACHE_MEDIA',
      urls: [
        '/noise.png',
        '/api/health' 
      ]
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full overflow-hidden rounded-[3rem] bg-[#0A0A0A]/60 backdrop-blur-[40px] saturate-[200%] border border-white/[0.1] p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02),_0_20px_40px_rgba(0,0,0,0.5)] my-6"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0AEFFF]/20 via-transparent to-transparent" />
      
      {/* 3D Cylinder Visualizer */}
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        
        {/* The Liquid Cylinder */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 shadow-[inset_0_0_40px_rgba(0,255,255,0.1)] flex items-center justify-center overflow-hidden bg-black/50 shrink-0">
          <motion.div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#0AEFFF]/80 to-[#0AEFFF]/20"
            initial={{ height: "10%" }}
            animate={{ 
              height: isSyncing ? "90%" : syncComplete ? "100%" : "25%",
              filter: isSyncing ? "brightness(1.5) blur(5px)" : "brightness(1) blur(0px)"
            }}
            transition={{ duration: isSyncing ? 3 : 1, ease: "easeInOut" }}
          />
          {/* Waves */}
          {isSyncing && (
            <motion.div 
              className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
          <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            {syncComplete ? (
              <CheckCircle2 size={40} className="text-[#0AEFFF]" />
            ) : isSyncing ? (
              <RefreshCw size={40} className="animate-spin text-white/90" />
            ) : (
              <CloudOff size={40} className="text-white/50" />
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-right">
          <h3 className="text-2xl font-black text-white font-['Outfit'] mb-2 tracking-tight">
            Liquid Time Offline Sync
          </h3>
          <p className="text-white/60 font-['Inter'] text-sm mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
            הורד את הטריילרים והמפות האקוסטיות של הסרטים המועדפים עליך, וצפה בהם גם במצב טיסה או במקומות ללא קליטה (Zero-Reflow Offline).
          </p>

          <button 
            onClick={handleSync}
            disabled={isSyncing || syncComplete}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#0AEFFF]/20 to-transparent pointer-events-none blur-md" />
            <span className="text-white font-black uppercase tracking-[0.2em] text-xs font-['Outfit']">
              {isSyncing ? "מסנכרן נתונים..." : syncComplete ? "סונכרן בהצלחה!" : "הפעל סנכרון אופליין"}
            </span>
            <HardDriveDownload size={16} className={`text-[#0AEFFF] ${isSyncing ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

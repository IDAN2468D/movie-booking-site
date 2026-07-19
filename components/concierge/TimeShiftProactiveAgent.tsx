'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeShiftStore } from '@/lib/store/timeShiftStore';
import { rescheduleTicketAction } from '@/app/actions/rescheduleActions';
import { MapPin, Clock, X, AlertTriangle, ArrowRightCircle, RefreshCcw } from 'lucide-react';

export default function TimeShiftProactiveAgent() {
  const { trafficStatus, delayMinutes, route, activeTicketId, ticketTime, dismissAlert, isDismissed } = useTimeShiftStore();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-mount effect to check live traffic if a ticket is active
  const { startLiveTrafficPoll } = useTimeShiftStore();
  
  useEffect(() => {
    // In a real app, origin/dest would come from GPS/Ticket data
    if (activeTicketId && !trafficStatus && !isDismissed) {
      startLiveTrafficPoll('Tel Aviv, Israel', 'Cinema City Glilot');
      const interval = setInterval(() => {
        startLiveTrafficPoll('Tel Aviv, Israel', 'Cinema City Glilot');
      }, 5 * 60 * 1000); // Poll every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [activeTicketId, trafficStatus, startLiveTrafficPoll, isDismissed]);

  // Only show if traffic is HEAVY or SEVERE
  const shouldShow = (trafficStatus === 'HEAVY' || trafficStatus === 'SEVERE') && !isSuccess;

  const handleReschedule = async () => {
    if (!activeTicketId) return;
    setIsRescheduling(true);
    
    // Shift time by +2 hours
    const currentTicketDate = ticketTime ? new Date(ticketTime) : new Date();
    currentTicketDate.setHours(currentTicketDate.getHours() + 2);
    
    const res = await rescheduleTicketAction({
      ticketId: activeTicketId,
      newTime: currentTicketDate.toISOString()
    });

    setIsRescheduling(false);
    
    if (res.success) {
      setIsSuccess(true);
      // Automatically dismiss success message after 3 seconds
      setTimeout(() => {
        dismissAlert();
        setIsSuccess(false);
      }, 3000);
    } else {
      console.error(res.error);
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: -150, opacity: 0, scale: 0.95 }}
          animate={{ y: 24, opacity: 1, scale: 1 }}
          exit={{ y: -150, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          dir="rtl"
        >
          {/* Liquid Glass 4.0 Container */}
          <div className="pointer-events-auto w-full max-w-lg mx-4 overflow-hidden rounded-[24px] 
            backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40
            border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)]
            p-5 font-outfit"
          >
            {/* Header / Traffic Alert */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-wide text-white">
                    זיהוי עיכוב בדרך (Proactive Alert)
                  </h3>
                  <p className="text-sm font-inter text-red-200/80">
                    עיכוב של {delayMinutes} דקות - {route}
                  </p>
                </div>
              </div>
              <button 
                onClick={dismissAlert}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contextual Body */}
            <div className="mt-4 mb-5 text-white/80 font-inter text-sm leading-relaxed">
              נראה שאתה עלול לאחר לסרט שלך. הסוכן החכם שלנו ממליץ על דחיית הכרטיס להקרנה הבאה כדי למנוע לחץ מיותר.
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReschedule}
                disabled={isRescheduling}
                className="flex-1 relative overflow-hidden group rounded-xl p-[1px] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 h-11 bg-neutral-950/50 backdrop-blur-xl rounded-[11px] text-white font-medium hover:bg-neutral-950/30 transition-colors">
                  {isRescheduling ? (
                    <RefreshCcw className="w-4 h-4 animate-spin text-fuchsia-300" />
                  ) : (
                    <>
                      <ArrowRightCircle className="w-4 h-4 text-fuchsia-300" />
                      <span>דחה להקרנה הבאה (+שעתיים)</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Morph State */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-24 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full 
            backdrop-blur-[40px] saturate-[250%] bg-emerald-500/20 border border-emerald-500/40
            shadow-[0_0_30px_rgba(16,185,129,0.3)] text-emerald-100 font-outfit"
          >
            <Clock className="w-5 h-5" />
            <span>הכרטיס עודכן בהצלחה להקרנה הבאה!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

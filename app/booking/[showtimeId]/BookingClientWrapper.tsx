"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SeatMap from "@/components/booking/SeatMap";
import DigitalTicket from "@/components/booking/DigitalTicket";
import { CrowdHeatmapContainer } from "@/components/booking/CrowdHeatmapContainer";
import { SeatExchangeBoard } from "@/components/booking/SeatExchangeBoard";
import { CreditCard, RotateCcw, Ticket } from "lucide-react";

interface BookingClientWrapperProps {
  showtimeId: string;
  userId: string;
  occupiedSeats: string[];
}

export default function BookingClientWrapper({ showtimeId, userId, occupiedSeats }: BookingClientWrapperProps) {
  const [lockedSeat, setLockedSeat] = useState<string | null>(null);

  const handleSeatLocked = (seatId: string) => {
    setLockedSeat(seatId);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-[#05070B]" dir="rtl">
      <AnimatePresence mode="wait">
        {!lockedSeat ? (
          <motion.div
            key="seat-map"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-5xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                בחירת מושבים
              </h1>
              <p className="text-white/40 font-['Inter'] mt-2">אנא בחר מושב כדי להמשיך</p>
            </div>
            
            <div className="mb-8">
              <CrowdHeatmapContainer showtimeId={showtimeId} auditoriumId="auditorium-imax-1" />
            </div>

            <SeatMap 
              showtimeId={showtimeId} 
              userId={userId} 
              occupiedSeats={occupiedSeats} 
              onSeatLocked={handleSeatLocked}
            />

            <div className="mt-12">
              <SeatExchangeBoard showtimeId={showtimeId} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="digital-ticket"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="w-full max-w-md flex flex-col items-center gap-6"
          >
            <DigitalTicket
              movieTitle="Live Broadcast Premiere"
              showtime="היום, 21:00"
              seats={[lockedSeat]}
              qrPayload={`TICKET-${showtimeId}-${lockedSeat}-${userId}`}
            />

            {/* Next Step Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-amber-500 hover:brightness-110 text-white font-black text-center shadow-[0_15px_35px_rgba(139,92,246,0.4)] border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>המשך לתשלום וסיום הזמנה 💳</span>
              </Link>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setLockedSeat(null)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 font-bold text-xs border border-white/15 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>שינוי מושב</span>
                </button>

                <Link
                  href="/my-tickets"
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 font-bold text-xs border border-white/15 text-center transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>הכרטיסים שלי</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

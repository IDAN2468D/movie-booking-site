"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SeatMap from "@/components/booking/SeatMap";
import DigitalTicket from "@/components/booking/DigitalTicket";
import { CrowdHeatmapContainer } from "@/components/booking/CrowdHeatmapContainer";

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
          </motion.div>
        ) : (
          <motion.div
            key="digital-ticket"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="w-full max-w-md"
          >
            <DigitalTicket
              movieTitle="Live Broadcast Premiere"
              showtime="היום, 21:00"
              seats={[lockedSeat]}
              qrPayload={`TICKET-${showtimeId}-${lockedSeat}-${userId}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

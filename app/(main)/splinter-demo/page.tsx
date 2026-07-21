import React from 'react';
import QuantumTicket from '@/components/tickets/QuantumTicket';
import TicketSplinterCore from '@/components/tickets/TicketSplinterCore';
import { SplinterNetworkVisualizer } from '@/components/admin/SplinterNetworkVisualizer';

export default function SplinterDemoPage() {
  const dummyTicket = {
    id: "group-ticket-001",
    movie: "DUNE: PART TWO",
    date: "25 Oct 2026",
    time: "21:30",
    hall: "IMAX 3",
    seats: ["H10", "H11", "H12"],
    image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    active: true
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center overflow-hidden space-y-12">
      <div className="text-center z-50">
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter text-white">פיצול כרטיסים ועומסים חכם</h1>
        <p className="text-cyan-400 text-sm mt-2 font-black tracking-widest uppercase">גרור את כרטיסי האורחים מטה כדי לנתק ולשתף אותם</p>
      </div>

      <div className="relative w-full flex justify-center">
        <TicketSplinterCore parentTicketId={dummyTicket.id} splinterCount={3}>
          <QuantumTicket ticket={dummyTicket} state="qr" />
        </TicketSplinterCore>
      </div>

      <div className="w-full max-w-5xl px-4 pt-12">
        <SplinterNetworkVisualizer />
      </div>
    </div>
  );
}

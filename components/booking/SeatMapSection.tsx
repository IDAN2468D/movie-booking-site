'use client';

import React, { useEffect, useRef, useState } from 'react';
import SeatMap from '@/components/booking/SeatMap';
import SeatingRoulette from '@/components/booking/SeatingRoulette';
import { SpatialCinemaPortal360 } from '@/components/booking/SpatialCinemaPortal360';
import KineticTicketTransition from '@/components/fx/KineticTicketTransition';
import CurrencyCascade from '@/components/fx/CurrencyCascade';
import SeatHapticFeedback from '@/components/booking/SeatHapticFeedback';
import { SeatAcousticPreviewModal } from '@/components/booking/SeatAcousticPreviewModal';
import { useBookingStore } from '@/lib/store';
import { useRouletteStore } from '@/lib/store/rouletteStore';
import { Ticket, Headphones } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SeatMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);

  const kineticTicketVisible = useRouletteStore((state) => state.kineticTicketVisible);
  const showKineticTicket = useRouletteStore((state) => state.showKineticTicket);
  const winningSeatCoords = useRouletteStore((state) => state.winningSeatCoords);
  const winningSeatId = winningSeatCoords ? `${['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][winningSeatCoords.row]}${winningSeatCoords.col}` : null;

  const [realOccupiedSeats, setRealOccupiedSeats] = useState<string[]>([]);
  const [isAcousticModalOpen, setIsAcousticModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedMovie) return;
    async function fetchOccupied() {
      try {
        const queryParams = new URLSearchParams({
          movieId: String(selectedMovie!.id),
          showtime: selectedShowtime || '19:30',
          date: selectedDate || new Date().toLocaleDateString('he-IL'),
        });
        const res = await fetch(`/api/bookings?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.occupiedSeats) setRealOccupiedSeats(data.occupiedSeats);
        }
      } catch (err) {
        console.error('Failed to fetch occupied seats:', err);
      }
    }
    fetchOccupied();
  }, [selectedMovie, selectedShowtime, selectedDate]);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    const scrollerEl = document.querySelector('main');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { rotateX: 25, scale: 0.9, opacity: 0.8 },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: scrollerEl || undefined,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const showtimeId = selectedShowtime || 'st_demo_1';
  const userId = 'user_me';
  const mockOccupiedSeats = ['A3', 'A4', 'C7', 'C8', 'D10', 'E5'];

  const allRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const allCols = Array.from({ length: 12 }, (_, i) => i + 1);
  const totalOccupied = new Set([...mockOccupiedSeats, ...realOccupiedSeats]);

  const availableSeats: string[] = [];
  allRows.forEach((row) => {
    allCols.forEach((col) => {
      const seatId = `${row}${col}`;
      if (!totalOccupied.has(seatId)) availableSeats.push(seatId);
    });
  });

  const lastSeat = selectedSeats.length > 0 ? selectedSeats[selectedSeats.length - 1] : 'E-12';

  return (
    <div ref={sectionRef} className="w-full flex flex-col items-center justify-center my-12 relative px-4" dir="rtl">
      <div className="text-center mb-6 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-2">
          <Ticket size={14} />
          מפת מושבים דינמית
        </div>
        <h2 className="text-2xl font-bold font-outfit text-white">מפת המושבים באולם</h2>
        <p className="text-xs text-neutral-400">בחר את המקומות המועדפים עליך</p>
      </div>

      <div ref={containerRef} className="w-full max-w-lg origin-bottom transition-all duration-300 mb-10" style={{ transformStyle: 'preserve-3d' }}>
        <SeatMap
          showtimeId={showtimeId}
          userId={userId}
          occupiedSeats={[...mockOccupiedSeats, ...realOccupiedSeats]}
          onSeatLocked={(seatId) => toggleSeat(seatId)}
        />
      </div>

      <div className="w-full max-w-lg mb-8 flex flex-col items-center gap-4">
        <SeatHapticFeedback />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsAcousticModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-2xl shadow-lg transition-all"
          >
            <Headphones className="w-4 h-4" />
            <span>הפעל 3D Spatializer למושב {lastSeat}</span>
          </button>
        </div>
        <SpatialCinemaPortal360 seatId={lastSeat} />
      </div>

      <div className="w-full max-w-lg">
        <SeatingRoulette
          showtimeId={showtimeId}
          userId={userId}
          availableSeats={availableSeats}
          onSeatLocked={(seatId) => toggleSeat(seatId)}
        />
      </div>

      <KineticTicketTransition
        isOpen={kineticTicketVisible}
        onClose={() => showKineticTicket(false)}
        seatId={winningSeatId}
        showtimeId={showtimeId}
        movieTitle={selectedMovie?.title}
      />
      <CurrencyCascade />

      <SeatAcousticPreviewModal
        seatNumber={lastSeat}
        rowCategory={lastSeat.startsWith('A') || lastSeat.startsWith('B') ? 'VIP Prime Box' : 'שורה מרכזית standard'}
        isOpen={isAcousticModalOpen}
        onClose={() => setIsAcousticModalOpen(false)}
      />
    </div>
  );
}

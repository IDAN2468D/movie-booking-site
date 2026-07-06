'use client';

import React, { useEffect, useRef, useState } from 'react';
import SeatMap from '@/components/booking/SeatMap';
import SeatingRoulette from '@/components/booking/SeatingRoulette';
import KineticTicketTransition from '@/components/fx/KineticTicketTransition';
import CurrencyCascade from '@/components/fx/CurrencyCascade';
import { useBookingStore } from '@/lib/store';
import { useRouletteStore } from '@/lib/store/rouletteStore';
import { Ticket } from 'lucide-react';
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
  const winningSeatId = winningSeatCoords ? `${["A", "B", "C", "D", "E", "F", "G", "H"][winningSeatCoords.row]}${winningSeatCoords.col}` : null;

  const [realOccupiedSeats, setRealOccupiedSeats] = useState<string[]>([]);

  // Fetch occupied seats to accurately calculate available seats for the roulette
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
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      // 3D-like entry tilt and scale animation
      gsap.fromTo(
        containerRef.current,
        {
          transformPerspective: 1000,
          rotateX: 25,
          scale: 0.88,
          opacity: 0.6,
        },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: scrollerEl,
            start: 'top 90%',
            end: 'top 45%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mockOccupiedSeats = ['A6', 'C1', 'C2', 'E1', 'F2', 'G5', 'H1'];
  const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const allSeatIds = ROWS.flatMap(row => Array.from({ length: 6 }, (_, i) => `${row}${i + 1}`));
  const availableSeats = allSeatIds.filter(
    (id) => !mockOccupiedSeats.includes(id) && !realOccupiedSeats.includes(id) && !selectedSeats.includes(id)
  );

  const showtimeId = `${selectedMovie?.id || 'movie'}-${selectedShowtime || '19:30'}-${selectedDate || 'today'}`;
  const userId = 'user-roulette-session';

  return (
    <div
      ref={sectionRef}
      id="seat-selection-section"
      className="relative w-full py-16 px-6 bg-[#050505] flex flex-col items-center border-b border-white/5"
      dir="rtl"
    >
      <div className="max-w-xl w-full text-right mb-10">
        <div className="flex items-center gap-3 justify-start">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <Ticket className="text-primary w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight">
              בחירת מושבים באולם
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              בחר את המקומות המועדפים עליך
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full max-w-lg origin-bottom transition-all duration-300 mb-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <SeatMap 
          showtimeId={showtimeId} 
          userId={userId} 
          occupiedSeats={[...mockOccupiedSeats, ...realOccupiedSeats]} 
          onSeatLocked={(seatId) => toggleSeat(seatId)}
        />
      </div>

      {/* Lucky Seat Roulette Engine integration */}
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
      
      {/* Specular Currency Cascade Particle Overlay */}
      <CurrencyCascade />
    </div>
  );
}

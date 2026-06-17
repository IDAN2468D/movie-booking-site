'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import { CINEMA_BRANCHES } from '@/lib/constants';
import BookingHero from '@/components/booking/BookingHero';
import HorizontalShowtimes from '@/components/booking/HorizontalShowtimes';
import SeatMapSection from '@/components/booking/SeatMapSection';
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar';

type CinemaBranch = (typeof CINEMA_BRANCHES)[number] & { _id?: string };

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  
  // Zustand State - Strict Selectors
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const setSelectedBranchId = useBookingStore((state) => state.setSelectedBranchId);

  const [branch, setBranch] = useState<CinemaBranch | null>(null);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  // Sync branchId to store and fetch branch details
  useEffect(() => {
    async function loadBranch() {
      if (!params.branchId) return;
      setSelectedBranchId(params.branchId as string);

      const staticBranch = CINEMA_BRANCHES.find((b) => b.id === params.branchId);
      if (staticBranch) {
        setBranch(staticBranch);
        setLoading(false);
        return;
      }

      try {
        const { getCinemas } = await import('@/lib/actions/cinemas');
        const result = await getCinemas();
        if (result.success) {
          const found = (result.data as CinemaBranch[])?.find(
            (b) => b._id === params.branchId || b.id === params.branchId
          );
          if (found) setBranch(found);
        }
      } catch (err) {
        console.error('Failed to load branch details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBranch();
  }, [params.branchId, setSelectedBranchId]);

  // Recover movie details if state is lost (e.g. page refresh)
  useEffect(() => {
    async function loadMovie() {
      if (!params.movieId || selectedMovie) return;

      try {
        const { getMovieById } = await import('@/lib/tmdb');
        const movie = await getMovieById(Number(params.movieId));
        if (movie) {
          useBookingStore.getState().setSelectedMovie(movie);
        }
      } catch (err) {
        console.error('Failed to recover movie details:', err);
      }
    }

    loadMovie();
  }, [params.movieId, selectedMovie]);

  if (loading || !selectedMovie || !branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32" dir="rtl">
      {/* Navigation Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-6 px-6 md:px-12 flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        <Link href="/" className="hover:text-primary transition-colors">ראשי</Link>
        <ChevronRight size={12} className="rotate-180" />
        <Link href={`/movie/${selectedMovie.id}`} className="hover:text-primary transition-colors">
          {selectedMovie.displayTitle}
        </Link>
        <ChevronRight size={12} className="rotate-180" />
        <Link href="/branches" className="hover:text-primary transition-colors">בחר סניף</Link>
        <ChevronRight size={12} className="rotate-180" />
        <span className="text-white">בחירת מושבים</span>
      </div>

      {/* STAGE 1: Cinematic Booking Hero */}
      <BookingHero
        movie={selectedMovie}
        branchName={branch.name}
        selectedDate={selectedDate}
        selectedShowtime={selectedShowtime}
        heroRef={heroRef}
        posterRef={posterRef}
      />

      {/* STAGE 2: Pinned Horizontal Showtime Selection */}
      <HorizontalShowtimes />

      {/* STAGE 3 & 4: Seat Selection and Sticky Summary Sidebar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Seat selection takes 8 columns */}
        <div className="lg:col-span-8">
          <SeatMapSection />
        </div>
        
        {/* Booking summary sidebar takes 4 columns */}
        <div className="lg:col-span-4">
          <BookingSummarySidebar onCheckout={() => router.push('/checkout')} />
        </div>
      </div>
    </div>
  );
}

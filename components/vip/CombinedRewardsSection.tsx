"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ActivityHistory } from "@/components/rewards/ActivityHistory";
import { MovieCraftGame } from "@/components/rewards/MovieCraftGame";

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
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12 pb-20">
      
      {/* Activity History on the side */}
      <div className="lg:col-span-4">
        <ActivityHistory 
          bookings={bookings} 
          isLoading={isLoading} 
          onShowFull={() => setShowFullHistory(true)} 
        />
      </div>

      {/* MovieCraft Game in the main area */}
      <div className="lg:col-span-8">
        <MovieCraftGame />
      </div>
      
    </div>
  );
}

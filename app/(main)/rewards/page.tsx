'use client';

import React, { useEffect, useState } from 'react';
import { Gift, Star, Trophy, Zap, Sparkles, Popcorn, Ticket, Crown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { RewardCard } from '@/components/rewards/RewardCard';
import { RewardStats } from '@/components/rewards/RewardStats';
import { ActivityHistory } from '@/components/rewards/ActivityHistory';
import { RewardsModals } from '@/components/rewards/RewardsModals';

const REWARDS_DATA = [
  { id: 1, title: 'פופקורן גדול חינם', desc: 'קבל פופקורן גדול חינם בהזמנה הבאה שלך', points: 500, icon: Gift, color: 'text-orange-400' },
  { id: 2, title: 'שדרוג לטרקלין VIP', desc: 'חוויית צפייה פרימיום עם מושבים מרווחים ושירות אישי', points: 1200, icon: Trophy, color: 'text-yellow-400' },
  { id: 3, title: 'כרטיס שני חינם', desc: 'הזמן כרטיס אחד וקבל את השני במתנה', points: 2000, icon: Zap, color: 'text-purple-400' },
  { id: 4, title: 'הנחה להקרנה פרטית', desc: 'הנחה של 30% על הקרנה פרטית באולם', points: 5000, icon: Star, color: 'text-blue-400' },
  { id: 5, title: 'שתייה גדולה חינם', desc: 'בחר שתייה גדולה מהמגוון שלנו ללא עלות', points: 300, icon: Sparkles, color: 'text-cyan-400' },
  { id: 6, title: 'כרטיס IMAX חינם', desc: 'כרטיס חינם להקרנת IMAX לבחירתך', points: 3500, icon: Ticket, color: 'text-red-400' },
  { id: 7, title: 'קומבו משפחתי', desc: 'פופקורן גדול + 4 שתיות + נאצ\'וס במחיר מיוחד', points: 800, icon: Popcorn, color: 'text-amber-400' },
  { id: 8, title: 'חברות פלטינום לשנה', desc: 'גישה בלעדית להקרנות בכורה, אולמות VIP והטבות שוטפות', points: 10000, icon: Crown, color: 'text-pink-400' },
];

interface Activity {
  movie: string;
  date: string;
  points: number;
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showAllRewards, setShowAllRewards] = useState(false);
  const [redeemedId, setRedeemedId] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setCurrentPoints(data.totalPoints || 0);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      requestAnimationFrame(() => setIsLoading(false));
      return;
    }
    
    const fetchData = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
          setCurrentPoints(data.totalPoints || 0);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div className="p-10 pb-20 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <RewardStats totalPoints={currentPoints} isLoading={isLoading} />

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4 flex-row">
              <h2 className="text-xl font-bold text-white tracking-tight">הטבות זמינות</h2>
              <button 
                onClick={() => setShowAllRewards(true)} 
                className="text-xs text-primary font-black hover:text-white transition-all tracking-widest uppercase px-6 py-3 bg-primary/10 rounded-full border border-primary/20 hover:border-primary/40"
              >
                קטלוג מלא
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REWARDS_DATA.slice(0, 4).map((reward) => (
                <RewardCard key={reward.id} {...reward} onClick={() => setShowAllRewards(true)} />
              ))}
            </div>
          </div>
        </div>

        <ActivityHistory 
          bookings={bookings} 
          isLoading={isLoading} 
          onShowFull={() => setShowFullHistory(true)} 
        />
      </div>

      <RewardsModals 
        mounted={mounted}
        showFullHistory={showFullHistory}
        setShowFullHistory={setShowFullHistory}
        showAllRewards={showAllRewards}
        setShowAllRewards={setShowAllRewards}
        bookings={bookings}
        rewards={REWARDS_DATA}
        totalPoints={currentPoints}
        redeemedId={redeemedId}
        setRedeemedId={(id) => {
          setRedeemedId(id);
          if (id) refreshData(); // Refresh points after redemption
        }}
      />
    </div>
  );
}

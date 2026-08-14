'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import {
  getUserCineStatsAction,
  UserCineStats,
} from '@/app/actions/cineStatsActions';
import CineStatsOverview from './CineStatsOverview';
import AchievementBadgesGrid from './AchievementBadgesGrid';

export function CineStatsContainer() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserCineStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (status === 'loading') return;
      setLoading(true);
      try {
        const res = await getUserCineStatsAction(
          session?.user?.id ? { userId: session.user.id } : undefined
        );
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load user cine stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [session?.user?.id, status]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5">
        <LoadingIndicator variant="orbit" size="lg" label="טוען סטטיסטיקות ותגי הישג..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center bg-white/[0.02] rounded-3xl border border-white/5 text-white/50 text-sm">
        לא נמצאו נתוני סטטיסטיקה למשתמש זה.
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full" dir="rtl">
      {/* Visual Stats Overview (KPIs + Genre Graph) */}
      <CineStatsOverview stats={stats} />

      {/* Achievement Badges Grid */}
      <AchievementBadgesGrid badges={stats.badges} />
    </div>
  );
}

export default CineStatsContainer;

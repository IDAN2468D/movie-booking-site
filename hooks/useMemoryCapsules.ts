'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MemoryCapsuleItem, MemoryReflection } from '@/lib/validations/memoryCapsule';
import { 
  getUserMemoryCapsulesAction, 
  saveMemoryReflectionAction, 
  createCustomMemoryCapsuleAction 
} from '@/app/actions/memoryActions';

export function useMemoryCapsules() {
  const { data: session } = useSession();
  const [capsules, setCapsules] = useState<MemoryCapsuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'reel' | 'grid'>('reel');
  const [isReversed, setIsReversed] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<MemoryCapsuleItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchCapsules = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUserMemoryCapsulesAction(session?.user?.email || undefined);
      if (res.success && res.data) {
        setCapsules(res.data);
      }
    } catch (err) {
      console.error('Failed to load memory capsules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchCapsules();
  }, [fetchCapsules]);

  const handleSaveReflection = async (reflection: MemoryReflection) => {
    try {
      const res = await saveMemoryReflectionAction(reflection, session?.user?.email || undefined);
      if (res.success) {
        setCapsules((prev) =>
          prev.map((c) => (c.id === reflection.capsuleId ? { ...c, reflection } : c))
        );
        if (selectedCapsule?.id === reflection.capsuleId) {
          setSelectedCapsule((prev) => (prev ? { ...prev, reflection } : null));
        }
      }
      return res;
    } catch (err) {
      return { success: false, error: 'שגיאה בשמירת הרשמים' };
    }
  };

  const handleCreateCapsule = async (payload: Partial<MemoryCapsuleItem>) => {
    try {
      const res = await createCustomMemoryCapsuleAction(payload, session?.user?.email || undefined);
      if (res.success && res.data) {
        setCapsules((prev) => [res.data!, ...prev]);
        setIsCreateOpen(false);
      }
      return res;
    } catch (err) {
      return { success: false, error: 'שגיאה ביצירת הקפסולה' };
    }
  };

  const genres = useMemo(() => {
    const set = new Set<string>();
    capsules.forEach((c) => { if (c.genre) set.add(c.genre); });
    return ['all', ...Array.from(set)];
  }, [capsules]);

  const filteredCapsules = useMemo(() => {
    let list = capsules.filter((c) => {
      const matchSearch = c.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.iconicQuote.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGenre = selectedGenre === 'all' || c.genre === selectedGenre;
      return matchSearch && matchGenre;
    });

    return isReversed ? [...list].reverse() : list;
  }, [capsules, searchQuery, selectedGenre, isReversed]);

  const stats = useMemo(() => {
    const totalHours = capsules.length * 2.5;
    const topGenre = capsules.length > 0 ? capsules[0].genre : 'מד״ב';
    const totalReflections = capsules.filter((c) => c.reflection?.personalNote).length;
    return { totalHours, topGenre, totalReflections, totalCapsules: capsules.length };
  }, [capsules]);

  return {
    capsules: filteredCapsules,
    rawCount: capsules.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    viewMode,
    setViewMode,
    isReversed,
    setIsReversed,
    selectedCapsule,
    setSelectedCapsule,
    isCreateOpen,
    setIsCreateOpen,
    handleSaveReflection,
    handleCreateCapsule,
    stats,
  };
}

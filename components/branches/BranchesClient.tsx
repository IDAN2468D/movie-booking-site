'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Search, Coffee, Car, Wifi, Accessibility, CreditCard, ShieldCheck
} from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { BranchCard } from './BranchCard';
import { BranchFilters } from './BranchFilters';
import { Cinema } from '@/lib/actions/cinemas';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const facilityIcons: Record<string, { icon: React.ElementType, label: string }> = {
  parking: { icon: Car, label: 'חנייה חינם' },
  accessibility: { icon: Accessibility, label: 'נגישות מלאה' },
  cafe: { icon: Coffee, label: 'בית קפה' },
  wifi: { icon: Wifi, label: 'Wi-Fi חופשי' },
  'vip-lounge': { icon: CreditCard, label: 'טרקלין VIP' },
};

const regions: Record<string, string> = {
  all: 'כל הארץ',
  center: 'מרכז',
  north: 'צפון',
  south: 'דרום',
  jerusalem: 'ירושלים',
};

export default function BranchesClient({ initialBranches }: { initialBranches: Cinema[] }) {
  const { location, setLocation, selectedMovie, setSelectedBranchId } = useBookingStore();
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moviebook_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        console.error('Failed to parse favorites');
      }
    }
  }, []);

  const toggleFavorite = (branchId: string) => {
    const newFavorites = favorites.includes(branchId)
      ? favorites.filter(id => id !== branchId)
      : [...favorites, branchId];
    setFavorites(newFavorites);
    localStorage.setItem('moviebook_favorites', JSON.stringify(newFavorites));
  };

  const handleGetLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("דפדפן זה אינו תומך ב-GPS");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setError("לא הצלחנו לקבל את המיקום שלך");
        setIsLocating(false);
      }
    );
  }, []);

  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  const isBranchOpen = (hours: string) => {
    try {
      const [start, end] = hours.split(' - ');
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = start.split(':').map(Number);
      const st = sh * 60 + sm;
      const [eh, em] = end.split(':').map(Number);
      let et = eh * 60 + em;
      if (et < st) et += 24 * 60;
      return currentTime >= st && currentTime <= et;
    } catch { return true; }
  };

  const filteredBranches = initialBranches.filter(branch => {
    const matchesSearch = 
      (branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || 
      (branch.city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (branch.address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFacility = !selectedFacility || branch.facilities?.includes(selectedFacility);
    const matchesRegion = selectedRegion === 'all' || branch.region === selectedRegion;
    const matchesFavorite = !showOnlyFavorites || favorites.includes(branch._id);
    return matchesSearch && matchesFacility && matchesRegion && matchesFavorite;
  });

  const sortedBranches = userCoords 
    ? [...filteredBranches].sort((a, b) => {
        const dA = calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
        const dB = calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
        return dA - dB;
      })
    : filteredBranches;

  console.log('[DEBUG] BranchesClient render:', {
    total: initialBranches.length,
    filtered: filteredBranches.length,
    selectedMovie: selectedMovie?.title
  });

  const allFacilities = Array.from(new Set(initialBranches.flatMap(b => b.facilities || [])));

  return (
    <div className="max-w-7xl mx-auto relative z-10 py-10 px-4">
      <BranchFilters 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        showOnlyFavorites={showOnlyFavorites} setShowOnlyFavorites={setShowOnlyFavorites}
        selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
        selectedFacility={selectedFacility} setSelectedFacility={setSelectedFacility}
        regions={regions} allFacilities={allFacilities} facilityIcons={facilityIcons}
        userCoords={userCoords} isLocating={isLocating} onRefreshLocation={handleGetLocation}
      />

      {error && (
        <div className="mb-12 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-right">
          <span className="font-bold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {sortedBranches.map((branch, index) => (
            <BranchCard 
              key={branch._id}
              branch={branch}
              isSelected={location === `${branch.name}, ישראל`}
              isFav={favorites.includes(branch._id)}
              isOpen={isBranchOpen(branch.hours)}
              distance={userCoords ? calculateDistance(userCoords.lat, userCoords.lng, branch.lat, branch.lng).toFixed(1) : null}
              selectedMovie={selectedMovie}
              onToggleFav={toggleFavorite}
              onSetLocation={setLocation}
              onSetSelectedBranch={setSelectedBranchId}
              facilityIcons={facilityIcons}
            />
          ))}
        </AnimatePresence>
      </div>

      {sortedBranches.length === 0 && (
        <div className="text-center py-32">
          <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white mb-2">לא נמצאו סניפים</h3>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSelectedFacility(null); setShowOnlyFavorites(false); }}
            className="mt-8 px-8 py-3 rounded-xl bg-white/5 text-primary font-black text-xs"
          >
            איפוס פילטרים
          </button>
        </div>
      )}

      <footer className="mt-32 pb-10 border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dynamic Sync Active</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MongoDB Secured</span>
          </div>
        </div>
        <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">MovieBook Engine v3.0</p>
      </footer>
    </div>
  );
}

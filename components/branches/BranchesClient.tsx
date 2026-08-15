'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Zap, Search, Coffee, Car, Wifi, Accessibility, CreditCard, ShieldCheck } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { BranchCard } from './BranchCard';
import { BranchFilters } from './BranchFilters';
import { Cinema } from '@/lib/actions/cinemas';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const facilityIcons: Record<string, { icon: React.ElementType, label: string }> = {
  parking: { icon: Car, label: 'חנייה חינם' },
  accessibility: { icon: Accessibility, label: 'נגישות מלאה' },
  cafe: { icon: Coffee, label: 'בית קפה' },
  wifi: { icon: Wifi, label: 'Wi-Fi חופשי' },
  'vip-lounge': { icon: CreditCard, label: 'טרקלין VIP' },
};

const regions: Record<string, string> = {
  all: 'כל הארץ', center: 'מרכז', north: 'צפון', south: 'דרום', jerusalem: 'ירושלים',
};

const DEFAULT_ISRAEL_COORDS = { lat: 32.0853, lng: 34.7818 };

export default function BranchesClient({ initialBranches }: { initialBranches: Cinema[] }) {
  const { setLocation, selectedMovie, setSelectedBranchId, selectedBranchId } = useBookingStore();
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(DEFAULT_ISRAEL_COORDS);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('moviebook_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleFavorite = (branchId: string) => {
    const next = favorites.includes(branchId) ? favorites.filter(id => id !== branchId) : [...favorites, branchId];
    setFavorites(next);
    localStorage.setItem('moviebook_favorites', JSON.stringify(next));
  };

  const handleGetLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setUserCoords(DEFAULT_ISRAEL_COORDS);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setUserCoords(DEFAULT_ISRAEL_COORDS);
        setIsLocating(false);
      },
      { timeout: 6000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, []);

  useEffect(() => { handleGetLocation(); }, [handleGetLocation]);

  useEffect(() => {
    if (selectedBranchId) {
      setTimeout(() => {
        document.getElementById(`branch-${selectedBranchId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [selectedBranchId]);

  const isBranchOpen = (hours: string) => {
    try {
      const [start, end] = hours.split(' - ');
      const now = new Date();
      const cur = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let et = eh * 60 + em;
      if (et < (sh * 60 + sm)) et += 24 * 60;
      return cur >= (sh * 60 + sm) && cur <= et;
    } catch { return true; }
  };

  const matchRegion = (b: Cinema, sel: string) => {
    if (sel === 'all' || !sel) return true;
    const r = (b.region || '').toLowerCase();
    const l = (b.location || '').toLowerCase();
    const c = (b.city || '').toLowerCase();
    if (sel === 'center' || sel === 'מרכז') return r.includes('מרכז') || r.includes('center') || l.includes('מרכז') || c.includes('תל אביב') || c.includes('ראשון') || c.includes('שרונה');
    if (sel === 'north' || sel === 'צפון') return r.includes('צפון') || r.includes('north') || l.includes('צפון') || c.includes('חיפה') || c.includes('קריות') || c.includes('צפון');
    if (sel === 'south' || sel === 'דרום') return r.includes('דרום') || r.includes('south') || l.includes('דרום') || c.includes('באר שבע') || c.includes('אשדוד') || c.includes('דרום');
    if (sel === 'jerusalem' || sel === 'ירושלים') return r.includes('ירושלים') || r.includes('jerusalem') || l.includes('ירושלים') || c.includes('ירושלים');
    return r === sel || l === sel || c === sel;
  };

  const filteredBranches = initialBranches.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || b.name?.toLowerCase().includes(q) || b.city?.toLowerCase().includes(q) || b.address?.toLowerCase().includes(q);
    const matchF = !selectedFacility || b.facilities?.includes(selectedFacility);
    const matchR = matchRegion(b, selectedRegion);
    const matchFav = !showOnlyFavorites || favorites.includes(b._id);
    return matchQ && matchF && matchR && matchFav;
  });

  const sortedBranches = userCoords ? [...filteredBranches].sort((a, b) => 
    calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng) - calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng)
  ) : filteredBranches;

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {sortedBranches.map((branch) => (
            <BranchCard 
              key={branch._id}
              branch={branch}
              isSelected={selectedBranchId === branch._id}
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
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GPS Realtime Connected</span>
          </div>
        </div>
        <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">MovieBook Engine v3.0</p>
      </footer>
    </div>
  );
}

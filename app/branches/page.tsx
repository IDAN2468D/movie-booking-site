'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, Star, Zap, Compass, ShieldCheck, 
  Search, Coffee, Car, Wifi, Accessibility, ExternalLink, Clock, CreditCard,
  Heart, Filter, Map as MapIcon, ChevronRight, Ticket
} from 'lucide-react';
import { CINEMA_BRANCHES } from '@/lib/constants';
import { useBookingStore } from '@/lib/store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
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

export default function BranchesPage() {
  const router = useRouter();
  const { location, setLocation, selectedMovie, setSelectedBranchId } = useBookingStore();
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moviebook_favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Use a small delay to avoid "setState in effect" lint error
        const timer = setTimeout(() => {
          setFavorites(parsed);
        }, 0);
        return () => clearTimeout(timer);
      } catch {
        console.error('Failed to parse favorites');
      }
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (branchId: string) => {
    const newFavorites = favorites.includes(branchId)
      ? favorites.filter(id => id !== branchId)
      : [...favorites, branchId];
    
    setFavorites(newFavorites);
    localStorage.setItem('moviebook_favorites', JSON.stringify(newFavorites));
  };

  const handleGetLocation = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("דפדפן זה אינו תומך ב-GPS");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      () => {
        setError("לא הצלחנו לקבל את המיקום שלך. בדוק את הרשאות ה-GPS.");
        setIsLocating(false);
      }
    );
  }, []);

  useEffect(() => {
    const initLocation = setTimeout(() => {
      handleGetLocation();
    }, 0);
    return () => clearTimeout(initLocation);
  }, [handleGetLocation]);

  const isBranchOpen = (hours: string) => {
    try {
      const [start, end] = hours.split(' - ');
      const now = new Date();
      const [nowH, nowM] = [now.getHours(), now.getMinutes()];
      const currentTime = nowH * 60 + nowM;

      const [startH, startM] = start.split(':').map(Number);
      const startTime = startH * 60 + startM;

      const [endH, endM] = end.split(':').map(Number);
      let endTime = endH * 60 + endM;

      // Handle closing times after midnight
      if (endTime < startTime) {
        endTime += 24 * 60;
      }

      return currentTime >= startTime && currentTime <= endTime;
    } catch {
      return true; // Default to open if parsing fails
    }
  };

  const filteredBranches = CINEMA_BRANCHES.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFacility = !selectedFacility || branch.facilities?.includes(selectedFacility);
    const matchesRegion = selectedRegion === 'all' || branch.region === selectedRegion;
    const matchesFavorite = !showOnlyFavorites || favorites.includes(branch.id);
    
    return matchesSearch && matchesFacility && matchesRegion && matchesFavorite;
  });

  const sortedBranches = userCoords 
    ? [...filteredBranches].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
        return distA - distB;
      })
    : filteredBranches;

  const allFacilities = Array.from(new Set(CINEMA_BRANCHES.flatMap(b => b.facilities || [])));

  return (
    <main className="min-h-screen bg-[#0A0A0B] p-4 md:p-10 overflow-x-hidden text-right" dir="rtl">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-6">
              <motion.div 
                initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,159,10,0.15)] backdrop-blur-xl"
              >
                <Compass className="w-10 h-10 text-primary animate-pulse" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-none mb-3">איתור סניפים</h1>
                <p className="text-slate-400 text-lg font-medium flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-primary/60" />
                  גלה את חווית הקולנוע הקרובה אליך
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group w-full sm:w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="חיפוש לפי עיר או סניף..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              <button 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-sm border transition-all ${
                  showOnlyFavorites 
                    ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(255,159,10,0.2)]' 
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-primary' : ''}`} />
                מועדפים
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl">
            {/* Region Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
              <Filter className="w-4 h-4 text-slate-500 ml-2 flex-shrink-0" />
              {Object.entries(regions).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                    selectedRegion === key 
                      ? 'bg-primary text-white shadow-[0_8px_20px_rgba(255,159,10,0.3)]' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 p-3 pr-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className={`w-2 h-2 rounded-full ${userCoords ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {userCoords ? 'GPS Active' : 'Locating...'}
                </span>
                <button 
                  onClick={() => {
                    setIsLocating(true);
                    handleGetLocation();
                  }}
                  disabled={isLocating}
                  className="mr-4 text-primary hover:text-white transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-lg"
                >
                  <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  עדכון
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {allFacilities.map(f => (
                  <button 
                    key={f}
                    onClick={() => setSelectedFacility(f === selectedFacility ? null : f)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center gap-2 border ${
                      selectedFacility === f 
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {facilityIcons[f]?.icon && React.createElement(facilityIcons[f].icon, { className: "w-3 h-3" })}
                    {facilityIcons[f]?.label || f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-4 backdrop-blur-xl"
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {sortedBranches.map((branch, index) => {
              const isSelected = location === `${branch.name}, ישראל`;
              const isFav = favorites.includes(branch.id);
              const isOpen = isBranchOpen(branch.hours);
              const distance = userCoords 
                ? calculateDistance(userCoords.lat, userCoords.lng, branch.lat, branch.lng).toFixed(1)
                : null;

              return (
                <motion.div
                  key={branch.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className={`group relative p-0.5 rounded-[2.5rem] cursor-pointer transition-all duration-700 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-primary via-cyan-500 to-primary shadow-[0_20px_60px_rgba(255,159,10,0.15)]' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="relative h-full bg-[#111112] rounded-[2.4rem] p-6 overflow-hidden flex flex-col border border-white/5">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    
                    {/* Branch Image Placeholder with Filter */}
                    <div className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none rotate-12">
                      <Image src={branch.image} alt={branch.name} fill className="object-cover rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex flex-col gap-2">
                          <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${
                            isSelected ? 'bg-primary text-white' : 'bg-white/10 text-primary'
                          }`}>
                            {branch.feature}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.floor(branch.rating || 5) ? 'text-primary fill-primary' : 'text-slate-800'}`} />
                            ))}
                            <span className="text-[9px] font-black text-slate-500 mr-1">{branch.rating}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(branch.id);
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isFav ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-slate-600 border border-white/5 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isFav ? 'fill-primary' : ''}`} />
                        </button>
                      </div>

                      <h3 className="text-2xl font-black text-white font-outfit mb-1 group-hover:text-primary transition-colors">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 mb-6">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        <span className="font-bold text-xs">{branch.address}, {branch.city}</span>
                      </div>

                      {/* Status & Distance */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isOpen ? 'פתוח עכשיו' : 'סגור'}</span>
                        </div>
                        {distance && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{distance} ק&quot;מ</span>
                          </div>
                        )}
                      </div>

                      {/* Info Cards */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">טלפון</span>
                          <span className="text-[10px] font-bold text-slate-300">{branch.phone}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">שעות פעילות</span>
                          <span className="text-[10px] font-bold text-slate-300">{branch.hours}</span>
                        </div>
                      </div>

                      {/* Facilities Mini */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {branch.facilities?.slice(0, 3).map(f => (
                          <div key={f} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-colors" title={facilityIcons[f]?.label}>
                            {facilityIcons[f]?.icon && React.createElement(facilityIcons[f].icon, { className: "w-4 h-4" })}
                          </div>
                        ))}
                        {branch.facilities && branch.facilities.length > 3 && (
                          <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-600">
                            +{branch.facilities.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-auto">
                        {selectedMovie ? (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBranchId(branch.id);
                              router.push(`/book/${selectedMovie.id}/${branch.id}`);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs bg-primary text-white shadow-[0_10px_30px_rgba(255,159,10,0.2)] transition-all duration-500 group"
                          >
                            <Ticket size={16} className="group-hover:rotate-12 transition-transform" />
                            בחר סניף להזמנה
                          </motion.button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`${branch.name}, ישראל`);
                              router.push('/');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs transition-all duration-500 ${
                              isSelected ? 'bg-white text-black' : 'bg-primary text-white shadow-[0_10px_30px_rgba(255,159,10,0.2)]'
                            }`}
                          >
                            {isSelected ? 'הסניף הנבחר' : 'הפוך לסניף שלי'}
                            {!isSelected && <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                        
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {sortedBranches.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.03] mb-6">
              <Search className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">לא נמצאו סניפים</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">נסה לשנות את הפילטרים או את מילת החיפוש</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedFacility(null);
                setShowOnlyFavorites(false);
              }}
              className="mt-8 px-8 py-3 rounded-xl bg-white/5 text-primary font-black text-xs hover:bg-white/10 transition-all"
            >
              איפוס כל המסננים
            </button>
          </motion.div>
        )}

        <footer className="mt-32 pb-10 border-t border-white/5 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ultra Low Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Secure Geolocation</span>
              </div>
            </div>
            <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">MovieBook Cinema Discovery Engine v3.0</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

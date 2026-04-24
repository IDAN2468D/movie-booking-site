'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Zap, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
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

export default function BranchesPage() {
  const router = useRouter();
  const { location, setLocation } = useBookingStore();
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const sortedBranches = userCoords 
    ? [...CINEMA_BRANCHES].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
        return distA - distB;
      })
    : CINEMA_BRANCHES;

  return (
    <main className="min-h-screen bg-background p-10 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(255,159,10,0.2)]"
            >
              <Compass className="w-8 h-8 text-primary animate-pulse" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black text-white font-outfit tracking-tighter leading-none mb-2">איתור סניפים</h1>
              <p className="text-slate-400 text-lg font-medium">חוויה קולנועית בהתאמה אישית למיקומך</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-8 p-6 rounded-[32px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 w-fit">
            <div className={`w-3 h-3 rounded-full ${userCoords ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-sm font-black text-white uppercase tracking-widest">
              {userCoords ? 'GPS מחובר' : 'ממתין למיקום...'}
            </span>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button 
              onClick={() => {
                setIsLocating(true);
                handleGetLocation();
              }}
              disabled={isLocating}
              className="text-primary hover:text-white transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              עדכון מיקום
            </button>
          </div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-4"
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedBranches.map((branch, index) => {
            const isSelected = location === `${branch.name}, ישראל`;
            const distance = userCoords 
              ? calculateDistance(userCoords.lat, userCoords.lng, branch.lat, branch.lng).toFixed(1)
              : null;

            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setLocation(`${branch.name}, ישראל`);
                  router.push('/');
                }}
                className={`group relative p-1 rounded-[40px] cursor-pointer transition-all duration-700 ${
                  isSelected ? 'bg-gradient-to-br from-primary to-cyan-500' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="relative h-full bg-[#1A1A1A] rounded-[38px] p-8 overflow-hidden">
                  {/* Branch Image Background */}
                  <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                    <Image src={branch.image} alt={branch.name} fill className="object-cover grayscale" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isSelected ? 'bg-primary text-white' : 'bg-white/5 text-slate-400'
                      }`}>
                        {branch.feature}
                      </div>
                      {distance && (
                        <div className="flex items-center gap-1.5 text-primary">
                          <Navigation className="w-3.5 h-3.5" />
                          <span className="font-black text-sm">{distance} {'ק"מ'} ממך</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-3xl font-black text-white font-outfit mb-2 group-hover:translate-x-2 transition-transform duration-500">
                      {branch.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 mb-8">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{branch.address}, {branch.city}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isSelected ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:bg-primary/20 group-hover:text-primary'
                      }`}>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-6 right-6">
                      <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
                      <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(255,159,10,0.8)]" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-4">MovieBook Advanced Infrastructure</p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">רינדור 4K מלא</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">אבטחת GPS מוצפנת</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

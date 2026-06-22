'use client';

import React, { useState, useEffect } from 'react';
import { useCineSyncStore } from '@/lib/store/cinesyncStore';
import { useBookingStore } from '@/lib/store';
import { Users, LogOut, CheckCircle2, Circle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CineSyncInviteButton from './CineSyncInviteButton';

export default function CineSyncDashboard() {
  const {
    activeRoomId,
    myUserId,
    participants,
    isReady,
    isLoungeLoading,
    loungeError,
    createLounge,
    joinLounge,
    syncLounge,
    toggleReady,
    leaveLounge,
  } = useCineSyncStore();

  const { selectedMovie, selectedBranchId, selectedShowtime, selectedDate } = useBookingStore();
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Poll server for synchronization when in room
  useEffect(() => {
    if (!activeRoomId) return;

    // Start synchronization poll loop
    const interval = setInterval(() => {
      // Fetch latest mouse position from document/store if needed, or send current selection
      const currentSelectedSeats = useBookingStore.getState().selectedSeats;
      const mySeat = currentSelectedSeats.length > 0 ? currentSelectedSeats[0] : null;
      
      // We pass the last cursor coordinates from global state
      const cursorState = (window as any).__cinesync_cursor || { x: 0, y: 0 };
      syncLounge(cursorState.x, cursorState.y, mySeat);
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [activeRoomId, syncLounge]);

  // Handle URL lounge entry
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const loungeParam = urlParams.get('lounge');
      if (loungeParam && loungeParam !== activeRoomId && !isLoungeLoading) {
        joinLounge(loungeParam).then((success) => {
          if (success) {
            // Clean URL query param
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        });
      }
    }
  }, [joinLounge, activeRoomId, isLoungeLoading]);

  const handleCreate = async () => {
    if (!selectedMovie || !selectedBranchId) return;
    await createLounge(
      selectedMovie,
      selectedBranchId,
      selectedShowtime || '19:30',
      selectedDate || new Date().toLocaleDateString('he-IL')
    );
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    await joinLounge(inviteCode.trim().toUpperCase());
    setIsJoining(false);
  };

  return (
    <div className="w-full text-right" dir="rtl">
      <AnimatePresence mode="wait">
        {!activeRoomId ? (
          <motion.div
            key="portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white font-outfit">תא צפייה משותף CineSync</h4>
                  <p className="text-[10px] font-bold text-slate-500">בחרו מושבים יחד בזמן אמת</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                הזמינו חברים לתא הזמנה וירטואלי. תוכלו לראות איפה העכבר שלהם זז, באיזה מושב הם נוגעים ולסנכרן את הכרטיסים במכה אחת.
              </p>

              {selectedMovie && selectedBranchId ? (
                <button
                  onClick={handleCreate}
                  disabled={isLoungeLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-black shadow-[0_10px_20px_rgba(255,159,10,0.15)] hover:shadow-[0_15px_30px_rgba(255,159,10,0.25)] hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoungeLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span>פתח חדר הזמנה קבוצתי</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center p-3 rounded-2xl bg-white/[0.01] border border-white/5 text-[10px] font-bold text-slate-500">
                  בחר סרט וסניף תחילה כדי לפתוח חדר
                </div>
              )}
            </div>

            {/* Join Lounge Section */}
            <form onSubmit={handleJoin} className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pr-1">הצטרפות לחדר קיים</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="הזן קוד חדר (לדוגמה: CS-AB12)"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs text-white bg-white/[0.02] border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono placeholder:text-slate-600 uppercase"
                />
                <button
                  type="submit"
                  disabled={isJoining || !inviteCode.trim()}
                  className="px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isJoining ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 text-slate-400 hover:text-white" />
                  )}
                </button>
              </div>
              {loungeError && (
                <p className="text-[10px] font-bold text-red-400 pr-1">{loungeError}</p>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="room"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden group shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">חדר CineSync פעיל</span>
                </div>
                <button
                  onClick={leaveLounge}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all active:scale-90"
                  title="עזוב חדר"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Room Share widget */}
              <div className="mb-6">
                <CineSyncInviteButton roomId={activeRoomId} />
              </div>

              {/* Participants list */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block pr-1">משתתפים בחדר ({participants.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {participants.map((p) => {
                    const isCurrentUser = p.userId === myUserId;
                    return (
                      <div
                        key={p.userId}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isCurrentUser
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-white/[0.01] border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                            {p.name.substring(0, 2)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {p.name} {isCurrentUser && <span className="text-[9px] font-black text-primary/80 mr-1">(אני)</span>}
                            </span>
                            {p.selectedSeat && (
                              <span className="text-[9px] font-black text-[#22D3EE]">כיסא נבחר: {p.selectedSeat.replace('s-', '')}</span>
                            )}
                          </div>
                        </div>

                        <div>
                          {p.isReady ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ready Trigger */}
              <button
                onClick={toggleReady}
                className={`w-full mt-6 py-3 px-4 rounded-2xl border font-black text-xs transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                  isReady
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:bg-green-500/20'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isReady ? 'אני מוכן!' : 'סמן כסיימתי לבחור'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

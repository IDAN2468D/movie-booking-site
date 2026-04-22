'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Gift, Star, Trophy, Zap, ArrowUpRight, TrendingUp, X, Loader2, Sparkles, Popcorn, Ticket, Crown, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

const rewards = [
  { id: 1, title: 'פופקורן גדול חינם', desc: 'קבל פופקורן גדול חינם בהזמנה הבאה שלך', points: 500, icon: Gift, color: 'text-orange-400' },
  { id: 2, title: 'שדרוג לטרקלין VIP', desc: 'חוויית צפייה פרימיום עם מושבים מרווחים ושירות אישי', points: 1200, icon: Trophy, color: 'text-yellow-400' },
  { id: 3, title: 'כרטיס שני חינם', desc: 'הזמן כרטיס אחד וקבל את השני במתנה', points: 2000, icon: Zap, color: 'text-purple-400' },
  { id: 4, title: 'הנחה להקרנה פרטית', desc: 'הנחה של 30% על הקרנה פרטית באולם', points: 5000, icon: Star, color: 'text-blue-400' },
  { id: 5, title: 'שתייה גדולה חינם', desc: 'בחר שתייה גדולה מהמגוון שלנו ללא עלות', points: 300, icon: Sparkles, color: 'text-cyan-400' },
  { id: 6, title: 'כרטיס IMAX חינם', desc: 'כרטיס חינם להקרנת IMAX לבחירתך', points: 3500, icon: Ticket, color: 'text-red-400' },
  { id: 7, title: 'קומבו משפחתי', desc: 'פופקורן גדול + 4 שתיות + נאצ\'וס במחיר מיוחד', points: 800, icon: Popcorn, color: 'text-amber-400' },
  { id: 8, title: 'חברות פלטינום לשנה', desc: 'גישה בלעדית להקרנות בכורה, אולמות VIP והטבות שוטפות', points: 10000, icon: Crown, color: 'text-pink-400' },
];

interface Booking {
  id: string;
  movie: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  image: string;
  active: boolean;
  points: number;
  total: number;
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showAllRewards, setShowAllRewards] = useState(false);
  const [redeemedId, setRedeemedId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session) return;
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [session]);

  // Points calculation: 10% of total booking cost + 1500 starter points
  const totalPoints = bookings.reduce((acc, curr) => acc + (curr.points || 0), 0) + 1500;

  return (
    <div className="p-10 pb-20 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-10">
          <div className="relative glass-orange rounded-[48px] p-12 overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32 -mt-32" />
            
            <div className="flex items-center gap-4 mb-12 flex-row">
               <div className="p-3 bg-primary rounded-2xl text-background shadow-lg shadow-primary/20">
                  <Star size={24} className="fill-background" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-white tracking-tighter">תכנית <span className="text-primary">נאמנות</span></h1>
                  <p className="text-slate-400 font-medium">צבור נקודות על כל כרטיס שאתה מזמין</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">נקודות זמינות</p>
                   <p className="text-5xl font-black text-white mb-2 tracking-tighter">{totalPoints.toLocaleString()}</p>
                   <div className="flex items-center gap-1.5 text-xs text-primary font-bold justify-start">
                     +12% החודש <ArrowUpRight size={14} />
                   </div>
                </div>
               
               <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">דירוג נוכחי</p>
                  <p className="text-5xl font-black text-white mb-2 tracking-tighter">זהב</p>
                  <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="w-3/4 h-full bg-primary" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-2 text-left">550 נקודות ליהלום</p>
               </div>

               <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">סה&quot;כ נחסך</p>
                  <p className="text-5xl font-black text-white mb-2 tracking-tighter">₪142</p>
                  <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold justify-start">
                    הטבות לכל החיים <TrendingUp size={14} />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-4 flex-row">
                <h2 className="text-xl font-bold text-white tracking-tight">מימוש הטבות</h2>
                <button onClick={() => setShowAllRewards(true)} className="text-xs text-slate-500 font-black hover:text-primary transition-colors tracking-widest uppercase">צפה בהכל</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.slice(0, 4).map((reward) => (
                  <div key={reward.id} className="group glass rounded-[32px] p-8 border border-white/5 hover:border-primary/30 transition-all cursor-pointer" onClick={() => setShowAllRewards(true)}>
                    <div className="flex items-start justify-between mb-8 flex-row">
                       <div className={`p-4 rounded-2xl bg-white/5 ${reward.color}`}>
                          <reward.icon size={24} />
                       </div>
                       <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary tracking-tighter">
                          {reward.points} נקודות
                       </div>
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 group-hover:text-primary transition-colors">{reward.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{reward.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="glass rounded-[48px] p-10 border border-white/5 flex flex-col h-full">
           <h3 className="text-xl font-bold text-white mb-8 tracking-tight">פעילות אחרונה</h3>
           
           <div className="flex-1 space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs text-slate-500 font-bold">טוען פעילות...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <Zap size={24} className="text-slate-700 mb-4" />
                  <p className="text-xs text-slate-500 font-medium text-center">אין פעילות אחרונה להצגה. הזמן סרט כדי לצבור נקודות!</p>
                </div>
              ) : (
                bookings.slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 flex-row">
                    <div className="flex items-center gap-4 flex-row">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                          <Zap size={20} />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white font-bold">הזמנת סרט</p>
                          <p className="text-[10px] text-slate-500 font-medium">{activity.movie} • {activity.date}</p>
                        </div>
                    </div>
                    <span className="text-sm font-black text-primary">+{activity.points}</span>
                  </div>
                ))
              )}
           </div>
           
           <button 
            onClick={() => setShowFullHistory(true)}
            disabled={bookings.length === 0}
            className="w-full mt-10 p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             היסטוריית נקודות מלאה
           </button>
        </div>
      </div>

      {/* Full History Modal - Portal to escape overflow-hidden layout */}
      {mounted && showFullHistory && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12" dir="rtl">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowFullHistory(false)} />
          <div className="relative w-full max-w-2xl bg-[#0D0D0D]/80 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(255,159,10,0.1)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-white/5 flex items-center justify-between flex-row">
              <h2 className="text-2xl font-black text-white">היסטוריית <span className="text-primary">נקודות</span></h2>
              <button onClick={() => setShowFullHistory(false)} className="p-3 hover:bg-white/10 rounded-2xl text-slate-500 transition-all hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
              {bookings.length === 0 ? (
                <div className="text-center py-20">
                   <p className="text-slate-500 font-bold">לא נמצאה היסטוריית פעילות</p>
                </div>
              ) : (
                bookings.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/5 flex-row hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-6 flex-row">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                          <Zap size={24} />
                        </div>
                        <div className="text-right">
                          <p className="text-base text-white font-black">הזמנת סרט</p>
                          <p className="text-xs text-slate-500 font-bold">{activity.movie} • {activity.date}</p>
                        </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xl font-black text-primary tracking-tighter">+{activity.points}</span>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">נקודות</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/5">
               <div className="flex items-center justify-between flex-row">
                  <p className="text-sm font-bold text-slate-400">סה&quot;כ נקודות מהזמנות</p>
                  <p className="text-lg font-black text-white">{bookings.reduce((a, b) => a + b.points, 0).toLocaleString()}</p>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* All Rewards Modal - Portal to escape overflow-hidden layout */}
      {mounted && showAllRewards && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12" dir="rtl">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => { setShowAllRewards(false); setRedeemedId(null); }} />
          <div className="relative w-full max-w-3xl bg-[#0D0D0D]/80 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(255,159,10,0.1)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-white/5 flex items-center justify-between flex-row">
              <div>
                <h2 className="text-2xl font-black text-white">קטלוג <span className="text-primary">הטבות</span></h2>
                <p className="text-xs text-slate-500 font-medium mt-1">יש לך <span className="text-primary font-black">{totalPoints.toLocaleString()}</span> נקודות זמינות</p>
              </div>
              <button onClick={() => { setShowAllRewards(false); setRedeemedId(null); }} className="p-3 hover:bg-white/10 rounded-2xl text-slate-500 transition-all hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
              {rewards.map((reward) => {
                const canRedeem = totalPoints >= reward.points;
                const isRedeemed = redeemedId === reward.id;
                return (
                  <div key={reward.id} className={`flex items-center justify-between p-6 rounded-[32px] border transition-all group ${
                    isRedeemed ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-primary/20'
                  }`}>
                    <div className="flex items-center gap-6 flex-row">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                        isRedeemed ? 'bg-green-500/20 text-green-400' : `bg-white/5 ${reward.color}`
                      }`}>
                        {isRedeemed ? <Check size={24} /> : <reward.icon size={24} />}
                      </div>
                      <div className="text-right">
                        <p className="text-base text-white font-black">{reward.title}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">{reward.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <span className={`text-lg font-black tracking-tighter ${canRedeem ? 'text-primary' : 'text-slate-600'}`}>{reward.points.toLocaleString()}</span>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">נקודות</p>
                      </div>
                      <button
                        onClick={() => {
                          if (canRedeem && !isRedeemed) setRedeemedId(reward.id);
                        }}
                        disabled={!canRedeem || isRedeemed}
                        className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          isRedeemed
                            ? 'bg-green-500/20 text-green-400 border border-green-500/20 cursor-default'
                            : canRedeem
                              ? 'bg-primary text-background hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'
                              : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {isRedeemed ? 'מומש ✓' : canRedeem ? 'מימוש' : 'לא מספיק'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

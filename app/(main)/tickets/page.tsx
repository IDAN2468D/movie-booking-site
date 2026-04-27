'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Ticket, Calendar, Clock, MapPin, QrCode, Share2, Download, Loader2, Mail, Sparkles, Bot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface TicketType {
  id: string;
  movie: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  image: string;
  active: boolean;
  points?: number; // Added points field
  total?: number;
}

export default function TicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleEmailTicket = async (ticket: TicketType) => {
    setProcessingId(`${ticket.id}-email`);
    try {
      const res = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          movieTitle: ticket.movie,
          seats: ticket.seats,
          price: ticket.total || 45,
          orderId: ticket.id,
          posterUrl: ticket.image,
          date: ticket.date,
          time: ticket.time,
          hall: ticket.hall,
          userName: session?.user?.name
        })
      });
      if (res.ok) alert('הכרטיס נשלח למייל בהצלחה!');
      else alert('אירעה שגיאה בשליחת המייל');
    } catch (err) {
      alert('שגיאת תקשורת בשליחת המייל');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadPDF = async (ticket: TicketType) => {
    setProcessingId(`${ticket.id}-pdf`);
    try {
      const res = await fetch('/api/download-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: ticket.movie,
          seats: ticket.seats,
          price: ticket.total || 45,
          orderId: ticket.id,
          date: ticket.date,
          time: ticket.time,
          hall: ticket.hall,
          userName: session?.user?.name,
          posterUrl: ticket.image
        })
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${ticket.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await res.json();
        alert(`שגיאה ביצירת ה-PDF: ${errorData.error || 'שגיאה לא ידועה'}`);
      }
    } catch (err) {
      alert(`שגיאת תקשורת בהורדת ה-PDF: ${(err as Error).message}`);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setTickets(data.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-400 font-bold">טוען את הכרטיסים שלך...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-10 text-right overflow-x-hidden bg-background">
      {/* Header Section - Premium Glass */}
      <div className="mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-4 justify-end">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(255,159,10,0.2)]">
               <Ticket className="text-primary w-6 h-6" />
            </div>
            <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.4em]">Personal Cinema Collection</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-outfit">
             הכרטיסים <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">שלי</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl mr-auto md:mr-0">
             המסעות הקולנועיים הקרובים והקודמים שלך, מעובדים ומאובטחים במנוע ה-AI של MovieBook.
          </p>
        </motion.div>
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {!session ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto min-h-[450px] relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-primary/20 rounded-[48px] blur-2xl opacity-50" />
          <div className="relative h-full bg-black/40 backdrop-blur-[60px] saturate-[200%] rounded-[48px] flex flex-col items-center justify-center p-12 text-center border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-orange-500/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_15px_35px_rgba(255,159,10,0.3)]">
              <Bot size={48} className="text-primary drop-shadow-[0_0_15px_rgba(255,159,10,0.8)]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter font-outfit">חבר את הפרופיל שלך</h2>
            <p className="text-slate-400 mb-10 max-w-sm leading-relaxed">עליך להתחבר כדי שנוכל לאחזר את הכרטיסים וההטבות הממתינות לך במערכת ה-AI שלנו.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-12 py-5 bg-primary text-background font-black rounded-2xl shadow-[0_20px_40px_rgba(255,159,10,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs font-outfit"
            >
              התחבר למערכת
            </button>
          </div>
        </motion.div>
      ) : tickets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto min-h-[400px] relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-[48px] blur-xl opacity-50" />
          <div className="relative h-full bg-black/40 backdrop-blur-[60px] saturate-[200%] rounded-[48px] flex flex-col items-center justify-center p-12 text-center border border-white/10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
              <Ticket size={40} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">עדיין אין כרטיסים באוסף</h2>
            <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">הזמן את הסרט הבא שלך והוא יופיע כאן ככרטיס דיגיטלי יוקרתי ומאובטח.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs"
            >
              גלה סרטים חדשים
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-16">
          {tickets.map((ticket, index) => (
          <motion.div 
            key={ticket.id} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col group transition-all duration-700 ${ticket.active ? 'hover:-translate-y-4' : 'opacity-60 grayscale-[0.5] filter'}`}
          >
            {/* Top Section: Movie Art (The Ticket Head) */}
            <div className="relative h-[420px] md:h-[480px] rounded-t-[48px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-10 border-t border-x border-white/20">
              <NextImage 
                src={ticket.image} 
                alt={ticket.movie} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 saturate-[1.2]" 
              />
              
              {/* Premium Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Holographic Label */}
              {ticket.active && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-primary/20 backdrop-blur-3xl border border-primary/40 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(255,159,10,0.3)] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Premiere Access 2026
                </div>
              )}

              {/* Movie Info Overlay */}
              <div className="absolute bottom-10 right-10 left-10 text-right">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3 drop-shadow-[0_0_10px_rgba(255,159,10,0.5)]">חווית צפייה אופטימלית</p>
                <h2 className="text-4xl font-black text-white tracking-tighter leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-outfit">{ticket.movie}</h2>
              </div>
            </div>

            {/* Middle Section: Perforated Connector (Tactile Stub) */}
            <div className="relative h-14 bg-black/60 backdrop-blur-3xl flex items-center justify-center overflow-hidden border-x border-white/20">
               <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-14 h-14 bg-background rounded-full shadow-[inset_-10px_0_15px_rgba(0,0,0,0.5)] border-r border-white/10" />
               <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-14 h-14 bg-background rounded-full shadow-[inset_10px_0_15px_rgba(0,0,0,0.5)] border-l border-white/10" />
               <div className="w-[85%] h-[1px] border-t-2 border-dashed border-white/20 opacity-40" />
            </div>

            {/* Bottom Section: Ticket Stub (The Info Base) */}
            <div className="bg-black/60 backdrop-blur-[50px] saturate-[200%] rounded-b-[48px] p-10 border-x border-b border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative text-right">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 opacity-50 pointer-events-none" />

               <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-12 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                      תאריך <Calendar size={12} className="text-primary" />
                    </p>
                    <p className="text-base text-white font-black font-outfit">{ticket.date}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                      שעה <Clock size={12} className="text-primary" />
                    </p>
                    <p className="text-base text-white font-black font-outfit">{ticket.time}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                      אולם <MapPin size={12} className="text-primary" />
                    </p>
                    <p className="text-base text-white font-black font-outfit">{ticket.hall}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                      מושבים <Ticket size={12} className="text-primary" />
                    </p>
                    <p className="text-base text-white font-black font-outfit tracking-tighter">{ticket.seats.join(', ')}</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/10 relative z-10">
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                     <div className="p-4 bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700 relative overflow-hidden">
                       <QrCode size={56} className="text-black relative z-10" />
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-colors" />
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">מזהה כרטיס</p>
                       <p className="text-xs text-white font-black tracking-widest">{ticket.id.substring(0, 12)}...</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-row gap-3 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => handleEmailTicket(ticket)}
                      disabled={processingId === `${ticket.id}-email`}
                      className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10 border border-white/5 transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="שלח למייל"
                    >
                      {processingId === `${ticket.id}-email` ? <Loader2 size={20} className="animate-spin" /> : <Mail size={20} />}
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `הכרטיס שלי לסרט ${ticket.movie}`,
                            text: `קניתי כרטיס לסרט ${ticket.movie} ב-MovieBook! מושבים: ${ticket.seats.join(', ')}`,
                            url: window.location.href,
                          });
                        } else {
                          alert('שיתוף לא נתמך בדפדפן זה');
                        }
                      }}
                      className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10 border border-white/5 transition-all active:scale-90"
                      title="שתף כרטיס"
                    >
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(ticket)}
                      disabled={processingId === `${ticket.id}-pdf`}
                      className="p-4 rounded-2xl bg-primary text-background hover:bg-orange-400 transition-all shadow-[0_10px_20px_rgba(255,159,10,0.2)] active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="הורד PDF"
                    >
                      {processingId === `${ticket.id}-pdf` ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                    </button>
                  </div>
               </div>

            </div>
          </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Loader2, Bot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import QuantumTicket from '@/components/tickets/QuantumTicket';
import HolographicTicket from '@/components/tickets/HolographicTicket';
import { ChronoRefractiveReel } from '@/components/tickets/ChronoRefractiveReel';

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
  const [activeTab, setActiveTab] = useState<'countdown' | 'qr' | 'memory'>('countdown');
  const [ticketStyle, setTicketStyle] = useState<'quantum' | 'holographic'>('quantum');

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
    } catch {
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
        <div className="flex flex-col items-center w-full">
          {/* Global Category Switcher - Premium Glass Pill */}
          <div className="w-full max-w-md mb-12 bg-black/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl flex gap-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {([
              { id: 'countdown', label: 'קדימון וזמן' },
              { id: 'qr', label: 'כרטיס כניסה' },
              { id: 'memory', label: 'קפסולת זיכרון' }
            ] as const).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-center transition-colors duration-300 whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="globalTicketTab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_20px_rgba(255,159,10,0.5)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ticket Style Switcher */}
          <div className="w-full max-w-xs mb-12 bg-black/40 backdrop-blur-2xl border border-white/5 p-1 rounded-xl flex gap-1 shadow-md">
            {([
              { id: 'quantum', label: 'קוונטי' },
              { id: 'holographic', label: 'הולוגרפי 3D' }
            ] as const).map((style) => {
              const isActive = ticketStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setTicketStyle(style.id)}
                  className={`relative flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-center transition-colors duration-300 whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="ticketStyleTab"
                      className="absolute inset-0 bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">{style.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'memory' ? (
            <div className="w-full flex justify-center mt-4">
              <ChronoRefractiveReel />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-16 w-full">
            {tickets.map((ticket, index) => (
              <motion.div 
                key={ticket.id} 
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 150,
                  damping: 12,
                  mass: 0.9,
                  delay: index * 0.1 
                }}
                className="w-full flex justify-center"
              >
                {ticketStyle === 'holographic' ? (
                  <HolographicTicket
                    movieTitle={ticket.movie}
                    date={ticket.date}
                    time={ticket.time}
                    hall={ticket.hall}
                    seats={ticket.seats}
                  />
                ) : (
                  <QuantumTicket 
                    ticket={ticket}
                    state={activeTab}
                    onEmail={() => handleEmailTicket(ticket)}
                    onDownload={() => handleDownloadPDF(ticket)}
                    onShare={() => {
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
                    isProcessingEmail={processingId === `${ticket.id}-email`}
                    isProcessingPDF={processingId === `${ticket.id}-pdf`}
                  />
                )}
              </motion.div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}

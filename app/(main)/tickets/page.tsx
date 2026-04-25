'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Ticket, Calendar, Clock, MapPin, QrCode, Share2, Download, Loader2, Mail, Sparkles, Bot } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
    <div className="p-10 pb-20 text-right">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">הכרטיסים <span className="text-primary">שלי</span></h1>
        <p className="text-slate-400 font-medium">המסעות הקולנועיים הקרובים והקודמים שלך</p>
      </div>

      {!session ? (
        <div className="min-h-[40vh] glass rounded-[48px] flex flex-col items-center justify-center p-12 text-center border border-white/5 bg-white/5 backdrop-blur-2xl">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
            <Bot size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">עליך להתחבר כדי לצפות בכרטיסים</h2>
          <p className="text-slate-500 mb-8 max-w-xs">התחבר לחשבון שלך כדי לראות את כל ההזמנות והכרטיסים הדיגיטליים שלך.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            התחבר עכשיו
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="min-h-[40vh] glass rounded-[48px] flex flex-col items-center justify-center p-12 text-center border border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Ticket size={32} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">אין לך כרטיסים עדיין</h2>
          <p className="text-slate-500 mb-8 max-w-xs">כשתזמין כרטיסים לסרטים, הם יופיעו כאן בצורה מסודרת.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {tickets.map((ticket) => (
          <div key={ticket.id} className={`relative flex flex-col group transition-all duration-700 ${ticket.active ? 'hover:-translate-y-2' : 'opacity-60 grayscale-[0.5]'}`}>
            
            {/* Top Section: Movie Art */}
            <div className="relative h-[480px] rounded-t-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
              <NextImage 
                src={ticket.image} 
                alt={ticket.movie} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
              
              {/* Badge */}
              {ticket.active && (
                <div className="absolute top-8 left-8 px-5 py-2.5 bg-[#FF9F0A] rounded-full text-[10px] font-black text-background uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,159,10,0.5)] animate-pulse">
                  כרטיס פרמיירה
                </div>
              )}

              {/* Movie Info Overlay */}
              <div className="absolute bottom-8 right-8 left-8 text-right">
                <p className="text-[10px] font-black text-[#FF9F0A] uppercase tracking-[0.4em] mb-2 drop-shadow-lg">עכשיו במוקד הקולנועי 2026</p>
                <h2 className="text-3xl font-black text-white tracking-tight leading-none drop-shadow-2xl">{ticket.movie}</h2>
              </div>
            </div>

            {/* Middle Section: Perforated Connector */}
            <div className="relative h-12 bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
               {/* Notches */}
               <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0F0F0F] rounded-full shadow-inner" />
               <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0F0F0F] rounded-full shadow-inner" />
               
               {/* Perforation Line */}
               <div className="w-full h-[2px] border-t-2 border-dashed border-white/10 px-8 mx-6" />
            </div>

            {/* Bottom Section: Ticket Stub */}
            <div className="bg-[#1A1A1A] rounded-b-[48px] p-8 border-x border-b border-white/5 shadow-2xl relative text-right">
               <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-start">
                      <Calendar size={12} className="text-[#FF9F0A]" /> תאריך
                    </p>
                    <p className="text-sm text-white font-bold">{ticket.date}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-start">
                      <Clock size={12} className="text-[#FF9F0A]" /> שעה
                    </p>
                    <p className="text-sm text-white font-bold">{ticket.time}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-start">
                      <MapPin size={12} className="text-[#FF9F0A]" /> אולם
                    </p>
                    <p className="text-sm text-white font-bold">{ticket.hall}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-start">
                      <Ticket size={12} className="text-[#FF9F0A]" /> מושבים
                    </p>
                    <p className="text-sm text-white font-bold">{ticket.seats.join(', ')}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-6 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-[20px] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                       <QrCode size={40} className="text-black" />
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">מזהה אימות</p>
                       <p className="text-xs text-white font-black">{ticket.id}</p>
                     </div>
                  </div>
                  {ticket.points && (
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">צברת ברכישה</p>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-xs text-primary font-black">{ticket.points} נקודות</span>
                      </div>
                    </div>
                  )}
                                    <div className="flex flex-col gap-2">
                    <button 
                      disabled={isLoading}
                      onClick={async () => {
                        if (!session?.user?.email) return;
                        try {
                          const res = await fetch('/api/send-ticket', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              email: session.user.email,
                              movieTitle: ticket.movie,
                              seats: ticket.seats,
                              price: ticket.seats.length * 45,
                              orderId: ticket.id,
                              posterUrl: ticket.image,
                              date: ticket.date,
                              time: ticket.time,
                              hall: ticket.hall,
                              userName: session.user.name || 'אורח'
                            }),
                          });
                          if (res.ok) alert('הכרטיס נשלח שוב למייל שלך!');
                          else alert('נכשלנו בשליחת המייל. וודא שההגדרות תקינות.');
                        } catch (err) {
                          console.error(err);
                          alert('שגיאה בשליחת המייל.');
                        }
                      }}
                      className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-[#FF9F0A] hover:bg-white/10 transition-all disabled:opacity-50"
                      title="שלח שוב למייל"
                    >
                      <Mail size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `כרטיס ל${ticket.movie}`,
                            text: `היי! הזמנתי כרטיסים ל${ticket.movie} ב${ticket.date} בשעה ${ticket.time}. בואו איתי!`,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('הקישור הועתק ללוח!');
                        }
                      }}
                      className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-[#FF9F0A] hover:bg-white/10 transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/download-ticket', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              movieTitle: ticket.movie,
                              seats: ticket.seats,
                              price: ticket.seats.length * 45,
                              orderId: ticket.id,
                              date: ticket.date,
                              time: ticket.time,
                              hall: ticket.hall,
                              userName: session?.user?.name || 'אורח',
                              posterUrl: ticket.image
                            }),
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
                            alert('נכשלנו בהורדת ה-PDF.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('שגיאה בהורדת ה-PDF.');
                        }
                      }}
                      className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-[#FF9F0A] hover:bg-white/10 transition-all"
                      title="הורד כרטיס PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
               </div>

               {/* Holographic Security Label */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-transparent via-white/5 to-transparent text-[8px] text-slate-700 font-black tracking-[0.5em] uppercase whitespace-nowrap">
                  נכס דיגיטלי מאובטח • 2026
               </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

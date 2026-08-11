'use client';

import React, { useEffect, useState } from 'react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import QuantumTicket from '@/components/tickets/QuantumTicket';
import HolographicTicket from '@/components/tickets/HolographicTicket';
import { ChronoRefractiveReel } from '@/components/tickets/ChronoRefractiveReel';
import { LiquidGlassTicketVault } from '@/components/tickets/LiquidGlassTicketVault';
import { TicketsHeader } from '@/components/tickets/TicketsHeader';
import { TicketsTabSwitcher } from '@/components/tickets/TicketsTabSwitcher';
import { TicketType, FALLBACK_VIP_TICKETS } from '@/lib/constants/fallbackTickets';

export default function TicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<TicketType[]>(FALLBACK_VIP_TICKETS);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'countdown' | 'qr' | 'memory'>('countdown');
  const [ticketStyle, setTicketStyle] = useState<'quantum' | 'holographic' | 'vault'>('quantum');

  const handleEmailTicket = async (ticket: TicketType) => {
    setProcessingId(`${ticket.id}-email`);
    try {
      const res = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email || 'user@cinepulse.com',
          movieTitle: ticket.movie,
          seats: ticket.seats,
          price: ticket.total || 45,
          orderId: ticket.id,
          posterUrl: ticket.image,
          date: ticket.date,
          time: ticket.time,
          hall: ticket.hall,
          userName: session?.user?.name || 'אורח VIP'
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
          userName: session?.user?.name || 'אורח VIP',
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
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          if (data.bookings && data.bookings.length > 0) {
            setTickets(data.bookings);
          }
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
        <LoadingIndicator variant="orbit" size="lg" label="טוען את הכרטיסים שלך..." />
        <p className="text-slate-400 font-bold animate-pulse">טוען את הכרטיסים שלך...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-10 text-right overflow-x-hidden bg-background">
      <TicketsHeader />

      <TicketsTabSwitcher
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ticketStyle={ticketStyle}
        setTicketStyle={setTicketStyle}
      />

      {activeTab === 'memory' ? (
        <div className="w-full flex justify-center mt-4">
          <ChronoRefractiveReel />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-16 w-full">
          {tickets.map((ticket, index) => (
            <motion.div 
              key={ticket.id} 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 180,
                damping: 15,
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
                  posterUrl={ticket.image}
                />
              ) : ticketStyle === 'vault' ? (
                <LiquidGlassTicketVault
                  bookingId={ticket.id}
                  seatId={ticket.seats[0] || "VIP-1"}
                  concessions={[]}
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
                        text: `קניתי כרטיס לסרט ${ticket.movie} ב-CinePulse! מושבים: ${ticket.seats.join(', ')}`,
                        url: window.location.href,
                      });
                    } else {
                      alert('שיתוף נתמך במכשירים ניידים');
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
  );
}

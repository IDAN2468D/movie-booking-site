'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Loader2, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils/index';

interface TicketExportProps {
  bookingId: string;
  movieTitle: string;
  seats: string[];
  date: string;
  time: string;
  posterUrl?: string;
  className?: string;
}

export default function TicketExport({
  bookingId,
  movieTitle,
  seats,
  date,
  time,
  posterUrl,
  className,
}: TicketExportProps) {
  const [ticketToken, setTicketToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate the signed JWT token for the QR code
    const generateToken = async () => {
      try {
        const res = await fetch('/api/tickets/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, title: movieTitle, seats, showtime: `${date} ${time}` }),
        });
        const data = await res.json();
        if (data.success) {
          setTicketToken(data.data.token);
        }
      } catch (error) {
        console.error('Failed to generate ticket token', error);
      }
    };
    
    if (bookingId && !ticketToken) {
      generateToken();
    }
  }, [bookingId, movieTitle, seats, date, time, ticketToken]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    
    setIsGenerating(true);
    try {
      // Use html2canvas to capture the exact UI (avoids complex RTL/font issues in jsPDF)
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#0A0A0A',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions (A4 size: 210 x 297 mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 40; // 20mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save(`Ticket_${bookingId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* The Printable Ticket Area */}
      <div 
        ref={ticketRef}
        className="w-[350px] sm:w-[400px] rounded-[30px] overflow-hidden liquid-glass border border-white/10 p-6 flex flex-col gap-6 relative"
        dir="rtl"
      >
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div>
            <h3 className="text-2xl font-bold font-display text-white">{movieTitle}</h3>
            <p className="text-sm text-gray-400 mt-1">{date} • {time}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        {/* Body */}
        <div className="flex justify-between items-center relative z-10">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">מושבים</p>
              <p className="text-lg font-medium text-white">{seats.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">מזהה הזמנה</p>
              <p className="text-sm text-gray-300 font-mono">{bookingId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          
          {/* QR Code Container */}
          <div className="bg-white p-3 rounded-xl shadow-lg">
            {ticketToken ? (
              <QRCodeSVG 
                value={ticketToken} 
                size={100}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="w-[100px] h-[100px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t border-white/10 border-dashed text-center relative z-10">
          <p className="text-xs text-gray-500">הצג קוד זה בכניסה לאולם הקולנוע</p>
        </div>
      </div>

      {/* Download Action */}
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating || !ticketToken}
        className={cn(
          "flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300",
          isGenerating || !ticketToken
            ? "bg-white/5 text-gray-500 cursor-not-allowed"
            : "bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/10"
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>מייצר כרטיס...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>הורד כרטיס כ-PDF</span>
          </>
        )}
      </button>
    </div>
  );
}

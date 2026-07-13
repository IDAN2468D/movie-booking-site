"use client";

import React from 'react';
import BookingConfirmationWidget from '@/components/checkout/BookingConfirmationWidget';
import TicketVaultWidget from '@/components/booking/TicketVaultWidget';

interface TransactionStatusOverlayProps {
  status: 'IDLE' | 'SEAT_SELECT' | 'PAYMENT_PENDING' | 'SUCCESS' | 'FAILED';
  errorMsg: string | null;
  reset: () => void;
}

export function TransactionStatusOverlay({ status, errorMsg, reset }: TransactionStatusOverlayProps) {
  if (status === 'PAYMENT_PENDING') {
    return (
      <div className="flex justify-center p-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono tracking-wider animate-pulse">Processing Secure Payment...</span>
        </div>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return (
      <div className="w-full flex flex-col items-center">
        <BookingConfirmationWidget onDismiss={reset} />
        <TicketVaultWidget />
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-center">
        <p className="text-red-400 font-bold mb-1">Transaction Failed</p>
        <p className="text-red-300/70 text-xs">{errorMsg}</p>
        <button onClick={reset} className="mt-2 text-xs text-white/50 hover:text-white underline">Dismiss</button>
      </div>
    );
  }

  return null;
}

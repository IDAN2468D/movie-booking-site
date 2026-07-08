"use client";

import { useState, useEffect } from 'react';

async function generateHMAC(ticketId: string, secret: string, timeWindow: number): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(`${ticketId}-${timeWindow}`);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function useTicketRotator(ticketId: string | null, secret: string | null) {
  const [totpHash, setTotpHash] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);

  useEffect(() => {
    if (!ticketId || !secret) {
      setTotpHash(null);
      return;
    }

    let intervalId: NodeJS.Timeout;
    let tickId: NodeJS.Timeout;

    const updateToken = async () => {
      const now = Date.now();
      const window = Math.floor(now / 15000);
      const hash = await generateHMAC(ticketId, secret, window);
      setTotpHash(hash);
    };

    const tick = () => {
      const now = Date.now();
      const msElapsed = now % 15000;
      setTimeRemaining(15 - Math.floor(msElapsed / 1000));
    };

    updateToken();
    tick();

    // 15 seconds synchronization logic
    const msToNextWindow = 15000 - (Date.now() % 15000);
    
    const startSync = () => {
      updateToken();
      tick();
      intervalId = setInterval(updateToken, 15000);
    };

    const initialTimeoutId = setTimeout(startSync, msToNextWindow);
    tickId = setInterval(tick, 1000);

    return () => {
      clearTimeout(initialTimeoutId);
      clearInterval(intervalId);
      clearInterval(tickId);
    };
  }, [ticketId, secret]);

  return { totpHash, timeRemaining };
}

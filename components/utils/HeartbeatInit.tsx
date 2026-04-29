'use client';

import { useEffect } from 'react';
import { initHeartbeat } from '@/lib/render-heartbeat';

export function HeartbeatInit() {
  useEffect(() => {
    initHeartbeat();
  }, []);

  return null;
}

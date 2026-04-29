/**
 * Render Heartbeat Script
 * Prevents the Render server from going into IDLE mode by performing a self-ping every 10 minutes.
 */

export function initHeartbeat() {
  if (typeof window === 'undefined') return;

  const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

  const ping = async () => {
    try {
      // Just a lightweight fetch to keep the process warm
      await fetch('/api/health', { method: 'HEAD' }).catch(() => {});
      console.log('💓 Heartbeat: Server kept warm');
    } catch (e) {
      // Ignore errors
    }
  };

  // Run every 10 minutes
  setInterval(ping, PING_INTERVAL);
  
  // Also run once on init
  ping();
}

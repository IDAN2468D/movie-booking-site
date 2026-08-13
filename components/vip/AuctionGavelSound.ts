/**
 * 🔨 Web Audio API Acoustic Gavel Strike Synthesizer
 * Simulates a wooden auction gavel strike with 40Hz resonant echo
 */
export function playAuctionGavelSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    // 1. Strike transient (wood crack)
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(320, ctx.currentTime);
    strikeOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    strikeGain.gain.setValueAtTime(0.6, ctx.currentTime);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    strikeOsc.connect(strikeGain);
    strikeGain.connect(ctx.destination);
    strikeOsc.start();
    strikeOsc.stop(ctx.currentTime + 0.08);

    // 2. Resonant sub-bass body (40Hz wood thump)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(90, ctx.currentTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.25);

    subGain.gain.setValueAtTime(0.5, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.25);

    // Haptic vibration feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 30, 80]);
    }
  } catch (e) {
    console.warn('Gavel audio error:', e);
  }
}

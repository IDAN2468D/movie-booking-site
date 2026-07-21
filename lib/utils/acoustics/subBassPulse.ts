import { HapticPulseConfig, HapticPulseSchema } from '@/lib/validations/hapticPulseSchema';

let audioCtx: AudioContext | null = null;

export const playSubBassPulse = (config: Partial<HapticPulseConfig> = {}) => {
  // Validate configuration boundaries using Zod
  const validConfig = HapticPulseSchema.parse(config);

  if (typeof window === 'undefined') return;

  try {
    // 1. Initialize Audio Context if not already done
    if (!audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContext();
    }

    // Resume context if suspended (browser auto-play policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // 2. Set up Web Audio nodes
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Configure Oscillator (Deep Sine Wave)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(validConfig.frequency, audioCtx.currentTime);
    
    // Configure Filter (Lowpass to remove any clicking/high frequencies)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, audioCtx.currentTime);

    // Configure Gain Envelope (Fade in and fade out for smooth sub-bass)
    const now = audioCtx.currentTime;
    const durationSeconds = validConfig.duration / 1000;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(validConfig.volume, now + 0.05); // Quick fade in
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds); // Smooth fade out

    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start and Stop Oscillator
    oscillator.start(now);
    oscillator.stop(now + durationSeconds);

    // 3. Trigger Native Haptics if available
    if (navigator.vibrate) {
      navigator.vibrate(validConfig.pattern);
    }
  } catch (error) {
    console.error('Sub-Bass Pulse Error:', error);
  }
};

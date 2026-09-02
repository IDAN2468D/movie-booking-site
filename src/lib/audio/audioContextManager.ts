/**
 * CinePulse Web Audio Context Singleton Manager
 * High-performance audio context lifecycle manager with idle auto-suspension.
 * Prevents CPU overuse, context exhaustion, and memory leaks.
 */

type AudioCtxType = AudioContext | null;

class AudioContextManager {
  private static instance: AudioContextManager | null = null;
  private ctx: AudioCtxType = null;
  private suspendTimeout: NodeJS.Timeout | null = null;
  private readonly IDLE_TIMEOUT_MS = 10000; // 10s idle before auto-suspend

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  public getContext(): AudioCtxType {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();
    }

    this.scheduleAutoSuspend();
    return this.ctx;
  }

  public async resume(): Promise<AudioCtxType> {
    const context = this.getContext();
    if (!context) return null;

    if (this.suspendTimeout) {
      clearTimeout(this.suspendTimeout);
      this.suspendTimeout = null;
    }

    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        // Fallback for user gesture blocking
      }
    }

    this.scheduleAutoSuspend();
    return context;
  }

  public scheduleAutoSuspend(): void {
    if (this.suspendTimeout) {
      clearTimeout(this.suspendTimeout);
    }

    if (typeof window === 'undefined') return;

    this.suspendTimeout = setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    }, this.IDLE_TIMEOUT_MS);
  }

  public async playChime(frequency = 520, duration = 0.35, type: OscillatorType = 'sine'): Promise<void> {
    const context = await this.resume();
    if (!context) return;

    try {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, context.currentTime + duration);

      gain.gain.setValueAtTime(0.12, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

      osc.connect(gain);
      gain.connect(context.destination);

      osc.start();
      osc.stop(context.currentTime + duration);
    } catch {
      // Audio playback safety catch
    }
  }

  public async playHapticBass(frequency = 45, duration = 0.2): Promise<void> {
    const context = await this.resume();
    if (!context) return;

    try {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, context.currentTime + duration);

      gain.gain.setValueAtTime(0.25, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

      osc.connect(gain);
      gain.connect(context.destination);

      osc.start();
      osc.stop(context.currentTime + duration);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([20, 30, 20]);
      }
    } catch {
      // Audio playback safety catch
    }
  }

  public destroy(): void {
    if (this.suspendTimeout) {
      clearTimeout(this.suspendTimeout);
      this.suspendTimeout = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const audioContextManager = AudioContextManager.getInstance();

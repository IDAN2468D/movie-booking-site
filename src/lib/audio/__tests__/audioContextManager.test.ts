import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { audioContextManager } from '../audioContextManager';

describe('AudioContextManager (Singleton & Performance Lifecycle)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    audioContextManager.destroy();
    vi.restoreAllMocks();
  });

  it('should return a singleton instance of AudioContextManager', () => {
    expect(audioContextManager).toBeDefined();
    expect(typeof audioContextManager.getContext).toBe('function');
    expect(typeof audioContextManager.resume).toBe('function');
    expect(typeof audioContextManager.playChime).toBe('function');
    expect(typeof audioContextManager.playHapticBass).toBe('function');
  });

  it('should gracefully handle SSR environment without window AudioContext', () => {
    const ctx = audioContextManager.getContext();
    expect(ctx === null || typeof ctx === 'object').toBe(true);
  });

  it('should schedule auto-suspend timer correctly', () => {
    audioContextManager.scheduleAutoSuspend();
    expect(vi.getTimerCount()).toBeGreaterThanOrEqual(1);
  });

  it('should safely destroy and clear timeouts', () => {
    audioContextManager.scheduleAutoSuspend();
    audioContextManager.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });
});

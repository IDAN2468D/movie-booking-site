import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrbVoiceEngine } from '../useOrbVoiceEngine';

describe('useOrbVoiceEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useOrbVoiceEngine());
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(typeof result.current.toggleListening).toBe('function');
    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('should toggle listening safely without crashing in test environment', () => {
    const { result } = renderHook(() => useOrbVoiceEngine());
    act(() => {
      result.current.toggleListening();
    });
    expect(typeof result.current.isListening).toBe('boolean');
  });
});

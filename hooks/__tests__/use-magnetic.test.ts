import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMagnetic } from '../use-magnetic';

describe('useMagnetic', () => {
  it('should initialize with 0 motion values', () => {
    const { result } = renderHook(() => useMagnetic());
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });

  it('should update motion values when mouse is nearby', () => {
    const { result } = renderHook(() => useMagnetic(0.5));
    
    // Mock the ref element's bounding rect
    const mockRef = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // @ts-expect-error - overriding readonly ref for testing
    result.current.ref.current = mockRef;

    // Simulate mouse move near center (150, 150)
    // Distance from center (150, 150) to (160, 160) is 14.14px (< proximity 100)
    const event = new MouseEvent('mousemove', { clientX: 160, clientY: 160 });
    
    act(() => {
      window.dispatchEvent(event);
    });

    // x = (160 - 150) * 0.5 = 5
    // y = (160 - 150) * 0.5 = 5
    expect(result.current.x.get()).toBe(5);
    expect(result.current.y.get()).toBe(5);
  });

  it('should reset motion values when mouse is far away', () => {
    const { result } = renderHook(() => useMagnetic(0.5));
    
    const mockRef = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    // @ts-expect-error - overriding readonly ref for testing
    result.current.ref.current = mockRef;

    // Center is (50, 50). Move mouse to (500, 500) (> proximity 100)
    const event = new MouseEvent('mousemove', { clientX: 500, clientY: 500 });
    
    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });
});

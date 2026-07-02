import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSightlineCalculations, calculateSightline } from '../useSightlineCalculations';

describe('useSightlineCalculations', () => {
  it('should return error status if no seat is selected', () => {
    const { result } = renderHook(() => useSightlineCalculations(null));
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('No seat selected');
  });

  it('should return error status for an invalid seat ID format', () => {
    const { result } = renderHook(() => useSightlineCalculations('invalid-id'));
    expect(result.current.success).toBe(false);
    expect(result.current.error).toContain('Invalid seat ID format');
  });

  it('should correctly calculate sightline values for a valid seat index', () => {
    // Row 0 (A), col 6 (Index 5 -> Math.floor(5/6) = 0, (5 % 6) + 1 = 6)
    const { result } = renderHook(() => useSightlineCalculations('s-5'));
    expect(result.current.success).toBe(true);
    expect(result.current.data).toBeDefined();
    
    const data = result.current.data!;
    expect(data.row).toBe('A');
    expect(data.col).toBe(6);
    expect(data.perspectiveAngle).toBeGreaterThan(0); // Offset to the right
    expect(data.pitchAngle).toBe(25); // Close row A
    expect(data.visibilityScore).toBeGreaterThanOrEqual(50);
    expect(data.visibilityScore).toBeLessThanOrEqual(100);
  });

  it('should correctly calculate different angles for center vs side seats', () => {
    // s-2 represents Row A, Col 3 (Index 2 -> Math.floor(2/6) = 0, (2 % 6) + 1 = 3)
    // Offset is col - 3.5 = 3 - 3.5 = -0.5
    const leftSeat = calculateSightline('s-2');
    
    // s-3 represents Row A, Col 4 (Index 3 -> Math.floor(3/6) = 0, (3 % 6) + 1 = 4)
    // Offset is col - 3.5 = 4 - 3.5 = +0.5
    const rightSeat = calculateSightline('s-3');

    expect(leftSeat.success).toBe(true);
    expect(rightSeat.success).toBe(true);
    
    // They should have opposite perspective angles
    expect(leftSeat.data!.perspectiveAngle).toBeCloseTo(-rightSeat.data!.perspectiveAngle, 5);
  });
});

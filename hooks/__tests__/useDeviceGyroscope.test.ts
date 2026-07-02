import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDeviceGyroscope } from '../useDeviceGyroscope';

describe('useDeviceGyroscope', () => {
  it('should initialize and return success result structure', () => {
    const { result } = renderHook(() => useDeviceGyroscope());
    expect(result.current.success).toBe(true);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.gradientAngle).toBe(135); // default fallback angle
  });
});

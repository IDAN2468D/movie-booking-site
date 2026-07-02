import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAcousticMatrix } from '../useAcousticMatrix';

describe('useAcousticMatrix', () => {
  let mockAudioContextInstance: any;
  let mockPannerNode: any;
  let mockBiquadFilterNode: any;
  let mockSourceNode: any;

  beforeEach(() => {
    // Setup Web Audio API mocks
    mockPannerNode = {
      panningModel: '',
      distanceModel: '',
      refDistance: 0,
      maxDistance: 0,
      rolloffFactor: 0,
      positionX: { setValueAtTime: vi.fn() },
      positionY: { setValueAtTime: vi.fn() },
      positionZ: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };

    mockBiquadFilterNode = {
      type: '',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };

    mockSourceNode = {
      connect: vi.fn(),
    };

    mockAudioContextInstance = {
      createPanner: vi.fn().mockReturnValue(mockPannerNode),
      createBiquadFilter: vi.fn().mockReturnValue(mockBiquadFilterNode),
      createMediaElementSource: vi.fn().mockReturnValue(mockSourceNode),
      destination: {},
      state: 'suspended',
      resume: vi.fn().mockResolvedValue(undefined),
      currentTime: 10,
    };

    vi.stubGlobal('AudioContext', vi.fn().mockImplementation(() => mockAudioContextInstance));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return error status if no seat is selected', () => {
    const { result } = renderHook(() => useAcousticMatrix(null, null));
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('No active seat coordinates');
  });

  it('should calculate valid soundstage coordinates for a correct seat index', () => {
    // s-15 -> index 15. Math.floor(15/6) = 2, (15 % 6) = 3
    const { result } = renderHook(() => useAcousticMatrix('s-15', null));
    expect(result.current.success).toBe(true);
    expect(result.current.data).toBeDefined();

    const data = result.current.data!;
    expect(data.panX).toBeCloseTo(0.75, 2);
    expect(data.panZ).toBeCloseTo(5.0, 2);
    expect(data.frequency).toBeLessThan(22000);
    expect(data.gain).toBeLessThanOrEqual(1.0);
  });
});

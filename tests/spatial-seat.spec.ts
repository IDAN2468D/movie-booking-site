import { describe, it, expect } from 'vitest';
import { SpatialSeatSchema } from '../lib/validations/spatialSeat';
import { getSeatPerspectiveAction } from '../app/actions/spatialSeatActions';

describe('Sprint 51: Spatial IMAX 3D Seat Walkthrough', () => {
  it('validates spatial seat coordinates correctly via Zod', () => {
    const valid = SpatialSeatSchema.safeParse({
      seatId: 'F-12',
      x: 0,
      y: 0,
      z: 50,
      screenCurvature: 0.8,
      panValue: 0,
    });
    expect(valid.success).toBe(true);

    const invalid = SpatialSeatSchema.safeParse({
      seatId: '',
      x: 1000, // exceeds max limit
    });
    expect(invalid.success).toBe(false);
  });

  it('calculates IMAX optimum viewing angle and acoustic pan value', async () => {
    const res = await getSeatPerspectiveAction({
      seatId: 'VIP-7',
      x: 10,
      y: 0,
      z: 50,
      screenCurvature: 0.8,
      panValue: 0.2,
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.fov).toBeGreaterThan(0);
    expect(res.data?.sweetSpotRating).toBe('IMAX Optimum');
    expect(res.data?.panValue).toBe(0.2);
  });
});

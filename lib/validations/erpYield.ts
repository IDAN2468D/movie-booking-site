import { z } from 'zod';

export const erpYieldSchema = z.object({
  showtimeId: z.string().min(1),
  occupancyPercentage: z.number().min(0).max(100),
  hoursUntilShowtime: z.number().nonnegative(),
  basePrice: z.number().positive(),
});

export const scannerTelemetrySchema = z.object({
  gateId: z.string().min(1),
  scansPerMinute: z.number().nonnegative(),
  bottleneckDetected: z.boolean(),
});

export type ERPYieldPayload = z.infer<typeof erpYieldSchema>;
export type ScannerTelemetryPayload = z.infer<typeof scannerTelemetrySchema>;

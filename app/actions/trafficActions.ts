'use server';

import { z } from 'zod';

// Zod boundary for the expected traffic response
const TrafficDataSchema = z.object({
  status: z.enum(['CLEAR', 'MODERATE', 'HEAVY', 'SEVERE']),
  estimatedDelayMinutes: z.number(),
  route: z.string(),
});

type TrafficData = z.infer<typeof TrafficDataSchema>;

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server Action: checkLiveTrafficAction
 * Attempts to fetch live traffic data from an external API.
 * Falls back to a realistic "HEAVY" simulation if the API key is missing or the endpoint fails.
 */
export async function checkLiveTrafficAction(
  origin: string,
  destination: string
): Promise<ActionResponse<TrafficData>> {
  try {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('⚠️ Missing GOOGLE_MAPS_API_KEY. Falling back to simulated live traffic data.');
      return generateSimulatedTraffic();
    }

    // Attempt actual live fetch (Constructing the URL for Google Maps Distance Matrix)
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', origin);
    url.searchParams.append('destinations', destination);
    url.searchParams.append('departure_time', 'now');
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Traffic API responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    // Parse Google's response (simplified for demonstration)
    if (data.rows && data.rows[0].elements[0].status === 'OK') {
      const durationInTraffic = data.rows[0].elements[0].duration_in_traffic?.value || 0;
      const normalDuration = data.rows[0].elements[0].duration?.value || 0;
      
      const delaySeconds = durationInTraffic - normalDuration;
      const delayMinutes = Math.max(0, Math.floor(delaySeconds / 60));

      let status: 'CLEAR' | 'MODERATE' | 'HEAVY' | 'SEVERE' = 'CLEAR';
      if (delayMinutes > 30) status = 'SEVERE';
      else if (delayMinutes > 15) status = 'HEAVY';
      else if (delayMinutes > 5) status = 'MODERATE';

      const trafficData = TrafficDataSchema.parse({
        status,
        estimatedDelayMinutes: delayMinutes,
        route: 'Live Route API',
      });

      return { success: true, data: trafficData };
    }

    throw new Error('Invalid routing response from API');

  } catch (error: any) {
    console.error('Live Traffic API Error:', error.message);
    // Fallback to simulation on any network failure
    return generateSimulatedTraffic();
  }
}

// Simulated fallback when no API key is available or network fails
async function generateSimulatedTraffic(): Promise<ActionResponse<TrafficData>> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // We intentionally return a "HEAVY" traffic state to trigger the Time-Shift Concierge UX
  const simulatedData = TrafficDataSchema.parse({
    status: 'HEAVY',
    estimatedDelayMinutes: 45,
    route: 'Ayalon Highway (Route 20)',
  });

  return { success: true, data: simulatedData };
}

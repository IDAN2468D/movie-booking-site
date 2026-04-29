import { NextResponse } from 'next/server';

/**
 * Health check endpoint to prevent Render.com free tier from sleeping
 * and to monitor app vitals.
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'active', 
      timestamp: new Date().toISOString(),
      service: 'Movie Booking Site AI'
    },
    { status: 200 }
  );
}

import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200" fill="none">
  <rect width="800" height="1200" fill="#0A0A0E"/>
  <rect width="800" height="1200" fill="url(#grad)" opacity="0.4"/>
  <circle cx="400" cy="550" r="140" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <path d="M370 510L450 550L370 590V510Z" fill="rgba(255,255,255,0.4)"/>
  <text x="400" y="740" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="sans-serif" font-size="28" font-weight="500">CINEMATIC FRAME</text>
  <defs>
    <radialGradient id="grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 600) rotate(90) scale(600 400)">
      <stop stop-color="#A855F7" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#09090B" stop-opacity="0"/>
    </radialGradient>
  </defs>
</svg>`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return new NextResponse(FALLBACK_SVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imageRes.arrayBuffer();

    // Return the image data with proper CORS headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse(FALLBACK_SVG, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { genre, prompt } = await req.json();

    // Note: In production, this would call Google Cloud Vertex AI (Imagen 3 API)
    // or OpenAI DALL-E 3 API. Since this requires specific GCP setup, 
    // we simulate the AI generation process with a delay and return high-quality thematic avatars.
    
    await new Promise(resolve => setTimeout(resolve, 3500));

    let imageUrl = 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=400&auto=format&fit=crop'; // Default neon/cyberpunk
    
    if (genre === 'נואר (שחור-לבן)') {
      imageUrl = 'https://images.unsplash.com/photo-1583847268964-b28ce8f31586?q=80&w=400&auto=format&fit=crop&grayscale';
    } else if (genre === 'פנטזיה') {
      imageUrl = 'https://images.unsplash.com/photo-1543616991-75a2c12500ba?q=80&w=400&auto=format&fit=crop';
    } else if (genre === 'סייברפאנק') {
      imageUrl = 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop';
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

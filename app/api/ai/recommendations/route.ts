import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/ai-engine';
import { AIRequest } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    
    if (!body.userProfile || !body.movieDatabase || !body.liveInventory) {
      return NextResponse.json(
        { error: 'Missing required data fields' },
        { status: 400 }
      );
    }

    const result = await generateRecommendations(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Engine Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

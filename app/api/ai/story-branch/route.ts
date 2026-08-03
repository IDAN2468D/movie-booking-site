import { NextRequest, NextResponse } from 'next/server';
import { storyBranchingSchema } from '@/lib/validations/interactiveStory';
import { generateStoryBranches } from '@/lib/ai/storyBranching';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = storyBranchingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.flatten() }, { status: 400 });
    }

    const { movieId, sceneDescription, currentTimestamp } = validation.data;

    // Generate story branches using Gemini 3.5 Flash Lite
    const result = await generateStoryBranches(movieId, sceneDescription, currentTimestamp);

    // Non-blocking telemetry logging
    Promise.resolve().then(() => {
      console.log(`[CinePulse AI Telemetry] Story branch generated for Movie ${movieId} at t=${currentTimestamp}s`);
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

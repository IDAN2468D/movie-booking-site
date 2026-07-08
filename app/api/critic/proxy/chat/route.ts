import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message, localContext } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'LLM API key not configured in environment' }, { status: 500 });
    }

    // Shielding API keys from the client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a localized in-site AI movie critic. You are knowledgeable, sharp, and highly cinematic in your speech. 
Context: The user is currently looking at Movie ID: ${localContext?.movieId || 'Unknown'}. 
User's Current Mood: ${localContext?.currentMood || 'Neutral'}.
Instruction: Keep responses concise (1-3 sentences max), engaging, and relevant to the user's mood and the specific movie context.`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to critique.' }] }
      ],
    });

    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (error) {
          console.error("Stream parsing error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error) {
    console.error('Critic Chat Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

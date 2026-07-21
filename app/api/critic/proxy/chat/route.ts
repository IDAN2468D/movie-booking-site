import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const runtime = 'edge';

const PayloadSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  localContext: z.object({
    movieId: z.string().optional(),
    currentMood: z.string().optional(),
    appState: z.object({
      currentPath: z.string(),
      isSwiping: z.boolean(),
      flashOfferActive: z.boolean(),
    }).optional(),
  }).optional(),
});

// Predictive Engine Logic: Mock server-side aggregation pipeline
async function fetchUserPersonaVector(userId?: string) {
  // In a real environment, this aggregates MongoDB order history and swipe patterns.
  return ["Sci-Fi Fan", "Prefers Aisle Seats", "Frequent Weekend Booker"];
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = PayloadSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 });
    }

    const { message, localContext } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'LLM API key not configured in environment' }, { status: 500 });
    }

    // Shielding API keys from the client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const personaVector = await fetchUserPersonaVector();

    const systemPrompt = `You are a localized in-site Cognitive AI Concierge. You are knowledgeable, sharp, proactive, and highly cinematic. 
Context: The user is currently looking at Movie ID: ${localContext?.movieId || 'Unknown'}. 
User's Current Mood: ${localContext?.currentMood || 'Neutral'}.
User Persona Vector: ${personaVector.join(', ')}.
App State: Route=${localContext?.appState?.currentPath || '/'}, Swiping=${localContext?.appState?.isSwiping ? 'Yes' : 'No'}, Flash Offer=${localContext?.appState?.flashOfferActive ? 'Yes' : 'No'}.

Instruction: Keep responses concise (1-3 sentences max), engaging, and relevant. Use the Persona Vector and App State to provide proactive, context-aware suggestions (e.g. if Flash Offer is active, gently encourage booking).`;

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

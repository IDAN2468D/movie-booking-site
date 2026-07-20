import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: 'No transcript provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              description: "The intended action. Must be exactly 'navigate' or 'unknown'."
            },
            route: {
              type: SchemaType.STRING,
              description: "The route to navigate to. Must be one of: '/', '/tickets', '/favorites', '/discovery', '/profile', '/splinter-demo', '/showcase', '/vision', '/coming-soon', '/vip', or '' if unknown."
            },
            feedback: {
              type: SchemaType.STRING,
              description: "A short, natural, enthusiastic Hebrew response confirming the action (e.g. 'מעביר אותך לעמוד הבית', 'פותח את אזור ה-VIP'). If unknown, apologize in Hebrew."
            }
          },
          required: ["action", "route", "feedback"]
        }
      }
    });

    const prompt = `
      You are the AI Voice Concierge for a hyper-premium movie booking platform.
      A user has spoken the following voice command (often in Hebrew): "${transcript}"
      
      Map their intent to one of the following valid app routes:
      - "/" : Home page, movies, browsing.
      - "/tickets" : My tickets, purchased tickets, qr codes.
      - "/favorites" : Liked movies, saved list.
      - "/discovery" : Neural discovery, emotional search, finding new movies.
      - "/profile" : Settings, user profile, account.
      - "/splinter-demo" : Ticket splintering, sharing tickets, gamified splitting.
      - "/showcase" : Swipe matcher, tinder for movies.
      - "/vision" : Our vision, about us.
      - "/coming-soon" : Upcoming movies.
      - "/vip" : VIP club, premium rewards.
      
      If their intent matches a route, set action="navigate", provide the exact route, and write a full, polite, engaging Hebrew sentence confirming the action explicitly (e.g. "מעביר אותך מיד למסך בקרוב!", "פותח עבורך את אזור המועדפים שלך").
      If their intent has absolutely nothing to do with the app, set action="unknown" and write a polite Hebrew apology.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Gemini Voice Nav Error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process voice command' },
      { status: 500 }
    );
  }
}

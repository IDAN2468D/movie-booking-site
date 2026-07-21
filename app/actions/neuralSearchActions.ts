'use server';

import { z } from 'zod';
import { callGeminiWithRetry } from '@/lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const NeuralSearchSchema = z.object({
  prompt: z.string().min(3).max(500),
  movies: z.array(z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string().optional(),
    genre_ids: z.array(z.number()).optional()
  }))
});

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function executeNeuralSearch(
  payload: z.infer<typeof NeuralSearchSchema>
): Promise<ActionResponse<{ matchedIds: number[], analysis: string }>> {
  try {
    const parsed = NeuralSearchSchema.safeParse(payload);
    
    if (!parsed.success) {
      return { success: false, error: 'Invalid search payload.' };
    }

    const { prompt, movies } = parsed.data;

    // To prevent passing too massive of a string, we map it to JSON string 
    // taking only the first 50 movies to avoid token limits if the list gets huge.
    const limitedMovies = movies.slice(0, 50).map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview ? m.overview.substring(0, 150) + '...' : ''
    }));

    const systemInstruction = `You are an expert film curator and "Neural Emotion Matrix" AI.
The user is requesting movies based on a mood, emotion, or specific cinematic vibe.
You are given a list of available movies (JSON format) with their IDs and titles.

Analyze the user's prompt: "${prompt}"

Select the top 5 most relevant movie IDs from the provided list that match this vibe.
Also provide a short 1-sentence "analysis" explaining your choice in Hebrew.

Return ONLY a valid raw JSON object in this exact format:
{
  "matchedIds": [123, 456, 789],
  "analysis": "..."
}
Do NOT wrap the response in markdown \`\`\`json blocks.
`;

    const resultData = await callGeminiWithRetry(
      ['gemini-3.5-flash-lite', 'gemini-2.5-flash'],
      async (model) => {
        const generativeModel = genAI.getGenerativeModel({
          model: model.model,
          systemInstruction
        });

        const promptMessage = `Available movies: ${JSON.stringify(limitedMovies)}`;

        const result = await generativeModel.generateContent(promptMessage);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        return { text };
      }
    );

    try {
      const parsedJson = JSON.parse(resultData.text);
      if (!Array.isArray(parsedJson.matchedIds)) {
         throw new Error("matchedIds is not an array");
      }
      return {
        success: true,
        data: {
          matchedIds: parsedJson.matchedIds,
          analysis: parsedJson.analysis || "מצאנו כמה סרטים שמתאימים לוויב שלך."
        }
      };
    } catch (parseError) {
      console.warn("Failed to parse Gemini Neural response:", resultData.text);
      return { success: false, error: "AI response parsing failed." };
    }

  } catch (error: any) {
    console.error('Neural Search Action Error:', error);
    return { success: false, error: 'Failed to execute neural search.' };
  }
}

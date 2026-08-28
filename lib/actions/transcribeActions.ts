"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  TranscribeRequestSchema,
  TranscribeResponse,
  SubtitleCue,
} from "@/lib/schemas/subtitleSync";
import { connectToDatabase } from "@/lib/mongoose";
import SubtitleTrack from "@/lib/models/SubtitleTrack";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || ""
);

const SYSTEM_PROMPT = `You are CineSub AI - an elite movie audio transcription, multi-speaker diarization, and subtitle translation engine.
Analyze the provided movie audio chunk carefully.
1. Transcribe the spoken dialogue with accurate relative millisecond timestamps (startTimeMs, endTimeMs).
2. Perform multi-speaker diarization: Label speakers consistently as 'Speaker 1', 'Speaker 2', 'Speaker 3', etc.
3. Translate all dialogue into natural, modern, localized Hebrew (Israel).
4. If dramatic audio cues, background sounds, or score themes occur, create a cue with isMusicOrEffect: true and Hebrew sound tags like "[מוזיקה דרמטית]" or "[קול פיצוץ]".
5. Output strictly JSON with the format:
{
  "detectedLanguage": "en",
  "summary": "Brief summary of spoken dialogue in Hebrew",
  "cues": [
    {
      "startTimeMs": 0,
      "endTimeMs": 2500,
      "speaker": "Speaker 1",
      "originalText": "We have to leave now.",
      "translatedText": "אנחנו חייבים לעזוב עכשיו.",
      "confidence": 0.96,
      "isMusicOrEffect": false
    }
  ]
}`;

export async function processLiveAudioChunk(
  rawPayload: unknown
): Promise<TranscribeResponse> {
  try {
    const validated = TranscribeRequestSchema.parse(rawPayload);
    const cleanBase64 = validated.audioBase64.replace(/^data:audio\/[\w+]+;base64,/, "");

    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        cues: [],
        detectedLanguage: "he",
        timestamp: Date.now(),
        error: "Gemini API key is not configured.",
      };
    }

    const modelCandidates = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
    let rawText = "";
    let lastErr: Error | null = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });

        const result = await model.generateContent([
          SYSTEM_PROMPT,
          {
            inlineData: {
              mimeType: validated.mimeType,
              data: cleanBase64,
            },
          },
        ]);

        rawText = result.response.text();
        if (rawText) break;
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err?.message);
      }
    }

    if (!rawText && lastErr) {
      throw lastErr;
    }

    const parsed = JSON.parse(rawText || "{}");
    const cues: SubtitleCue[] = (parsed.cues || []).map((c: any, index: number) => ({
      id: `cue-${Date.now()}-${index}`,
      startTimeMs: Number(c.startTimeMs || 0) + validated.sceneTimestampMs,
      endTimeMs: Number(c.endTimeMs || 3000) + validated.sceneTimestampMs,
      speaker: c.speaker || "Speaker 1",
      speakerColor: undefined,
      originalText: String(c.originalText || ""),
      translatedText: String(c.translatedText || ""),
      confidence: typeof c.confidence === "number" ? c.confidence : 0.95,
      isMusicOrEffect: Boolean(c.isMusicOrEffect),
    }));

    if (validated.movieId && cues.length > 0) {
      try {
        await connectToDatabase();
        await SubtitleTrack.create({
          movieId: validated.movieId,
          sceneTimestampMs: validated.sceneTimestampMs,
          language: validated.targetLanguage,
          cues,
          geminiModel: "gemini-2.0-flash",
        });
      } catch (dbErr) {
        console.warn("SubtitleTrack caching notice:", dbErr);
      }
    }

    return {
      success: true,
      cues,
      detectedLanguage: parsed.detectedLanguage || "en",
      summary: parsed.summary || "",
      timestamp: Date.now(),
    };
  } catch (error: any) {
    console.error("CineSub AI error:", error);
    return {
      success: false,
      cues: [],
      detectedLanguage: "unknown",
      timestamp: Date.now(),
      error: error.message || "Failed to process live audio chunk",
    };
  }
}

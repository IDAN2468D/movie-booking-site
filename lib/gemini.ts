import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const PREFERRED_GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];

/**
 * 🛠️ Robust Gemini Caller with Exponential Backoff and Model Fallback
 * Defaults strictly to gemini-3.5-flash-lite across all AI operations.
 */
export async function callGeminiWithRetry<T>(
  modelNames: string | string[] = PREFERRED_GEMINI_MODELS,
  fn: (model: GenerativeModel) => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  const models = Array.isArray(modelNames) ? modelNames : [modelNames];

  let lastError: Error | undefined;
  
  for (const modelName of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        return await fn(model);
      } catch (err: unknown) {
        const error = err as { status?: number; message?: string };
        lastError = err instanceof Error ? err : new Error(String(err));
        
        if ((error.status === 503 || error.status === 429) && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          console.warn(`Gemini model ${modelName} busy (${error.status}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.error(`Gemini model ${modelName} failed:`, error.message);
        break; 
      }
    }
  }
  
  throw lastError;
}

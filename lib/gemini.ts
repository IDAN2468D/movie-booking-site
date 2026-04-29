import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * 🛠️ Robust Gemini Caller with Exponential Backoff and Model Fallback
 * Handles 503 Service Unavailable errors gracefully and switches to fallback models if needed.
 */
export async function callGeminiWithRetry<T>(
  modelNames: string | string[],
  fn: (model: GenerativeModel) => Promise<T>,
  maxRetries = 2,
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
        
        // If it's a 503 (Service Unavailable) or 429 (Rate Limit), retry
        if ((error.status === 503 || error.status === 429) && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          console.warn(`Gemini model ${modelName} is busy (${error.status}). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If we've exhausted retries for this model, break to try the next model in the list
        console.error(`Gemini model ${modelName} failed after retries:`, err.message);
        break; 
      }
    }
  }
  
  throw lastError;
}

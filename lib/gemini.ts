import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * 🛠️ Robust Gemini Caller with Exponential Backoff
 * Handles 503 Service Unavailable errors gracefully.
 */
export async function callGeminiWithRetry(
  modelName: string,
  fn: (model: GenerativeModel) => Promise<any>,
  maxRetries = 3,
  initialDelay = 1000
) {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      return await fn(model);
    } catch (err: any) {
      lastError = err;
      
      // If it's a 503 (Service Unavailable), retry
      if (err.status === 503 && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`Gemini model ${modelName} is busy (503). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // For other errors or if we've exhausted retries, throw
      throw err;
    }
  }
  
  throw lastError;
}

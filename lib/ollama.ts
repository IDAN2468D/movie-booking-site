/**
 * 🤖 Ollama Core Client Driver (v1.0)
 * Highly optimized for Next.js Server Actions and API Routes.
 * Communicates with local Gemma models with robust sanitization and type-safety.
 */

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  success: boolean;
  content: string;
  model: string;
  error?: string;
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma2:2b';

/**
 * Sends a chat completion query to the local Ollama instance.
 */
export async function callOllama(
  messages: OllamaMessage[],
  options: { 
    temperature?: number; 
    model?: string;
    jsonMode?: boolean;
  } = {}
): Promise<OllamaResponse> {
  const modelToUse = options.model || OLLAMA_MODEL;
  
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
        },
        format: options.jsonMode ? 'json' : undefined
      }),
      // Set a generous timeout of 180 seconds for heavier models like 31B
      signal: AbortSignal.timeout(180000)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.message?.content || '';

    return {
      success: true,
      content,
      model: modelToUse
    };

  } catch (error: any) {
    console.error('Ollama communication error:', error);
    return {
      success: false,
      content: '',
      model: modelToUse,
      error: error.message || 'Unknown Ollama error'
    };
  }
}

/**
 * Helper to parse structured JSON from Ollama responses.
 * Automatically cleans markdown blocks (```json ... ```) if present.
 */
export function sanitizeAndParseJSON<T>(content: string): T | null {
  try {
    // Strip markdown code fences if Ollama included them
    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
      
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error('Failed to parse JSON from Ollama content:', content, e);
    return null;
  }
}

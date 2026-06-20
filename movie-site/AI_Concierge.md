# 🤖 AI Concierge & Self-Healing Fallbacks

Powers natural language movie discovery and booking wizards, ensuring 100% uptime with local fallbacks.

## 💬 Conversational Experience

### Interactive Chat Orb
- Designed as a translucent 3D glass sphere (`backdrop-blur-3xl saturate-200%`).
- Standard breathing states:
  - `idle`: Slow ambient hover animation.
  - `listening`: Fast pulse responsive to voice/input.
  - `processing`: Horizontal laser scanning line overlay.
  - `speaking`: Soft glow matching speech outputs.

---

## 🔌 API & Integration Stack

### Gemini API Core
- Uses `@google/generative-ai` SDK.
- Configured with System Instructions to enforce Hebrew language output and the Booking Wizard structure.
- **Function Calling (Tools)**: Supports search tools for matching movies, locations, showtimes, and booking.

### 🛡️ Local Ollama Fallback (Self-Healing)
All external AI API routes implement an automated fallback process in their catch blocks to guarantee service availability even when offline, rate-limited, or when API keys are invalid.

```typescript
try {
  // 1. Primary path: Call Gemini API
  return await callGeminiAPI(prompt);
} catch (error) {
  console.warn("Gemini API failed or rate-limited. Activating local Ollama fallback...", error);
  try {
    // 2. Fallback path: Call local Ollama gemma2:2b instance
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "gemma2:2b",
        prompt: prompt,
        stream: false
      })
    });
    const result = await ollamaResponse.json();
    return result.response;
  } catch (fallbackError) {
    console.error("Critical: Local Ollama fallback also failed.", fallbackError);
    throw new Error("AI Services Unavailable");
  }
}
```

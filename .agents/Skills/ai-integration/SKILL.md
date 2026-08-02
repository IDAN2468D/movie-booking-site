# 🧠 Skill: Gemini AI Integration & Model Routing

## Purpose
Governs integration with `@google/generative-ai`, prompt design, structured response parsing, and model routing.

## AI Specifications
1. **Default Model:** `gemini-3.5-flash-lite` for all automated insights, expense categorization, financial advice, and chat features.
2. **System Prompts:** Include system instructions defining persona, response language (Hebrew / English), and formatting rules.
3. **Structured Outputs:** Request JSON formatting in prompts (`responseSchema` or explicit JSON constraints) and sanitize outputs with Zod.
4. **Resiliency & Fallbacks:** Wrap API calls in `try/catch` blocks with graceful UI error states when API quota or network limits are hit.

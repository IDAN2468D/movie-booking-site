---
name: gemini-managed-agents
description: Guide and code snippets for working with Gemini Managed Agents (Antigravity and Deep Research) via the google-genai SDK, strictly integrated with the v8.0 Agent Stack Framework.
---

# Gemini Managed Agents & Enterprise-Cognitive Integration

Gemini Managed Agents (such as `Antigravity` and `Deep Research`) allow you to run an AI agent with a single API call via the `google-genai` SDK.

## 🏗️ Methodological Guardrails (v8.0 Alignment)
When implementing or invoking a Managed Agent within the Movie Booking Site, you **MUST** strictly adhere to the following framework rules:

### 1. Unified Result Pattern (Backend API)
Any Next.js API Route or Server Action that orchestrates a Managed Agent MUST return its result wrapped in the standard layout contract:
```typescript
{ success: boolean; data?: any; error?: string }
```

### 2. Data Boundary Validation (Zod)
Before sending the `input` prompt to the Managed Agent, and when processing its `interaction.output_text`, inputs and outputs must be parsed using strict **Zod schemas**. Never pass untrusted data directly to the agent without validation.

### 3. Layer 4 & 5 Compliance
- **Plan & Gated Checkpoints:** Do not spawn Background Agents for codebase modifications without explicit User Approval via Layer 4's `implementation_plan.md`.
- **Atomic File Isolation:** If the Managed Agent generates or writes code, you must explicitly inject prompt instructions to enforce the strict **200 LOC ceiling** per file.

## Setup & Implementation
Ensure your API credentials reside exclusively within encrypted server-side environment variables (`.env`).
```bash
pip install google-genai
export GEMINI_API_KEY="your-key-here"
```

## Basic Usage (Python Example)
```python
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Read Hacker News, summarize the top 10 stories, and save the results as a PDF.",
    environment="remote"
)

print(interaction.output_text)
```

## Advanced Configuration

### Background Execution
For asynchronous execution (e.g., Deep Research), run the agent in the background. If integrated into the frontend, ensure the loading state is represented via **Liquid Glass 4.0** standards (120Hz GPU motion, zero-reflow).
```python
interaction = client.interactions.create(
    agent="antigravity-preview-05-2026",
    input="Complex long running task...",
    environment="remote",
    background=True # Polling required
)
```

### Environments
- `"remote"`: A fresh, clean sandbox (Default for zero-drift Layer 1 execution).
- `"env_abc123"`: State-preserving environment.
- `EnvironmentConfig`: Custom configurations.

### MCP Tools Integration
When exposing external backend systems to the agent via MCP, ensure the MCP server operations are also fully typed and isolated:
```python
tools = [{
    "type": "mcp_server",
    "name": "my-tools",
    "url": "https://your-mcp-server.example.com"
}]
```

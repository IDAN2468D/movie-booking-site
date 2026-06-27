# 🧪 Skill: Intelligent Research & Knowledge Management (Res-01)

Governs the use of NotebookLM MCP tools for deep research, documentation synthesis, and artifact generation.

## 🗝️ Core Principles
1. **Source-First Intelligence**: Never guess technical implementation; research official documentation or industry standards first.
2. **Knowledge Synthesis**: Convert raw research (URLs, PDFs) into actionable project knowledge (KIs).
3. **Structured Delivery**: Use NotebookLM to generate high-fidelity artifacts (Reports, Mind Maps, Slide Decks) for project stakeholders.

## 🛠️ Implementation Specs

### 1. Triggering Deep Research
- **When**: Encountering unknown APIs, complex design patterns, or business logic gaps.
- **Action**: Use `research_start(mode="deep", source="web")` to gather at least 40 sources on the topic.

### 2. Documentation Management
- **Syncing**: When a new library is added (e.g., GSAP, Framer Motion), add its documentation URL using `notebook_add_url`.
- **Querying**: Use `notebook_query` to find specific implementation details within added sources before writing code.

### 3. Artifact Generation
- **For Yuval**: Create a `mind_map_generate` for complex features to visualize flow before coding.
- **For Reviews**: Generate an `audio_overview_create` to provide a vocal summary of a major feature implementation.

### 4. AI Cinematic Insights (Flash-Lite Engine)
- **Model**: `gemini-3.1-flash-lite-preview` (Mandatory).
- **Purpose**: Real-time analysis of movie metadata to provide unique "Why Watch" insights and emotional scoring in the Movie Details view.
- **Data Flow**: Fetches from `/api/ai/cinematic-insights` using TMDB metadata as context.

## 🔍 Audit Checklist
- [ ] Are the research sources credible and up-to-date?
- [ ] Has the discovered knowledge been distilled into the project's Knowledge Items (KIs)?
- [ ] Does the generated artifact follow the Liquid Glass 2.0 aesthetics?

---
> [!TIP]
> Use `notebook_add_drive` to sync with your personal research notes or design briefs stored in Google Drive.

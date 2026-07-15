# Skill: Feature Audit & Roadmap Generator (v2.0)

## Objective
Analyze the current project state (latest.md, task.md) and architect next-generation, hyper-premium features that strictly adhere to the "Liquid Glass 4.0" design system, "Acoustic Wavefront Spatializer", and "Agent Stack" rules.

## Execution Protocol
1. **Context Loading:**
   - Read `latest.md` (Current Status) and `task.md` (Completed Features).
   - Query **StitchMCP** (`list_projects`, `list_screens`, `get_project`) to retrieve screens, design tokens, and components from related workspaces as benchmarks and inspiration for new features.
2. **Deep-Dive Gap Analysis:**
   - Review implemented features.
   - Cross-reference with hyper-premium Cinema/Booking Enterprise trends (e.g., Co-Viewing, Haptic feedback, Spatial UI).
   - Identify missing logical layers while strictly preventing system bloat (Lean execution).
3. **Architectural Feasibility Check:** 
   - **Visuals:** Must utilize 120Hz Zero-Reflow GPU rendering (transform-gpu, opacity).
   - **Audio:** Must incorporate the Web Audio API (PannerNode/BiquadFilterNode) for spatial feedback.
   - **Security:** Ensure zero MongoDB client exposure and strict Zod boundary validation.
4. **Output Generation:** 
   - Present a Markdown table: [Feature Name] | [Target Sprint] | [Complexity] | [Tech Stack/API].
   - Provide the "Value Proposition" (User Value / Premium FOMO).
   - Define a Strict 3-Step Technical Roadmap (Data Layer -> UI/Physics -> Integration/Acoustics) for the top choice.

## Available MCP Reference for Feature Generation
Utilize these tools to implement next-gen features:
1. **StitchMCP:** `list_projects`, `list_screens`, `get_project`, `generate_screen_from_text`, `edit_screens` (UI prototyping, layout & theme alignments).
2. **google-gemma-31b:** `generate_image`, `generate_video`, `generate_svg`, `gemini_chat`, `gemini_deep_research` (Cinematic AI assistants, asset generators, video teasers).
3. **rapidapi_currency:** `Convert`, `Recent_Exchange_Rates` (Dynamic ticket currencies, portfolio conversions).
4. **visualization:** `render_chart` (Interactive analytics dashboards, VIP points trends).
5. **mongodb-mcp-server:** `aggregate`, `find` (Complex query pipelines for recommendations, real-time social queues).

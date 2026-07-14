# Skill: Feature Audit & Roadmap Generator (v2.0)

## Objective
Analyze the current project state (latest.md, task.md) and architect next-generation, hyper-premium features that strictly adhere to the "Liquid Glass 4.0" design system, "Acoustic Wavefront Spatializer", and "Agent Stack" rules.

## Execution Protocol
1. **Context Loading:** Read `latest.md` (Current Status) and `task.md` (Completed Features).
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

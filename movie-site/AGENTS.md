# 🤖 Movie Booking Site - Neural Discovery & Unified AI Governance Standard (v6.1)
*Single Source of Truth. Adherence mandatory.*

## 🎯 1. Identity, Communication & Scope Rules
- **Role**: Senior Full-Stack Developer, AI UX Architect, & Strategic Partner.
- **Tone**: Proactive, modular, honest. Reject bad tech design; defend SOLID/performance standards.
- **Lang**: Hebrew for Chat (RTL Liquid Glass Container below), English for Code/Docs.
- **RTL Glass Container**:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

## 🧠 2. Neural Discovery System & Acoustic Integration
- **Deprecation of Legacy Search**: Traditional search bars and filter forms are entirely deprecated. 
- **Neural Movie Discovery**: The primary discovery interface is emotion-driven. Users interact by dragging and dropping **Emotion Bubbles** into a central **Thought Core**.
- **Real-Time Sync**: Upon absorbing an emotion bubble, the Thought Core instantly syncs and retrieves the most appropriate movie list mapped to the user's current feeling.
- **Acoustic Wavefront Spatializer**: All critical UI interactions (such as the Seating Roulette spin loop) must utilize the Web Audio API (`PannerNode` and `BiquadFilterNode`). Clicks should be spatialized based on matrix grid coordinates, and successful state resolutions must trigger an immersive sub-bass frequency drop (e.g., 40Hz).
- **The Kinetic Ticket Fusion**: Successful booking or seat locking must trigger a hardware-accelerated particle explosion (using `framer-motion`), which seamlessly assembles into "The Kinetic Ticket" absolute preview overlay.

## ⚙️ 3. Core Architecture & Backend Guardrails
- **Atomic File Isolation**: Every code asset has a strict physical maximum of **200 lines of code** per file. Logic exceeding this ceiling must be immediately decomposed into isolated sub-components or modular utility hooks.
- **Data Boundary Validation**: No data may pass untrusted boundaries without explicit schema validation. **Zod schemas** are strictly mandatory to enforce type-safe operational boundaries.
- **Legacy Date Fallbacks**: Database queries performing timeline operations must incorporate an explicit fallback translation block (e.g., evaluating string comparisons against `toLocaleDateString('he-IL')` mutation of the legacy `createdAt` timestamp).
- **Unified Result Pattern**: All operational handlers, Server Actions, and database microservices must encapsulate outputs within a deterministic layout contract: `{ success: boolean; data?: any; error?: string }`.
- **State Management**: Implemented natively via **Zustand**. To prevent layout re-renders, the use of strict, isolated state slice selectors is strictly mandatory.

> [!CAUTION]
> **CRITICAL SECURITY GUARDRAIL: Zero MongoDB Client Exposure**
> The system connection string `mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/` must **never** be embedded, hardcoded, or exposed anywhere within the client bundle. The application must communicate strictly through an isolated server-side API layer. All database credentials must reside exclusively within encrypted, server-side environment variables (`.env`).

## 🎨 4. Design System: Liquid Glass 4.0 & Stitch MCP Layouts
- **Aesthetic Theme**: Premium futuristic dark mode leveraging layered high-depth glass components, sharp refraction backlighting tokens, and explicit optical depth rendering.
- **Hyper-Refraction Layer (Glass Backdrop)**: `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
- **Sub-Pixel Chromatic Borders**: `border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
- **Layered Macro-Depth Shadows**: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
- **Typography Standards**:
  - Headings/Titles: `font-family: 'Outfit', sans-serif;` with a subtle specular text-shadow if highlighted.
  - Body/Metadata: `font-family: 'Inter', sans-serif;` for absolute pixel-perfect readability.
- **120Hz GPU Motion Profile**: All dynamic scroll tracking, hover effects, particle explosions, or drag gestures must map mutations via hardware-accelerated GPU layers (`x`, `y`, `scale`, `rotate`) instead of layout geometry attributes (`left`, `top`, `margin`). This totally eliminates layout reflow penalties and keeps animation profiles locked at 120Hz. Ensure strict Zero-Reflow architecture.
- **Framer Motion & SVG Integration**: Dynamic transformations applied to vector graphics must be bound via inline styles (`style={{ x, y }}`) rather than standalone XML attributes to prevent unintended layout scaling resets.
- **Seat Mapping Tokens**: Occupied/Muted seats must render as: `opacity-35 stroke-white/10 fill-white/5 cubic-bezier(0.4, 0, 0.2, 1)`.

### 4.2 Stitch MCP Integration Standards
When executing design synchronization cycles via the Stitch MCP, validate all assets against Project ID `16086567673497814787`. Screens must align explicitly to verified database nodes:
- **Splash Screen Asset Node**: Screen ID `aef73438a91f4230a5a66ab754033b27`.
- **Design System Reference State**: Token ID `asset-stub-assets_185a109d61a34f88aadba67182e6dc6f`.
- **Native Initialization Rules**: `expo-splash-screen` native SDK initialization is required. Lock rendering using `SplashScreen.preventAutoHideAsync()` and invoke `hideAsync()` only when session state transitions are 100% resolved to fully eradicate layout flickering.

## 🚀 5. QA, Verification & Deployment Protocols
- **Source Control Hygiene**: Commits must be strictly atomic, isolated, and highly descriptive.
- **Pre-Flight Sanity Routines**: Prior to requesting push clearance, successfully run a local production build sequence via `npm run build`, followed immediately by the automated suite via `npx vitest run`. Any failures trigger an automatic rollback.
- **CI/CD Enforcement**: Remote repositories must execute automated pipeline suites on all incoming Pull Requests targeting protected primary trunks (`main`).

## 🤖 6. Framework Rule: Architectural Enforcement
- BEFORE executing any feature request, bug fix, or code modification, you MUST activate and follow the strict 5-layer engine defined in `.agents/skills/AgentStackFramework.md`.
- Never bypass the Markdown Persistence layer or the Plan/Checkpoint gate.

## 🛑 7. STRICT TOKEN OPTIMIZATION RULES
You operate in a high-efficiency environment where tokens are heavily budgeted. 
Adhere to these output constraints strictly:

1. **NO FULL FILE REWRITES:** Never rewrite an entire file if only small parts changed. 
2. **USE CODE SNIPPETS / DIFFS:** Provide only the specific functions or lines that need modification. Use clear comments indicating where the code fits:
   ```javascript
   // ... existing code ...
   function updatedTarget() {
       // Only the changed logic here
   }
   // ... existing code ...
   ```

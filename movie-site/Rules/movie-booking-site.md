# 🤖 Movie Booking Site - Neural Discovery & Unified AI Governance Standard (v6.0)
*Single Source of Truth. Adherence mandatory.*

## 🎯 1. Identity, Communication & Scope Rules
- **Role**: Senior Full-Stack Developer, AI UX Architect, & Strategic Partner.
- **Tone**: Proactive, modular, honest. Reject bad tech design; defend SOLID/performance standards.
- **Lang**: Hebrew for Chat (RTL Liquid Glass Container below), English for Code/Docs.
- **RTL Glass Container**:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

## 🧠 2. Neural Discovery System (Core UX Paradigm)
- **Deprecation of Legacy Search**: Traditional search bars and filter forms are entirely deprecated. 
- **Neural Movie Discovery**: The primary discovery interface is now emotion-driven. Users interact by dragging and dropping **Emotion Bubbles** into a central **Thought Core**.
- **Real-Time Sync**: Upon absorbing an emotion bubble, the Thought Core must instantly sync and retrieve the most appropriate movie list mapped to the user's current feeling.
- **Fluid Interactions**: All drag-and-drop mechanics and Thought Core reactions (pulsing, chromatic shifts, particle absorption) must strictly utilize the 120Hz GPU Motion Profile to ensure zero-latency feedback.

## ⚙️ 3. Core Architecture & Backend Guardrails
- **Atomic File Isolation**: Every code asset has a strict physical maximum of **200 lines of code** per file. Logic exceeding this ceiling must be immediately decomposed into isolated sub-components, specialized helper classes, or modular utility services.
- **Data Boundary Validation**: No data may pass untrusted boundaries (e.g., API requests, storage reads, form inputs) without explicit schema validation. The use of **Zod schemas** is strictly mandatory to enforce type-safe operational boundaries.
- **Legacy Date Fallbacks**: Database queries performing timeline operations or booking filters must incorporate an explicit fallback translation block. If historical records lack a dedicated, structured date field, the engine must fall back to evaluating string comparisons against the `toLocaleDateString('he-IL')` mutation of the legacy `createdAt` timestamp.
- **Unified Result Pattern**: To avoid unhandled runtime exceptions and untracked failures, all operational handlers, controllers, and database microservices must encapsulate outputs within a deterministic layout contract: `{ success: boolean; data?: any; error?: string }`.
- **State Management**: Implemented natively via **Zustand**. To prevent catastrophic layout re-renders and memory leakage across long-lived application cycles, the use of strict, isolated state slice selectors is strictly mandatory.

> [!CAUTION]
> **CRITICAL SECURITY GUARDRAIL: Zero MongoDB Client Exposure**
> The system connection string `mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/` must **never** be embedded, hardcoded, or exposed anywhere within the client-side Expo or React Native bundle. Doing so represents an instant compliance failure, leaving database clusters vulnerable to external extraction and unauthorized deletion. The mobile application must communicate strictly through an isolated server-side API layer. All database credentials must reside exclusively within encrypted, server-side environment variables (`.env`).

## 🎨 4. Design System: Liquid Glass 4.0 & Stitch MCP Layouts
- **Aesthetic Theme**: Premium futuristic dark mode. The UI must leverage layered high-depth glass components, sharp refraction backlighting tokens, and explicit optical depth rendering.
- **Hyper-Refraction Layer (Glass Backdrop)**: `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
- **Sub-Pixel Chromatic Borders**: `border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
- **Layered Macro-Depth Shadows**: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
- **Typography Standards**:
  - Headings/Titles: `font-family: 'Outfit', sans-serif;` with a subtle specular text-shadow if highlighted.
  - Body/Metadata: `font-family: 'Inter', sans-serif;` for absolute pixel-perfect readability.
- **120Hz GPU Motion Profile**: All dynamic scroll tracking, hover effects, or drag gestures must map mutations via hardware-accelerated GPU layers (`x` and `y` properties) instead of layout geometry attributes (`left`, `top`, `margin`). This totally eliminates layout reflow penalties and keeps animation profiles locked at 120Hz.
- **Framer Motion & SVG Integration**: Dynamic transformations applied to vector graphics must be bound via inline styles (`style={{ x, y }}`) rather than standalone XML attributes to ensure that Framer Motion interaction states do not cause unintended layout scaling resets.
- **Seat Mapping Tokens**: Occupied/Muted seats must render as: `opacity-35 stroke-white/10 fill-white/5 cubic-bezier(0.4, 0, 0.2, 1)`.

### 4.2 Stitch MCP Integration Standards
When executing design synchronization cycles via the Stitch Model Context Protocol (MCP), the agent must validate all assets against Project ID `16086567673497814787`. Screens must align explicitly to verified database nodes:
- **Splash Screen Asset Node**: Screen ID `aef73438a91f4230a5a66ab754033b27`.
- **Design System Reference State**: Token ID `asset-stub-assets_185a109d61a34f88aadba67182e6dc6f`.
- **Splash Screen Loading Rules**: Native SDK initialization via `expo-splash-screen` is strictly required. The agent must lock rendering initialization immediately using `SplashScreen.preventAutoHideAsync()`, resolve all background configuration tokens in an asynchronous wrapper, and invoke `SplashScreen.hideAsync()` only when session state transitions are 100% resolved to fully eradicate layout flickering bugs.

## 🤖 5. The Agent Stack Framework (Memory Harness)
To eliminate systemic context drift and session amnesia during long-duration autonomous code execution, the agent must be bound to a strict 5-layer execution engine. This layout guarantees over 80% error mitigation compared to unharnessed multi-agent swarm setups.

`[1. MARKDOWN PERSISTENCE] ==> Read/Write Checkpoint & State Alignment || \/ [2. PRD SCOPE DEFINITION] ==> Freeze Product Intent & Rule Out Guesswork || \/ [3. SPEC TECH BLUEPRINT] ==> Audit Schema Boundaries & Input/Output Contracts || \/ [4. PLAN PHASE ROADMAP] ==> Generate Granular Steps (🔴 BREAKS FOR USER GATE) || \/ [5. LOOP SELF-HEALING] ==> Execute, Build, Test, and Repair Autonomously`

1. **Layer 1 — Markdown Persistence (`latest.md` / `README.md`)**: The agent must parse this file at the absolute initiation of every work block. It must record active milestones and update session metrics immediately upon completing sub-tasks to guarantee context continuity across environment resets.
2. **Layer 2 — PRD Scope Definition**: Establishes product definitions and target personas. The agent is explicitly barred from implementing capabilities that rely on ambiguous parameters or undocumented user assumptions.
3. **Layer 3 — Technical Blueprint (Spec)**: Establishes systemic schemas, strict interface contracts, and error conditions (e.g., token timeouts, database partition breaks) before generating any functional file modifications.
4. **Layer 4 — Step-by-Step Roadmap (Plan)**: Breaks down execution into isolated tasks with clear validation flags. **CRITICAL GATEKEEPER**: The agent must pause execution and request manual user sign-off (`🔴 Checkpoint`) prior to modifying any physical code files.
5. **Layer 5 — Self-Healing Execution Engine (Loop)**: Once authorized, the agent compiles code, evaluates terminal trace logs, runs internal vitest hooks, and corrects compilation anomalies autonomously until all validation assertions pass without needing human intervention.

| Harness Layer | Mandatory System Prompt Template |
| :--- | :--- |
| **1. Markdown** | "Maintain all structural context within a unified Markdown target file. Parse this state contract comprehensively before executing any operation." |
| **2. PRD** | "Write a lean PRD defining the core product scope, target user persona, and structural baseline requirements." |
| **3. Spec** | "Formulate a deep technical blueprint covering API boundaries, strict data inputs, explicit outputs, and comprehensive edge-case handling routines." |
| **4. Plan** | "Construct an isolated, granular task list with deterministic checkpoints. Pause execution completely and prompt for explicit manual authorization prior to file creation or modification." |
| **5. Loop** | "Execute compilation routines autonomously in a self-healing loop. Evaluate log traces, run vitest verification blocks, and repair anomalies until error states are clear." |

## 🚀 6. QA, Verification & Deployment Protocols
Operational stability must be certified via local and remote testing boundaries before any code is committed or merged.
- **Source Control Hygiene**: Commits must be strictly atomic, isolated, and highly descriptive. A singular commit may only track a single logical change block.
- **Upstream Branch Synchronization**: Pushing compiled assets or source lines directly to remote branches is completely forbidden until explicit, manual user validation has been granted in the chat environment.
- **Pre-Flight Sanity Routines**: Prior to requesting push clearance, the agent must successfully run a local production build sequence via `npm run build`, followed immediately by running the automated unit and integration suite via `npx vitest run`. Any testing failures trigger an automatic rollback to Layer 5.
- **CI/CD Enforcement**: Remote repositories must execute automated pipeline suites (`ci.yml` and `qa.yml`) on all incoming Pull Requests targeting protected primary trunks (`main` or `master`). Bypass configurations are strictly blocked.
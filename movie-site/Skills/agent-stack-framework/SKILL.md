---
name: "Agent Stack Framework"
description: "Run the agent using the 5 layers of the Agent Stack (Loop, Plan, PRD, Spec, Markdown) for autonomous long-running tasks."
---

# 🤖 Agent Stack Execution Skill (v6.2)

To eliminate systemic context drift and session amnesia during long-duration autonomous code execution, you must be bound to a strict 5-layer execution engine. This layout guarantees over 80% error mitigation compared to unharnessed multi-agent swarm setups.

When tasked with a complex feature or long-running objective, execute the task strictly using the Agent Stack methodology.

`[1. MARKDOWN PERSISTENCE] ==> Read/Write Checkpoint & State Alignment || \/ [2. PRD SCOPE DEFINITION] ==> Freeze Product Intent & Rule Out Guesswork || \/ [3. SPEC TECH BLUEPRINT] ==> Audit Schema Boundaries & Input/Output Contracts || \/ [4. PLAN PHASE ROADMAP] ==> Generate Granular Steps (🔴 BREAKS FOR USER GATE) || \/ [5. LOOP SELF-HEALING] ==> Execute, Build, Test, and Repair Autonomously`

## Execution Steps:

### 1. Layer 1 — Markdown Persistence (`latest.md` / `README.md`)
- The agent must parse this file at the absolute initiation of every work block. It must record active milestones and update session metrics immediately upon completing sub-tasks to guarantee context continuity across environment resets.
- **Mandatory System Prompt Template**: "Maintain all structural context within a unified Markdown target file. Parse this state contract comprehensively before executing any operation."
- **Crucial:** Query available MCP servers (`StitchMCP`, `notebooklm`, `mcp-obsidian`, `mongodb-mcp-server`, `github-mcp-server`) for context before planning.

### 2. Layer 2 — PRD Scope Definition
- Establishes product definitions and target personas. The agent is explicitly barred from implementing capabilities that rely on ambiguous parameters or undocumented user assumptions.
- **Mandatory System Prompt Template**: "Write a lean PRD defining the core product scope, target user persona, and structural baseline requirements."

### 3. Layer 3 — Technical Blueprint (Spec)
- Establishes systemic schemas, strict interface contracts, and error conditions (e.g., token timeouts, database partition breaks) before generating any functional file modifications.
- **Mandatory System Prompt Template**: "Formulate a deep technical blueprint covering API boundaries, strict data inputs, explicit outputs, and comprehensive edge-case handling routines."

### 4. Layer 4 — Step-by-Step Roadmap (Plan)
- Breaks down execution into isolated tasks with clear validation flags.
- **CRITICAL GATEKEEPER**: The agent must pause execution and request manual user sign-off (`🔴 Checkpoint`) via an `implementation_plan.md` artifact prior to modifying any physical code files.
- **Mandatory System Prompt Template**: "Construct an isolated, granular task list with deterministic checkpoints. Pause execution completely and prompt for explicit manual authorization prior to file creation or modification."

### 5. Layer 5 — Self-Healing Execution Engine (Loop)
- Once authorized, the agent compiles code, evaluates terminal trace logs, runs internal vitest hooks, and corrects compilation anomalies autonomously until all validation assertions pass without needing human intervention.
- **Strict Testing Rule**: Execute static type checking (`npx tsc --noEmit`) and UI build scripts (`npm run build`) upon every single file generation batch to trap runtime regressions instantly.
- **Mandatory System Prompt Template**: "Execute compilation routines autonomously in a self-healing loop. Evaluate log traces, run vitest verification blocks, and repair anomalies until error states are clear."

# Specular Neural Concierge Ecosystem - Advanced Agent Stack (v3.0)

## 1. Tactical Intent & Context
This specification locks down the architectural blueprints for upgrading our long-running AI Concierge node. It introduces dynamic biometric sentiment telemetry, continuous context window pruning, and strict sliding-window persistence layers to guarantee non-decaying multi-session execution without exploding platform API expenses.

## 2. The 5-Layer Hyper-Agent Stack Mapping
| Layer | Core Project Mechanic | Advanced Implementation Specification |
| :--- | :--- | :--- |
| **1. PRD** | Biometric Objective Gate | Ingests runtime User Sentiment Vectors (`mood`, `intent_depth`) to pivot critique style. |
| **2. Spec** | Type-Contract Boundary | Enforces strict payload verification using Zod gate schemas and a rigid 200 LOC cap. |
| **3. Plan** | Asset Roadmap & Ledgers | Outlines structural change logs inside an atomic `task.md` snapshot graph. |
| **4. Loop** | Autonomous Healing & Pruning| Compiles workspace using `tsc`, intercepts errors, and token-compresses legacy contexts. |
| **5. Markdown**| Sliding-Window Persistence | Commits rolling operational snapshots to disk to avoid cross-session memory loss. |

## 3. System Directory Layout
```text
├── lib/
│   ├── store/
│   │   └── conciergeStore.ts      # Zustand engine: state flags, token budget counters, mood vectors
│   └── validations/
│   │   └── concierge.ts           # Zod schemas: sentiment payloads, legacy context tokens
├── scratch/
│   └── agent_harness.ts           # Execution harness: autonomous compiler loops & token compression utilities
└── src/components/
    ├── MovieCriticDrawer.tsx      # Core viewport: hardware-composited glass interaction container
    ├── ConciergeActivity.tsx      # Interface token: 120Hz micro-typography stack stage animation
    └── MessageBubble.tsx          # Presentation node: isolated sub-200 LOC viewport rendering chat blocks
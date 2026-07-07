# Skill: SettingsDashboardManager

## Role & Purpose
Governs the complete structural overhaul and feature injection for the premium, high-fidelity Settings Dashboard. Ensures all sub-systems align with Liquid Glass 4.0 visual standards, Web Audio API acoustic mechanics, and secure MongoDB client-server boundaries.

## Core Feature Architecture
1. **Cryptographic Profile & Security Zone**: Management of user sessions, secure password mutations, and cryptographic token expiration.
2. **Liquid Glass 4.0 Optics Controller**: Hardware-accelerated UI configuration toggles (Background blur depth, 120Hz motion profile limiter, and glass refraction opacity).
3. **Acoustic Wavefront Spatializer Control**: Volume and frequency toggles for the native 40Hz sub-bass audio environment drop engine.
4. **Cloud Sync & Data Purge Engine**: Atomic cache clearing, cursor-based pagination adjustments, and localized MongoDB synchronized data extraction.
5. **Notification Matrix**: Granular push notification triggers and quiet-hour scheduling boundaries.

## Architectural & Security Constraints
- **Zero Database Exposure**: No raw MongoDB client code or URI strings are allowed within the client components. Everything must bypass secure Server Actions or API routes.
- **Unified Result Pattern**: Every backend mutation or response must strictly follow the `{ success: boolean; data?: any; error?: string }` contract.
- **Data Integrity**: Enforce strict Zod validations on all state changes before passing parameters to the database pipeline.

## Token Protection & Discipline Protocols
- **Surgical Diff Execution**: NEVER rewrite entire code sheets. Output ONLY the lines that change using exact code snippets or standard git diff formatting.
- **Rigid Halting Directive**: Generate Layer 1-3 plans sequentially, and ALWAYS stop execution at a 🛑 CHECKPOINT to await human validation before implementing frontend components or API route code.
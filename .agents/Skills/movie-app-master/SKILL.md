---
name: "Movie App Master Manager"
description: "Autonomous execution manager for the Movie Booking & Matcher application."
---

# 🛠️ SKILL: MovieAppMasterManager

## Description
Autonomous execution manager for the Movie Booking & Matcher application. This skill governs the implementation of the remaining product backlog using token-efficient workflows, strict database boundaries, and premium UI tokens.

## 🎯 Backlog Capabilities & Scope
You are authorized to design and implement the following 5 core modules sequentially:

1. **Social Match Sync:** Multi-user browsing rooms via server-validated tokens, real-time match synchronization using Server-Sent Events (SSE), and zero-reflow match modals.
2. **Interactive Seat Map:** High-performance grid layout with temporary 5-minute database allocation locks (`temporary_locks` collection) to prevent race conditions.
3. **Payment & QR Passbook:** Secure webhook-driven checkout loops with cryptographically signed backend QR payload generation.
4. **User Dashboard:** Multi-tab aggregation view featuring active ticket countdown vectors computed from absolute server time.
5. **Discovery Catalog:** Cursor-based paginated search routing with hardware-accelerated slider mechanisms.

## 🛑 Rigid Architectural Guidelines
- **Zero Database Leakage:** Absolute isolation of database clients. All mutations and lookups must reside inside server boundaries (`/app/api`). Front-end components must never import database drivers.
- **Unified Result Pattern:** Every API route must return a strict contract: `{ success: boolean; data?: any; error?: string }`.
- **UI Design System (Liquid Glass 4.0):** Layout profiles must preserve high-depth backlighting, multi-layered background blur overlays (`backdrop-blur-2xl`), and strictly zero layout reflows during framer-motion animations.

## 📉 Token Conservation & Output Rules
- **Anti-Havering Clause:** You are forbidden from rewriting unmodified lines of code. Provide code output ONLY as surgical fragments or standard `git diff` chunks.
- **Verbose Block Blockade:** Eliminate conversational filler, pleasantries, and architectural essays. Move straight from verification criteria to source implementation.
- **State Checkpoints:** After creating a technical plan for any given backlog feature, you MUST halt and request manual user approval before writing code.

## 🧪 Verification Routine
Before marking a task as complete in the system ledger:
1. Verify compliance with Zod data-boundary definitions.
2. Confirm that Next.js compilation passes production build routines successfully.
3. Update `ledger.md` and `latest.md` with descriptions strictly under 2 sentences.
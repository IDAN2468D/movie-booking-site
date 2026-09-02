# Specification-Driven Development (SDD) Layers Guide

## Architecture Overview
The Agent Stack Framework bridges autonomous AI coding with strict enterprise reliability.

```
Layer 1 (Memory) -> Layer 2 (PRD) -> Layer 3 (Spec) -> Layer 4 (Plan & Gate) -> Layer 5 (Loop QA)
```

## Critical Invariants
1. **Zero Client DB Leakage:** All database queries remain strictly within Server Actions (`app/actions/`) or Route Handlers (`app/api/`).
2. **Strict File Bounds:** Hard 200 LOC ceiling per file.
3. **Automated State Ledger:** Every transition updates the 4 state markdown documents.

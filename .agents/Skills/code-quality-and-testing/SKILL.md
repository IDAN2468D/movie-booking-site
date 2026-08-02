# 🛠️ Skill: Code Quality, Type Safety & Verification

## Purpose
Guarantees clean TypeScript code, zero regression errors, modular component architecture, and production readiness.

## Execution Checklist
1. **Strict Types:** Ensure all props, API responses, and database queries are strongly typed with explicit TypeScript interfaces.
2. **Typecheck Protocol:** Validate type safety with `npx tsc --noEmit` or IDE diagnostics.
3. **Component Modularity & 200 LOC Limit:** Strictly enforce maximum 200 LOC per component/file under `components/`, `hooks/`, or `app/actions/`.
4. **UI State Handling:** Handle `Loading` (Skeletons), `Empty State`, `Error Toast`, and `Success State` for every interactive feature.
5. **No Any Types:** Strictly disallow `any` types or unsafe type assertions (`as unknown as X`).

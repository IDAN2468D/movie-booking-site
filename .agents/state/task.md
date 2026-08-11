# Current Active Task: Fix Unique Key Error in CharacterInsights

- [x] Identified console error in `CharacterInsights.tsx` caused by non-unique `key={char.name}` when AI returns duplicate character names
- [x] Updated `CharacterInsights.tsx` to use unique keys `${char.name}-${idx}` for buttons and `${current.name}-${activeIdx}` for `AnimatePresence`
- [x] Maintained strict 200 LOC limit (187 lines)
- [x] Verified full TypeScript compilation (`npx tsc --noEmit`) and Vitest test suite (`npx vitest run`)
- [x] Synchronized all 4 state files in `.agents/state/`

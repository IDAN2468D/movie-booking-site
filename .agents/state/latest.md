# Latest Milestone: Floating Trailer PIP & Global Keymap Optimization (Sprint 119)

- **Completed Sprints & Upgrades:**
  1. **Floating Trailer PIP & Global Shortcuts Optimization**:
     - `hooks/useGlobalShortcuts.ts`: Added full bilingual support for Hebrew & English keyboard layouts (`KeyT`/`א`, `KeyK`/`ל`, `KeyG`/`ע`, sequential keys), `Escape` close handling, and `toggle-floating-trailer` custom event listener.
     - `components/media/FloatingTrailerPlayer.tsx`: Optimized `AnimatePresence` wrapper placement, isolated drag listeners from button clicks (`onPointerDown` stopPropagation), and added double-click header minimize toggle.
     - `components/ui/KeyboardShortcutsModal.tsx`: Wired direct click action for the 'T' shortcut to instantly toggle the PIP trailer player.
     - `components/coming-soon/TrailerModal.tsx`: Added PIP floating player transition button.
- **Quality & Verification:**
  - TypeScript: `npx tsc --noEmit` - 0 errors.
  - Vitest: 28 test files passed (124/124 tests).
  - Strict 200 LOC ceiling maintained across all files.


# Current Active Task: Fix Framer Motion layoutId Collision Across Duplicate Movie Rows

- [x] Identified exact root cause: Framer Motion's `layoutId={`movie-poster-${movie.id}`}` on `MovieCard.tsx` caused Framer Motion to detach/hide earlier instances of the same movie appearing in multiple rows (e.g. "מוקרן כעת" vs "הכי מדורגים")
- [x] Removed shared `layoutId` collision from grid `MovieCard.tsx` while preserving full 3D gyroscope tilt, refractor effects, and smooth route transitions
- [x] Verified full Layer 5 QA Loop (`npx tsc --noEmit` and `npx vitest run`)
- [x] Synchronized all 4 state files in `.agents/state/`

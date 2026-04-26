# 🔍 Skill: Advanced Discovery Engine (Search-02)

This skill governs the movie discovery experience, recommendation algorithms, and TMDB search integration.

## 🗝️ Core Principles
1. **Ultra-Responsive**: Results must appear in < 200ms using debounced inputs.
2. **Predictive Context**: Prioritize movies based on user location, time of day, and booking history.
3. **Liquid Discovery**: Search results should use the "Liquid Glass" card system with entrance animations.

## 🛠️ Implementation Specs

### 1. Multi-Faceted Filter Logic
Use Zod to validate search params:
- `genres`: string[] (TMDB IDs).
- `minRating`: number (0-10).
- `sortBy`: 'popularity' | 'release_date' | 'vote_average'.

### 2. Search Debounce Pattern
```typescript
const performSearch = useMemo(
  () => debounce(async (query: string) => {
    const result = await searchMoviesAction(query);
    if (result.success) setResults(result.data);
  }, 300),
  []
);
```

### 3. AI Recommendations
- **Last-Seen Integration**: Suggest movies similar to the user's last 3 bookings.
- **Empty State**: Never show a blank screen. Always provide a "Trending Now" fallback.

## 💎 Liquid Glass Audit
- [ ] Do search cards have `backdrop-blur-xl`?
- [ ] Is the search bar using `inset 0 0 0 1px rgba(255,255,255,0.1)` for depth?
- [ ] Are hover states using the Cyan (`#0AEFFF`) holographic glow?

---
> [!TIP]
> Use `Framer Motion`'s `AnimatePresence` for smooth layout transitions between search states.

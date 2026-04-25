# 🎬 TMDB Data Strategy Skill (v1.0)

This skill optimizes how movie data is fetched, processed, and displayed using the TMDB API.

## 🗝️ Core Principles
1. **Fetch Once, Use Often**: Minimize API calls using aggressive server-side caching.
2. **Image Performance**: Use TMDB's image resizing parameters (e.g., `w500` vs `original`).
3. **Fallback Grace**: Always provide localized fallback metadata (Hebrew/English).

## 🛠️ Implementation Specs

### 1. Fetching & Caching
Use Next.js `fetch` with `revalidate` or a dedicated Redis layer for high-traffic routes:
```typescript
async function getMovieDetails(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=he-IL`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}
```

### 2. Image Optimization
- Always use the `next/image` component.
- Map TMDB paths to full URLs: `https://image.tmdb.org/t/p/w500${path}`.
- Implement blurred placeholders for the "Liquid Glass" loading effect.

### 3. Data Transformation
- Map TMDB's flat structure to our internal `Movie` domain model.
- Use Zod to ensure TMDB schema changes don't break the UI.

## 🔍 Audit Checklist
- [ ] Are we requesting only the necessary fields (`?append_to_response=...`)?
- [ ] Is the `language` parameter correctly set to `he-IL`?
- [ ] Are we handling 429 (Rate Limit) errors gracefully with skeletons?

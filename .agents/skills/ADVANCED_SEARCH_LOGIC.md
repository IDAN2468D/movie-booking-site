# 🔍 Advanced Search Logic Skill (v1.0)

This skill governs the movie discovery experience and recommendation algorithms.

## 🗝️ Core Principles
1. **Speed First**: Search results must appear in < 200ms (Debounced input).
2. **Contextual Relevance**: Prioritize movies currently in theaters.
3. **Serendipity**: Suggest movies the user might like, not just exact matches.

## 🛠️ Implementation Specs

### 1. Multi-Faceted Filtering
Support simultaneous filtering:
- `genre`: Array of IDs.
- `rating`: Minimum threshold (e.g., > 7.5).
- `searchQuery`: Fuzzy match against title/cast.

### 2. Debounced Search Pattern
```typescript
// useSearch.ts
import { debounce } from 'lodash';

const performSearch = debounce(async (query: string) => {
  const results = await fetch(`/api/search?q=${query}`);
  // ... update state
}, 300);
```

### 3. AI Recommendations
- Fetch `similar` movies from TMDB based on the user's last 3 bookings.
- Use vector-based matching if a local DB of movie tags is available.

## 🔍 Audit Checklist
- [ ] Does the "No Results" state offer a call-to-action (e.g., "See Popular Movies")?
- [ ] Are search terms highlighted in the results?
- [ ] Is the search bar accessible via `/` shortcut?

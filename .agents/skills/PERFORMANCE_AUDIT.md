# ⚡ Performance Audit Skill (v1.0)

This skill ensures the Movie Booking platform maintains "Instant-On" performance.

## 🚀 Optimization Rules
1. **Image Hygiene**: Always use `next/image` with proper `priority` for LCP elements (e.g., Movie Posters).
2. **Component Thinning**: Keep client components small. Move logic to Server Components where possible.
3. **Store Selection**: Use strict Zustand selectors to prevent store-wide re-renders.
   ```typescript
   // GOOD
   const value = useStore(state => state.specificValue);
   // BAD
   const { specificValue } = useStore();
   ```

## 🛠️ Technical Specs
- **Fonts**: Use `next/font/google` to eliminate layout shift.
- **Dynamic Imports**: Use `next/dynamic` for heavy components (e.g., Maps, Charts, Modals).
- **Caching**: Implement `next: { revalidate: 3600 }` for TMDB API calls.

## 📉 Targets
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms

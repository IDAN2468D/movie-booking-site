# 📊 Skill: Data Strategy & Persistence (Data-02)

Governs TMDB integration, MongoDB schemas, and server action patterns.

## 🗝️ Core Principles
1. **Schema Strictness**: All DB interactions must go through Zod schemas.
2. **Result Consistency**: All Server Actions return `{ success, data, error }`.
3. **Caching Efficiency**: 1-hour revalidation for TMDB; Tag-based revalidation for user data.

## 🛠️ Implementation Specs

### 1. The Result Pattern
```typescript
export async function someAction() {
  try {
    const data = await db.call();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
```

### 2. TMDB Optimization
- Use `next: { revalidate: 3600 }` for static movie data.
- Map TMDB raw data to internal, clean TypeScript interfaces immediately.

### 3. Zod Guard
```typescript
const UserSchema = z.object({
  id: z.string(),
  bookings: z.array(z.string()),
});
```

## 🔍 Audit Checklist
- [ ] Is there a loading state for the data fetch?
- [ ] Are error messages translated into user-friendly Hebrew?
- [ ] Is `fetch` wrapped in a centralized utility for consistent headers?

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

## 🗄️ MongoDB MCP Protocols
When using the `mongodb-mcp-server`, the agent must:
1. **Schema Validation**: Always call `collection-schema` before performing complex inserts to ensure data integrity.
2. **Atomic Operations**: Prefer `insert-many` or `update-many` for batch operations to minimize MCP roundtrips.
3. **Index Awareness**: Before scaling, use `collection-indexes` to ensure queries are performant.
4. **Data Privacy**: Never export or log sensitive user credentials (passwords, PII) in the chat.

## 🚀 Capabilities
- **Direct Management**: Creating collections for users, bookings, and reviews.
- **Query Analysis**: Running aggregations to generate business insights (e.g., top-selling movies).
- **Migration Support**: Programmatically updating data structures as the app evolves.

## 🔍 Audit Checklist
- [ ] Is there a loading state for the data fetch?
- [ ] Are error messages translated into user-friendly Hebrew?
- [ ] Is `fetch` wrapped in a centralized utility for consistent headers?
- [ ] For DB operations: Was the schema verified before writing?

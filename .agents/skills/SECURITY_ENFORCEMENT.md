# 🛡️ Security Enforcement Skill (v1.0)

This skill governs all security protocols across the Movie Booking platform.

## 🗝️ Core Principles
1. **Zero-Trust Input**: All external data (API params, Server Action args) MUST be validated with Zod.
2. **Secret Isolation**: Never commit `.env` files. Use `process.env` exclusively in server-side contexts.
3. **Payment Integrity**: Payment data must be handled through encrypted pipelines (SSL/TLS). No raw PII in logs.

## 🛠️ Implementation Specs

### 1. Zod Validation Pattern
Every API route should start with a schema validation:
```typescript
const BookingSchema = z.object({
  movieId: z.number(),
  seats: z.array(z.string()),
  total: z.number().positive(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = BookingSchema.safeParse(body);
  if (!result.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  // ... proceed safely
}
```

### 2. Layout Security
- Sensitive UI elements (Admin panels, Payment history) must be wrapped in `AuthGuard` or server-side session checks.
- Use `NextAuth` middleware to protect `(main)` routes.

## 🔍 Audit Checklist
- [ ] Are all `useEffect` deps clean of sensitive data?
- [ ] Does the `PaymentForm` obfuscate the CVV?
- [ ] Are there any `console.log` calls with user passwords or tokens? (REMOVE THEM)

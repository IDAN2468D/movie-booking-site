# 🔐 Skill: Authentication & Identity (Auth-01)

Governs user registration, login flows, and session security.

## 🗝️ Core Principles
1. **Frictionless Flow**: Minimal steps for registration; use social logins where possible.
2. **Security First**: Mandatory Zod validation for passwords and emails.
3. **Immersive Feedback**: Transitions between login/signup states must be animated (Liquid Glass).

## 🛠️ Implementation Specs

### 1. Registration Flow
- **Step 1**: Basic info (Email, Password).
- **Step 2**: Preferences (Favorite Genres).
- **Step 3**: Onboarding (Brief intro to points/concierge).

### 2. Validation (Zod)
```typescript
const AuthSchema = z.object({
  email: z.string().email("אימייל לא תקין"),
  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
});
```

### 3. Server Actions
- Use `useActionState` (React 19) for form handling.
- Return standardized Result Pattern: `{ success, data, error }`.

## 🔍 Audit Checklist
- [ ] Are error messages translated to Hebrew?
- [ ] Is the "Remember Me" logic implemented securely?
- [ ] Does the UI use the Liquid Glass skeleton while loading auth states?

---
> [!IMPORTANT]
> Never log raw passwords. Always hash before storing (handled by the backend/auth provider).

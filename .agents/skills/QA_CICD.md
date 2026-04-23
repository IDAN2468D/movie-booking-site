# 🧪 QA & CI/CD Automation Skill (v1.0)

This skill is MANDATORY for every feature completion. No turn should end without a QA verification pass.

## 🔄 Mandatory Workflow
Before ending a turn after creating/modifying features:
1. **Linting**: Run `npm run lint` or `next lint`.
2. **Build Verification**: Run `npm run build` to ensure no SSR or type errors.
3. **Unit Tests**: Run `npm run test` (Vitest) for logic-heavy modules.
4. **E2E Smoke Test**: Run `npx playwright test` for critical paths (Login, Booking, Rewards).

## 🛡️ Error Recovery Protocol
If an error is found:
1. **Analyze**: Read the stack trace or lint output carefully.
2. **Fix**: Apply the minimal surgical fix.
3. **Re-verify**: Run the failing check again.
4. **Document**: Note the fix in the final response.

## 📈 Quality Standards
- **Zero Warnings**: Lint warnings are treated as errors.
- **Type Safety**: No `any` types allowed (checked via strict TS).
- **Test Coverage**: Critical flows must have >80% path coverage.

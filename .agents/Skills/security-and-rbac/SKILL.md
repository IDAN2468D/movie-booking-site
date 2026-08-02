# 🔒 Skill: Security, Auth Guards & RBAC Enforcer

## Purpose
Protects user privacy, enforces role-based access control, prevents injection vulnerabilities, and ensures audit compliance.

## Security Rules
1. **Session Enforcement:** Verify active NextAuth session (`getServerSession(authOptions)`) on all protected Server Actions and API routes.
2. **RBAC Rules:**
   - `ADMIN`: Full system access, audit logs, organization settings, billing management.
   - `BILLING_MANAGER`: Invoices, subscriptions, expense approvals.
   - `MEMBER` / `USER`: Standard access to personal expenses, budgets, crypto assets, profile settings.
3. **Zod Validation:** Validate all incoming parameters with strict Zod runtime schemas before executing business or database logic.
4. **Audit Trail:** Log sensitive actions (Password Change, 2FA, Member Invite, Role Upgrade) in `AuditLog`.
5. **Zero PII Exposure:** Never log passwords, OTP secrets, or session tokens in stdout or logs.

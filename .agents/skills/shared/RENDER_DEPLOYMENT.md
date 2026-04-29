# 🚀 Skill: Render Deployment & Stability (Dep-01)

Mandatory protocols for ensuring high availability and performance on the Render.com platform.

## ❄️ 1. Cold Start Mitigation
Render's free tier spins down after 15 minutes of inactivity. To prevent the "First User Lag":
- **Keep-Alive Endpoint**: Use `app/api/health/route.ts` as the primary ping target.
- **External Monitoring**: Recommend/Configure an external cron service (e.g., cron-job.org) to hit `/api/health` every 14 minutes.
- **Internal Warming**: When the app initializes, trigger a background fetch to the health route to warm up cold caches.

## 🔑 2. Environment Variable Governance
All Render variables must be synchronized with the local `.env.local` standard:
- `MONGODB_URI`: Primary database connection string.
- `NEXT_PUBLIC_TMDB_API_KEY`: Client-side TMDB access.
- `GOOGLE_AI_API_KEY`: Gemini API access for AI Concierge.
- `NEXTAUTH_SECRET`: Mandatory for production authentication.
- `NEXTAUTH_URL`: Must match the assigned Render `.onrender.com` domain.

## 🏗️ 3. Build & Runtime Standards
- **Node Version**: Ensure `package.json` specifies `"engines": { "node": ">=18.0.0" }`.
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Memory Management**: If OOM errors occur, set `NODE_OPTIONS=--max-old-space-size=512` in Render dashboard.

## 📊 4. Troubleshooting Workflow
1. **Logs**: Check "Events" and "Logs" tabs in Render for build failures.
2. **Database Connectivity**: Ensure Render's outgoing IP is allowed in MongoDB Atlas (or use 0.0.0.0/0 for testing).
3. **SSL**: Render handles SSL automatically; ensure no hardcoded `http://` links exist.

---
> [!TIP]
> Always use `NextResponse.json()` in health routes to ensure consistent HTTP 200 responses for monitor probes.

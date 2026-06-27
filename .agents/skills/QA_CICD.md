 # 🧪 Quality Assurance & CI/CD Manual

Guides you on how to test, compile, and configure continuous integration and automated deployment pipelines.

---

## 💻 Local Testing & Quality Checklist

Before submitting a Pull Request or pushing any code changes, verify your branch against the following checks:

1. **Lint Check**: Fix formatting and syntax issues:
   ```bash
   npm run lint
   ```
2. **Unit & Integration Tests**: Verify components and helper functions:
   ```bash
   npx vitest run
   ```
3. **Next.js Production Build**: Test TypeScript compilation and static page generation:
   ```bash
   npm run build
   ```

---

## 🚀 GitHub Actions Continuous Integration (CI)

Every code push or pull request targeting the `main` or `master` branches triggers our automated CI pipelines.

### Active Pipelines

#### 1. Integration Pipeline (`ci.yml`)
- Checks out the branch and configures Node.js (v20).
- Installs dependencies with `npm ci`.
- Runs linter and Vitest unit tests.
- Installs Playwright browser instances.
- Runs E2E tests and compiles the Next.js application.

#### 2. E2E Browser Testing (`qa.yml`)
- Headless Chromium execution of full Playwright workflows (`npx playwright test`).
- Uploads test results as a zip file `playwright-report` which is stored for 30 days.

---

## 🔑 CI/CD Environment Variables & Secrets

For the GitHub Actions workflow to run successfully, configure the following secrets inside your GitHub Repository settings (**Settings -> Secrets and variables -> Actions**):

| Secret Key | Description |
| :--- | :--- |
| `MONGODB_URI` | Connection URI for the MongoDB testing database. |
| `NEXTAUTH_SECRET` | Secret token used to sign NextAuth.js JWT tokens. |
| `TMDB_API_KEY` | Private API key for TMDB movie retrieval. |
| `NEXT_PUBLIC_TMDB_API_KEY` | Public client-side TMDB API key. |

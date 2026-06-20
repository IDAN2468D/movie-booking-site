# 🧪 Skill: Quality Assurance & CI/CD Pipelines (QA-01)

Governs automated testing, compilation verification, and continuous integration workflows.

## 🗝️ Core Principles
1. **Zero-Breakage Policy**: No code changes may be pushed to `main`/`master` without complete local verification.
2. **Double Testing Coverage**:
   - **Unit/Integration**: Run via Vitest. Highly mocked to prevent DB requirements unless explicitly integration testing.
   - **End-to-End (E2E)**: Run via Playwright. Covers checkout simulations, booking flows, and chatbot interactions.
3. **Automated Pipeline Enforcement**: GitHub Actions must build and test every commit on pull requests to ensure build integrity.

---

## 🛠️ Testing Manual & Commands

### 1. Unit & Integration Testing (Vitest)
Used for logic in `lib/`, helper files, and hooks.
- **Run Tests**:
  ```bash
  npx vitest run
  ```
- **Guidelines**:
  - Always mock external resources (e.g. `mongodb` driver, `next-auth`).
  - Use `vi.hoisted` for mocking modules that are imported immediately during module loading (like the NextAuth MongoDBAdapter).

### 2. End-to-End Testing (Playwright)
Used for checking UI/UX flows.
- **Run Tests**:
  ```bash
  npx playwright test
  ```
- **Setup (if browsers missing)**:
  ```bash
  npx playwright install --with-deps
  ```

---

## 🚀 GitHub Actions CI/CD Pipeline

The repository uses two workflows inside `.github/workflows/`:
1. **`ci.yml`**: Runs lint checks, Vitest unit tests, installs Playwright browsers, runs E2E tests, and verifies next production build.
2. **`qa.yml`**: Playwright test suite dedicated to long-running headless browser flow verification.

### 🔑 Pipeline Secret Requirements
The following secrets must be defined in the GitHub Repository Settings for workflows to succeed:
- `MONGODB_URI`: Connection string for tests.
- `NEXTAUTH_SECRET`: Secret hash for NextAuth tokens.
- `TMDB_API_KEY`: API Key for TMDb requests.
- `NEXT_PUBLIC_TMDB_API_KEY`: Public-facing TMDb API Key.

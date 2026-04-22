# Movie Booking Site - Specification (SPEC.md)

## 1. Project Overview
A premium, high-performance web platform for discovering movies, checking showtimes, and booking tickets seamlessly. The focus is on a stunning UI/UX with smooth interactions and a robust backend.

## 2. Technical Stack & Governance
- **Frontend**: Next.js 15+ (App Router)
- **State Management**: React 19 Hooks
- **Styling**: Tailwind CSS (Liquid Glass Design System)
- **Database**: MongoDB
- **Governance**: AI agents must follow [.agents/rules/movie-booking-site.md](./.agents/rules/movie-booking-site.md) for all coding and communication standards.

## 3. Core Features
### 3.1 Global Layout (Sidebar & TopBar)
- **Sidebar Navigation**: Home, My Tickets, Bonuses, Food & Drinks, Notification, Setting, Logout.
- **Top Search & Categories**: Universal search bar with autocomplete and quick filters.
- **User Profile**: Integrated profile card with quick access to "My Tickets".

### 3.2 Home Dashboard
- **Featured Hero**: Large banner for trending movies with integrated trailer playback.
- **AI Recommendations**: Personalized "Recommended for You" section based on user history.
- **Movie Sections**: "Popular Movie" and "Continue Watching" grids.

### 3.3 Advanced Booking Flow
- **Interactive Seat Map**: High-fidelity map with "Best View" and "Handicap" indicators.
- **Food & Beverage Pre-order**: Interactive menu to add snacks/drinks during checkout.
- **Cinema Selector**: Switch between different venues, showtimes, and screen types (IMAX, 4DX).

### 3.4 Loyalty, Rewards & Social
- **Bonuses System**: Points-based loyalty program with a dedicated rewards dashboard.
- **Digital Wallet**: "My Tickets" area with dynamic QR codes for fast entry.
- **Social Features**: "Invite Friends" sharing links and "Add to Calendar" integration.
- **Reviews & Ratings**: User-generated reviews and cast biographies (via TMDB).

#### 3.5 Personalization & Settings
- **My Tickets**: Access upcoming and past cinematic journeys.
- **Favourites List**: Save movies for later.
- **Notifications Center**: Reminders for upcoming shows and promotional alerts.
- **Profile Settings**: Manage account details, payment methods, and theme preferences.

## 4. Design Guidelines (Reference Image)
- **Primary Colors**: Dark Graphite (#1A1A1A) and Vibrant Orange (#FF9F0A).
- **Aesthetic**: Modern, "Liquid Glass" layout with translucency, refraction, and depth.
- **Typography**: Premium sans-serif (Inter/Outfit) with bold hierarchy.
- **Micro-animations**: Functional motion for transitions and feedback.

## 5. Development Standards
- **Modular Code**: Small, reusable components (max 200 lines).
- **Security**: Server-side logic for database interactions and sensitive data handling.
## 6. QA & CI/CD
- **Linting**: Automated lint checks on every push to ensure code consistency.
- **Build Validation**: CI checks to ensure the project builds correctly before merging.
- **Testing**:
  - Unit tests for critical logic (e.g., price calculations).
  - Integration tests for API routes.
  - End-to-End (E2E) tests for the main booking flow.
- **Continuous Integration**: GitHub Actions workflow to automate quality checks.

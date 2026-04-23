# Movie Booking Site - Specification (SPEC.md) v2.0

## 1. Project Overview
A premium, high-performance web platform for discovering movies, checking showtimes, and booking tickets seamlessly. The focus is on a stunning UI/UX with smooth interactions and a robust backend.

## 2. Technical Stack & Governance
- **Frontend**: Next.js 15+ (App Router)
- **State Management**: Zustand (Global Store) + React 19 Hooks
- **Styling**: Tailwind CSS (Liquid Glass Design System 2.0)
- **Database**: MongoDB (Native Driver)
- **Validation**: Zod (Schema validation)
- **Governance**: AI agents must follow [.agents/rules/movie-booking-site.md](./.agents/rules/movie-booking-site.md) for all coding and communication standards.

## 3. Data Model (MongoDB)
### 3.1 Collections
- **Movies**: `title`, `description`, `genre` (array), `rating`, `duration`, `posterUrl`, `trailerUrl`, `cast` (array).
- **Showtimes**: `movieId`, `cinemaId`, `startTime`, `format` (IMAX, 4DX, Standard), `availableSeats` (number), `price`.
- **Bookings**: `userId`, `showtimeId`, `seats` (array), `totalPrice`, `status` (confirmed, pending), `timestamp`.
- **Users**: `name`, `email`, `preferences` (genres), `loyaltyPoints`, `subscriptionType`.

## 4. API & Server Actions Contract
All Server Actions and API routes MUST return the following structure:
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}
```

## 5. Core Features
### 5.1 Global Layout (Sidebar & TopBar)
- **Sidebar**: Home, My Tickets, Bonuses, Food & Drinks, Setting.
- **TopBar**: Universal search with Zod-validated input and dynamic suggestions.

### 5.2 Advanced Booking Flow
- **Seat Map**: Vector-based interactive map with real-time availability.
- **Checkout**: Multi-step flow with snack upsell and secure payment simulation.

## 6. Design Guidelines
- **Aesthetic**: "Liquid Glass" - High translucency, `backdrop-filter: blur(20px)`, thin borders (`1px solid rgba(255,255,255,0.1)`).
- **Colors**: Deep Zinc (#09090B), Vibrant Orange (#FF9F0A), Electric Cyan (#0AEFFF).
- **Typography**: Outfit (Headings), Inter (Body).

## 7. QA Standards
- **Testing**: Vitest for `lib/` logic, Playwright for `/checkout` and `/auth` flows.
- **Types**: 100% strict TypeScript. No `any`.

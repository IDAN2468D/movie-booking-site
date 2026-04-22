# Implementation Plan - AI Booking Assistant 🤖

Add a premium, conversational AI chatbot that enables users to discover and book movies through a natural language interface.

## 1. UI/UX Design (Premium & Cinematic)
- **Floating Chat Trigger**: A glassmorphism-styled floating action button (FAB) at the bottom left (RTL friendly).
- **Chat Window**:
  - Liquid Glass background with backdrop blur.
  - Animated message transitions (Framer Motion).
  - Quick action chips (e.g., "מה מוקרן היום?", "המלץ לי על קומדיה").
- **Avatar**: A futuristic AI icon or a subtle glowing orb animation.

## 2. Technical Architecture
- **Component**: `components/chat/MovieChatBot.tsx`
- **AI Engine Extension**: Enhance `lib/ai-engine.ts` or create `lib/chat-engine.ts` to handle booking intents.
- **Store Integration**: Connect the chat actions directly to `useBookingStore` (e.g., `setSelectedMovie`, `setSelectedShowtime`).
- **Navigation**: Automatically transition the user to the seat selection or checkout page when intent is confirmed.

## 3. Conversational Flow
1. **Discovery**: User asks for recommendations.
2. **Selection**: AI suggests movies and showtimes.
3. **Intent Recognition**: AI detects phrases like "אני רוצה להזמין" or "תשריין לי מקום".
4. **Action**: AI updates the global store and provides a direct booking link or triggers the modal.

## 4. Implementation Steps
1. **New Component**: Create `components/chat/MovieChatBot.tsx`.
2. **AI Integration**: Implement a simple NLP handler for Hebrew intents (Mocking the AI for now or using the existing AI engine pattern).
3. **Global Layout**: Add the `MovieChatBot` to `app/(main)/layout.tsx`.
4. **Interactive Actions**: Map AI "commands" to store actions.
5. **Localization**: Ensure the bot speaks native Hebrew and respects RTL layout.

## 5. Verification
- Test conversational flow on mobile and desktop.
- Verify that selecting a movie via chat correctly updates the `RightPanel` and booking state.
- Ensure the "Premium" look is maintained with proper animations.

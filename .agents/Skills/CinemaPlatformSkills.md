# File: CinemaPlatformSkills
## Framework: Liquid Glass 4.0 & The Agent Stack Architecture

## 1. Skill: MovieSwipeMatcher
### Role & Context
Governs the implementation and optimization of the interactive "Tinder-style" movie matchmaking system. This handles real-time swiping states, matchmaking algorithm computations between paired users, and layout animations.

### Technical & Architectural Bounds
1. **State Aggregation**: Swipe gestures (`Like` / `Dislike`) must be cached in local memory and debounced before updating the MongoDB backend via a dedicated endpoint (`/api/movies/swipe`).
2. **Match Engine**: Implements a pipeline that monitors active matching sessions. If two linked user accounts return a shared `Like` ID, a trigger must immediately return a match response without re-querying the database index.
3. **Zero-Lag Swiping**: Cards must use translation matrices (Hardware-accelerated) to prevent lagging at 120Hz.

### Design Rules (Liquid Glass 4.0)
- Swiping cards are stacked floating frosted glass panels (`bg-white/10 backdrop-blur-xl border border-white/20`).
- Right swipe injects a subtle emerald glow overlay (`rgba(16,185,129,0.2)`); Left swipe injects a ruby refraction overlay (`rgba(239,68,68,0.2)`).

---

## 2. Skill: DynamicAmbientCinemaMode
### Role & Context
Controls the visual ambient responsiveness of individual movie pages. It dynamically extracts color palettes from active movie assets (posters/trailers) and reflects them globally onto the container backdrop and text headers.

### Technical & Architectural Bounds
1. **Performance Guard**: Color calculations must happen once per page load (client-side extraction via Canvas/Context API or passed from Backend pre-calculated schemas). 
2. **Zero Layout Reflows**: Transitioning from one theme backdrop to another must happen asynchronously using CSS variables wrapped in standard hardware-accelerated CSS `transition: background 0.6s ease-in-out`. Never trigger DOM element updates that shift adjacent components.

### Design Rules (Liquid Glass 4.0)
- The main layout backdrop morphs into a deep, dark ambient glass mesh gradient derived from the poster's dominant color codes.
- Overlay text panels must automatically invert or change text contrast thresholds to maintain WCAG accessibility over glowing background shades.

---

## 3. Skill: QuantumSeatMapLiveSync
### Role & Context
Manages the critical layout generation, rendering, validation, and database synchronization of the real-time interactive Cinema Hall Seat Map Matrix (`SeatMap.tsx`).

### Technical & Architectural Bounds
1. **Pessimistic Hold Strategy**: When a user selects a seat, a secure POST request `/api/tickets/hold` locks the document schema in MongoDB for 10 minutes.
2. **Real-time Event Bridge**: Integrates with WebSockets or MongoDB Change Streams to visually reflect seat lock updates made by other users globally on the client layout in real time.
3. **Collision Avoidance**: If two client events overlap on the exact same millisecond, the backend state engine must strictly discard the secondary transaction and trigger a silent client roll-back.

### Design Rules (Liquid Glass 4.0)
- Free seats look like clear frosted glass cubes.
- Selected seats emit a continuous premium radiant ultraviolet glow pulse (`shadow-[0_0_20px_rgba(139,92,246,0.6)]`).
- Locked seats seamlessly fade out into a low-opacity dark glass composition with a diagonal scratch pattern.

---

## 4. Skill: LiquidGlassTicketVault
### Role & Context
Governs the "My Tickets" area of the application. It guarantees cryptographic verification, security token rotational dynamics, and robust offline availability when users step into low-reception movie theaters.

### Technical & Architectural Bounds
1. **Offline Persistence**: Tickets data schemas must be securely mirrored in a lightning-fast local cache layer (such as MMKV, AsyncStorage, or IndexedDB) defined structurally in `DATA.md`.
2. **Dynamic QR Tokenization**: The verification QR code matrix must rotate every 15 seconds locally using a time-based hashing algorithm linked to the user's secure JWT payload, ensuring zero fraud capability even without active internet data.

### Design Rules (Liquid Glass 4.0)
- Digital tickets appear as ultra-realistic holographic glass passes.
- Implement a CSS parallax shimmer shine reflection that responds dynamically to mouse coordinates or device orientation.

---

## 5. Skill: InSiteMovieCriticAgent
### Role & Context
Orchestrates the client UI drawer and the background proxy routing connecting the embedded interactive AI Movie Critic Bot inside the movie description canvas.

### Technical & Architectural Bounds
1. **Proxy Endpoint Architecture**: All chat prompts must pass through an encrypted back-channel gateway route on the Express server (Port 5000) to shield API keys from client visibility.
2. **Context Isolation**: Chat history arrays must be kept in localized temporary state components to prevent bloating global application state stores.

### Design Rules (Liquid Glass 4.0)
- The AI interaction panel slides out as an elegant semi-transparent glass panel from the right edge of the interface (`backdrop-blur-2xl bg-black/40 border-l border-white/10`).
- Text streams render character-by-character inside clear floating message bubbles with a light frosted sheen.
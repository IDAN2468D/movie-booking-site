# 📚 MOVIEBOOK Data Schema & Mongoose Model Reference

## MongoDB Models Overview (CinePulse Architecture)

### 1. Movie & Catalogue Models
- **`Movie`**: Core movie record containing TMDB ID (`movieId`), title (`title`, `displayTitle`), overview, backdrop/poster paths, genre IDs, rating (`voteAverage`), release date, and duration (`runtime`).
- **`Genre`**: Genre taxonomy (`Action`, `Sci-Fi`, `Comedy`, `Drama`, `Horror`, `Animation`, `Thriller`, `Romance`).

### 2. Showtime & Seat Models (`lib/models/ShowtimeSeats.ts`)
- **`Showtime`**: Screening session linking `movieId`, `branchId`, `auditoriumId`, screening time (`startTime`, `endTime`), ticket base price (`price`), and format (`IMAX 3D`, `VIP Dolby Atmos`, `Standard`).
- **`ShowtimeSeats`**: Seat occupancy matrix tracking seat ID (`seatId` e.g. `A1`, `F12`), row, column, seat status (`available`, `locked`, `occupied`), and locking user (`lockedBy`, `lockedUntil`).

### 3. User & Biometric Passbook Models (`lib/models/User.ts`)
- **`User`**: User account credentials (`email`, `passwordHash`, `name`, `avatarUrl`), system role (`USER`, `VIP_MEMBER`, `ADMIN`), 2FA secret, loyalty points (`pulsePoints`), and biometric passbook token.
- **`Booking`**: User booking order storing `bookingId`, `userId`, `showtimeId`, `seats` array, total price, payment status (`paid`, `pending`), dynamic HMAC QR payload, and creation timestamp.

### 4. Food & Concessions Models (`lib/models/ConcessionCombo.ts`)
- **`ConcessionCombo`**: Popcorn & beverage combos (`title`, `genreAffinity`, `price`, `items`, `subBassAudioTrigger`).

### 5. Acoustic & Mood Schema (`lib/validations/`)
- **`SpatialHapticSeat`**: Zod schema for 3D FOV raycasting, distance to screen, and Web Audio 40Hz sub-bass sound panning.
- **`HeroAura`**: Zod schema for AI movie aura evaluation, emotional valence score, and harmonic acoustic tags.
- **`VoiceSearch`**: Zod schema for Hebrew vocal search commands (`Web Speech API`) and neural mood matching.

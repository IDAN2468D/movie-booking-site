# 🗄️ Database Schema: Liquid Glass 2.0 (v1.0)

This document defines the structure of our MongoDB collections for the Movie Booking Site.

---

## 👥 Collection: `users`
Stores user identity, security, and AI personalization.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `name` | String | Full name |
| `email` | String | Unique email address |
| `password` | String | Hashed password |
| `points` | Number | Loyalty points balance |
| `aiPreferences` | Object | **[New]** Personalized discovery settings |
| `aiPreferences.genres` | Array<String> | Favorite genres for recommendations |
| `aiPreferences.preferredTimes` | String | e.g., "Late Night", "Matinee" |
| `loyaltyTier` | String | "Bronze", "Silver", "Gold", "Liquid" |
| `createdAt` | Date | Registration timestamp |

---

## 🎟️ Collection: `bookings`
Stores reservation history and transaction data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | String | Reference to user |
| `movie` | Object | Snapshot of movie data at time of booking |
| `seats` | Array<String> | List of seat IDs (e.g., ["A1", "A2"]) |
| `total` | Number | Amount paid |
| `status` | String | "confirmed", "cancelled", "completed" |
| `showtime` | String | ISO string of showtime |
| `hall` | String | Reference to cinema hall |
| `qrCode` | String | Base64 or URL of the ticket QR |

---

## 📽️ Collection: `cinemas` (New)
Defines physical locations and high-tech amenities.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Cinema name (e.g., "Cinema City Holograph") |
| `location` | String | City/District |
| `amenities` | Array<String> | e.g., ["Holographic Sound", "4D Motion"] |
| `halls` | Array<Object> | List of halls and their capacities |

---

## 📄 Collection: `reviews` (Future)
Stores AI-moderated user feedback.

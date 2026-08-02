# 🗄️ Skill: Database Architecture & MongoDB / Mongoose Optimization

## Purpose
Manages MongoDB database connection pooling, Mongoose models, relation indexing, query performance, and strict server-side schema boundaries.

## Database Guidelines
1. **Schema Modifications:** Add fields or models in `lib/models/` using Mongoose Schemas with appropriate defaults, types, and validation rules.
2. **Zero Client Exposure:** Database connection strings (`connectToDatabase()`) and models must remain strictly server-side (`"use server"` actions or `/api/` routes). Never export database instances to client components.
3. **Indexing:** Add composite or unique indexes (`schema.index(...)`) on frequently queried fields (`showtimeId`, `userId`, `seatId`, `email`).
4. **Change Streams & Real-Time Sync:** Utilize MongoDB Change Streams for real-time seat locking, snack ledger updates, and live attendance pulse.

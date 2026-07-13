# Data Schema Documentation: Users Collection

This document defines the schema of the `Users` collection in MongoDB, including validations managed via Zod.

## Users Collection Schema

| Field Name | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique user identifier. | Yes |
| `name` | `string` | Full name of the user (minimum 2 characters). | Yes |
| `email` | `string` | User's email address (must be unique and normalized to lowercase). | Yes |
| `password` | `string` | Bcrypt-hashed password (optional for OAuth provider sign-ins). | No |
| `image` | `string` | URL of the profile avatar (optional). | No |
| `createdAt` | `Date` | Timestamp of registration. | Yes |
| `pendingScratchReward` | `PendingScratchReward` | Unclaimed scratch card reward associated with the user profile. | No |

---

### `pendingScratchReward` Object Structure

A user might have a pending scratch card reward assigned after a booking success or a promotional action. The sub-document is validated as follows:

| Field Name | Type | Description | Details |
| :--- | :--- | :--- | :--- |
| `rewardId` | `string` | Unique identifier for this scratch card instance. | Required |
| `type` | `enum` | Type of reward. | `'discount_percentage'`, `'fixed_discount'`, `'free_ticket'` |
| `value` | `number` | Numerical value corresponding to the reward type. | Percentage (e.g. 15 for 15%) or raw value. |
| `applied` | `boolean` | Whether the reward has been claimed or applied to a checkout. | Default: `false` |
| `expiresAt` | `Date` | Expiration timestamp of the scratch reward. | Required |

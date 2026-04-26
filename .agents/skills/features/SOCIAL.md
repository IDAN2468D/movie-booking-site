# 👥 Skill: Social Cinema & Group Sync (Feat-02)

Enables collaborative booking, friend lists, and split-payment UI.

## 🗝️ Core Principles
1. **Sync Integrity**: Real-time updates for group seat selection.
2. **Visual Connection**: Friends' avatars should have a cyan holographic glow when active.
3. **Privacy by Design**: Mask sensitive group info in public views.

## 🛠️ Implementation Specs

### 1. Group Booking Logic
- Track `invites` and `paymentStatus` in a unified Zustand store.
- Use WebSockets (or Polling) to sync seat locks between users.

### 2. The "Split-Pay" UI
- Clear, refractive cards showing each person's share.
- Action: "Remind Friends" via shared links.

### 3. Sharing & QR
- Generate deep-links for group invites.
- Unique QR variants for group members.

## 💎 Liquid Glass Audit
- [ ] Are friend avatars using `ring-2 ring-cyan-400/50`?
- [ ] Is the group summary panel using `backdrop-blur-2xl`?
- [ ] Are success transitions for full-group payments satisfyingly animated?

---
> [!IMPORTANT]
> Ensure the group booking expires if payment isn't completed within the 10-minute hold window.

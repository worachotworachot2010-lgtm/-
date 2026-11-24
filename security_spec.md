# Security Specification — Loy Krathong Online

## 1. Data Invariants
1. **Public Festival Visibility Without PII**: Every krathong in `/krathongs/{krathongId}` must declare `visibility == 'public'` and must never store email addresses, phone numbers, or private user fields.
2. **Strict Owner-Only Deletion**: A krathong document's `authorId` must equal `request.auth.uid` on creation and remain immutable forever (`incoming().authorId == existing().authorId`). ONLY the original creator (`existing().authorId == request.auth.uid`) can delete their own krathong — nobody can delete another person's krathong.
3. **24-Hour Lifecycle**: `createdAt` is server-enforced (`request.time`). Blessings (`update`) are only allowed while `existing().createdAt > request.time - duration.value(24, 'h')`, and the client filters out krathongs older than 24 hours in real time.
4. **Strict Schema & Bounds**: `senderName` (1..40 chars), `wish` (1..280 chars), `baseId` (12 choices), `flowerId` (8 choices), `candleId` (6 choices), `ornamentId` (6 choices), `glowColor` (6 choices), `category`, and `pier` are strictly allowlisted.
5. **Atomic Single-Vote Blessing**: Incrementing `blessingsCount` on `/krathongs/{krathongId}` is only allowed by `+1`, and ONLY in the same atomic batch that creates `/krathongs/{krathongId}/blessings/$(request.auth.uid)`.

## 2. Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Create**: Creating `/krathongs/k1` when `request.auth == null`.
2. **Unverified Email Create**: Creating `/krathongs/k1` when `request.auth.token.email_verified == false`.
3. **Identity Spoofing**: Creating `/krathongs/k1` with `authorId: "victim-uid"` instead of `request.auth.uid`.
4. **ID Poisoning**: Creating `/krathongs/invalid$id!with/junk` violating `^[a-zA-Z0-9_-]+$`.
5. **Shadow Field Injection**: Creating `/krathongs/k1` with extra ghost field `isAdmin: true`.
6. **Non-Zero Initial Blessings**: Creating `/krathongs/k1` with `blessingsCount: 999` instead of `0`.
7. **Forged Timestamp**: Creating `/krathongs/k1` with a client-supplied `createdAt` instead of `request.time`.
8. **Wish Length Bomb**: Creating `/krathongs/k1` with `wish` exceeding 280 characters.
9. **Unauthorized Wish Tampering**: Updating `wish`, `senderName`, or `baseId` on any existing krathong.
10. **Expired Krathong Blessing**: Updating `blessingsCount` on a krathong older than 24 hours.
11. **Blessing Another User's ID**: Creating `/krathongs/k1/blessings/otherUid` where `userId != request.auth.uid`.
12. **Unauthorized Delete**: Deleting `/krathongs/k1` when `request.auth.uid != resource.data.authorId`.

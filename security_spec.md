# BloomBox Firestore Security Specification

## 1. Data Invariants
1. **Owner-Only Profile Access**: A `UserProfile` document at `/users/{userId}` can only be read, created, or updated by the authenticated, email-verified user whose `request.auth.uid == userId`. Listing `/users` is strictly denied to prevent PII enumeration.
2. **Immutable Ownership & Timestamps**: `uid` and `createdAt` on `UserProfile` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
3. **Subcollection Master Gate**: An `Order` document at `/users/{userId}/orders/{orderId}` requires the parent `/users/{userId}` document to exist (`exists(...)`) and `userId == request.auth.uid`.
4. **Terminal State & Order Integrity**: Orders are created with initial `status == 'confirmed'`, positive numeric `total` and `itemCount`, and immutable fields once placed (no client-side deletion or tampering of totals/ownership).

## 2. Dirty Dozen Adversarial Payloads
1. Unauthenticated read of `/users/userA` -> `PERMISSION_DENIED`
2. Authenticated `userB` reading `/users/userA` (PII leak test) -> `PERMISSION_DENIED`
3. Unverified email (`email_verified: false`) writing `/users/userA` -> `PERMISSION_DENIED`
4. Listing `/users` collection -> `PERMISSION_DENIED`
5. Shadow field injection on `/users/userA` (`{ ..., isAdmin: true }`) -> `PERMISSION_DENIED`
6. UID spoofing on `/users/userA` (`{ uid: "userB", ... }`) -> `PERMISSION_DENIED`
7. Client-forged `createdAt` timestamp not equal to `request.time` -> `PERMISSION_DENIED`
8. Mutating `createdAt` or `uid` on profile update -> `PERMISSION_DENIED`
9. Creating an order under `/users/userB/orders/ord1` as `userA` -> `PERMISSION_DENIED`
10. Creating an order with `status: "delivered"` instead of `"confirmed"` -> `PERMISSION_DENIED`
11. Resource poisoning: injecting a >128 char document ID or >300 char address -> `PERMISSION_DENIED`
12. Deleting an order from `/users/userA/orders/ord1` -> `PERMISSION_DENIED`

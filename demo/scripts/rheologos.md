# RheoLogos — walkthrough script

Target length: ~45-55s. This one has an async pipeline animation — the key thing to make
legible on screen is that the balance update is instant while the Kafka/Redis pipeline
finishes in the background.

**Before recording:** hit the live URL yourself first and let it fully cold-start
(can take 1-2+ min if Kafka needs to come up) — trim the wait out in post, don't
record the Render loading screen.

| # | Action (what to click) | On-screen text callout | Timing |
|---|---|---|---|
| 1 | Land on empty dashboard | "RheoLogos — double-entry ledger, Kafka outbox, Redis cache-aside" | 0-3s |
| 2 | Point at "ACCOUNTS" empty state | "No accounts yet" | 3-5s |
| 3 | Type owner name "Alice" in Open account form | "Open account: Alice" | 5-8s |
| 4 | Click **Open account** (leave balance 0) | "Account created, $0 balance" | 8-10s |
| 5 | Type "Bob", opening balance "10000" | "Open account: Bob, $100.00 opening balance" | 10-14s |
| 6 | Click **Open account** | | 14-16s |
| 7 | Click Bob's card | "Click a card to set FROM" | 16-19s |
| 8 | Shift-click Alice's card | "Shift-click to set TO" | 19-22s |
| 9 | Point at Idempotency key field | "Auto-generated idempotency key — resend it and the transfer won't double-post" | 22-27s |
| 10 | Type amount "2500" | "Amount in minor units (2500 = $25.00)" | 27-30s |
| 11 | Click **Send transfer** | "Balances update immediately..." | 30-32s |
| 12 | Point at updated balances (Alice $25, Bob $75) | "...double-entry, atomic" | 32-35s |
| 13 | Point at the pipeline dots animating left-to-right | "DB write -> outbox row -> Kafka topic -> cache eviction -> Redis re-cached" | 35-42s |
| 14 | Scroll down to Ledger Entries table | "Full audit trail per account" | 42-46s |
| 15 (optional) | Resend the exact same transfer with the same idempotency key | "Same key = same transaction returned, not a duplicate transfer" | 46-52s |

**Note:** step 15 is worth including if you have time — it's the most interesting
correctness guarantee this project demonstrates and isn't obvious from the UI alone.

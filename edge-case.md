# Edge Cases & Corner Scenarios: Goal Store

This document catalogs all the edge cases and corner scenarios for the Goal Store interactive prototype. These scenarios must be handled gracefully to ensure a robust, glitch-free experience, as outlined in the PRD and Architecture documents.

## 1. Economy & Balance
- **Zero Balance:** New players or players who just redeemed a reward leaving them with exactly 0 coins. All rewards should show as "Far", CTAs should say "Earn X more", and "Ready to claim" should never appear.
- **Exact Balance Match:** Player has exactly the number of coins needed for a reward. The CTA should change to "Redeem", ETA to "Ready to claim", and balance after redemption should correctly compute to 0 without errors.
- **Average Earn is Zero:** If a player plays rounds but scores 0, `avgCoinsPerRound` could drop to 0. The ETA calculation `Math.ceil(remaining / avgPerRound)` must avoid division by zero (e.g., fallback to a default value or return "Never at this pace").
- **Sink Ratio with Zero Earn:** If the player has spent coins (e.g., from seed balance) but earned 0, `totalSpent / totalEarned` could result in NaN or Infinity. The engine must return `0` if `totalEarned === 0`.
- **UI Overflow on Huge Balance:** A player plays for hours or uses the simulator to add massive amounts of coins. The WalletPill and GoalChip text must truncate or format large numbers (e.g., "1.2M") to avoid breaking the layout.

## 2. Nudge Engine (Priority & Caps)
- **Nudge Cap Enforcement:** A player triggers an N2 Unlock nudge, but they have already dismissed 2 nudges in this session. The engine must respect the `session.nudgesDismissed >= 2` cap and return `null`.
- **Priority Conflicts (N1 vs N2):** A player's balance crosses a reward threshold (triggering N2 Unlock) in the same round they get within 2 rounds of their pinned goal (triggering N1 Near-goal). N2 must take strict priority and suppress N1.
- **Variant Switch mid-session:** A player plays in the Goal variant, accumulates nudges, then switches to the Classic variant. No nudges should ever fire in Classic, regardless of the session state.

## 3. Redeem & Order Flow
- **Double-Tap on Redeem:** A player aggressively double-taps the "Confirm" button on the Redeem Sheet. A double-tap guard (`isProcessing` ref) must ensure only one ledger debit and one order are created.
- **Redeeming an Unpinned Reward:** A player has Goal A pinned, but opens and redeems Reward B. The balance drops. The HUD GoalChip for Goal A must instantly reflect the dropped progress and increased ETA.
- **Exhausting the Catalogue:** A player redeems every single reward in the seed data. The Store Home must handle the empty state for the reward grid, and the Receipt screen must gracefully handle 0 next-goal suggestions.
- **Physical Reward Address Flow:** Redeeming a physical reward (e.g., "boAt Earbuds") without shipping details. The UI must show the "Delivery details (coming soon)" placeholder but still allow the transaction to complete for prototype purposes.

## 4. Next-Goal Suggestions (Receipt)
- **No Higher Tier Available:** A player redeems the most expensive item in a category. The "Same category, one tier up" logic must not fail or return undefined; it should gracefully fall back to other suggestions.
- **Deduplication:** A player has redeemed Reward X this session. Reward X must be filtered out of the next-goal suggestions, even if it is the cheapest unredeemed quick win.

## 5. Storage & Persistence
- **localStorage Quota Exceeded / Disabled:** The user plays in private browsing mode where `localStorage` is disabled, or their disk is full. Every write operation must be wrapped in a `try/catch` block to prevent the app from crashing, falling back to in-memory state.
- **Stale Schema on Reload:** The user returns to the prototype after the data schema was updated. The hydration logic must validate the state shape and seamlessly clear/reset to the latest seed data if a schema mismatch is found.
- **Rapid Skin/Variant Switching:** The user rapidly toggles between the 3 skins or the 2 variants. The UI must not suffer from layout shifts, component remount flickering, or state corruption.

## 6. Gameplay (Pulse Tap)
- **Reduced Motion Preference:** The OS `prefers-reduced-motion` flag is set. The game must disable orb scaling, particle bursts, and combo pulses to ensure accessibility compliance without breaking the scoring logic.
- **Timer Sync on Tab Switch:** The user starts a round, switches browser tabs, and returns 30 seconds later. The 20-second timer must either pause or complete gracefully without flooding the event loop with expired orbs.

# Problem Statement: The In-Game Commerce Store

**Author:** Prince Gupta | **Version:** 1.0 | **Companion:** `prd.md`

---

## 1. The Question

> How should an in-game commerce store be different from a traditional e-commerce store?

---

## 2. Core Insight

> **A traditional store is a destination. An in-game store is a moment inside a play loop.**

An e-commerce user arrives *to shop*, with money already in hand. A player arrives *to play*, holding coins they earned through effort. The store is a detour they must be given a reason to take, and a reason to return from.

### How the two models differ

| Dimension | Traditional e-commerce | In-game store |
|---|---|---|
| Intent | Shopping is the goal | Playing is the goal; shopping is a detour |
| Currency | Money, already held | Coins, earned through effort and time |
| Price signal | Rupees | Coins, which are abstract unless tied to effort |
| Discovery | Browse a large catalogue | Few, reachable rewards |
| Core object | Cart (buy now) | **Goal** (work towards) |
| Checkout | Payment and forms | One-tap confirm that feels like a win |
| Purchase means | End of the journey | **Start of the next session** |
| Success metric | Conversion, AOV | Retention first, then redemption |
| Failure mode | Cart abandonment | Coin hoarding, store as an exit, inflation |
| Personalisation signal | Browse and purchase history | Gameplay state: balance, progress, streak |
| Economy | None | Store is a sink in the game economy |

---

## 3. The Problems to Solve

| # | Problem | Why it happens | Likely symptom |
|---|---|---|---|
| P1 | **The store is a detour** | A catalogue asks the player to switch into shopping mode with no prompt or context | Low store opens, high exit on the store home |
| P2 | **Coins without a goal are abstract** | "340 coins" means nothing until compared to something wanted | Hoarding, long gap before first redeem |
| P3 | **Redemption is treated as an exit** | Purchase flows end at a confirmation page, but redemption is the peak emotional moment of the game loop | Redeemers who never return |
| P4 | **The economy and rules are invisible** | Prices and earn rates are tuned by feel; chance-based or cash-like mechanics create regulatory and trust risk | Inflation, perceived unfairness |

These are hypotheses drawn from the model's structure. The prototype is built to make each one visible.

---

## 4. Design Principles

1. **Play first.** The store never interrupts active play.
2. **Goals over catalogues.** Lead with the player's next reward.
3. **Price in effort.** Show "about 3 rounds" next to the coin price.
4. **Every redemption seeds the next session.** The receipt is a retention surface.
5. **Native, not bolted on.** The store takes the game's visual language.
6. **Economy and fairness are features.** No cash-out, no chance-based rewards, no fake urgency.

---

## 5. What We Are Building

A playable prototype of a **Goal Store** with:

| Component | Purpose | Answers |
|---|---|---|
| **Pulse Tap mini-game** | A 20-second round that awards coins, making the play-to-reward link tangible | Gameplay and economy |
| **Goal pinning with HUD chip** | Player pins one reward and sees progress inside the game | P2 |
| **Effort pricing** | "About N rounds" on every reward | P2 |
| **Moment nudges** | Capped prompts at round end: near-goal, unlock, first goal | P1 |
| **Redeem sheet and receipt loop** | One-tap redeem, then a next-goal suggestion and back to game | P3 |
| **Classic vs Goal toggle** | Shows the difference side by side | The core question |
| **PM Lens** | Live events, funnel, economy meter and simulator | P4 |
| **Skins** | Three themes from one component set | Native feel |

### Out of scope
Real payments, real coupons, a backend, cash-out, chance-based rewards, and ML personalisation.

---

## 6. Success Measures

| Level | Metric |
|---|---|
| **North Star** | D7 retention lift, Goal Store vs Classic |
| **Activation** | % new players who pin a goal in session 1; time to first redeem |
| **Engagement** | Return-to-game rate after store close; nudge click-through |
| **Guardrails** | Gameplay minutes per DAU, D1 retention, sink ratio |

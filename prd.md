# PRD: Goal Store

**A goal-first, economy-aware in-game commerce store (interactive prototype)**

| | |
|---|---|
| **Author** | Prince Gupta |
| **Status** | v1.0, ready to build |
| **Related** | `problem-statement.md` |

---

## 1. Summary

Replace the catalogue-and-cart model with a **Goal Store**. The player pins a reward as a goal, sees its price in **effort** ("about 3 rounds"), gets capped nudges at natural pauses, and redeems into a receipt that suggests the next goal and returns them to play.

A **Classic** catalogue variant sits beside it so the difference is visible, and a **PM Lens** exposes live events, a funnel and the economy.

### Goals
| # | Goal | How the prototype shows it |
|---|---|---|
| G1 | Make coins meaningful early | A new player can pin a goal within 60 seconds |
| G2 | Shorten time to first reward | First reward reachable in about 2 rounds |
| G3 | Make redemption feed retention | Receipt always offers a next goal and a path back to play |
| G4 | Make the economy legible | Lens shows earn, spend, sink ratio and time-to-reward |
| G5 | Feel native to the game | Three skins from one component set |

### Non-goals
Real payments or coupons, backend, cash-out or transfer of coins, chance-based rewards, ML personalisation.

---

## 2. Users

| Persona | Need |
|---|---|
| **Kunal, new player** | Proof that rewards are real and reachable in the first session |
| **Sneha, habitual player** | A target for her coins and visible progress |
| **Rohan, studio lead** (served by the Lens) | To see how earn rate and prices affect the economy |

---

## 3. Scope

| Tier | Items |
|---|---|
| **P0** | Pulse Tap mini-game; wallet; Store Home; category filter; Reward Detail; goal pinning; HUD goal chip; Redeem sheet; Receipt with next goal; Classic vs Goal toggle; event logging |
| **P1** | Moment nudges; PM Lens (events, funnel, economy meter); economy simulator; skin switcher; guided tour |
| **P2** | Wallet history; reset and export event log |

### Surface mapping
| Standard surface | Goal Store equivalent | Difference |
|---|---|---|
| Homepage | Store Home | Leads with your goal and what is within reach |
| Category page | Category view | Filter chips, sorted by reachability |
| Product page | Reward Detail | Effort price, pin goal, "Earn more" CTA that returns to play |
| Cart | Goal tray | A single pinned goal with progress |
| Checkout | Redeem sheet | One-tap confirm |
| Order confirmation | Reward Receipt | Reveals code, suggests next goal, returns to game |

---

## 4. User Flows

**A. First session**
```
Game Home -> Play round 1 -> coins awarded
-> Nudge N3 "Pick your first goal" -> Store Home (Quick wins)
-> Reward Detail -> Pin as goal -> back to game, HUD chip visible
-> Play until affordable -> Nudge N2 "You can claim this now"
-> Redeem sheet -> Receipt -> next goal -> Play
```

**B. Out of reach**
```
Reward Detail (balance < price) -> CTA "Earn 160 more (about 3 rounds)"
-> store closes, round starts -> round end shows progress
-> Nudge N1 when within 2 rounds
```

**C. Classic variant**
```
Game Home -> Open store -> catalogue grid with banners and categories
-> product page -> Redeem -> plain confirmation -> Close
(no goal, no effort price, no nudges, no next-goal loop)
```

---

## 5. Functional Requirements

### 5.1 Game (Pulse Tap)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| G-1 | P0 | 20-second round; glowing orbs appear at random positions; tap to score | Tap increments score with a pop animation; round ends at 0 s |
| G-2 | P0 | Coins at round end: `min(120, hits x 4 + longest_combo x 2)` | 18 hits, combo 6 awards 84 coins |
| G-3 | P0 | HUD shows balance and a goal chip (icon, progress bar, remaining coins) | Chip updates after each round; hidden if no goal |
| G-4 | P0 | Round-end screen: coins earned, balance, goal progress; **Play again** and **Open store** | Both CTAs work and log events |
| G-5 | P1 | Lens has **Simulate round** (adds a set coin amount) | Logs `round_completed` with `source = simulated` |
| G-6 | P0 | "Demo economy" label visible | Label shown in Lens and settings |

### 5.2 Store Home (Goal variant)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| S-1 | P0 | Header with wallet balance and close control | Close logs `store_closed` with `return_to_game = true` |
| S-2 | P0 | **Your Goal** card on top; empty state "Pick a goal to play towards" | Empty state when `goalId` is null |
| S-3 | P0 | Goal card shows reward, price, progress ring, remaining coins, effort ETA | ETA follows section 6.3 |
| S-4 | P0 | **Within reach** rail: rewards with price up to 130% of balance, sorted per section 7.1 | Order matches the formula |
| S-5 | P0 | **Quick wins** rail: rewards tagged `quick_win` (300 coins or less) | First rail for players with zero redemptions |
| S-6 | P0 | Category chips: All, Food, Entertainment, Gaming, Shopping, Fashion, Gadgets | Selecting filters the grid and logs `category_selected` |
| S-7 | P0 | Reward card: brand tile, title, price, effort ETA, state badge (Affordable / Within reach / Far) | Badge updates as balance changes |
| S-8 | P1 | One static brand spotlight banner | Renders from seed |

### 5.3 Store Home (Classic variant)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| C-1 | P0 | Banner carousel, category chips, unsorted grid with coin price only | No goal card, ETA, badges or nudges |
| C-2 | P0 | Product page with price and Redeem; disabled if insufficient | Disabled state reads "Not enough coins", with no earn CTA |
| C-3 | P0 | Plain confirmation with code and **Close** | No next-goal suggestions |

### 5.4 Reward Detail

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| P-1 | P0 | Brand, title, rupee value, coin price, type, validity, collapsible terms | Renders from seed |
| P-2 | P0 | Effort line "About N rounds of play" | Per section 6.3 |
| P-3 | P0 | Primary CTA by state: **Redeem** (affordable) / **Earn X more** (not affordable) | "Earn X more" closes the store and starts a round |
| P-4 | P0 | **Pin as goal** / **Unpin** | Pinning replaces any existing goal; logs `goal_pinned` with `previous_goal_id` |
| P-5 | P0 | Progress bar of balance vs price | Updates after earning |
| P-6 | P1 | "Because you pinned X" related rewards | Same category, within 150% of price |

### 5.5 Redeem sheet

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| R-1 | P0 | Shows reward, price, **balance after**, one **Confirm** button | Balance after = balance minus price |
| R-2 | P0 | No form fields for digital rewards; physical shows "Delivery details (coming soon)" and still confirms | Placeholder shown for physical |
| R-3 | P0 | Confirm debits coins, writes a ledger entry, creates an order | Ledger has a `redeem` entry |
| R-4 | P0 | Double-tap creates one order | Button disables on first tap |
| R-5 | P1 | Lens toggle to simulate failure | Balance unchanged; `redeem_failed` logged; retry shown |

### 5.6 Reward Receipt (Goal variant)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| X-1 | P0 | Success animation; tap to reveal code; copy button | Copy logs `coupon_copied` |
| X-2 | P0 | How to use, expiry, coins spent | Populated from reward data |
| X-3 | P0 | **Next goal**: three suggestions per section 7.2 | One tap pins and logs `next_goal_selected` |
| X-4 | P0 | **Back to game** primary CTA | HUD shows the new goal chip |

### 5.7 Moment nudges

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| N-1 | P1 | **N1 Near-goal:** goal pinned and remaining is at most 2x average coins per round. "You're X coins from {goal}. One more round?" | CTA **Play again**; secondary **Open store** |
| N-2 | P1 | **N2 Unlock:** balance crossed a reward price this round. "You can now claim {reward}" | CTA **Claim**; secondary **Keep playing** |
| N-3 | P1 | **N3 First goal:** after round 1 with no goal. "Pick your first goal" | Opens Store Home on Quick wins |
| N-4 | P1 | Caps: 1 nudge per round end, 3 per session; after 2 dismissals, none for the session | Verified by scripted test |
| N-5 | P1 | Never during active play; no countdown timers or false scarcity | Verified in review |
| N-6 | P1 | Priority: N2, then N1, then N3 | Only the highest shows |

### 5.8 PM Lens

Side panel on desktop, bottom sheet on mobile.

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| L-1 | P1 | Live event stream: last 50 events, filterable | Updates in real time |
| L-2 | P1 | Funnel: Store open, Reward viewed, Goal pinned or Redeem started, Redeemed, Receipt revealed, Returned to game | Counts from the live log, with step conversion |
| L-3 | P1 | Economy meter: earned, spent, sink ratio, average coins per round, coins outstanding | Matches the ledger |
| L-4 | P1 | Variant switch (Classic / Goal) | Wallet preserved; new session id |
| L-5 | P1 | Economy simulator: sliders for coins per round, price multiplier, rounds per day | Outputs per section 6.4 update live |
| L-6 | P1 | Skin switcher | Restyles via tokens with no layout shift |
| L-7 | P1 | Hypothesis card (static): the Goal vs Classic test, primary metric D7 retention, guardrails | Content from section 9 |
| L-8 | P2 | Reset demo; export events as JSON | Reset restores seed |

### 5.9 Guided tour (P1)
Four skippable coachmarks: play a round, pin a goal, see the effort price, open the PM Lens.

---

## 6. Economy Design

### 6.1 Rules
1. Effort-denominated pricing: the player can always tell how long a reward will take.
2. Value ladder: cheap rewards build the habit, expensive ones sustain it.
3. No cash-equivalence: coins cannot be withdrawn, transferred or converted to money.
4. Earn rate and price multiplier are tunable.

### 6.2 Value ladder and constants

| Tier | Price (coins) | Time to reach |
|---|---|---|
| Quick wins | 150-300 | 1-3 rounds |
| Everyday | 400-900 | 6-12 rounds |
| Aspirational | 1,000-3,000 | 3-10 days |
| Premium (physical) | 6,000+ | 2+ weeks |

| Constant | Value |
|---|---|
| Starting balance | 90 coins |
| Default average coins per round | 70 (then rolling mean of last 3 rounds) |
| Rounds per day (assumed) | 15 |
| Round time | 20 s play, about 10 s overhead |

All values are configurable and labelled "Demo economy".

### 6.3 Effort ETA

```
remaining     = max(0, price - balance)
avg_per_round = rolling mean of last 3 rounds (default 70)
rounds_needed = ceil(remaining / avg_per_round)

remaining == 0       -> "Ready to claim"
rounds_needed <= 3   -> "about {n} round(s)"
rounds_needed <= 20  -> "about {n} rounds (~{n*0.5} min)"
else                 -> "about {ceil(rounds_needed / 15)} day(s) at your pace"
```

### 6.4 Economy simulator outputs
- **Time to first reward** = cheapest price x multiplier / coins per round
- **Days to Everyday tier** = median Everyday price x multiplier / (coins per round x rounds per day)
- **Daily earn** = coins per round x rounds per day
- **Sink ratio** (live) = coins spent / coins earned

| Indicator | Healthy band (hypothesis) |
|---|---|
| Time to first reward | Under 5 minutes |
| Days to Everyday tier | 1-3 days |
| Sink ratio | 40-70% |

### 6.5 Design rules
- No spin wheels, mystery boxes or randomised reward value
- Terms and expiry visible before redeem
- No countdown timers or fake scarcity
- Branded, non-cash rewards only

---

## 7. Rule-Based Personalisation

### 7.1 Within-reach ranking
```
score = 0.5 * proximity + 0.3 * category_affinity + 0.2 * popularity
proximity         = 1 - min(1, abs(price - balance) / max(price, balance))
category_affinity = 1 if same category as goal; 0.5 if viewed in last 3 events; else 0
popularity        = seeded rank normalised to 0..1
```
Eligible: `price <= 1.3 x balance`. Ties go to the lower price.

### 7.2 Next-goal suggestions
1. Same category, one tier up
2. Cheapest unredeemed Quick win or Everyday reward
3. An Aspirational reward

Exclude anything already redeemed this session.

---

## 8. Analytics

**Common properties:** `event_name`, `timestamp`, `player_id`, `session_id`, `variant`, `skin`, `coin_balance`, `source` (`user` | `simulated`).

| Event | Trigger | Key properties |
|---|---|---|
| `round_started` | Round begins | `round_index` |
| `round_completed` | Round ends | `hits`, `longest_combo`, `coins_earned`, `source` |
| `nudge_shown` / `nudge_clicked` / `nudge_dismissed` | Nudge lifecycle | `nudge_type`, `goal_id`, `remaining_coins` |
| `store_opened` | Store opens | `entry_point` (hud, round_end, nudge, receipt), `has_goal` |
| `category_selected` | Chip tap | `category` |
| `reward_impression` | Card in view | `reward_id`, `rail`, `position`, `state` |
| `reward_clicked` | Card tap | `reward_id`, `rail`, `position` |
| `pdp_viewed` | Detail opens | `reward_id`, `price`, `balance`, `affordable` |
| `goal_pinned` / `goal_unpinned` | Pin action | `reward_id`, `previous_goal_id` |
| `earn_cta_clicked` | "Earn X more" | `reward_id`, `remaining_coins`, `rounds_needed` |
| `redeem_initiated` / `redeem_confirmed` / `redeem_failed` | Redeem flow | `reward_id`, `price`, `balance_after`, `reason` |
| `reward_revealed`, `coupon_copied` | Receipt | `reward_id` |
| `next_goal_selected` | Suggestion tap | `reward_id`, `suggestion_rank` |
| `store_closed` | Store closes | `return_to_game`, `time_in_store_sec` |
| `skin_changed`, `variant_changed` | Lens | `from`, `to` |

**Primary funnel:** `store_opened` -> `pdp_viewed` -> (`goal_pinned` or `redeem_initiated`) -> `redeem_confirmed` -> `reward_revealed` -> `round_started` (same session).

**Activation funnel:** first `round_completed` -> `nudge_shown` (N3) -> `store_opened` -> `goal_pinned` -> second `round_completed`.

---

## 9. Metrics and Test Design (shown in the Lens)

| Layer | Metric |
|---|---|
| North Star | D7 retention, Goal Store vs Classic |
| Activation | % new players pinning a goal in session 1; time to first redeem |
| Engagement | Return-to-game after store close; nudge click-through |
| Guardrails | Gameplay minutes per DAU (no more than 3% decline), D1 retention, sink ratio 40-70%, redeem failure under 1%, nudge dismissal under 70% |

**Test:** randomise per player into Classic, Goal Store, and optionally Goal Store without nudges. Analyse by assigned arm. For a 5% baseline D7 and a +1 pp effect, about 7,500 players per arm gives 80% power at 5% significance (`n = 15.7 x p(1-p) / delta^2`). Ship if D7 lifts and guardrails hold.

---

## 10. Design System

### 10.1 Principles
Skinned from the game; reward-first visuals; motion with purpose; mobile-first at 390 x 844, shown in a centred phone frame on desktop.

### 10.2 Skin tokens

| Token | Neon Arcade (default) | Jungle Pop | Retail Light |
|---|---|---|---|
| `--bg` | #0B1020 | #0F2A1D | #F6F7FB |
| `--surface` | #151B33 | #173A28 | #FFFFFF |
| `--primary` | #7C5CFF | #FF8A3D | #2563EB |
| `--accent-coin` | #FFC933 | #FFE066 | #F59E0B |
| `--success` | #22D3A0 | #7BE495 | #16A34A |
| `--text` | #EAF0FF | #F1FFF4 | #0F172A |
| `--muted` | #8A94B8 | #9CC7AA | #64748B |
| `--radius` | 20px | 28px | 8px |
| Display font | Sora | Baloo 2 | Inter |

Body font is Inter in all skins. Body text must meet WCAG AA contrast in every skin.

### 10.3 Components
`PhoneFrame`, `WalletPill`, `GoalCard`, `GoalChip`, `ProgressRing`, `RewardCard`, `EffortLabel`, `StateBadge`, `CategoryChips`, `RewardDetail`, `RedeemSheet`, `ReceiptCard`, `NextGoalCard`, `NudgeCard`, `LensPanel`, `EventRow`, `FunnelChart`, `EconomyMeter`, `SimulatorControls`, `SkinSwitcher`, `CoachMark`.

### 10.4 Microcopy

| Moment | Copy |
|---|---|
| Empty goal | "Pick a goal to play towards" |
| Not affordable | "Earn 160 more (about 3 rounds)" |
| Near-goal nudge | "You're 60 coins from Swiggy Rs 75 off. One more round?" |
| Unlock nudge | "You can now claim Zomato Rs 50 off" |
| Redeem success | "Reward unlocked" |
| Next goal heading | "What are you playing for next?" |
| Failure | "That didn't go through. Your coins are safe. Try again." |

---

## 11. Technical Specification

| Area | Choice |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS with CSS variables for skins |
| State | Zustand |
| Motion | Framer Motion |
| Charts | Recharts |
| Persistence | `localStorage` in try/catch, with reset |
| Backend | None; events held in memory |
| Hosting | Vercel or Netlify |
| Assets | No remote images; brand tiles are generated monograms in brand colours |

### 11.1 Folder structure
```
src/
  app/        shell, PhoneFrame, layout
  game/       PulseTap, RoundEnd, Hud
  store/      StoreHome, ClassicHome, CategoryView, RewardDetail, RedeemSheet, Receipt
  nudges/     NudgeEngine, NudgeCard
  lens/       LensPanel, EventStream, Funnel, EconomyMeter, Simulator
  state/      useAppStore, selectors
  lib/        economy (ETA, ranking, sink ratio), analytics, seed
  theme/      tokens.css, skins
  components/ shared UI
```

### 11.2 Data model
```ts
type Reward = {
  id: string; brand: string; title: string; valueInr: number;
  type: 'coupon' | 'giftcard' | 'digital' | 'physical';
  category: 'Food' | 'Entertainment' | 'Gaming' | 'Shopping' | 'Fashion' | 'Gadgets';
  priceCoins: number; validityDays: number; tag?: 'quick_win';
  popularityRank: number; brandColor: string; terms: string[]; howToUse: string[];
};
type LedgerEntry = { id: string; type: 'earn' | 'redeem'; amount: number; ts: number; refId?: string };
type Order = { id: string; rewardId: string; priceCoins: number; code: string; ts: number };
type AppState = {
  balance: number; goalId: string | null; ledger: LedgerEntry[]; orders: Order[];
  session: { id: string; roundsPlayed: number; coinsHistory: number[];
             nudgesShown: number; nudgesDismissed: number };
  ui: { screen: Screen; variant: 'classic' | 'goal'; skin: 'neon' | 'jungle' | 'retail';
        lensOpen: boolean; tourDone: boolean };
  events: AnalyticsEvent[];
};
```

### 11.3 Seed catalogue
*Brand names are illustrative only; the prototype shows a disclaimer.*

| ID | Brand | Title | Type | Category | Coins | Tag |
|---|---|---|---|---|---|---|
| r01 | Zomato | Flat Rs 50 off | coupon | Food | 150 | quick_win |
| r02 | Swiggy | Rs 75 off on Rs 249+ | coupon | Food | 250 | quick_win |
| r03 | BookMyShow | Rs 100 off on tickets | coupon | Entertainment | 500 | |
| r04 | Google Play | Rs 100 gift code | giftcard | Gaming | 600 | |
| r05 | Domino's | Rs 150 off on Rs 499+ | coupon | Food | 650 | |
| r06 | Spotify | 1-month Premium credit | digital | Entertainment | 750 | |
| r07 | Nykaa | Rs 200 off on Rs 999+ | coupon | Fashion | 800 | |
| r08 | Netflix | 1-month mobile plan credit | digital | Entertainment | 900 | |
| r09 | Starbucks | Rs 200 e-gift card | giftcard | Food | 1,000 | |
| r10 | Myntra | Rs 300 off on Rs 1,499+ | coupon | Fashion | 1,200 | |
| r11 | Amazon | Rs 250 gift card | giftcard | Shopping | 1,400 | |
| r12 | Steam | Rs 500 wallet code | giftcard | Gaming | 2,800 | |
| r13 | boAt | Wireless earbuds | physical | Gadgets | 6,500 | |
| r14 | Noise | Smartwatch | physical | Gadgets | 9,000 | |

Starting balance is 90 coins. Codes are mock strings such as `PS-ZOM50-7K3Q`.

### 11.4 Pulse Tap spec
- Play area 340 x 460 inside the phone frame
- Orbs spawn every 450-800 ms, live 1.1 s, radius 28-40 px
- Combo increases on consecutive hits; an expired orb resets it
- Hit feedback: scale pop, particle burst, `navigator.vibrate` where available; sound off by default

### 11.5 Layout
- **Desktop (above 1100 px):** left brief panel (problem, pillars, 60-second demo steps), centre phone frame, right PM Lens
- **Tablet (700-1100 px):** phone centred; Lens as a slide-over
- **Mobile (below 700 px):** phone fills the viewport; Lens opens as a bottom sheet from a floating button

### 11.6 Quality bar
Tap targets at least 44 px; visible focus states; keyboard-reachable on desktop; respects `prefers-reduced-motion`; first load under 2 s on 4G; no layout shift when switching skins; no console errors.

---

## 12. Build Plan

Build in order; each milestone must pass its checks before the next begins.

| # | Milestone | Deliverables | Done when |
|---|---|---|---|
| M1 | Foundation | Vite + React + TS + Tailwind; skin tokens; PhoneFrame; Zustand store; seed data; analytics logger | Three skins load; events log |
| M2 | Game loop | Pulse Tap, coin award, HUD, round-end screen | G-1 to G-4 |
| M3 | Store core | Store Home, categories, Reward Detail, effort ETA, pin goal, HUD chip | S-1 to S-7, P-1 to P-5 |
| M4 | Redeem and receipt | Redeem sheet, ledger, orders, receipt with next goal | R-1 to R-4, X-1 to X-4 |
| M5 | Classic variant | Control store and variant switch | C-1 to C-3; wallet preserved on switch |
| M6 | Nudges | Nudge engine with caps and priority | N-1 to N-6 |
| M7 | PM Lens | Events, funnel, economy meter, simulator, skins, hypothesis card | L-1 to L-7 |
| M8 | Polish and ship | Guided tour, microcopy, responsive and accessibility checks, deploy | All P0 and P1 pass; public link works |

### 12.1 Scripted tests
1. **First session:** fresh state, play a round, N3 appears, pin Zomato Rs 50, HUD chip shows, play until affordable, N2 appears, redeem, receipt shows three next goals.
2. **Out of reach:** with 90 coins open Swiggy Rs 75 off (250 coins); CTA reads "Earn 160 more (about 3 rounds)"; tapping starts a round.
3. **Double-tap redeem:** one order and one ledger debit.
4. **Nudge caps:** dismiss two nudges; none for the rest of the session.
5. **Variant switch:** Classic shows no goal, ETA or nudges; Goal shows all three.
6. **Economy:** slider changes update outputs; sink ratio equals spent divided by earned.
7. **Persistence:** refresh keeps state; reset returns to seed.

### 12.2 Definition of done
- All P0 and P1 criteria pass
- Public URL works on phone and laptop with no sign-in
- No broken states at zero balance, exact balance, or after the last redeemable item
- README with setup steps and assumptions

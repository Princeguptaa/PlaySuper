# Goal Store Interactive Prototype

This is the interactive prototype for the Goal Store, addressing key challenges in play-to-earn economies by linking gameplay directly with tangible goals.

## Tech Stack
- React 18
- TypeScript
- Vite
- Zustand (State Management)
- Tailwind CSS (Styling & Design System)
- Framer Motion (Animations)
- Recharts (Data Visualization)

## Folder Structure
- `src/app`: Core application shell, routing, layouts, and Guided Tour.
- `src/components`: Shared UI components (Buttons, Progress Rings, CoachMarks).
- `src/game`: PulseTap mini-game, HUD, and Round End screens.
- `src/store`: The Goal Store and Classic Store variants, including Reward Detail and Receipt.
- `src/lens`: The PM Lens analytics panel, Simulator, Funnel chart, and Event Stream.
- `src/state`: Zustand store, selectors, and TypeScript type definitions.
- `src/lib`: Core utility functions, economy math, analytics logger, and seed data.
- `src/nudges`: Nudge engine logic and UI.
- `src/theme`: CSS design tokens and fonts for Skin switching.

## Setup Instructions

1. Clone the repository.
2. Ensure you have Node.js 18+ installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## How to Play / Demo
- The prototype starts with a 90-coin balance.
- **Goal Store Variant**: Open the store to browse rewards. You can pin a reward as your goal. Play rounds of PulseTap to earn more coins. Contextual nudges will guide you based on your progress.
- **Classic Variant**: Switch to the "Classic Store" in the PM Lens or via the toggle in the store header to see a control variant without goals, effort pricing, or nudges.
- **PM Lens**: On desktop, the PM Lens is permanently visible on the right. On mobile, use the floating action button to open it. It shows live analytics, a funnel chart, an economy simulator, and options to switch skins or variants.

## Resetting the Demo
- In the PM Lens panel (scroll to the bottom), there is a **Reset Demo** button that clears all local storage state and restores the initial seed data.
- You can also export the session event stream as JSON from the PM Lens.

## Assumptions & Constraints
- All data is persisted in the browser's `localStorage`.
- The prototype assumes a mobile-first or tablet layout for the core game/store flow, wrapped in a Phone Frame on desktop.
- Brand names and images are illustrative.

## Deploying on Render

This project is fully configured for deployment as a **Static Site** on [Render](https://render.com).

### Option 1: Automatic Deployment via Blueprint (Recommended)
1. Push your changes to GitHub / GitLab.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect this repository (`PlaySuper`).
5. Render will automatically read [`render.yaml`](./render.yaml) and configure:
   - **Service Type**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `20.18.0`
   - **SPA Routing**: Rewrites `/*` to `/index.html`
6. Click **Apply** to deploy.

### Option 2: Manual Setup in Render Dashboard
1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Static Site**.
3. Connect your repository.
4. Set the following settings:
   - **Name**: `playsuper-goal-store` (or your preferred name)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Under **Advanced** / **Environment Variables**:
   - Add `NODE_VERSION` with value `20.18.0`.
6. Under **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
7. Click **Create Static Site**.

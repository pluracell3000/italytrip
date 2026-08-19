# Mocale Quest

A live, map-first field guide for discovering Tuscany around **Borgo Mocale**. Instead of building a rigid itinerary, open the app and get three thoughtful places that fit the weather, the hour, your energy and how hungry you are.

**Live:** https://pluracell3000.github.io/italytrip/

## Product experience

- Custom, low-noise map of the Upper Valdarno with 51 researched quests
- Search across place names, villages, categories, descriptions and tags
- Live local conditions from Open-Meteo, with a graceful offline fallback
- Context-aware recommendations that combine editorial priority with heat, rain, time, energy and hunger
- Quest details with drive time, effort, ideal window, honest caveats and one-tap Google Maps directions
- Active routes, completion feedback and an evolving journey log
- Local persistence—no account or backend required
- Installable web-app manifest and mobile safe-area support
- Keyboard-accessible dialogs, visible focus, touch-sized controls and reduced-motion support
- Responsive bottom sheets on mobile and floating editorial panels on desktop

The catalog is merged and deduplicated from two audited research batches in `docs/research/`. Drive times remain editorial estimates and coordinates are approximate pending a dedicated verification pass. Availability flags are editorial rather than live business data, so time-sensitive places should be confirmed before leaving.

Search can also discover nearby OpenStreetMap places through the free Photon API. These results are clearly marked as unverified, stay in the current browser session and never alter the curated catalog.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · MapLibre GL · OpenFreeMap · Open-Meteo.

The app has no secrets, database or server runtime. Weather is fetched directly in the browser and day progress stays in `localStorage`.

## Develop

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
npm run check
npm run build
```

The dev server runs at `http://localhost:3000`. The production build is exported to `out/`.

## Project map

```text
app/                    App shell, metadata, manifest and global design tokens
components/
  GameScreen.tsx        Saved run state and screen orchestration
  MapView.tsx           MapLibre map, markers, route trail and camera controls
  GameHUD.tsx           Live weather, energy, hunger and search entry
  WelcomeScreen.tsx     First-run product framing
  SearchOverlay.tsx     Local-first catalog search
  WhatNextSheet.tsx     Top-three adaptive recommendations
  QuestBottomSheet.tsx  Editorial place details and actions
  JourneySheet.tsx      Completed-place journal and progress
  Icon.tsx              Shared dependency-free SVG icon system
data/quests.ts          Human-editable researched place catalog
docs/research/          Audited source batches and editorial decisions
hooks/                  Dialog accessibility and live weather hooks
lib/
  recommendations.ts    Deterministic context-aware ranking
  search.ts             Accent-insensitive catalog search
  weather.ts            Open-Meteo client and WMO condition mapping
  mapStyle.ts           Custom game-world map style
types/                  Product, map and icon types
DESIGN.md               Visual and interaction principles
```

## Deployment

Every push to `main` runs `.github/workflows/deploy-pages.yml`, builds with `NEXT_PUBLIC_BASE_PATH=/italytrip`, and publishes the static `out/` directory to GitHub Pages.

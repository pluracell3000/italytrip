# Mocale Quest

A live, map-based exploration game for discovering places around **Borgo
Mocale** and Tuscany — without following a rigid itinerary. Open the app,
press **What next?**, get three strong choices for *right now*.

> Pokémon-style exploration + Zelda-style quest map + premium travel guide +
> live context.

**Status: Phase 0 — visual prototype.** Mock data, no real scoring, no live
weather yet. The goal of this phase is to validate the visual identity, map
interaction, marker design, HUD, bottom sheet and mobile ergonomics.

## What's in the prototype

- Full-screen stylized "game world" map of the Upper Valdarno (custom
  MapLibre style — warm terrain, forests, rivers, subdued roads, no basemap
  noise)
- Pulsing player marker at Borgo Mocale
- 10 mock quests across all categories (nature, water, village, farm, pizza,
  gelato, sunset, rain-safe, base) with marker states: available,
  recommended, active, completed, closed, weather-sensitive
- Compact HUD: time, temperature (mocked), energy bar, hunger
- Quest bottom sheet: why-go, chips, best time, energy impact, Start /
  Navigate (opens Google Maps) / Close
- Active quest: banner + dotted route trail on the map, camera fit
- Quest completion overlay with energy change
- **WHAT NEXT?** sheet with top-3 mock recommendations that react to run
  state (completed quests drop out; low energy boosts recovery quests)

## Live

Deployed to GitHub Pages on every push to `main`
(`.github/workflows/deploy-pages.yml`):

**https://pluracell3000.github.io/italytrip/**

## Stack

Next.js (App Router, static export) · TypeScript · Tailwind CSS v4 ·
MapLibre GL JS.

The plan prefers Mapbox GL JS; the prototype uses **MapLibre + OpenFreeMap**
because it needs no API token — the map style is fully custom either way, and
swapping providers only touches `lib/mapStyle.ts` + the map constructor in
`components/MapView.tsx`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000 — use a mobile viewport
npm run build   # production build
```

No environment variables, no database, no backend.

## Layout

```
app/                    # App Router shell (layout, page, global styles)
components/
  GameScreen.tsx        # run state + screen orchestration
  MapView.tsx           # MapLibre map, markers, route trail
  QuestMarker.tsx       # marker DOM factories (states via data-attributes)
  GameHUD.tsx           # time / temp / energy / hunger
  QuestBottomSheet.tsx  # quest detail card
  WhatNextSheet.tsx     # top-3 recommendations
  ActiveQuestBanner.tsx
  QuestCompleteOverlay.tsx
  WhatNextButton.tsx
  EnergyBar.tsx
data/quests.ts          # mock quest catalog + category meta (human-editable)
lib/
  mapStyle.ts           # custom game-world map style
  recommendations.ts    # mock top-3 (Phase 1: deterministic scoring)
  geo.ts                # route arc
  utils.ts
types/game.ts           # Quest, RunState, marker states
DESIGN.md               # visual design system
```

## Roadmap

- **Phase 0 — visual prototype** ← you are here
- **Phase 1 — core game**: Start Now, energy/hunger simulation, deterministic
  scoring, localStorage persistence
- **Phase 2 — live context**: geolocation, weather, sunset,
  weather-sensitive ranking
- **Phase 3 — real content**: 30–40 curated POIs, opening hours, images
- **Phase 4 — PWA polish**: installability, offline degradation, icons

See `DESIGN.md` for the visual language.

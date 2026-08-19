# Mocale Quest — Visual Design System (v1.0)

The intended feeling: **Pokémon-style exploration + Zelda-style quest map +
premium travel editorial + live context.** Playful but restrained — never
8-bit, never childish, never Google-Maps-generic.

## Design keywords

premium · playful · exploratory · Mediterranean · warm · tactile · editorial ·
map-first · calm · polished

---

## 1. Color

A warm Tuscany palette. Parchment grounds everything; terracotta is the single
loud voice; category colors stay muted and earthy.

| Token | Hex | Role |
| --- | --- | --- |
| `parchment` | `#F1E5CF` | App + map ground |
| `sand` | `#EADDC4` | Chips, secondary surfaces |
| `cream` | `#FFFAF0` | Cards, sheets, marker bubbles |
| `ink` | `#3B2E22` | Primary text, dark surfaces |
| `ink-soft` | `#6B5A47` | Secondary text |
| `terracotta` | `#B14A27` | Primary CTA, active quest, player |
| `terracotta-deep` | `#963A1F` | Hover and pressed states |
| `olive` | `#657A40` | Positive energy, success |
| `forest` | `#567447` | Nature category, complete action |
| `water` | `#3E8896` | Water category |
| `gold` | `#B87518` | Sunset category, warnings |
| `blush` | `#B45F7D` | Gelato category |
| `stone` | `#7D8CA3` | Rain-safe category, disabled |

Rules:

- Terracotta is reserved for "act now": the CTA, the active quest, the player.
- Energy deltas: olive = gain, terracotta = cost. Nothing else uses those pills.
- Map terrain colors live in `lib/mapStyle.ts` and are deliberately quieter
  than the UI palette so markers pop.

## 2. Typography

- **Display: Fraunces** (variable serif) — quest names, numbers in the HUD,
  CTA labels. Uppercase + wide tracking for game-y headers ("WHAT NEXT?",
  "QUEST COMPLETE").
- **UI: Outfit** (geometric sans) — everything else.
- Body text stays ≥13px; single-weight hierarchy per block (bold name,
  medium place, regular prose).

## 3. Surfaces & shape

- Cards and sheets: `cream`, radius 24px (`rounded-3xl` sheets,
  `rounded-2xl` cards), soft long shadows (`shadow-card`).
- Chips: `sand`, full-round, 12px text.
- Bottom sheets have a 40×4px drag handle and respect `safe-area-inset`.
- Dark surfaces (`ink` at 90%) are reserved for the active-quest banner and
  Navigate buttons — the "instrument panel" feel.

## 4. The map is the game world

Custom MapLibre style (`lib/mapStyle.ts`), built from scratch:

- parchment ground, sage forests, warm-teal water, tan roads
- no commercial POIs, no default basemap noise
- only city/town/village labels, uppercase, letter-spaced, halo'd
- rotation disabled — the world stays upright like a game map

## 5. Markers

- **Quest marker**: 48px cream bubble, 2.5px category-colored ring, category
  icon from the shared monoline SVG system.
- **States** (data-attributes + CSS in `globals.css`):
  - `recommended` — soft pulsing halo in the category color
  - `active` — terracotta ring + faster pulse
  - `completed` — desaturated + forest ✓ badge
  - `closed` — grayscale + stone ✕ badge
  - `weather_sensitive` — gold ! badge
- **Player**: 26px terracotta dot, white ring, slow radiating pulse. Floats
  above quest markers, never intercepts taps.
- **Route**: dotted terracotta arc (quadratic bezier) from player to active
  quest — a trail, not a navigation polyline.

## 6. Motion

Purposeful and quiet. Standard curve: `cubic-bezier(0.32, 0.72, 0, 1)` for
sheets; springy `cubic-bezier(0.34, 1.56, 0.64, 1)` for pop-ins.

- player pulse (2.2s loop), recommended-marker halo (2.4s loop)
- sheet slide-up 320ms, card pop-in 350ms with 70ms stagger
- energy bar width transitions 700ms
- camera: `easeTo` on select, `fitBounds` on quest start

Avoid: constant map animation, particles, anything that competes with the
terrain.

## 7. Mobile ergonomics

- One-handed: all actions in the bottom half; primary CTA bottom-center.
- Tap targets ≥44px; `active:scale` feedback on every button.
- High-contrast text on cream/parchment for outdoor glare.
- `100dvh` and `viewport-fit=cover`; browser zoom remains available.
- Bottom sheets become floating, scroll-contained panels at desktop widths.
- All modal surfaces trap focus, close with Escape and restore focus on exit.
- Reduced-motion preferences collapse non-essential animation.

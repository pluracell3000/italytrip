# Mocale Quest — Research Summary, Batch 1

**Date:** 2026-08-18

## What the research changed

The area around Borgo Mocale is strong enough that the MVP does **not** need to pretend all of Tuscany is nearby. The best product is a dense local world centered on the Balze, Loro Ciuffenna, Pratomagno/Vallombrosa, Valdarno towns, and Arezzo.

The research also confirms the value of separating:
- **editorial truth** — why a place is worth doing
- **volatile operational truth** — hours, closures, routing, weather

The first should stay curated. The second should eventually refresh.

## Strongest 10 experience anchors

1. **Loro Ciuffenna** — strongest all-round nearby quest; village + gorge + waterfall + mill.
2. **Vallombrosa Forest** — best hot-day escape.
3. **Balze del Valdarno** — signature scenery immediately around base.
4. **Castelfranco di Sopra** — ideal ultra-low-friction evening quest.
5. **Arezzo historic center** — best substantial city quest.
6. **Croce del Pratomagno** — biggest panorama/cooler mountain quest when conditions are good.
7. **Montevarchi Paleontological Museum** — strongest nearby rainy-day child-friendly anchor.
8. **Valle dell'Inferno & Bandella** — nature/wetland alternative with future kayak/SUP potential.
9. **Il Borro** — visually strong compact village, subject to access expectations.
10. **San Giovanni Valdarno** — authentic easy evening/food combination.

## Best extreme-heat quests

- Vallombrosa Forest
- Abbazia di Vallombrosa
- Arboreti di Vallombrosa, when access is available
- Loro Ciuffenna in early morning or evening rather than exposed midday
- indoor Montevarchi Paleontological Museum

## Best rainy-day quests

- Montevarchi Paleontological Museum
- MINE Museum, Cavriglia
- Arezzo museums / historic center using indoor-outdoor hopping
- San Giovanni museum/art stops

## Best low-energy quests

- Castelfranco historic center
- Gelateria Caffetteria Turismo
- New California pizza/food
- Loro Ciuffenna as a short evening loop
- San Giovanni Valdarno + dinner

## Best evening quests

- Loro Ciuffenna
- Castelfranco di Sopra
- San Giovanni Valdarno
- Arezzo
- Il Borro, if access is straightforward
- gelato stations in Castelfranco / Figline / Arezzo

## Food findings worth seeding now

### Ultra-local / spontaneous
- Gelateria Caffetteria Turismo
- New California

### Proper nearby dinner
- Le Pietre Serene
- Ristorante il Cipresso
- Agricola 7
- Ristorante Castellucci

### Route pairing
- Il Canniccio for Reggello/Vallombrosa side

### Arezzo energy stations
- Cremeria Cecconi
- Gelateria Sunflower
- Osteria 54

## Important uncertainties

These should **not** be silently guessed in the app:

- exact outdoor seating at many restaurants
- restaurant reservations / same-day capacity
- real drive time
- temporary road restrictions
- guided/open access to Vallombrosa arboreta
- child/visitor formats at riding/farm businesses
- public swimming legality/safety in natural water
- short safe access points to Balze for very young children

## Recommended live-refresh fields

Eventually refresh through APIs or small verification jobs:

```text
open_now
opening_hours
temporary_closed
drive_minutes
traffic
weather
rain_probability
temperature
sunset
```

Keep these curated/static unless deliberately re-researched:

```text
why_go
base_quality
scenic_score
kid_score
shade_level
walking_intensity
failure_modes
best_time_of_day
```

## Recommendation for Claude/Codex

Use `MOCALE_QUEST_VERIFIED_POIS.md` as **seed editorial content**, not yet as final production JSON.

For Phase 0, select only 8–10 entries:

- Borgo Mocale / home
- Castelfranco
- Balze
- Loro Ciuffenna
- Vallombrosa
- Pratomagno
- Montevarchi Paleontological Museum
- Arezzo
- one gelato
- one pizza / restaurant

This is enough to validate the game loop before wiring all content.

# Mocale Quest — Verified POIs, Research Batch 1

**Run date:** 2026-08-18  
**Status:** First audited dataset for MVP seeding  
**Important:** Drive minutes are editorial estimates from Borgo Mocale, **not live routing**. The runtime should eventually calculate route time. Volatile opening/access facts should be refreshed.

The shortlist below intentionally mixes destination quests and energy/food stations. Confidence is generally **high for place existence/value**, but some operational details remain medium and are called out in `failure_modes`.

## Castelfranco di Sopra

```yaml
id: castelfranco
name: "Castelfranco di Sopra"
category: "village"
drive_from_borgo_minutes: 5
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 9
scenic_score: 8
rain_compatible: "partial"
best_time_of_day: "evening"
energy_cost: 8
energy_reward: 0
why_go: "Medieval home-area quest with almost no commitment."
failure_modes:
  - "Midday heat; combine with food/gelato."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/it/citta-e-borghi/castelfranco-e-piandisco/"
```

## Badia di San Salvatore a Soffena

```yaml
id: badia-soffena
name: "Badia di San Salvatore a Soffena"
category: "historic"
drive_from_borgo_minutes: 6
estimated_visit_minutes:
  min: 30
  max: 60
indoor_outdoor: "mixed"
shade_level: 2
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 7
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "morning"
energy_cost: 5
energy_reward: 0
why_go: "Beautiful compact abbey beside Castelfranco."
failure_modes:
  - "Verify same-day access hours."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/it/citta-e-borghi/castelfranco-e-piandisco/"
```

## Area Naturale Protetta delle Balze

```yaml
id: balze
name: "Area Naturale Protetta delle Balze"
category: "nature"
drive_from_borgo_minutes: 8
estimated_visit_minutes:
  min: 30
  max: 90
indoor_outdoor: "outdoor"
shade_level: 0
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 9
scenic_score: 10
rain_compatible: "false"
best_time_of_day: "morning/sunset"
energy_cost: 10
energy_reward: 0
why_go: "Signature geological landscape immediately around base."
failure_modes:
  - "Avoid exposed sections in extreme midday heat."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/it/citta-e-borghi/castelfranco-e-piandisco/"
```

## Sentiero dell'Acqua Zolfina

```yaml
id: acqua-zolfina
name: "Sentiero dell'Acqua Zolfina"
category: "nature"
drive_from_borgo_minutes: 8
estimated_visit_minutes:
  min: 120
  max: 180
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 2
parking_difficulty: "easy"
kid_score: 8
scenic_score: 10
rain_compatible: "false"
best_time_of_day: "morning"
energy_cost: 22
energy_reward: 0
why_go: "7 km loop with the best immersive Balze scenery."
failure_modes:
  - "Too long/exposed for small children at 34–36°C; shorten rather than force full loop."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/it/itinerari/sentiero-dellacqua-zolfina-un-itinerario-tra-le-balze-del-valdarno/"
```

## Loro Ciuffenna

```yaml
id: loro
name: "Loro Ciuffenna"
category: "village/water"
drive_from_borgo_minutes: 18
estimated_visit_minutes:
  min: 90
  max: 180
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 10
scenic_score: 10
rain_compatible: "partial"
best_time_of_day: "evening"
energy_cost: 12
energy_reward: 0
why_go: "Best nearby all-rounder: gorge, bridge, waterfall, working historic mill and compact village."
failure_modes:
  - "Not a swimming quest; stone/river edges need supervision."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/ideas/5-watery-wonders-in-valdarno/"
```

## Pieve di San Pietro a Gropina

```yaml
id: gropina
name: "Pieve di San Pietro a Gropina"
category: "historic"
drive_from_borgo_minutes: 22
estimated_visit_minutes:
  min: 30
  max: 60
indoor_outdoor: "mixed"
shade_level: 2
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 7
scenic_score: 9
rain_compatible: "true"
best_time_of_day: "morning/evening"
energy_cost: 5
energy_reward: 0
why_go: "Excellent Romanesque micro-quest near Loro."
failure_modes:
  - "Works best as add-on, not a dedicated long outing."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/ideas/what-to-see-in-valdarno/"
```

## Croce del Pratomagno

```yaml
id: pratomagno
name: "Croce del Pratomagno"
category: "mountain/view"
drive_from_borgo_minutes: 45
estimated_visit_minutes:
  min: 90
  max: 180
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 2
parking_difficulty: "medium"
kid_score: 8
scenic_score: 10
rain_compatible: "false"
best_time_of_day: "morning/sunset"
energy_cost: 22
energy_reward: 0
why_go: "Big-view mountain quest and cooler-weather escape."
failure_modes:
  - "Mountain access/walk is not stroller-simple; avoid storms and low visibility."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Croce%20del%20Pratomagno"
```

## Vallombrosa Forest

```yaml
id: vallombrosa
name: "Vallombrosa Forest"
category: "forest"
drive_from_borgo_minutes: 35
estimated_visit_minutes:
  min: 120
  max: 240
indoor_outdoor: "outdoor"
shade_level: 3
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 10
scenic_score: 9
rain_compatible: "partial"
best_time_of_day: "morning/afternoon"
energy_cost: 8
energy_reward: 12
why_go: "Best heat-wave escape: altitude, huge shade and flexible walking."
failure_modes:
  - "Storms/wind can make forest outings poor choices."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.feelflorence.it/en/points-interest/experimental-arboretums-vallombrosa"
```

## Abbazia di Vallombrosa

```yaml
id: vallombrosa-abbey
name: "Abbazia di Vallombrosa"
category: "historic/forest"
drive_from_borgo_minutes: 35
estimated_visit_minutes:
  min: 45
  max: 90
indoor_outdoor: "mixed"
shade_level: 3
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 8
scenic_score: 9
rain_compatible: "true"
best_time_of_day: "morning/afternoon"
energy_cost: 4
energy_reward: 5
why_go: "Easy cultural anchor inside the forest outing."
failure_modes:
  - "Check access hours for interiors."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://visitreggello-tuscany.com/en/the-vallombrosa-experimental-arboretum-a-journey-into-biodiversity/"
```

## Arboreti Sperimentali di Vallombrosa

```yaml
id: arboreti
name: "Arboreti Sperimentali di Vallombrosa"
category: "nature"
drive_from_borgo_minutes: 36
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 3
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 8
scenic_score: 9
rain_compatible: "partial"
best_time_of_day: "morning/afternoon"
energy_cost: 6
energy_reward: 8
why_go: "Unique botanical discovery with thousands of specimens."
failure_modes:
  - "Guided/open access can vary; verify before treating as guaranteed."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.feelflorence.it/en/points-interest/experimental-arboretums-vallombrosa"
```

## Lago di San Cipriano

```yaml
id: san-cipriano
name: "Lago di San Cipriano"
category: "water"
drive_from_borgo_minutes: 30
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 7
scenic_score: 8
rain_compatible: "partial"
best_time_of_day: "morning/evening"
energy_cost: 7
energy_reward: 5
why_go: "Quiet water landscape with fishing/sailing/canoe context."
failure_modes:
  - "Do NOT label as a swimming spot without live/local confirmation."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/ideas/fun-and-relaxation-on-the-lakes-of-tuscany/"
```

## Valle dell'Inferno e Bandella Nature Reserve

```yaml
id: bandella
name: "Valle dell'Inferno e Bandella Nature Reserve"
category: "nature/water"
drive_from_borgo_minutes: 30
estimated_visit_minutes:
  min: 90
  max: 240
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 2
parking_difficulty: "medium"
kid_score: 8
scenic_score: 9
rain_compatible: "partial"
best_time_of_day: "morning"
energy_cost: 14
energy_reward: 4
why_go: "Strong wetland/nature alternative; birding plus water landscape."
failure_modes:
  - "Longer activities and kayaking require separate operator/conditions verification."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/towns-and-villages/laterina-pergine-valdarno/"
```

## Museo Paleontologico di Montevarchi

```yaml
id: montevarchi-paleo
name: "Museo Paleontologico di Montevarchi"
category: "museum/kids"
drive_from_borgo_minutes: 25
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "indoor"
shade_level: 3
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 9
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "afternoon"
energy_cost: 2
energy_reward: 8
why_go: "Best nearby rainy-day family museum: local elephants, saber-toothed cats, hippos and giant deer."
failure_modes:
  - "Current listing shows Thu–Sun hours; closed early week, so check before departure."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/attractions/paleontological-museum-in-montevarchi/"
```

## MINE Museum

```yaml
id: mine
name: "MINE Museum"
category: "museum"
drive_from_borgo_minutes: 30
estimated_visit_minutes:
  min: 60
  max: 90
indoor_outdoor: "indoor"
shade_level: 3
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 7
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "afternoon"
energy_cost: 2
energy_reward: 6
why_go: "Distinctive local mining story rather than generic art museum."
failure_modes:
  - "Opening schedule needs live check before a spontaneous quest."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/ideas/what-to-do-and-see-in-cavriglia-valdarno/"
```

## Il Borro village

```yaml
id: il-borro
name: "Il Borro village"
category: "village"
drive_from_borgo_minutes: 30
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 8
scenic_score: 10
rain_compatible: "partial"
best_time_of_day: "evening"
energy_cost: 8
energy_reward: 0
why_go: "Tiny spectacular settlement on a rocky spur; strong visual payoff."
failure_modes:
  - "Upscale private-estate feel; verify what is freely accessible on the day."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/itineraries-bike/valle-dell-inferno/"
```

## San Giovanni Valdarno center

```yaml
id: san-giovanni
name: "San Giovanni Valdarno center"
category: "town"
drive_from_borgo_minutes: 25
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "evening"
energy_cost: 7
energy_reward: 0
why_go: "Easy authentic town stroll with art, squares and food nearby."
failure_modes:
  - "Less dramatic than Loro; strongest as dinner/evening combination."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.visittuscany.com/en/itineraries/a-stroll-through-the-center-of-san-giovanni-valdarno/"
```

## Arezzo historic center / Piazza Grande

```yaml
id: arezzo
name: "Arezzo historic center / Piazza Grande"
category: "city"
drive_from_borgo_minutes: 45
estimated_visit_minutes:
  min: 180
  max: 300
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 2
parking_difficulty: "medium"
kid_score: 9
scenic_score: 10
rain_compatible: "true"
best_time_of_day: "morning/evening"
energy_cost: 20
energy_reward: 0
why_go: "The strongest nearby full city quest; architecture, squares, food and indoor fallbacks."
failure_modes:
  - "Avoid turning it into an all-day museum marathon in extreme heat."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.discoverarezzo.com/en/"
```

## Gelateria Caffetteria Turismo

```yaml
id: gelato-turismo
name: "Gelateria Caffetteria Turismo"
category: "gelato"
drive_from_borgo_minutes: 5
estimated_visit_minutes:
  min: 20
  max: 45
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 6
rain_compatible: "true"
best_time_of_day: "afternoon/evening"
energy_cost: 0
energy_reward: 12
why_go: "Ultra-local energy station in Castelfranco; current listing active."
failure_modes:
  - "Business hours are volatile."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Gelateria%20Caffetteria%20Turismo%20Castelfranco%20di%20Sopra"
```

## Bar Ristorante/Pizzeria New California

```yaml
id: new-california
name: "Bar Ristorante/Pizzeria New California"
category: "pizza"
drive_from_borgo_minutes: 5
estimated_visit_minutes:
  min: 45
  max: 90
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 5
rain_compatible: "true"
best_time_of_day: "lunch/evening"
energy_cost: 0
energy_reward: 22
why_go: "Very low-friction local pizza/food option with broad current hours."
failure_modes:
  - "Choose for convenience, not as a destination restaurant."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=New%20California%20Castelfranco%20di%20Sopra"
```

## Le Pietre Serene

```yaml
id: le-pietre-serene
name: "Le Pietre Serene"
category: "restaurant"
drive_from_borgo_minutes: 20
estimated_visit_minutes:
  min: 75
  max: 120
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "dinner"
energy_cost: 0
energy_reward: 28
why_go: "Strong nearby proper dinner candidate with high current rating."
failure_modes:
  - "Limited service days; not spontaneous every night."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Le%20Pietre%20Serene%20Loro%20Ciuffenna"
```

## Ristorante il Cipresso

```yaml
id: il-cipresso
name: "Ristorante il Cipresso"
category: "restaurant"
drive_from_borgo_minutes: 20
estimated_visit_minutes:
  min: 75
  max: 120
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "lunch/dinner"
energy_cost: 0
energy_reward: 28
why_go: "Established Tuscan restaurant and useful Loro pairing."
failure_modes:
  - "Check booking and current service hours."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Ristorante%20il%20Cipresso%20Loro%20Ciuffenna"
```

## Ristorante Agricola 7

```yaml
id: agricola7
name: "Ristorante Agricola 7"
category: "restaurant"
drive_from_borgo_minutes: 20
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "dinner"
energy_cost: 0
energy_reward: 25
why_go: "Farm-area Tuscan dinner with relaxed positioning."
failure_modes:
  - "Current listing shows limited Thu–Sun service."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Agricola%207%20Malva%20Loro%20Ciuffenna"
```

## Ristorante Castellucci

```yaml
id: castellucci
name: "Ristorante Castellucci"
category: "restaurant"
drive_from_borgo_minutes: 25
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "indoor/mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "lunch/dinner"
energy_cost: 0
energy_reward: 28
why_go: "Established Montevarchi option with >1,000 current listing reviews."
failure_modes:
  - "Outdoor seating not verified in this pass."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Ristorante%20Castellucci%20Montevarchi"
```

## Ristorante Il Canniccio

```yaml
id: il-canniccio
name: "Ristorante Il Canniccio"
category: "restaurant"
drive_from_borgo_minutes: 30
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "lunch/dinner"
energy_cost: 0
energy_reward: 28
why_go: "Good pairing for Reggello/Vallombrosa route; broad meal schedule."
failure_modes:
  - "Check reservation/outdoor table if that matters."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Ristorante%20Il%20Canniccio%20Reggello"
```

## Cremeria Cecconi

```yaml
id: cecconi
name: "Cremeria Cecconi"
category: "gelato"
drive_from_borgo_minutes: 45
estimated_visit_minutes:
  min: 20
  max: 40
indoor_outdoor: "mixed"
shade_level: 0
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 9
scenic_score: 7
rain_compatible: "true"
best_time_of_day: "afternoon/evening"
energy_cost: 0
energy_reward: 14
why_go: "Excellent current Arezzo gelato candidate; strong rating and long hours."
failure_modes:
  - "Best as an Arezzo add-on, not a dedicated drive."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Cremeria%20Cecconi%20Arezzo"
```

## Gelateria Sunflower

```yaml
id: sunflower
name: "Gelateria Sunflower"
category: "gelato"
drive_from_borgo_minutes: 45
estimated_visit_minutes:
  min: 20
  max: 40
indoor_outdoor: "mixed"
shade_level: 0
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 9
scenic_score: 7
rain_compatible: "true"
best_time_of_day: "afternoon/evening"
energy_cost: 0
energy_reward: 14
why_go: "Convenient Piazza San Francesco energy stop in Arezzo."
failure_modes:
  - "Best as an add-on."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Gelateria%20Sunflower%20Arezzo"
```

## Osteria 54

```yaml
id: osteria54
name: "Osteria 54"
category: "restaurant"
drive_from_borgo_minutes: 45
estimated_visit_minutes:
  min: 60
  max: 100
indoor_outdoor: "indoor/mixed"
shade_level: 1
walking_intensity: 0
parking_difficulty: "medium"
kid_score: 8
scenic_score: 8
rain_compatible: "true"
best_time_of_day: "lunch/dinner"
energy_cost: 0
energy_reward: 26
why_go: "Casual Tuscan option useful during an Arezzo quest."
failure_modes:
  - "Parking is city-dependent; use as city add-on."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Osteria%2054%20Arezzo"
```

## Gelateria Caraiby

```yaml
id: caraiby
name: "Gelateria Caraiby"
category: "gelato"
drive_from_borgo_minutes: 25
estimated_visit_minutes:
  min: 20
  max: 40
indoor_outdoor: "mixed"
shade_level: 0
walking_intensity: 0
parking_difficulty: "easy"
kid_score: 8
scenic_score: 6
rain_compatible: "true"
best_time_of_day: "afternoon/evening"
energy_cost: 0
energy_reward: 13
why_go: "Strong-volume gelato option in Figline, useful on westbound routes."
failure_modes:
  - "Not worth a special trip alone."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Gelateria%20Caraiby%20Figline%20Valdarno"
```

## Ranch Margherita

```yaml
id: ranch-margherita
name: "Ranch Margherita"
category: "activity"
drive_from_borgo_minutes: 35
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 7
scenic_score: 7
rain_compatible: "partial"
best_time_of_day: "morning"
energy_cost: 10
energy_reward: 4
why_go: "Interesting nearby farm/animal candidate with active current listing."
failure_modes:
  - "Visitor format, age suitability and booking are not verified enough for automatic recommendation."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Ranch%20Margherita%20Cavriglia"
```

## Circolo Ippico Tir na nog

```yaml
id: tir-na-nog
name: "Circolo Ippico Tir na nog"
category: "activity"
drive_from_borgo_minutes: 20
estimated_visit_minutes:
  min: 60
  max: 120
indoor_outdoor: "outdoor"
shade_level: 1
walking_intensity: 1
parking_difficulty: "easy"
kid_score: 7
scenic_score: 6
rain_compatible: "partial"
best_time_of_day: "morning"
energy_cost: 12
energy_reward: 0
why_go: "Very nearby riding candidate with active current listing."
failure_modes:
  - "Must verify whether casual visitors/young children can book suitable experiences."
last_verified: "2026-08-18"
confidence: "high"
sources:
  - "https://www.google.com/maps/search/?api=1&query=Circolo%20Ippico%20Tir%20na%20nog%20Terranuova%20Bracciolini"
```


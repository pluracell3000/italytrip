# Mocale Quest — Research Batch 2 (34-POI dataset with coordinates)

**Received:** 2026-08-19 (research run 2026-08-18)
**Base:** Borgo Mocale, Via Lama 26, Castelfranco Piandiscò, Arezzo, Tuscany

> Ingestion note (Claude): this batch supersedes batch 1 for coordinates and
> drive times on duplicated POIs. Energy semantics differ from the game's
> (its `energy_reward` on sightseeing quests reads as experiential payoff,
> not physical recovery), so quest `energyDelta` values in `data/quests.ts`
> keep the game convention: outings cost energy, food/rest restores it.

## TL;DR

- This curated 34-POI dataset centers on Borgo Mocale and prioritizes the low-friction, high-value cluster within 20 minutes (Loro Ciuffenna, the Balze del Valdarno, Castelfranco di Sopra, and the Setteponti pieve churches); the three strongest single picks for a family arriving this week are Loro Ciuffenna village with its historic watermill, the easy Balze del Valdarno loop from Castelfranco di Sopra, and Vallombrosa forest for heat relief.
- The best August extreme-heat escapes are the Vallombrosa biogenetic forest reserve (abbey at roughly 955 to 960 m, reserve spanning 450 to 1450 m), the shallow "Massette" spots on the Ciuffenna torrent, and shaded Pratomagno woodland; the deep Pozzone pool is explicitly NOT suitable for children aged 3 to 7.
- Two well-known names are rejected: the former Parco di Cavriglia zoo now has no animals (the last, bison Arturo, left on 12 February 2024), and Castello di Sammezzano is closed to visitors, with its owners planning reopening only in 2028.

## Key Findings

Borgo Mocale sits at about 480 m elevation in the Lama frazione, roughly 2.5 km from Castelfranco di Sopra. The densest concentration of genuinely worthwhile, low-effort experiences lies within a 20-minute drive: Castelfranco di Sopra, the Balze del Valdarno, Loro Ciuffenna, and the Romanesque Pieve di Gropina. This tight ring, not distant famous destinations, is what makes the base valuable, and the dataset is weighted accordingly.

Loro Ciuffenna is the standout nearby village: it is on the official Borghi più belli d'Italia list and holds the oldest functioning water mill in Tuscany, most likely built around 1100 (12th century) and still grinding chestnut flour. Its gorge setting keeps it noticeably cooler in summer, and it offers gelato, a Romanesque bridge, and river pools in one compact, walkable stop.

The Balze del Valdarno are dramatic stratified clay gullies. Their link to Leonardo da Vinci is more than folklore: Silvano Vinceti, president of the Centro Studi Leonardeschi, argued in July 2026 that a specific Balze formation at Castelfranco Piandiscò corresponds to the left part of the background of the Mona Lisa (Louvre), and the formations are also associated with the background of the Madonna dei Fusi (c. 1501). The easiest way in is the Sentiero dell'Acqua Zolfina, a CAI-marked loop of about 5 km that starts just outside Castelfranco's walls near the post office. (Batch 1 cited ~7 km for the same loop — unresolved discrepancy, treat as 5–7 km.)

Vallombrosa is the premier extreme-heat and shoulder-weather option. The abbey sits at roughly 955 to 960 m inside a biogenetic reserve of about 1,279 hectares ranging from 450 to 1450 m elevation, which since 2016 has held Italy's tallest tree, a Douglas fir measured at 62.45 m. It is a genuine cool-forest refuge with easy trails and picnic areas, about 50 to 60 minutes away over the Pratomagno.

## ARTIFACT 1: Candidates (broad discovery set)

Villages and towns: Castelfranco di Sopra (nearest borgo più bello), Loro Ciuffenna (borgo più bello, watermill), Piantravigne (Balze panoramic hamlet), San Giovanni Valdarno (Masaccio, Arnolfo plan), Montevarchi (Collegiata, shopping), Arezzo (Piazza Grande, Piero della Francesca), Poppi (Casentino castle), Il Borro (restored Ferragamo hamlet), Rocca Ricciarda (Pratomagno stone hamlet), Chianti edge castles (Brolio, Meleto, Gaiole).

Nature and forest: Vallombrosa forest reserve, Pratomagno ridge and Cross, Balze del Valdarno, Foresta di Sant'Antonio waterfalls (Reggello), Riserva Valle dell'Inferno e Bandella, Parco di Cavriglia woodland.

Water: Ciuffenna torrent pools (deep Pozzone and shallow Massette), Cascata di Meriggioni, Lago di Levane/Bandella wetland.

Activities: Poppi castle, MINE mining museum (Castelnuovo dei Sabbioni), Il Borro artisan workshops, Museo delle Terre Nuove (San Giovanni), Museo Venturino Venturi (Loro Ciuffenna), Castello di Sammezzano, former Cavriglia animal park.

Food: Osteria del Fondaccio (Loro Ciuffenna), Agriturismo Osteria Le Balze, Pizzeria Le Balze, Il Ristoro di Cristiano Filippini, Ristorante Pizzeria Andrea (Pian di Scò), Enoteca La Torre, gelaterie in Loro Ciuffenna, San Giovanni, and Montevarchi.

Culture/Setteponti churches: Pieve di San Pietro a Gropina, Badia di San Salvatore a Soffena.

## ARTIFACT 2: Verified POIs (curated shortlist, 34 POIs)

```yaml
- id: loro-ciuffenna-borgo
  name: Loro Ciuffenna (borgo e Vecchio Mulino)
  short_name: Loro Ciuffenna
  category: village
  secondary_categories: [nature, food, water]
  coordinates: {lat: 43.5830, lng: 11.6170}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 90, max: 180}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 1
  parking_difficulty: medium
  kid_score: 8
  scenic_score: 9
  base_quality: 9
  ideal_temperature_c: {min: 10, max: 32}
  rain_compatible: partial
  best_time_of_day: [morning, afternoon, evening]
  energy_cost: 8
  energy_reward: 22
  hunger_reduction: 30
  why_go: One of Italy's most beautiful villages, holding the oldest functioning water mill in Tuscany (most likely built around 1100 and still grinding chestnut flour), a Romanesque bridge, and a cool gorge setting.
  best_for: Wandering, gelato, cooler summer village visit
  avoid_when: Midday parking crunch on summer weekends
  failure_modes: "Parking near center fills quickly; steep alleys are hard with a stroller"
  food_nearby: {lunch: Osteria del Fondaccio, dinner: Osteria del Fondaccio, pizza: local, gelato: gelateria on the piazza, notes: try lemon-basil gelato}
  opening_hours: village always open; mill visitable most days (advise the comune for groups)
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.visittuscany.com/en/towns-and-villages/castelfranco-piandisco/
      source_type: tourism_board
      verified_claims: [borgo status, watermill c.1100]
    - url: https://siviaggia.it/borghi/loro-ciuffenna-borgo-toscana-piu-belli-italia/259915/
      source_type: travel_media
      verified_claims: [oldest working mill, cool in summer]

- id: balze-acqua-zolfina
  name: Balze del Valdarno (Sentiero dell'Acqua Zolfina)
  short_name: Balze del Valdarno
  category: nature
  secondary_categories: [viewpoint, hike]
  coordinates: {lat: 43.6270, lng: 11.5560}
  drive_from_borgo_minutes: 8
  estimated_visit_minutes: {min: 90, max: 150}
  indoor_outdoor: outdoor
  shade_level: 1
  walking_intensity: 2
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 9
  base_quality: 8
  ideal_temperature_c: {min: 8, max: 28}
  rain_compatible: false
  best_time_of_day: [morning, sunset]
  energy_cost: 15
  energy_reward: 20
  hunger_reduction: 0
  why_go: Dramatic stratified clay gullies linked to Leonardo (Silvano Vinceti of the Centro Studi Leonardeschi tied a Castelfranco formation to the left background of the Mona Lisa in July 2026), on an easy CAI-marked loop of about 5 km starting near Castelfranco's post office.
  best_for: Photography, easy scenic hike
  avoid_when: Midday August heat; clay is slippery after rain
  failure_modes: "Exposed with little shade between 12:00 and 16:00; slippery and best avoided when wet"
  food_nearby: {lunch: Castelfranco di Sopra, dinner: Osteria Le Balze, pizza: Pizzeria Le Balze, gelato: Castelfranco, notes: combine with the village}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.visittuscany.com/en/itineraries/sentiero-dellacqua-zolfina-an-itinerary-among-the-balze-del-valdarno/
      source_type: tourism_board
      verified_claims: [loop trail, Balze access]
    - url: https://www.visitvaldarno.com/en/balze-del-valdarno/
      source_type: tourism_board
      verified_claims: [Leonardo association, viewpoints]

- id: vallombrosa-forest
  name: Abbazia e Foresta di Vallombrosa
  short_name: Vallombrosa
  category: nature
  secondary_categories: [activity, rain-safe, viewpoint]
  coordinates: {lat: 43.7325, lng: 11.5558}
  drive_from_borgo_minutes: 55
  estimated_visit_minutes: {min: 120, max: 300}
  indoor_outdoor: mixed
  shade_level: 3
  walking_intensity: 2
  parking_difficulty: medium
  kid_score: 7
  scenic_score: 9
  base_quality: 9
  ideal_temperature_c: {min: 5, max: 30}
  rain_compatible: partial
  best_time_of_day: [morning, afternoon]
  energy_cost: 15
  energy_reward: 25
  hunger_reduction: 0
  why_go: Cool shaded fir forest with the abbey at roughly 955 to 960 m inside a 1,279-hectare biogenetic reserve (450 to 1450 m) that holds Italy's tallest tree, a 62.45 m Douglas fir; the best heat escape in range.
  best_for: Extreme heat days, forest walks, families
  avoid_when: Winter snow without chains
  failure_modes: "Abbey visit outside July and August may require booking; mountain access road is winding"
  food_nearby: {lunch: Saltino/Reggello, dinner: Reggello, pizza: Reggello, gelato: Saltino, notes: picnic areas with tables and fountains}
  opening_hours: "abbey summer approx 06:00-12:00 and 15:00-19:00; winter 09:00-12:00 and 15:00-18:00"
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.frammentiditoscana.it/vallombrosa-labbazia-nella-foresta/
      source_type: travel_media
      verified_claims: [abbey hours, reserve 1273 ha]
    - url: https://borghi.toscana.it/cosa-vedere/vallombrosa/
      source_type: travel_media
      verified_claims: [elevation ~1000 m, trails]

- id: arezzo-centro
  name: Arezzo centro storico (Piazza Grande)
  short_name: Arezzo
  category: town
  secondary_categories: [activity, food, rain-safe]
  coordinates: {lat: 43.4633, lng: 11.8797}
  drive_from_borgo_minutes: 50
  estimated_visit_minutes: {min: 180, max: 360}
  indoor_outdoor: mixed
  shade_level: 1
  walking_intensity: 2
  parking_difficulty: medium
  kid_score: 6
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 8, max: 30}
  rain_compatible: partial
  best_time_of_day: [morning, evening]
  energy_cost: 18
  energy_reward: 22
  hunger_reduction: 40
  why_go: Trapezoidal sloping Piazza Grande (about a 10 m height difference for rain drainage), Piero della Francesca frescoes, monthly antiques market, and the setting of Benigni's Life Is Beautiful.
  best_for: Culture, dinner, evening passeggiata
  avoid_when: Hot exposed midday in the piazza
  failure_modes: "Antiques fair on the first weekend of the month crowds the center and parking"
  food_nearby: {lunch: many, dinner: many, pizza: many, gelato: many, notes: destination dining}
  opening_hours: city always open; museums vary
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.toscana.info/en/arezzo/
      source_type: travel_media
      verified_claims: [Piazza Grande shape, artists, WWII damage]

- id: poppi-castello
  name: Castello dei Conti Guidi di Poppi e borgo
  short_name: Poppi
  category: activity
  secondary_categories: [village, rain-safe]
  coordinates: {lat: 43.7228, lng: 11.7669}
  drive_from_borgo_minutes: 50
  estimated_visit_minutes: {min: 120, max: 240}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 2
  parking_difficulty: easy
  kid_score: 8
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 5, max: 32}
  rain_compatible: true
  best_time_of_day: [morning, afternoon]
  energy_cost: 15
  energy_reward: 22
  hunger_reduction: 30
  why_go: One of the best-preserved medieval castles in Tuscany plus a Borghi più belli d'Italia village; a strong rainy-day pick with a tower to climb.
  best_for: Families, rainy days, medieval history
  avoid_when: Arriving near closing
  failure_modes: "Arrive well before closing; guided tours require booking; ticket about 7 euro, under 6 free"
  food_nearby: {lunch: Poppi trattorias, dinner: Poppi, pizza: Ponte a Poppi, gelato: Poppi, notes: hearty Casentino cuisine}
  opening_hours: "Apr 1 to Sep 30 daily from 10:00 (Mon-Thu to 19:00, Fri-Sun to 20:00)"
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://ecomuseodelcasentino.it/en/castle-of-conti-guidi-di-poppi-information-exhibition-center
      source_type: official_venue
      verified_claims: [seasonal hours]
    - url: https://www.castellinews.it/il-castello-di-poppi-tesoro-medievale-nella-valle-del-casentino/
      source_type: travel_media
      verified_claims: [ticket price, under 6 free]

- id: pieve-gropina
  name: Pieve di San Pietro a Gropina
  short_name: Pieve di Gropina
  category: activity
  secondary_categories: [rain-safe, culture]
  coordinates: {lat: 43.5710, lng: 11.6350}
  drive_from_borgo_minutes: 18
  estimated_visit_minutes: {min: 30, max: 60}
  indoor_outdoor: indoor
  shade_level: 3
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 5
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 5, max: 40}
  rain_compatible: true
  best_time_of_day: [morning, afternoon]
  energy_cost: 5
  energy_reward: 15
  hunger_reduction: 0
  why_go: The finest Romanesque church in the Valdarno, a national monument with a remarkable carved pulpit; cool interior and a quick add-on to Loro Ciuffenna.
  best_for: Quick culture stop, heat and rain shelter
  avoid_when: During Mass
  failure_modes: "Hours seasonal; summer approx 09:00-19:00, winter 09:00-17:00; Apr-Sep daily, Oct-Mar weekends only"
  food_nearby: {lunch: Loro Ciuffenna, dinner: Loro Ciuffenna, pizza: Loro Ciuffenna, gelato: Loro Ciuffenna, notes: pair with Loro Ciuffenna}
  opening_hours: "summer (21 Jun-21 Sep) 09:00-19:00, otherwise 09:00-17:00"
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.visittuscany.com/en/attractions/parish-church-in-gropina/
      source_type: tourism_board
      verified_claims: [Romanesque, built c.1000, location]
    - url: https://www.lamiabellatoscana.it/2012/11/pieve-romanica-gropina-suo-borgo-valdarno-loro-ciuffenna-tesori-nascosti-toscana.html
      source_type: travel_blog
      verified_claims: [seasonal hours]

- id: ciuffenna-massette
  name: Ciuffenna torrent shallow spots (le Massette)
  short_name: Ciuffenna shallows
  category: water
  secondary_categories: [nature, kids]
  coordinates: {lat: 43.5850, lng: 11.6200}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 60, max: 150}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 1
  parking_difficulty: medium
  kid_score: 7
  scenic_score: 7
  base_quality: 7
  ideal_temperature_c: {min: 24, max: 40}
  rain_compatible: false
  best_time_of_day: [morning, afternoon]
  energy_cost: 8
  energy_reward: 18
  hunger_reduction: 0
  why_go: Free shallow river pools with gentle current and a small sandy beach about 5 minutes from the town square, explicitly recommended for small children.
  best_for: Hot-day cooling with young kids
  avoid_when: After heavy rain; water is cold even in high summer
  failure_modes: "Unmanaged, no lifeguard and no certified water quality; smooth rocks are slippery; keep young children away from the deep Pozzone basin upstream"
  food_nearby: {lunch: Loro Ciuffenna, dinner: Loro Ciuffenna, pizza: Loro Ciuffenna, gelato: Loro Ciuffenna, notes: town 5 min away}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://siviaggia.it/vacanze-natura/toscana-borghi-natura-spiagge-acqua-dolce-torrente-ciuffenna/535565/
      source_type: travel_media
      verified_claims: [Massette shallow and safe for small kids, Pozzone deep]
    - url: https://valdarnopost.it/edizioni-locali/il-ciuffenna-il-fiume-dei-valdarnesi-contro-la-calura-ecco-dove-fare-il-bagno/
      source_type: regional_news
      verified_claims: [free, unequipped, no facilities]

- id: osteria-fondaccio
  name: L'Osteria del Fondaccio
  short_name: Osteria del Fondaccio
  category: food
  secondary_categories: [dinner]
  coordinates: {lat: 43.5835, lng: 11.6165}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 75, max: 120}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: medium
  kid_score: 6
  scenic_score: 7
  base_quality: 8
  ideal_temperature_c: {min: 5, max: 35}
  rain_compatible: true
  best_time_of_day: [evening]
  energy_cost: 3
  energy_reward: 15
  hunger_reduction: 60
  why_go: Traditional Tuscan, truffle-forward osteria in the historic center of Loro Ciuffenna, with outdoor tables in a small piazza during warm months; the most firmly confirmed currently-open dinner option nearby.
  best_for: Relaxed dinner
  avoid_when: Without a booking on weekends
  failure_modes: "Small intimate venue; phone to confirm the booking (one guest reported a reservation not honored)"
  food_nearby: {lunch: self, dinner: self, pizza: nearby, gelato: piazza, notes: reservation advised}
  opening_hours: "dinner from 19:00; Sunday lunch 11:45-14:30"
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.osteriadelfondaccio.it/
      source_type: business_site
      verified_claims: [outdoor seating, booking advised]

- id: osteria-le-balze
  name: Agriturismo Osteria Le Balze
  short_name: Osteria Le Balze
  category: food
  secondary_categories: [dinner, scenic]
  coordinates: {lat: 43.6230, lng: 11.5500}
  drive_from_borgo_minutes: 10
  estimated_visit_minutes: {min: 90, max: 150}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 8
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 10, max: 35}
  rain_compatible: true
  best_time_of_day: [afternoon, evening]
  energy_cost: 3
  energy_reward: 15
  hunger_reduction: 65
  why_go: Family-run agriturismo dining among the Balze with shade, a pool, panoramic setting, and pure Tuscan fixed-price meals.
  best_for: Family lunch or dinner with a view
  avoid_when: Peak sun without a shaded table
  failure_modes: "Confirmed active into late 2024; phone ahead to confirm current-season opening"
  food_nearby: {lunch: self, dinner: self, pizza: Castelfranco, gelato: Castelfranco, notes: fixed-price dinners with wine and water included}
  opening_hours: seasonal; call ahead
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://gastroranking.it/r/agriturismo-osteria-le-balze_295304/
      source_type: review_aggregator
      verified_claims: [reviews to Oct 2024, shade, pool, family-friendly]

- id: pizzeria-le-balze
  name: Pizzeria Le Balze
  short_name: Pizzeria Le Balze
  category: food
  secondary_categories: [pizza, kids]
  coordinates: {lat: 43.6200, lng: 11.5550}
  drive_from_borgo_minutes: 8
  estimated_visit_minutes: {min: 60, max: 90}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 9
  scenic_score: 5
  base_quality: 7
  ideal_temperature_c: {min: 5, max: 35}
  rain_compatible: true
  best_time_of_day: [evening]
  energy_cost: 3
  energy_reward: 12
  hunger_reduction: 55
  why_go: Informal, budget-friendly pizzeria in Castelfranco di Sopra with outdoor space and games, singled out by reviewers as ideal for those with children.
  best_for: Easy family pizza night
  avoid_when: Late arrivals on busy weekends
  failure_modes: "Fills on weekend evenings"
  food_nearby: {lunch: nearby, dinner: self, pizza: self, gelato: Castelfranco, notes: budget-friendly}
  opening_hours: dinner
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.tripadvisor.com/Restaurants-g8042257-Castelfranco_Piandisco_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [outdoor space and games, kid-friendly, rating ~4.1]

- id: il-borro-borgo
  name: Il Borro (medieval hamlet and artisan workshops)
  short_name: Il Borro
  category: activity
  secondary_categories: [village, food]
  coordinates: {lat: 43.5090, lng: 11.6720}
  drive_from_borgo_minutes: 30
  estimated_visit_minutes: {min: 90, max: 180}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 7
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 8, max: 33}
  rain_compatible: partial
  best_time_of_day: [afternoon, evening]
  energy_cost: 8
  energy_reward: 18
  hunger_reduction: 40
  why_go: Restored Ferragamo-owned medieval village with working artisan shops (goldsmith, shoemaker, restorer) and a bistro, set on a large organic estate.
  best_for: Artisan browsing, aperitivo, upscale ambience
  avoid_when: Expecting a budget outing
  failure_modes: "Upscale resort context; food and shops are premium-priced"
  food_nearby: {lunch: Tuscan Bistro, dinner: Osteria del Borro, pizza: none, gelato: none, notes: reservation advised for restaurants}
  opening_hours: village accessible; shops daytime
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.ilborro.it/en/the-estate-and-its-history/between-art-and-culture/
      source_type: official_venue
      verified_claims: [artisan workshops, medieval village]

- id: san-giovanni-valdarno
  name: San Giovanni Valdarno (Palazzo d'Arnolfo, Museo Terre Nuove)
  short_name: San Giovanni Valdarno
  category: town
  secondary_categories: [activity, food, rain-safe]
  coordinates: {lat: 43.5670, lng: 11.5320}
  drive_from_borgo_minutes: 20
  estimated_visit_minutes: {min: 90, max: 180}
  indoor_outdoor: mixed
  shade_level: 1
  walking_intensity: 1
  parking_difficulty: medium
  kid_score: 6
  scenic_score: 7
  base_quality: 7
  ideal_temperature_c: {min: 8, max: 32}
  rain_compatible: partial
  best_time_of_day: [morning, evening]
  energy_cost: 10
  energy_reward: 15
  hunger_reduction: 35
  why_go: Birthplace of Masaccio, an Arnolfo di Cambio grid plan, the Museo delle Terre Nuove, and good everyday services and gelato.
  best_for: Practical town stop, museum, market
  avoid_when: Nothing major
  failure_modes: "Industrial outskirts; charm concentrated in the historic core"
  food_nearby: {lunch: center, dinner: center, pizza: center, gelato: multiple, notes: everyday services}
  opening_hours: town always open; museums vary
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.touringclub.it/destinazioni/san-giovanni-valdarno
      source_type: travel_media
      verified_claims: [Masaccio, Palazzo Pretorio, Beato Angelico]

- id: piantravigne-viewpoint
  name: Piantravigne (Balze panoramic hamlet)
  short_name: Piantravigne
  category: viewpoint
  secondary_categories: [village, sunset]
  coordinates: {lat: 43.6070, lng: 11.5760}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 30, max: 60}
  indoor_outdoor: outdoor
  shade_level: 1
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 8
  base_quality: 7
  ideal_temperature_c: {min: 8, max: 32}
  rain_compatible: false
  best_time_of_day: [sunset]
  energy_cost: 5
  energy_reward: 15
  hunger_reduction: 0
  why_go: Tiny hamlet on a clay overhang with a sweeping view over the Balze; excellent at golden hour.
  best_for: Sunset, quick photo stop
  avoid_when: Midday heat, wet paths
  failure_modes: "Not worth a dedicated long trip; combine with the Balze walk"
  food_nearby: {lunch: Terranuova, dinner: Terranuova, pizza: Terranuova, gelato: Piantravigne pastry shop, notes: limited on site}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.discoverarezzo.com/en/suggested-itineraries/from-balze-to-pratomagno/balze-natural-area/
      source_type: tourism_board
      verified_claims: [panoramic viewpoint over Balze]

- id: pratomagno-croce
  name: Pratomagno ridge and Cross
  short_name: Pratomagno
  category: nature
  secondary_categories: [viewpoint, hike]
  coordinates: {lat: 43.6400, lng: 11.6600}
  drive_from_borgo_minutes: 55
  estimated_visit_minutes: {min: 120, max: 300}
  indoor_outdoor: outdoor
  shade_level: 1
  walking_intensity: 2
  parking_difficulty: medium
  kid_score: 6
  scenic_score: 10
  base_quality: 8
  ideal_temperature_c: {min: 5, max: 28}
  rain_compatible: false
  best_time_of_day: [morning, sunset]
  energy_cost: 18
  energy_reward: 26
  hunger_reduction: 0
  why_go: Open grassy summit crowned by the iron Croce del Pratomagno (erected 1927 to 1928) at exactly 1592 m, with a 360-degree panorama over Valdarno and Casentino.
  best_for: Big views, cool high-altitude air
  avoid_when: Fog, storms, or exposed heat with no shade on the ridge
  failure_modes: "Long winding access road; exposed ridge; bring layers even in summer"
  food_nearby: {lunch: mountain rifugio, dinner: valley, pizza: none, gelato: none, notes: limited; pack food}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.visitvaldarno.com/en/pratomagno-an-easy-mountain-to-discover/
      source_type: tourism_board
      verified_claims: [1592 m cross, ridge, access points]

- id: mine-cavriglia
  name: MINE Museo delle Miniere e del Territorio
  short_name: MINE museum
  category: activity
  secondary_categories: [rain-safe, culture]
  coordinates: {lat: 43.5170, lng: 11.4520}
  drive_from_borgo_minutes: 30
  estimated_visit_minutes: {min: 60, max: 120}
  indoor_outdoor: indoor
  shade_level: 3
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 6
  base_quality: 7
  ideal_temperature_c: {min: 0, max: 40}
  rain_compatible: true
  best_time_of_day: [morning, afternoon]
  energy_cost: 6
  energy_reward: 14
  hunger_reduction: 0
  why_go: Multimedia mining museum in the abandoned village of Castelnuovo dei Sabbioni, tracing 150 years of lignite mining; strong rainy-day interior.
  best_for: Rainy days, curious older children
  avoid_when: Mondays (closed)
  failure_modes: "Confirm current opening before going; Visit Tuscany noted a temporary closure, while regional listings show regular hours"
  food_nearby: {lunch: Cavriglia, dinner: Cavriglia, pizza: Cavriglia, gelato: Cavriglia, notes: limited on site}
  opening_hours: "Tue-Sun 10:00-13:00; Sat-Sun also 15:00-18:00; closed Monday (verify)"
  current_status: verify
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.isprambiente.gov.it/it/attivita/museo/regioni/musei/mine-museo-delle-miniere-e-del-territorio
      source_type: official_agency
      verified_claims: [hours, ticket, address]
    - url: https://www.visittuscany.com/en/attractions/mining-museum-in-cavriglia/
      source_type: tourism_board
      verified_claims: [temporary closure note]

- id: reggello-sant-antonio-waterfalls
  name: Foresta di Sant'Antonio (Reggello waterfalls, Cascata di Meriggioni)
  short_name: Sant'Antonio waterfalls
  category: nature
  secondary_categories: [water, hike]
  coordinates: {lat: 43.6800, lng: 11.5600}
  drive_from_borgo_minutes: 45
  estimated_visit_minutes: {min: 150, max: 300}
  indoor_outdoor: outdoor
  shade_level: 3
  walking_intensity: 3
  parking_difficulty: medium
  kid_score: 4
  scenic_score: 8
  base_quality: 7
  ideal_temperature_c: {min: 10, max: 30}
  rain_compatible: false
  best_time_of_day: [morning]
  energy_cost: 22
  energy_reward: 22
  hunger_reduction: 0
  why_go: Shaded forest streams, wooden footbridges, and waterfalls along the Resco toward Pratomagno; deeply shaded heat escape for fit walkers.
  best_for: Fit walkers, heat escape
  avoid_when: With very young children; some sections are rough
  failure_modes: "CAI 15 from Case Sant'Antonio to Reggello reported poorly maintained in parts; not for small kids"
  food_nearby: {lunch: Reggello, dinner: Reggello, pizza: Reggello, gelato: Reggello, notes: none on trail}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://caifirenze.it/sentiero/da-reggello-al-pratomagno-lungo-il-resco
      source_type: official_authority
      verified_claims: [waterfalls, footbridges, trail condition warning]

- id: bandella-reserve
  name: Riserva Naturale Valle dell'Inferno e Bandella
  short_name: Bandella reserve
  category: nature
  secondary_categories: [water, hike]
  coordinates: {lat: 43.5000, lng: 11.6300}
  drive_from_borgo_minutes: 30
  estimated_visit_minutes: {min: 90, max: 180}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 2
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 7
  base_quality: 7
  ideal_temperature_c: {min: 8, max: 30}
  rain_compatible: false
  best_time_of_day: [morning]
  energy_cost: 14
  energy_reward: 18
  hunger_reduction: 0
  why_go: A 531-hectare wetland and river reserve on the dammed Arno; birdwatching, guided boat tours, and wooded trails, with the visitor center at Monticello (Terranuova).
  best_for: Birdwatching, quiet nature walks
  avoid_when: Swimming (this is a protected wetland, not a bathing area)
  failure_modes: "Do not swim; some trails are exposed; check visitor center hours"
  food_nearby: {lunch: Terranuova, dinner: Terranuova, pizza: Terranuova, gelato: Terranuova, notes: none on trail}
  opening_hours: paths freely accessible; visitor center hours vary
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.parks.it/riserva.valle.inferno.bandella/iti.php
      source_type: official_park
      verified_claims: [trails, boat tours, visitor center]

- id: badia-soffena
  name: Badia di San Salvatore a Soffena
  short_name: Badia Soffena
  category: activity
  secondary_categories: [rain-safe, culture]
  coordinates: {lat: 43.6180, lng: 11.5550}
  drive_from_borgo_minutes: 6
  estimated_visit_minutes: {min: 30, max: 60}
  indoor_outdoor: indoor
  shade_level: 3
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 4
  scenic_score: 7
  base_quality: 7
  ideal_temperature_c: {min: 0, max: 40}
  rain_compatible: true
  best_time_of_day: [morning, afternoon]
  energy_cost: 4
  energy_reward: 12
  hunger_reduction: 0
  why_go: Vallombrosan abbey with frescoes, about 3 km from base and the closest cultural indoor stop to Borgo Mocale.
  best_for: Quick heat or rain shelter, art
  avoid_when: Uncertain opening days
  failure_modes: "Limited opening hours; confirm locally before visiting"
  food_nearby: {lunch: Castelfranco, dinner: Castelfranco, pizza: Castelfranco, gelato: Castelfranco, notes: village nearby}
  opening_hours: variable; check locally
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://mapcarta.com/N8514893433
      source_type: map_listing
      verified_claims: [proximity to Borgo Mocale, church]

- id: castelfranco-di-sopra
  name: Castelfranco di Sopra (borgo, Torre di Arnolfo)
  short_name: Castelfranco di Sopra
  category: village
  secondary_categories: [food, evening]
  coordinates: {lat: 43.6236, lng: 11.5583}
  drive_from_borgo_minutes: 6
  estimated_visit_minutes: {min: 45, max: 120}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 7
  scenic_score: 8
  base_quality: 8
  ideal_temperature_c: {min: 8, max: 33}
  rain_compatible: partial
  best_time_of_day: [evening]
  energy_cost: 6
  energy_reward: 16
  hunger_reduction: 40
  why_go: The nearest Borghi più belli d'Italia village, founded 1296 with an Arnolfo di Cambio grid plan and the Arnolfo tower; the lowest-friction evening base.
  best_for: Evening stroll, dinner, low-friction outing
  avoid_when: Nothing major
  failure_modes: "Small; combine with the Balze or dinner"
  food_nearby: {lunch: Enoteca La Torre, dinner: Il Ristoro di Cristiano Filippini, pizza: Pizzeria Le Balze, gelato: local, notes: nearest full food cluster to base}
  opening_hours: village always open
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.visittuscany.com/en/ideas/5-reasons-to-visit-castelfranco-piandisco/
      source_type: tourism_board
      verified_claims: [borgo status, founded 1296, Arnolfo plan]

- id: enoteca-la-torre
  name: Enoteca La Torre
  short_name: Enoteca La Torre
  category: food
  secondary_categories: [lunch, wine]
  coordinates: {lat: 43.6238, lng: 11.5585}
  drive_from_borgo_minutes: 6
  estimated_visit_minutes: {min: 60, max: 120}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 5
  scenic_score: 6
  base_quality: 7
  ideal_temperature_c: {min: 5, max: 35}
  rain_compatible: true
  best_time_of_day: [afternoon, evening]
  energy_cost: 3
  energy_reward: 12
  hunger_reduction: 45
  why_go: Cozy wine bar and cafe under the Arnolfo tower in Castelfranco di Sopra, well-rated for a light meal.
  best_for: Light lunch, aperitivo
  avoid_when: Nothing major
  failure_modes: "Small; limited kitchen hours"
  food_nearby: {lunch: self, dinner: self, pizza: nearby, gelato: nearby, notes: convenient to base}
  opening_hours: cafe hours
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.tripadvisor.com/Restaurants-g8042257-Castelfranco_Piandisco_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [rating ~4.3, cafe/wine bar]

- id: ristorante-andrea-pian-di-sco
  name: Ristorante Pizzeria Andrea
  short_name: Andrea (Pian di Scò)
  category: food
  secondary_categories: [pizza, dinner]
  coordinates: {lat: 43.6300, lng: 11.5300}
  drive_from_borgo_minutes: 10
  estimated_visit_minutes: {min: 60, max: 110}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 7
  scenic_score: 5
  base_quality: 7
  ideal_temperature_c: {min: 5, max: 35}
  rain_compatible: true
  best_time_of_day: [evening]
  energy_cost: 3
  energy_reward: 12
  hunger_reduction: 55
  why_go: Well-liked local pizza and Italian spot in Pian di Scò (about 4.2 stars over 150-plus reviews).
  best_for: Family pizza and pasta
  avoid_when: Without booking on weekends
  failure_modes: "Confirm current hours; verify open before relying on it"
  food_nearby: {lunch: self, dinner: self, pizza: self, gelato: Pian di Scò, notes: casual}
  opening_hours: lunch and dinner
  current_status: verify
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.tripadvisor.it/Restaurants-g8042257-zfp58-Castelfranco_Piandisco_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [rating 4.2, pizza and Italian]

- id: gelateria-loro-ciuffenna
  name: Gelateria on the Loro Ciuffenna piazza
  short_name: Gelato Loro Ciuffenna
  category: food
  secondary_categories: [gelato]
  coordinates: {lat: 43.5832, lng: 11.6168}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 15, max: 40}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: medium
  kid_score: 9
  scenic_score: 7
  base_quality: 7
  ideal_temperature_c: {min: 15, max: 40}
  rain_compatible: false
  best_time_of_day: [afternoon, evening]
  energy_cost: 1
  energy_reward: 10
  hunger_reduction: 15
  why_go: Refreshing gelato by the torrent, with a lemon-basil flavor repeatedly praised by visitors.
  best_for: Hot-day treat with kids
  avoid_when: Nothing major
  failure_modes: "Seasonal hours; confirm the specific vendor on the piazza"
  food_nearby: {lunch: Loro Ciuffenna, dinner: Loro Ciuffenna, pizza: Loro Ciuffenna, gelato: self, notes: pair with the village}
  opening_hours: daytime and evening in season
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.tripadvisor.it/ShowUserReviews-g644276-d2486538-r409878000-Vecchio_Molino-Loro_Ciuffenna_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [lemon-basil gelato on the pontile]

- id: museo-venturino-venturi
  name: Museo Venturino Venturi (Palazzo Alberti, Loro Ciuffenna)
  short_name: Museo Venturi
  category: activity
  secondary_categories: [rain-safe, culture]
  coordinates: {lat: 43.5834, lng: 11.6172}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 30, max: 60}
  indoor_outdoor: indoor
  shade_level: 3
  walking_intensity: 1
  parking_difficulty: medium
  kid_score: 4
  scenic_score: 6
  base_quality: 6
  ideal_temperature_c: {min: 0, max: 40}
  rain_compatible: true
  best_time_of_day: [afternoon]
  energy_cost: 4
  energy_reward: 10
  hunger_reduction: 0
  why_go: Small museum dedicated to sculptor Venturino Venturi, a rainy-day add-on inside the village.
  best_for: Art lovers, rain
  avoid_when: With restless small kids
  failure_modes: "Limited hours; confirm before the visit"
  food_nearby: {lunch: Loro Ciuffenna, dinner: Loro Ciuffenna, pizza: Loro Ciuffenna, gelato: piazza, notes: inside the village}
  opening_hours: variable
  current_status: verify
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://norcenni.huopenair.com/it/esperienze/loro-ciuffenna-cosa-vedere-tra-borghi-medievali-mulini-storici-e-natura-toscana
      source_type: travel_media
      verified_claims: [museum in Palazzo Alberti, Venturino Venturi]

- id: montevarchi-centro
  name: Montevarchi (Piazza Varchi, Collegiata)
  short_name: Montevarchi
  category: town
  secondary_categories: [food, rain-safe]
  coordinates: {lat: 43.5230, lng: 11.5680}
  drive_from_borgo_minutes: 25
  estimated_visit_minutes: {min: 60, max: 120}
  indoor_outdoor: mixed
  shade_level: 1
  walking_intensity: 1
  parking_difficulty: medium
  kid_score: 5
  scenic_score: 6
  base_quality: 6
  ideal_temperature_c: {min: 8, max: 32}
  rain_compatible: partial
  best_time_of_day: [morning, evening]
  energy_cost: 8
  energy_reward: 12
  hunger_reduction: 35
  why_go: Almond-shaped medieval core, a richly decorated Collegiata di San Lorenzo, and good shopping and gelato.
  best_for: Practical town, shopping
  avoid_when: If seeking a picturesque small borgo
  failure_modes: "More commercial than scenic"
  food_nearby: {lunch: center, dinner: center, pizza: center, gelato: Il Gelatiere/Gran Gelato, notes: everyday services}
  opening_hours: town always open
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://travel.thewom.it/italia/cosa-vedere-nel-valdarno.html
      source_type: travel_media
      verified_claims: [Collegiata, medieval plan]

- id: rocca-ricciarda
  name: Rocca Ricciarda (Pratomagno stone hamlet)
  short_name: Rocca Ricciarda
  category: village
  secondary_categories: [nature, viewpoint]
  coordinates: {lat: 43.6100, lng: 11.6500}
  drive_from_borgo_minutes: 35
  estimated_visit_minutes: {min: 45, max: 90}
  indoor_outdoor: outdoor
  shade_level: 2
  walking_intensity: 2
  parking_difficulty: medium
  kid_score: 5
  scenic_score: 8
  base_quality: 7
  ideal_temperature_c: {min: 8, max: 30}
  rain_compatible: false
  best_time_of_day: [morning, afternoon]
  energy_cost: 12
  energy_reward: 18
  hunger_reduction: 0
  why_go: A tiny remote stone hamlet on the Pratomagno slopes, atmospheric and cool, near the Loro Ciuffenna mountain roads.
  best_for: Off-the-beaten-path explorers
  avoid_when: With very young children; narrow mountain road
  failure_modes: "Winding access; limited services"
  food_nearby: {lunch: Loro Ciuffenna, dinner: Loro Ciuffenna, pizza: none, gelato: none, notes: none on site}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.ilbelcasentino.it/itinerari-pratomagno.php
      source_type: travel_media
      verified_claims: [Rocca Ricciarda hamlet, Pratomagno]

- id: castelfranco-il-ristoro-filippini
  name: Il Ristoro di Cristiano Filippini
  short_name: Il Ristoro Filippini
  category: food
  secondary_categories: [dinner, pizza]
  coordinates: {lat: 43.6237, lng: 11.5586}
  drive_from_borgo_minutes: 6
  estimated_visit_minutes: {min: 60, max: 120}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 6
  base_quality: 7
  ideal_temperature_c: {min: 5, max: 35}
  rain_compatible: true
  best_time_of_day: [evening]
  energy_cost: 3
  energy_reward: 14
  hunger_reduction: 60
  why_go: In-village Castelfranco di Sopra restaurant praised by reviewers for pizza, steak, and friendly service; the closest proper sit-down dinner to base.
  best_for: Dinner near base, steak and pizza
  avoid_when: Without booking on weekends
  failure_modes: "Small; weekend booking advised"
  food_nearby: {lunch: nearby, dinner: self, pizza: self, gelato: Castelfranco, notes: in the historic center}
  opening_hours: lunch and dinner
  current_status: open
  last_verified: 2026-08-18
  confidence: medium
  sources:
    - url: https://www.tripadvisor.com/Restaurants-g8042257-Castelfranco_Piandisco_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [best pizza and steak in the area, rating ~4.2]

- id: gelateria-san-giovanni
  name: Gelateria in San Giovanni Valdarno (Piazza Cavour cluster)
  short_name: Gelato San Giovanni
  category: food
  secondary_categories: [gelato]
  coordinates: {lat: 43.5665, lng: 11.5325}
  drive_from_borgo_minutes: 20
  estimated_visit_minutes: {min: 15, max: 40}
  indoor_outdoor: outdoor
  shade_level: 1
  walking_intensity: 0
  parking_difficulty: medium
  kid_score: 8
  scenic_score: 6
  base_quality: 7
  ideal_temperature_c: {min: 15, max: 40}
  rain_compatible: false
  best_time_of_day: [afternoon, evening]
  energy_cost: 1
  energy_reward: 9
  hunger_reduction: 15
  why_go: Multiple well-frequented gelaterie clustered in the historic center, a convenient sweet stop when in San Giovanni.
  best_for: Hot-day treat while sightseeing
  avoid_when: Nothing major
  failure_modes: "Confirm the specific vendor and seasonal hours"
  food_nearby: {lunch: center, dinner: center, pizza: center, gelato: self, notes: pair with town visit}
  opening_hours: daytime and evening in season
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.paginebianche.it/toscana/san-giovanni-valdarno/gelaterie.html
      source_type: business_listing
      verified_claims: [gelaterie in the center]

- id: terranuova-piantravigne-pasticceria
  name: Pasticceria in Piantravigne (Terranuova)
  short_name: Piantravigne pastry
  category: food
  secondary_categories: [pastry, gelato]
  coordinates: {lat: 43.6072, lng: 11.5762}
  drive_from_borgo_minutes: 15
  estimated_visit_minutes: {min: 15, max: 40}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 7
  scenic_score: 7
  base_quality: 6
  ideal_temperature_c: {min: 5, max: 38}
  rain_compatible: partial
  best_time_of_day: [morning, afternoon]
  energy_cost: 1
  energy_reward: 9
  hunger_reduction: 20
  why_go: Pastry and gelato stop with outdoor tables in the tiny Balze-view hamlet of Piantravigne; a pleasant pairing with the viewpoint.
  best_for: Coffee and cake with a view
  avoid_when: Nothing major
  failure_modes: "Small hamlet; confirm hours"
  food_nearby: {lunch: Terranuova, dinner: Terranuova, pizza: Terranuova, gelato: self, notes: pair with Piantravigne viewpoint}
  opening_hours: daytime
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.paginegialle.it/toscana/san_giovanni_valdarno/gelaterie.html
      source_type: business_listing
      verified_claims: [pasticceria in Piantravigne with outdoor tables]

- id: chianti-edge-gaiole
  name: Chianti edge (Gaiole, Castello di Brolio)
  short_name: Chianti edge
  category: activity
  secondary_categories: [village, food, viewpoint]
  coordinates: {lat: 43.4700, lng: 11.4400}
  drive_from_borgo_minutes: 60
  estimated_visit_minutes: {min: 150, max: 300}
  indoor_outdoor: mixed
  shade_level: 1
  walking_intensity: 2
  parking_difficulty: medium
  kid_score: 5
  scenic_score: 8
  base_quality: 7
  ideal_temperature_c: {min: 8, max: 30}
  rain_compatible: partial
  best_time_of_day: [morning, afternoon]
  energy_cost: 16
  energy_reward: 20
  hunger_reduction: 40
  why_go: Classic Chianti wine landscape and castles on the outer edge of the radius; good but longer and duplicative of closer village value.
  best_for: Wine landscape, a dedicated day trip
  avoid_when: When time is short or with restless toddlers
  failure_modes: "Near the 60-minute edge; keep as an optional dedicated trip, not a spontaneous add-on"
  food_nearby: {lunch: Gaiole, dinner: Gaiole, pizza: Gaiole, gelato: Gaiole, notes: wine-country dining}
  opening_hours: villages open; castles vary
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.tripadvisor.com/Attraction_Review-g642185-d2213341-Reviews-Il_Parco_di_Cavriglia-Cavriglia_Province_of_Arezzo_Tuscany.html
      source_type: reviews
      verified_claims: [Chianti castles near Cavriglia/Gaiole]

- id: cavriglia-parco-woodland
  name: Parco di Cavriglia (woodland park, no longer a zoo)
  short_name: Parco di Cavriglia
  category: nature
  secondary_categories: [picnic, kids]
  coordinates: {lat: 43.5220, lng: 11.4870}
  drive_from_borgo_minutes: 28
  estimated_visit_minutes: {min: 60, max: 150}
  indoor_outdoor: outdoor
  shade_level: 3
  walking_intensity: 1
  parking_difficulty: easy
  kid_score: 4
  scenic_score: 6
  base_quality: 5
  ideal_temperature_c: {min: 10, max: 30}
  rain_compatible: false
  best_time_of_day: [morning, afternoon]
  energy_cost: 8
  energy_reward: 12
  hunger_reduction: 0
  why_go: A 600-hectare shaded woodland park with trails, picnic areas, and playgrounds; useful for shade, but no longer an animal attraction.
  best_for: Picnic and shaded walk
  avoid_when: Expecting a zoo (all animals removed)
  failure_modes: "Do not promise animals; the last bison, Arturo, left on 12 February 2024; current TripAdvisor rating is low"
  food_nearby: {lunch: Cavriglia, dinner: Cavriglia, pizza: Cavriglia, gelato: Cavriglia, notes: bar/picnic on site historically}
  opening_hours: park hours vary
  current_status: verify
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://it.wikipedia.org/wiki/Parco_naturale_di_Cavriglia
      source_type: encyclopedia
      verified_claims: [animals removed, park failure]

- id: montevarchi-gran-gelato
  name: Gran Gelato / Il Gelatiere (Montevarchi and Terranuova)
  short_name: Gran Gelato
  category: food
  secondary_categories: [gelato]
  coordinates: {lat: 43.5232, lng: 11.5685}
  drive_from_borgo_minutes: 22
  estimated_visit_minutes: {min: 15, max: 35}
  indoor_outdoor: mixed
  shade_level: 2
  walking_intensity: 0
  parking_difficulty: medium
  kid_score: 8
  scenic_score: 5
  base_quality: 7
  ideal_temperature_c: {min: 15, max: 40}
  rain_compatible: false
  best_time_of_day: [afternoon, evening]
  energy_cost: 1
  energy_reward: 9
  hunger_reduction: 15
  why_go: Well-reviewed local gelato chain in the Montevarchi and Terranuova area, a reliable sweet stop when in the lower Valdarno.
  best_for: Hot-day treat
  avoid_when: Nothing major
  failure_modes: "Confirm the specific branch hours"
  food_nearby: {lunch: Montevarchi, dinner: Montevarchi, pizza: Montevarchi, gelato: self, notes: pair with town}
  opening_hours: daytime and evening in season
  current_status: open
  last_verified: 2026-08-18
  confidence: low
  sources:
    - url: https://www.paginegialle.it/toscana/montevarchi/gelaterie.html
      source_type: business_listing
      verified_claims: [Il Gelatiere, Gran Gelato preferred]

- id: setteponti-scenic-drive
  name: Strada dei Setteponti scenic drive
  short_name: Setteponti drive
  category: viewpoint
  secondary_categories: [nature, culture]
  coordinates: {lat: 43.6100, lng: 11.5800}
  drive_from_borgo_minutes: 5
  estimated_visit_minutes: {min: 45, max: 180}
  indoor_outdoor: outdoor
  shade_level: 1
  walking_intensity: 0
  parking_difficulty: easy
  kid_score: 6
  scenic_score: 8
  base_quality: 7
  ideal_temperature_c: {min: 5, max: 36}
  rain_compatible: true
  best_time_of_day: [afternoon, sunset]
  energy_cost: 4
  energy_reward: 16
  hunger_reduction: 0
  why_go: The panoramic road along the old Roman Cassia Vetus, linking Castelfranco, Loro Ciuffenna, Gropina, olive groves, vineyards, and Balze views; low-energy scenic outing usable even in heat or light rain from the car.
  best_for: Low-energy scenic touring, linking stops
  avoid_when: Nothing major
  failure_modes: "Two-lane road; pull over only at marked viewpoints"
  food_nearby: {lunch: along route, dinner: along route, pizza: Castelfranco, gelato: Loro Ciuffenna, notes: threads together several POIs}
  opening_hours: always open
  current_status: open
  last_verified: 2026-08-18
  confidence: high
  sources:
    - url: https://www.discoverarezzo.com/en/suggested-itineraries/from-balze-to-pratomagno/
      source_type: tourism_board
      verified_claims: [Setteponti route, Cassia Vetus, villages]
```

## ARTIFACT 3: Rejected POIs

- Parco/Zoo di Cavriglia (as an animal attraction): REJECTED. All animals removed; the last, bison Arturo, left on 12 February 2024 for a farm in the Marche, part of a closure campaign led by LEAL (Lega Antivivisezionista) since 2014. Retained only as a shaded woodland/picnic park with a low current rating. Do not market as a zoo. Evidence: it.wikipedia.org Parco naturale di Cavriglia; Valdarno24.
- Castello di Sammezzano: REJECTED for now. The owners' official site states the park and historic buildings will be closed until a planned opening in 2028; the estate was acquired in July 2025 by SMZ Srl (Moretti family) with an 80 million euro redevelopment plan. Spectacular Moorish-revival interior, but not visitable. Evidence: savesammezzano.com; thewomtravel.com.
- The Mall Luxury Outlet / Fashion Valley / Gucci Outlet (Leccio): REJECTED. Generic luxury shopping, off-philosophy for the product.
- Uffizi / Florence day trips: REJECTED. Outside the radius and against the base philosophy.
- Il Pozzone deep pool (Loro Ciuffenna): REJECTED as a swimming spot for ages 3 to 7. Deep basin with cliff diving from smooth rocks and cold water; direct families to the shallow Massette instead. Evidence: SiViaggia; ValdarnoPost.
- "Vecchio Frantoio Loro Ciuffenna" as a restaurant: REJECTED. The website by that name is a restaurant in Calabria, a false match; do not list.
- Foreste Casentinesi deep trails / Camaldoli / La Verna: DEFERRED. Beyond 60 to 75 minutes for most itineraries; Poppi delivers a Casentino taste within range.
- Chianti castles (Brolio, Meleto, Gaiole): DEFERRED to optional. Near the outer edge, longer drive, and duplicative of closer village and food value; kept as a single optional dedicated-day entry.

## ARTIFACT 4: Research Summary

Strongest 10 overall experiences: Loro Ciuffenna, Balze del Valdarno (Acqua Zolfina), Vallombrosa forest, Arezzo, Poppi castle, Pieve di Gropina, Castelfranco di Sopra, Il Borro, Piantravigne at sunset, Pratomagno ridge and Cross.

Best extreme-heat (August) options: Vallombrosa forest (abbey ~955 to 960 m, deep shade), Ciuffenna shallows at le Massette, Pieve di Gropina interior, Pratomagno ridge in early morning, the cool gorge of Loro Ciuffenna, Parco di Cavriglia woodland.

Best rainy-day options: Poppi castle, MINE mining museum, Arezzo (museums and porticoes), Pieve di Gropina, Badia Soffena, Museo delle Terre Nuove in San Giovanni.

Best low-energy options: Castelfranco di Sopra, Pieve di Gropina, Piantravigne viewpoint, the Setteponti scenic drive, gelato in Loro Ciuffenna, Enoteca La Torre.

Best evening/sunset options: Piantravigne, the Pratomagno ridge and Cross, an evening in Castelfranco di Sopra, the Arezzo passeggiata, and Loro Ciuffenna.

Best food stops: Osteria del Fondaccio (best-confirmed dinner), Agriturismo Osteria Le Balze (scenic family agriturismo), Il Ristoro di Cristiano Filippini and Pizzeria Le Balze (nearest to base), Ristorante Andrea (Pian di Scò), plus gelato in Loro Ciuffenna, San Giovanni, and Montevarchi.

Biggest uncertainties: MINE museum current opening status (one tourism source flags a temporary closure while agency listings show regular hours); exact seasonal hours of Badia Soffena and Museo Venturi; current-season confirmation for Osteria Le Balze and Ristorante Andrea; and precise Ciuffenna water conditions during a dry August.

Fields to refresh live via API: opening_hours, current_status, parking_difficulty (weekend crowding), swimming access after rain, and restaurant reservation requirements.

## Recommendations

1. Default family day this week: morning Balze walk or Loro Ciuffenna before the heat, midday shift to Vallombrosa forest or the Ciuffenna Massette shallows, and an evening in Castelfranco di Sopra or Arezzo. This sequence covers scenery, heat relief, and food with minimal driving.
2. On extreme-heat days above 34 C, prioritize Vallombrosa and cool interiors (Pieve di Gropina, Badia Soffena); avoid the exposed Balze and Pratomagno ridge between roughly 12:00 and 16:00.
3. On rain, choose Poppi castle, Arezzo museums, or Pieve di Gropina; these are the strongest weather-proof picks.
4. For food, default to Osteria del Fondaccio for a real dinner and Pizzeria Le Balze or Il Ristoro Filippini for easy family evenings; phone ahead to confirm Osteria Le Balze and Ristorante Andrea before relying on them.
5. Benchmarks that would change these calls: if MINE museum, Osteria Le Balze, or Ristorante Andrea cannot be confirmed open by phone, downgrade them to "verify" and substitute a confirmed alternative; if an August drought or heavy rain is reported on the Ciuffenna, drop the shallows for that window and use Vallombrosa instead.

## Caveats

Driving times to Poppi, Cavriglia, and especially Vallombrosa are estimates derived from straight-line distances plus known mountain-road conditions rather than door-to-door routing from Via Lama; confirm on a live map. Confirmed distances include Castelfranco Piandiscò to Arezzo at 43.2 km and about 50 minutes (Rome2Rio) and Castelfranco di Sopra to Loro Ciuffenna at roughly 7 km. Ciuffenna torrent bathing is a traditional, tolerated activity, not an officially certified bathing site, and no monitored water-quality data exists; the water is cold and the rocks are slippery, so constant adult supervision is essential and the deep Pozzone should be avoided with young children. Several small museums and agriturismo restaurants have variable seasonal hours that should be reconfirmed before a visit; entries marked "verify" or "low" confidence should be treated as discovery leads pending a live check.

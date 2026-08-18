import type { LatLng, Quest, QuestCategory } from "@/types/game";

// Home base: Borgo Mocale, Castelfranco Piandiscò (Upper Valdarno).
// Coordinates are approximate — good enough for the Phase 0 prototype.
export const BASE_LOCATION: LatLng = {
  latitude: 43.6205,
  longitude: 11.5432,
};

export const CATEGORY_META: Record<
  QuestCategory,
  { label: string; glyph: string; color: string }
> = {
  nature: { label: "Nature", glyph: "🌳", color: "#567447" },
  water: { label: "Water", glyph: "💦", color: "#3E8896" },
  village: { label: "Village", glyph: "🏰", color: "#A2653F" },
  farm: { label: "Farm & Kids", glyph: "🐐", color: "#8A6D3B" },
  food: { label: "Food", glyph: "🍝", color: "#C4572E" },
  pizza: { label: "Pizza", glyph: "🍕", color: "#C4572E" },
  gelato: { label: "Gelato", glyph: "🍦", color: "#D98CA6" },
  sunset: { label: "Sunset", glyph: "🌅", color: "#E3A44F" },
  rainsafe: { label: "Rain-safe", glyph: "🌧", color: "#7D8CA3" },
  base: { label: "Base", glyph: "🏡", color: "#7E8F58" },
};

// Phase 0 mock catalog — 10 representative quests to validate the visual
// direction. Real curated content (30–40 POIs) arrives in Phase 3.
export const QUESTS: Quest[] = [
  {
    id: "the-cool-escape",
    name: "The Cool Escape",
    place: "Vallombrosa",
    category: "nature",
    secondaryCategories: ["rainsafe"],
    latitude: 43.7317,
    longitude: 11.5561,
    whyGo:
      "A thousand-year-old abbey wrapped in a cold, dark fir forest. When the valley bakes, this is where the air still feels like morning.",
    chips: ["Forest", "Shade", "Abbey"],
    driveMinutes: 32,
    durationLabel: "2–3h",
    effortLabel: "Easy walking",
    bestTimeLabel: "11:00–17:00",
    energyDelta: -8,
  },
  {
    id: "water-hunter",
    name: "Water Hunter",
    place: "Loro Ciuffenna",
    category: "water",
    secondaryCategories: ["village", "gelato"],
    latitude: 43.5906,
    longitude: 11.6297,
    whyGo:
      "Tiny medieval village built across a dramatic river gorge. Strong visual payoff, very low planning effort — and gelato within reach.",
    chips: ["Village", "River", "Gelato nearby"],
    driveMinutes: 18,
    durationLabel: "1–2.5h",
    effortLabel: "Easy–medium",
    bestTimeLabel: "17:00–20:00",
    energyDelta: -12,
  },
  {
    id: "easy-mode",
    name: "Easy Mode",
    place: "Local pizza + Borgo pool",
    category: "pizza",
    secondaryCategories: ["base"],
    latitude: 43.6132,
    longitude: 11.5588,
    whyGo:
      "Wood-oven pizza in the village, then straight back to the pool. Zero logistics, maximum recovery. Sometimes the best quest is the lazy one.",
    chips: ["Food", "Rest", "Low effort"],
    driveMinutes: 11,
    durationLabel: "1.5–2h",
    effortLabel: "Low effort",
    bestTimeLabel: "12:00–14:30",
    energyDelta: +18,
    hungerDelta: -60,
  },
  {
    id: "stone-and-stories",
    name: "Stone & Stories",
    place: "Castelfranco di Sopra",
    category: "village",
    latitude: 43.6216,
    longitude: 11.5561,
    whyGo:
      "Your nearest borgo — an Arnolfo di Cambio grid of warm stone lanes, an arched gate tower and a bar with tables in the piazza. Perfect first wander.",
    chips: ["Borgo", "Piazza", "Coffee"],
    driveMinutes: 6,
    durationLabel: "45m–1.5h",
    effortLabel: "Stroll",
    bestTimeLabel: "9:00–11:00",
    energyDelta: -6,
  },
  {
    id: "gelato-radar",
    name: "Gelato Radar",
    place: "Figline Valdarno",
    category: "gelato",
    secondaryCategories: ["village"],
    latitude: 43.6196,
    longitude: 11.4699,
    whyGo:
      "A proper market-town piazza with one of the valley's best gelaterie. Go for the pistachio, stay for the people-watching under the loggia.",
    chips: ["Gelato", "Piazza", "Shade"],
    driveMinutes: 20,
    durationLabel: "1h",
    effortLabel: "Stroll",
    bestTimeLabel: "16:00–19:00",
    energyDelta: +12,
    hungerDelta: -15,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    place: "Le Balze viewpoint",
    category: "sunset",
    secondaryCategories: ["nature"],
    latitude: 43.5871,
    longitude: 11.5492,
    whyGo:
      "Eroded ochre cliffs — Leonardo sketched them — that catch fire at sunset. Ten quiet minutes, one unforgettable view of the Valdarno.",
    chips: ["Viewpoint", "Cliffs", "Photos"],
    driveMinutes: 14,
    durationLabel: "30m–1h",
    effortLabel: "Easy",
    bestTimeLabel: "Golden hour",
    energyDelta: -5,
    initialState: "weather_sensitive",
  },
  {
    id: "farm-friends",
    name: "Farm Friends",
    place: "Reggello farm trail",
    category: "farm",
    secondaryCategories: ["nature"],
    latitude: 43.6822,
    longitude: 11.531,
    whyGo:
      "Goats, donkeys and an olive-oil farm that loves visitors. The kind of slow, hands-on morning that becomes the trip's favourite memory.",
    chips: ["Animals", "Olive oil", "Kids love it"],
    driveMinutes: 22,
    durationLabel: "1.5–2h",
    effortLabel: "Easy",
    bestTimeLabel: "Mornings",
    energyDelta: -10,
    initialState: "closed",
  },
  {
    id: "the-rainy-keep",
    name: "The Rainy Keep",
    place: "Arezzo old town",
    category: "rainsafe",
    secondaryCategories: ["village", "food"],
    latitude: 43.4633,
    longitude: 11.8796,
    whyGo:
      "Piero della Francesca frescoes, a sloping medieval piazza and covered cafés. The strongest bad-weather card in the whole valley.",
    chips: ["Indoor", "Frescoes", "Cafés"],
    driveMinutes: 40,
    durationLabel: "3–4h",
    effortLabel: "Medium walking",
    bestTimeLabel: "10:00–17:00",
    energyDelta: -14,
  },
  {
    id: "river-splash",
    name: "River Splash",
    place: "Ponte Buriano",
    category: "water",
    secondaryCategories: ["nature"],
    latitude: 43.5058,
    longitude: 11.7935,
    whyGo:
      "A calm bend of the Arno by a Romanesque bridge — likely the one behind the Mona Lisa. Herons, picnic shade and space for the kids to wade.",
    chips: ["River", "Picnic", "Wildlife"],
    driveMinutes: 35,
    durationLabel: "1.5–2.5h",
    effortLabel: "Easy",
    bestTimeLabel: "10:00–13:00",
    energyDelta: -9,
  },
  {
    id: "return-to-base",
    name: "Return to Base",
    place: "Borgo Mocale",
    category: "base",
    // Nudged NW of BASE_LOCATION so the marker and the player dot both
    // stay visible and tappable at the default zoom.
    latitude: 43.6265,
    longitude: 11.5342,
    whyGo:
      "Pool, shade, a cold drink and the view you're paying for. Recovery is a strategy, not a defeat.",
    chips: ["Pool", "Rest", "Recharge"],
    driveMinutes: 0,
    durationLabel: "Open-ended",
    effortLabel: "None",
    bestTimeLabel: "Anytime",
    energyDelta: +20,
  },
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find((quest) => quest.id === id);
}

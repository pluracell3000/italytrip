// Core game types for Mocale Quest.
//
// Core domain types for the map, recommendation engine, and saved day state.

export type QuestCategory =
  | "nature"
  | "water"
  | "village"
  | "farm"
  | "food"
  | "pizza"
  | "gelato"
  | "sunset"
  | "rainsafe"
  | "base";

export type QuestMarkerState =
  | "available"
  | "recommended"
  | "active"
  | "completed"
  | "weather_sensitive"
  | "closed";

export type Quest = {
  id: string;
  /** Quest title, e.g. "Water Hunter" */
  name: string;
  /** Real-world place, e.g. "Loro Ciuffenna" */
  place: string;

  category: QuestCategory;
  secondaryCategories?: QuestCategory[];

  latitude: number;
  longitude: number;

  /** One opinionated paragraph — why this is worth doing. */
  whyGo: string;
  /** Short descriptors shown on cards, e.g. ["Village", "River", "Gelato nearby"] */
  chips: string[];

  driveMinutes: number;
  durationLabel: string;
  effortLabel: string;
  bestTimeLabel: string;

  /** Net energy effect of the quest. Negative = costs energy. */
  energyDelta: number;
  /** Net hunger effect. Negative = reduces hunger (food quests). */
  hungerDelta?: number;

  /** One honest caveat surfaced on the quest card (research "failure mode"). */
  note?: string;

  // Curated research fields (docs/research/) — consumed by the Phase 1
  // deterministic scoring engine; carried in the catalog from day one.
  /** 0 = fully exposed … 3 = deep shade / indoor */
  shadeLevel?: 0 | 1 | 2 | 3;
  /** 0 = none … 3 = strenuous */
  walkingIntensity?: 0 | 1 | 2 | 3;
  /** 0–10, how well it lands with kids */
  kidScore?: number;
  /** 0–10, visual payoff */
  scenicScore?: number;
  rainCompatible?: "yes" | "partial" | "no";
  /** Research source link (editorial provenance, not shown in UI yet). */
  sourceUrl?: string;

  /** True for quests created from live web search — unverified, session-only. */
  isDiscovery?: boolean;

  /** Lets the curated catalog pin a marker state (closed, weather-sensitive). */
  initialState?: Extract<
    QuestMarkerState,
    "available" | "closed" | "weather_sensitive"
  >;
};

export type RunState = {
  startedAt: number;
  /** 0–100 */
  energy: number;
  /** 0–100, higher = hungrier */
  hunger: number;
  activeQuestId: string | null;
  completedQuestIds: string[];
};

export type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  label: string;
  sunset: string | null;
  updatedAt: number;
};

export type Recommendation = {
  quest: Quest;
  /** One-line human reason shown under the quest name. */
  reason: string;
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

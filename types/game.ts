// Core game types for Mocale Quest.
//
// Phase 0 note: this is a pragmatic subset of the full Quest schema from the
// product plan (§11). It carries exactly what the visual prototype renders.
// Phase 1 will converge it with the full schema (opening hours, ideal
// temperature ranges, base quality, etc.) when deterministic scoring lands.

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

  /** Phase 0 only: lets mock data pin a marker state (closed, weather_sensitive). */
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

export type Recommendation = {
  quest: Quest;
  /** One-line human reason shown under the quest name. */
  reason: string;
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

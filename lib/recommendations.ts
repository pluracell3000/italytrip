import { isWetWeather } from "@/lib/weather";
import type {
  Quest,
  Recommendation,
  RunState,
  WeatherSnapshot,
} from "@/types/game";

// Editorial anchors from the two verified research batches. These establish
// a strong default order; live context then moves the best fit to the top.
const EDITORIAL_REASONS: Record<string, string> = {
  loro: "The strongest all-rounder nearby: gorge, mill and stone village",
  "acqua-zolfina": "The Balze loop Leonardo painted—best before the heat builds",
  vallombrosa: "Cool forest shade and abbey calm make this a restorative escape",
  arezzo: "The big city quest, with excellent indoor fallbacks",
  poppi: "One of Tuscany's best-preserved castles and a reliable rain-proof plan",
  gropina: "A cool Romanesque interior that is easy to add to another stop",
  castelfranco: "The closest proper borgo—easy to fit into any day",
  "il-borro": "A beautifully restored hamlet with artisan shops and open views",
  piantravigne: "Golden-hour light over the Balze is the entire point",
  pratomagno: "High-altitude air and a huge panorama over the Valdarno",
  "ciuffenna-massette": "Shallow river pools that are made for hot afternoons",
  "setteponti-drive": "A low-energy scenic drive that links several of the valley's highlights",
  "montevarchi-paleo": "Saber-toothed cats make this rain-proof and genuinely kid-friendly",
  bandella: "Herons, wetland calm and a slower side of the Arno",
  "osteria-fondaccio": "The best-confirmed proper dinner close to home base",
  "gelato-turismo": "A quick gelato win only a few minutes away",
  "pizzeria-le-balze": "Pizza with room to play makes an easy family evening",
  "return-to-base": "The pool, shade and a cold drink are a perfectly valid plan",
};

const PRIORITY_ORDER = [
  "loro",
  "acqua-zolfina",
  "vallombrosa",
  "arezzo",
  "poppi",
  "gropina",
  "castelfranco",
  "il-borro",
  "piantravigne",
  "pratomagno",
  "ciuffenna-massette",
  "setteponti-drive",
  "montevarchi-paleo",
  "bandella",
  "osteria-fondaccio",
  "gelato-turismo",
  "pizzeria-le-balze",
  "return-to-base",
];

function priorityOf(quest: Quest): number {
  const index = PRIORITY_ORDER.indexOf(quest.id);
  return index === -1 ? PRIORITY_ORDER.length : index;
}

function hasCategory(quest: Quest, categories: Quest["category"][]): boolean {
  return categories.includes(quest.category) ||
    Boolean(quest.secondaryCategories?.some((category) => categories.includes(category)));
}

function scoreQuest(
  quest: Quest,
  run: RunState,
  weather: WeatherSnapshot | null,
  hour: number,
): number {
  const priority = priorityOf(quest);
  let score =
    72 -
    quest.driveMinutes * 0.7 +
    (quest.scenicScore ?? 5) * 2 +
    Math.max(0, PRIORITY_ORDER.length - priority) * 2.4;

  if (run.energy < 45) {
    score += quest.energyDelta > 0 ? 48 : quest.energyDelta;
    score -= quest.driveMinutes * 0.8;
    score -= (quest.walkingIntensity ?? 1) * 5;
  }

  if (run.hunger > 55) {
    if (hasCategory(quest, ["food", "pizza", "gelato"])) score += 44;
    if (quest.hungerDelta && quest.hungerDelta < 0) score += 18;
  }

  if (weather) {
    if (isWetWeather(weather.weatherCode)) {
      if (quest.rainCompatible === "yes" || hasCategory(quest, ["rainsafe"])) {
        score += 58;
      } else if (quest.rainCompatible === "partial") {
        score += 12;
      } else {
        score -= 38;
      }
    }

    if (weather.temperature >= 29) {
      score += (quest.shadeLevel ?? 0) * 9;
      if (hasCategory(quest, ["water", "nature", "base"])) score += 18;
      if ((quest.shadeLevel ?? 0) === 0) score -= 18;
    }
  }

  if (hour >= 17 && hour <= 20 && quest.category === "sunset") score += 62;
  if (hour >= 19 && hasCategory(quest, ["food", "pizza"])) score += 32;
  if (hour <= 11 && hasCategory(quest, ["farm", "village", "nature"])) score += 14;

  return score;
}

function reasonFor(
  quest: Quest,
  run: RunState,
  weather: WeatherSnapshot | null,
  hour: number,
  planning: boolean,
): string {
  if (run.energy < 45 && quest.energyDelta > 0) {
    return "Your energy is running low—this is one of the gentlest resets nearby";
  }
  if (run.hunger > 55 && hasCategory(quest, ["food", "pizza", "gelato"])) {
    return "You are due for something delicious, without over-planning it";
  }
  if (
    weather &&
    isWetWeather(weather.weatherCode) &&
    (quest.rainCompatible === "yes" || hasCategory(quest, ["rainsafe"]))
  ) {
    return planning
      ? "Rain is in the forecast—this keeps the day interesting and mostly dry"
      : "Rain is in the air—this keeps the day interesting and mostly dry";
  }
  if (weather && weather.temperature >= 29 && (quest.shadeLevel ?? 0) >= 2) {
    return planning
      ? `Around ${weather.temperature}° expected—this is one of the coolest options nearby`
      : `${weather.temperature}° outside—this is one of the coolest options nearby`;
  }
  if (hour >= 17 && hour <= 20 && quest.category === "sunset") {
    return planning
      ? "The light will be turning by then—the right window for the view"
      : "The light is turning now—this is the right moment for the view";
  }
  if (EDITORIAL_REASONS[quest.id]) return EDITORIAL_REASONS[quest.id];
  if ((quest.scenicScore ?? 0) >= 9) {
    return "Exceptional scenery gives this one a very high payoff";
  }
  if (quest.driveMinutes <= 10) {
    return `Only ${quest.driveMinutes} minutes from Mocale—an easy win for today`;
  }
  return "A strong fit for this moment of your day";
}

export type RecommendationOptions = {
  /** The moment to rank for — defaults to right now. */
  at?: Date;
  count?: number;
  /** True when ranking for a future start time rather than the live moment. */
  planning?: boolean;
};

export function getRecommendations(
  quests: Quest[],
  run: RunState,
  weather: WeatherSnapshot | null,
  options: RecommendationOptions = {},
): Recommendation[] {
  const { at = new Date(), count = 3, planning = false } = options;
  const hour = at.getHours();

  return quests
    .filter(
      (quest) =>
        quest.id !== run.activeQuestId &&
        !run.completedQuestIds.includes(quest.id) &&
        quest.initialState !== "closed",
    )
    .map((quest) => ({
      quest,
      score: scoreQuest(quest, run, weather, hour),
      reason: reasonFor(quest, run, weather, hour, planning),
    }))
    .sort((a, b) => b.score - a.score || a.quest.driveMinutes - b.quest.driveMinutes)
    .slice(0, count)
    .map(({ quest, reason }) => ({ quest, reason }));
}

export const getMockRecommendations = getRecommendations;

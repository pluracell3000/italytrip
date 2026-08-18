import type { Quest, Recommendation, RunState } from "@/types/game";

// Phase 0: hand-authored mock recommendations to validate the "top 3" UI.
// The deterministic scoring engine (plan §10) replaces this in Phase 1 —
// keep the function signature, swap the internals.

const MOCK_REASONS: Record<string, string> = {
  "the-cool-escape": "Cold forest shade beats the afternoon heat",
  "water-hunter": "River air, short drive, gelato as a bonus",
  "easy-mode": "Low effort, big recovery — pizza then pool",
  "stone-and-stories": "Six minutes away and lovely in soft light",
  "gelato-radar": "Quick win: shade, piazza and pistachio",
  "golden-hour": "Sunset is coming — the cliffs will glow",
  "the-rainy-keep": "Frescoes and cafés, immune to weather",
  "river-splash": "Calm water and picnic shade by the Arno",
  "return-to-base": "Energy is low — the pool is calling",
};

const PRIORITY_ORDER = [
  "the-cool-escape",
  "water-hunter",
  "easy-mode",
  "stone-and-stories",
  "gelato-radar",
  "river-splash",
  "the-rainy-keep",
  "golden-hour",
  "return-to-base",
];

export function getMockRecommendations(
  quests: Quest[],
  run: RunState,
  count = 3,
): Recommendation[] {
  const eligible = quests.filter(
    (quest) =>
      quest.id !== run.activeQuestId &&
      !run.completedQuestIds.includes(quest.id) &&
      quest.initialState !== "closed",
  );

  const ranked = [...eligible].sort((a, b) => {
    // Mock "state awareness": tired players get recovery quests first.
    if (run.energy < 40) {
      const aRecovers = a.energyDelta > 0 ? 0 : 1;
      const bRecovers = b.energyDelta > 0 ? 0 : 1;
      if (aRecovers !== bRecovers) return aRecovers - bRecovers;
    }
    return PRIORITY_ORDER.indexOf(a.id) - PRIORITY_ORDER.indexOf(b.id);
  });

  return ranked.slice(0, count).map((quest) => ({
    quest,
    reason: MOCK_REASONS[quest.id] ?? "A strong pick from right here",
  }));
}

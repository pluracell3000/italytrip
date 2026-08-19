import type { Quest, Recommendation, RunState } from "@/types/game";

// Mock top-3 recommendations to validate the "What next?" UI.
// The priority order follows the research batch's "strongest experience
// anchors" (docs/research/MOCALE_QUEST_RESEARCH_SUMMARY.md). The
// deterministic scoring engine (plan §10) replaces this in Phase 1 —
// keep the function signature, swap the internals.

const MOCK_REASONS: Record<string, string> = {
  loro: "Strongest all-rounder nearby: gorge, mill, village",
  vallombrosa: "Cold forest shade beats the afternoon heat",
  balze: "The signature scenery, ten minutes from base",
  castelfranco: "Ultra-low-friction evening wander",
  arezzo: "The big city quest, with indoor fallbacks",
  pratomagno: "Biggest panorama when conditions are good",
  "montevarchi-paleo": "Saber-toothed cats — rain-proof and kid-proof",
  bandella: "Herons and wetland calm by the Arno",
  "il-borro": "Tiny spectacular hamlet, big visual payoff",
  "san-giovanni": "Easy town stroll that ends in dinner",
  "new-california": "Low effort, big recovery — pizza then pool",
  "gelato-turismo": "Quick win: gelato five minutes away",
  "return-to-base": "Energy is low — the pool is calling",
  "acqua-zolfina": "The full Balze immersion, best in the morning",
};

const PRIORITY_ORDER = [
  "loro",
  "vallombrosa",
  "balze",
  "castelfranco",
  "arezzo",
  "pratomagno",
  "montevarchi-paleo",
  "bandella",
  "il-borro",
  "san-giovanni",
  "acqua-zolfina",
  "gelato-turismo",
  "new-california",
  "return-to-base",
];

function priorityOf(quest: Quest): number {
  const index = PRIORITY_ORDER.indexOf(quest.id);
  return index === -1 ? PRIORITY_ORDER.length : index;
}

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
    return priorityOf(a) - priorityOf(b);
  });

  return ranked.slice(0, count).map((quest) => ({
    quest,
    reason: MOCK_REASONS[quest.id] ?? "A strong pick from right here",
  }));
}

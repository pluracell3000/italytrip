import type { Quest, Recommendation, RunState } from "@/types/game";

// Mock top-3 recommendations to validate the "What next?" UI.
// Priority follows research batch 2's "strongest 10 overall experiences"
// (docs/research/MOCALE_QUEST_RESEARCH_BATCH2.md), then batch 1 anchors.
// The deterministic scoring engine (plan §10) replaces this in Phase 1 —
// keep the function signature, swap the internals.

const MOCK_REASONS: Record<string, string> = {
  loro: "Strongest all-rounder nearby: gorge, mill, village",
  "acqua-zolfina": "The Balze loop Leonardo painted — go early",
  vallombrosa: "Cold forest shade beats the afternoon heat",
  arezzo: "The big city quest, with indoor fallbacks",
  poppi: "Best-preserved castle in Tuscany, rain-proof",
  gropina: "Cool Romanesque interior, quick add-on",
  castelfranco: "Ultra-low-friction evening wander",
  "il-borro": "Ferragamo's hamlet — artisan shops and views",
  piantravigne: "Golden hour over the Balze",
  pratomagno: "1592 m of panorama and cool air",
  "ciuffenna-massette": "Shallow river pools — made for hot afternoons",
  "setteponti-drive": "Low-energy scenic drive linking the hits",
  "montevarchi-paleo": "Saber-toothed cats — rain-proof and kid-proof",
  bandella: "Herons and wetland calm by the Arno",
  "osteria-fondaccio": "The best-confirmed proper dinner around",
  "gelato-turismo": "Quick win: gelato five minutes away",
  "pizzeria-le-balze": "Pizza with outdoor games — easy family night",
  "return-to-base": "Energy is low — the pool is calling",
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

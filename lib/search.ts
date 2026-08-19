import { CATEGORY_META } from "@/data/quests";
import type { Quest } from "@/types/game";

// Client-side catalog search (Phase: basic search).
// Accent-insensitive token matching with light field weighting — no index
// needed at this catalog size. A later phase may add live web discovery;
// this module stays the local-first path.

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function questHaystacks(quest: Quest): { text: string; weight: number }[] {
  const categories = [quest.category, ...(quest.secondaryCategories ?? [])];
  return [
    { text: normalize(quest.name), weight: 5 },
    { text: normalize(quest.place), weight: 4 },
    { text: normalize(quest.chips.join(" ")), weight: 3 },
    {
      text: normalize(categories.map((c) => CATEGORY_META[c].label).join(" ")),
      weight: 3,
    },
    { text: normalize(quest.whyGo), weight: 1 },
  ];
}

/**
 * Returns quests matching the query, best first. Every query token must
 * match at least one field (AND semantics) to keep results tight.
 * An empty query returns the whole catalog, nearest first.
 */
export function searchQuests(quests: Quest[], query: string): Quest[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return [...quests].sort((a, b) => a.driveMinutes - b.driveMinutes);
  }

  const scored: { quest: Quest; score: number }[] = [];

  for (const quest of quests) {
    const haystacks = questHaystacks(quest);
    let score = 0;
    let allTokensMatch = true;

    for (const token of tokens) {
      let tokenScore = 0;
      for (const { text, weight } of haystacks) {
        if (!text.includes(token)) continue;
        tokenScore = Math.max(
          tokenScore,
          weight + (text.startsWith(token) ? 1 : 0),
        );
      }
      if (tokenScore === 0) {
        allTokensMatch = false;
        break;
      }
      score += tokenScore;
    }

    if (allTokensMatch) scored.push({ quest, score });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || a.quest.driveMinutes - b.quest.driveMinutes,
    )
    .map((entry) => entry.quest);
}

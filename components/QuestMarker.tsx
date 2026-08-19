import { CATEGORY_META } from "@/data/quests";
import type { Quest, QuestMarkerState } from "@/types/game";

// MapLibre markers take plain DOM elements, so these are element factories
// rather than rendered React components. All visual states are driven by
// data-attributes + CSS (see globals.css) so updating a marker never
// requires re-creating it.

const STATE_BADGES: Partial<Record<QuestMarkerState, string>> = {
  completed: "✓",
  closed: "✕",
  weather_sensitive: "!",
};

export function createQuestMarkerElement(
  quest: Quest,
  onClick: (questId: string) => void,
): HTMLElement {
  const meta = CATEGORY_META[quest.category];

  const root = document.createElement("button");
  root.type = "button";
  root.className = "quest-marker";
  root.style.setProperty("--marker-color", meta.color);
  root.setAttribute("aria-label", `${quest.name} — ${quest.place}`);
  root.dataset.state = "available";
  root.dataset.selected = "false";
  root.dataset.discovery = String(quest.isDiscovery ?? false);

  const halo = document.createElement("span");
  halo.className = "quest-marker__halo";

  const bubble = document.createElement("span");
  bubble.className = "quest-marker__bubble";
  bubble.textContent = meta.glyph;

  const badge = document.createElement("span");
  badge.className = "quest-marker__badge";

  root.append(halo, bubble, badge);

  root.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick(quest.id);
  });

  return root;
}

export function updateQuestMarkerElement(
  element: HTMLElement,
  state: QuestMarkerState,
  selected: boolean,
): void {
  element.dataset.state = state;
  element.dataset.selected = String(selected);
  const badge = element.querySelector<HTMLElement>(".quest-marker__badge");
  if (badge) badge.textContent = STATE_BADGES[state] ?? "";
}

export function createPlayerMarkerElement(): HTMLElement {
  const root = document.createElement("div");
  root.className = "player-marker";
  root.setAttribute("aria-label", "You are here");
  // Float above quest markers, but never intercept their taps.
  root.style.zIndex = "5";
  root.style.pointerEvents = "none";

  const pulse = document.createElement("span");
  pulse.className = "player-marker__pulse";

  const dot = document.createElement("span");
  dot.className = "player-marker__dot";

  root.append(pulse, dot);
  return root;
}

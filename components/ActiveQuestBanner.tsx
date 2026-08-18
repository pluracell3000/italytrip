"use client";

import { navigationUrl } from "@/components/QuestBottomSheet";
import { CATEGORY_META } from "@/data/quests";
import { clampStat } from "@/lib/utils";
import type { Quest } from "@/types/game";

type ActiveQuestBannerProps = {
  quest: Quest;
  energy: number;
  onComplete: (questId: string) => void;
  onCancel: () => void;
};

export default function ActiveQuestBanner({
  quest,
  energy,
  onComplete,
  onCancel,
}: ActiveQuestBannerProps) {
  const meta = CATEGORY_META[quest.category];
  // Rough mock: the drive itself nibbles a little energy before the quest.
  const arrivalEnergy = clampStat(energy - Math.ceil(quest.driveMinutes / 8));

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)] z-20 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink/90 px-4 py-3 text-cream shadow-card backdrop-blur animate-pop-in">
        <span className="text-xl" aria-hidden>
          {meta.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold uppercase tracking-wide">
            {quest.name}
          </p>
          <p className="text-xs text-cream/70 tabular-nums">
            🚗 {quest.driveMinutes} min · ⚡ {energy} → ~{arrivalEnergy} on
            arrival
          </p>
        </div>
        <a
          href={navigationUrl(quest)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Navigate"
          className="rounded-full bg-cream/15 px-3 py-2 text-sm font-bold"
        >
          ↗
        </a>
        <button
          type="button"
          onClick={() => onComplete(quest.id)}
          aria-label="Complete quest"
          className="rounded-full bg-forest px-3 py-2 text-sm font-bold transition-transform active:scale-95"
        >
          ✓
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel quest"
          className="rounded-full bg-cream/15 px-3 py-2 text-sm font-bold transition-transform active:scale-95"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

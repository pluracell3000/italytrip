"use client";

import Icon from "@/components/Icon";
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
  const arrivalEnergy = clampStat(energy - Math.ceil(quest.driveMinutes / 8));

  return (
    <aside className="pointer-events-none absolute inset-x-0 top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] z-20 flex justify-center px-3 sm:px-4">
      <div className="pointer-events-auto flex min-h-14 w-full max-w-[500px] items-center gap-2 rounded-[1.15rem] border border-cream/10 bg-ink/94 px-3 py-2.5 text-cream shadow-card backdrop-blur-xl animate-pop-in sm:gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.color}33`, color: "#fffaf0" }}
        >
          <Icon name={meta.icon} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold marker-live-dot" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cream/60">
              Quest in progress
            </p>
          </div>
          <p className="truncate font-display text-sm font-bold leading-tight">{quest.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-cream/65 tabular-nums">
            {quest.driveMinutes} min · arrive near {arrivalEnergy}
          </p>
        </div>
        <a
          href={navigationUrl(quest)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Navigate to ${quest.name}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cream/10 transition hover:bg-cream/15 active:scale-95"
        >
          <Icon name="navigation" className="size-[19px]" />
        </a>
        <button
          type="button"
          onClick={() => onComplete(quest.id)}
          aria-label={`Mark ${quest.name} complete`}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest transition hover:bg-forest/90 active:scale-95"
        >
          <Icon name="check" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Stop this quest"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cream/10 transition hover:bg-cream/15 active:scale-95"
        >
          <Icon name="x" className="size-[18px]" />
        </button>
      </div>
    </aside>
  );
}

"use client";

import { CATEGORY_META } from "@/data/quests";
import { cn, formatDelta } from "@/lib/utils";
import type { Quest, QuestMarkerState } from "@/types/game";

type QuestBottomSheetProps = {
  quest: Quest;
  state: QuestMarkerState;
  energy: number;
  onStart: (questId: string) => void;
  onComplete: (questId: string) => void;
  onClose: () => void;
};

export function navigationUrl(quest: Quest): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${quest.latitude},${quest.longitude}`;
}

export default function QuestBottomSheet({
  quest,
  state,
  energy,
  onStart,
  onComplete,
  onClose,
}: QuestBottomSheetProps) {
  const meta = CATEGORY_META[quest.category];
  const categories = [quest.category, ...(quest.secondaryCategories ?? [])];
  const isActive = state === "active";
  const isClosed = state === "closed";
  const isCompleted = state === "completed";
  const gains = quest.energyDelta > 0;

  return (
    <section
      className="absolute inset-x-0 bottom-0 z-30 animate-slide-up"
      aria-label={`Quest: ${quest.name}`}
    >
      <div className="mx-auto max-w-md rounded-t-3xl bg-cream px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_40px_-12px_rgb(59_46_34/0.4)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight">
              {quest.name}
            </h2>
            <p className="text-sm font-medium text-ink-soft">{quest.place}</p>
          </div>
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
            aria-hidden
          >
            {meta.glyph}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-ink-soft">
          <span className="rounded-full bg-sand px-2.5 py-1">
            {categories.map((c) => CATEGORY_META[c].glyph).join(" ")}{" "}
            {quest.chips.join(" · ")}
          </span>
          <span className="rounded-full bg-sand px-2.5 py-1">
            🚗 {quest.driveMinutes} min
          </span>
          <span className="rounded-full bg-sand px-2.5 py-1">
            ⏱ {quest.durationLabel}
          </span>
          <span className="rounded-full bg-sand px-2.5 py-1">
            🚶 {quest.effortLabel}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">
            Why go
          </h3>
          <p className="mt-1 text-[15px] leading-snug">{quest.whyGo}</p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-sand/70 px-4 py-2.5 text-sm font-semibold">
          <span className="text-ink-soft">
            Best time{" "}
            <span className="ml-1 text-ink">{quest.bestTimeLabel}</span>
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 tabular-nums text-cream",
              gains ? "bg-olive" : "bg-terracotta",
            )}
          >
            ⚡ {formatDelta(quest.energyDelta)}
          </span>
        </div>

        {state === "weather_sensitive" && (
          <p className="mt-2 text-xs font-medium text-gold">
            ⛅ Weather-sensitive — pick your moment.
          </p>
        )}
        {isClosed && (
          <p className="mt-2 text-xs font-medium text-stone">
            ✕ Closed right now — mock opening hours land in Phase 1.
          </p>
        )}
        {quest.note && (
          <p className="mt-2 text-xs font-medium text-ink-soft">
            ⚠️ {quest.note}
          </p>
        )}

        <div className="mt-4 flex gap-2.5">
          {isActive ? (
            <button
              type="button"
              onClick={() => onComplete(quest.id)}
              className="flex-1 rounded-2xl bg-forest py-3.5 font-display text-sm font-bold uppercase tracking-widest text-cream transition-transform active:scale-[0.98]"
            >
              Complete quest ✓
            </button>
          ) : (
            <button
              type="button"
              disabled={isClosed || isCompleted}
              onClick={() => onStart(quest.id)}
              className={cn(
                "flex-1 rounded-2xl py-3.5 font-display text-sm font-bold uppercase tracking-widest text-cream transition-transform active:scale-[0.98]",
                isClosed || isCompleted
                  ? "bg-stone/50"
                  : "bg-terracotta shadow-card",
              )}
            >
              {isCompleted ? "Completed ✓" : isClosed ? "Closed" : "Start quest"}
            </button>
          )}
          <a
            href={navigationUrl(quest)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-ink px-4 py-3.5 text-sm font-bold text-cream transition-transform active:scale-[0.98]"
          >
            Navigate ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quest card"
            className="rounded-2xl bg-sand px-4 py-3.5 text-sm font-bold text-ink-soft transition-transform active:scale-[0.98]"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-ink-soft/70">
          Arrive with ⚡ ~{Math.max(0, energy - Math.ceil(quest.driveMinutes / 8))}
        </p>
      </div>
    </section>
  );
}

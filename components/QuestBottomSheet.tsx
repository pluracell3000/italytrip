"use client";

import Icon from "@/components/Icon";
import { CATEGORY_META } from "@/data/quests";
import useDialog from "@/hooks/useDialog";
import { cn, formatDelta } from "@/lib/utils";
import type { Quest, QuestMarkerState } from "@/types/game";

type QuestBottomSheetProps = {
  quest: Quest;
  state: QuestMarkerState;
  energy: number;
  hasAnotherActiveQuest: boolean;
  onStart: (questId: string) => void;
  onComplete: (questId: string) => void;
  onClose: () => void;
};

export function navigationUrl(quest: Quest): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${quest.latitude},${quest.longitude}&travelmode=driving`;
}

export default function QuestBottomSheet({
  quest,
  state,
  energy,
  hasAnotherActiveQuest,
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
  const dialogRef = useDialog<HTMLElement>(onClose);

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-title"
      className="sheet-panel absolute inset-x-0 bottom-0 z-30 animate-slide-up"
    >
      <div className="sheet-surface bg-cream">
        <div className="sheet-handle" />

        <div className="flex items-start gap-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
          >
            <Icon name={meta.icon} className="size-6" />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="eyebrow">
              {meta.label} quest
            </p>
            <h2 id="quest-title" className="text-balance font-display text-2xl font-semibold leading-[1.08]">
              {quest.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-soft">{quest.place}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close place details" className="icon-button">
            <Icon name="x" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="metric-tile">
            <Icon name="route" className="size-4 text-terracotta" />
            <span className="metric-value">{quest.driveMinutes} min</span>
            <span className="metric-label">from Mocale</span>
          </div>
          <div className="metric-tile">
            <Icon name="clock" className="size-4 text-water" />
            <span className="metric-value">{quest.durationLabel}</span>
            <span className="metric-label">allow</span>
          </div>
          <div className="metric-tile">
            <Icon name="leaf" className="size-4 text-forest" />
            <span className="metric-value truncate">{quest.effortLabel}</span>
            <span className="metric-label">pace</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const categoryMeta = CATEGORY_META[category];
            return (
              <span
                key={category}
                className="inline-flex items-center gap-1.5 rounded-full bg-sand/75 px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft"
              >
                <Icon name={categoryMeta.icon} className="size-3.5" />
                {categoryMeta.label}
              </span>
            );
          })}
          {quest.chips.slice(0, 2).map((chip) => (
            <span key={chip} className="rounded-full bg-sand/75 px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft">
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-4 border-l-2 border-terracotta/35 pl-4">
          <h3 className="eyebrow">Why it is worth it</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{quest.whyGo}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-parchment/65 px-3.5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-ink">
              <Icon name="sun" className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">Best window</p>
              <p className="truncate text-sm font-semibold">{quest.bestTimeLabel}</p>
            </div>
          </div>
          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold tabular-nums text-cream",
              gains ? "bg-olive" : "bg-terracotta",
            )}
            aria-label={`${gains ? "Gains" : "Costs"} ${Math.abs(quest.energyDelta)} energy`}
          >
            <Icon name="zap" className="size-3.5" />
            {formatDelta(quest.energyDelta)}
          </div>
        </div>

        {state === "weather_sensitive" && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-gold/10 px-3 py-2 text-xs font-medium text-ink-soft">
            <Icon name="cloud-sun" className="size-4 text-gold" />
            Weather-sensitive—the view is best with a clear horizon.
          </p>
        )}
        {isClosed && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-stone/10 px-3 py-2 text-xs font-medium text-ink-soft">
            <Icon name="clock" className="size-4 text-stone" />
            Not available right now. Keep it on the map for another day.
          </p>
        )}
        {hasAnotherActiveQuest && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-terracotta/[0.08] px-3 py-2 text-xs font-medium text-ink-soft">
            <Icon name="route" className="size-4 text-terracotta" />
            Finish or stop your current quest before starting another.
          </p>
        )}
        {quest.note && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-sand/60 px-3 py-2 text-xs font-medium leading-relaxed text-ink-soft">
            <Icon name="flag" className="mt-0.5 size-4 shrink-0 text-terracotta" />
            {quest.note}
          </p>
        )}

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2.5">
          {isActive ? (
            <button
              type="button"
              onClick={() => onComplete(quest.id)}
              className="primary-button bg-forest hover:bg-forest/90"
            >
              <Icon name="check" />
              Complete quest
            </button>
          ) : (
            <button
              type="button"
              disabled={isClosed || isCompleted || hasAnotherActiveQuest}
              onClick={() => onStart(quest.id)}
              className={cn(
                "primary-button",
                isClosed || isCompleted || hasAnotherActiveQuest
                  ? "cursor-not-allowed bg-stone/45 shadow-none"
                  : "bg-terracotta hover:bg-terracotta-deep",
              )}
            >
              <Icon name={isCompleted ? "check" : "route"} />
              {isCompleted
                ? "Already explored"
                : isClosed
                  ? "Unavailable"
                  : hasAnotherActiveQuest
                    ? "Quest already active"
                    : "Start this quest"}
            </button>
          )}
          <a
            href={navigationUrl(quest)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-bold text-cream transition hover:bg-ink/90 active:scale-[0.98]"
            aria-label={`Navigate to ${quest.name} in Google Maps`}
          >
            <Icon name="navigation" className="size-[18px]" />
            <span className="hidden min-[390px]:inline">Directions</span>
          </a>
        </div>

        <p className="mt-2.5 text-center text-[11px] text-ink-soft/75">
          Estimated energy on arrival: <span className="font-semibold text-ink">{Math.max(0, energy - Math.ceil(quest.driveMinutes / 8))}</span>
        </p>
      </div>
    </section>
  );
}

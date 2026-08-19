"use client";

import Icon from "@/components/Icon";
import { CATEGORY_META } from "@/data/quests";
import useDialog from "@/hooks/useDialog";
import { cn, formatDelta } from "@/lib/utils";
import type { Recommendation } from "@/types/game";

type WhatNextSheetProps = {
  recommendations: Recommendation[];
  contextLabel: string;
  onStart: (questId: string) => void;
  onInspect: (questId: string) => void;
  onClose: () => void;
};

export default function WhatNextSheet({
  recommendations,
  contextLabel,
  onStart,
  onInspect,
  onClose,
}: WhatNextSheetProps) {
  const dialogRef = useDialog<HTMLElement>(onClose);

  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="Close recommendations"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] animate-fade-in"
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommendations-title"
        className="sheet-panel absolute inset-x-0 bottom-0 animate-slide-up"
      >
        <div className="sheet-surface bg-parchment">
          <div className="sheet-handle" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-1.5 text-terracotta">
                <Icon name="sparkles" className="size-3.5" />
                Picked for this moment
              </p>
              <h2 id="recommendations-title" className="mt-1 text-balance font-display text-2xl font-semibold leading-tight">
                Three good ways to spend the next few hours.
              </h2>
              <p className="mt-1.5 text-xs font-medium text-ink-soft">{contextLabel}</p>
            </div>
            <button type="button" onClick={onClose} className="icon-button" aria-label="Close">
              <Icon name="x" />
            </button>
          </div>

          {recommendations.length > 0 ? (
            <ol className="mt-4 space-y-2.5">
              {recommendations.map(({ quest, reason }, index) => {
                const meta = CATEGORY_META[quest.category];
                const gains = quest.energyDelta > 0;
                return (
                  <li key={quest.id}>
                    <article
                      className="group rounded-[1.25rem] border border-ink/8 bg-cream p-3.5 shadow-chip animate-pop-in sm:p-4"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => onInspect(quest.id)}
                        className="block w-full rounded-xl text-left focus-visible:outline-offset-4"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
                          >
                            <Icon name={meta.icon} className="size-[21px]" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-soft">
                                  {index === 0 ? "Best fit" : `Option ${index + 1}`} · {meta.label}
                                </p>
                                <h3 className="truncate font-display text-lg font-semibold leading-tight">{quest.name}</h3>
                              </div>
                              <Icon name="chevron-right" className="mt-1 size-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
                            </div>
                            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-soft">{reason}</p>
                          </div>
                        </div>
                      </button>

                      <div className="mt-3 flex items-center gap-2 border-t border-ink/8 pt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft">
                          <Icon name="route" className="size-3.5" />
                          {quest.driveMinutes} min
                        </span>
                        <span className="size-1 rounded-full bg-ink/20" />
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft">
                          <Icon name="clock" className="size-3.5" />
                          {quest.durationLabel}
                        </span>
                        <span
                          className={cn(
                            "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold tabular-nums text-cream",
                            gains ? "bg-olive" : "bg-terracotta",
                          )}
                        >
                          <Icon name="zap" className="size-3" />
                          {formatDelta(quest.energyDelta)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onStart(quest.id)}
                          className="min-h-11 rounded-xl bg-ink px-3.5 text-xs font-bold text-cream transition hover:bg-ink/90 active:scale-95"
                        >
                          Start
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-5 rounded-2xl bg-cream p-6 text-center shadow-chip">
              <Icon name="flag" className="mx-auto size-7 text-forest" />
              <p className="mt-3 font-display text-lg font-semibold">You have explored every open quest.</p>
              <p className="mt-1 text-sm text-ink-soft">That sounds like a day well spent.</p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-3 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 text-sm font-bold text-ink-soft transition hover:bg-cream/70 active:scale-[0.99]"
          >
            Keep browsing the map
          </button>
        </div>
      </section>
    </div>
  );
}

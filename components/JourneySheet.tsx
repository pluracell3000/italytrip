"use client";

import Icon from "@/components/Icon";
import { CATEGORY_META } from "@/data/quests";
import useDialog from "@/hooks/useDialog";
import type { Quest } from "@/types/game";

type JourneySheetProps = {
  completed: Quest[];
  activeQuest: Quest | null;
  total: number;
  onInspect: (questId: string) => void;
  onClose: () => void;
};

export default function JourneySheet({
  completed,
  activeQuest,
  total,
  onInspect,
  onClose,
}: JourneySheetProps) {
  const dialogRef = useDialog<HTMLElement>(onClose);
  const percentage = Math.round((completed.length / total) * 100);

  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="Close journey"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] animate-fade-in"
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-title"
        className="sheet-panel absolute inset-x-0 bottom-0 animate-slide-up"
      >
        <div className="sheet-surface bg-parchment">
          <div className="sheet-handle" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Your day</p>
              <h2 id="journey-title" className="mt-1 font-display text-2xl font-semibold">
                A little Tuscany, collected.
              </h2>
            </div>
            <button type="button" onClick={onClose} className="icon-button" aria-label="Close">
              <Icon name="x" />
            </button>
          </div>

          <div className="mt-5 rounded-3xl bg-ink p-5 text-cream shadow-card">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cream/60">
                  Places explored
                </p>
                <p className="mt-1 font-display text-4xl font-semibold tabular-nums">
                  {completed.length}<span className="text-xl text-cream/50">/{total}</span>
                </p>
              </div>
              <span className="rounded-full bg-cream/10 px-3 py-1.5 text-xs font-semibold tabular-nums">
                {percentage}% of the map
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream/15">
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {activeQuest && (
            <button
              type="button"
              onClick={() => onInspect(activeQuest.id)}
              className="mt-3 flex min-h-14 w-full items-center gap-3 rounded-2xl border border-terracotta/20 bg-terracotta/[0.08] p-3 text-left transition hover:bg-terracotta/[0.12]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-terracotta text-cream">
                <Icon name="route" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta">In progress</span>
                <span className="block truncate font-display font-semibold">{activeQuest.name}</span>
              </span>
              <Icon name="chevron-right" className="text-ink-soft" />
            </button>
          )}

          <div className="mt-5">
            <h3 className="eyebrow">Travel notes</h3>
            {completed.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-ink/15 bg-cream/55 px-5 py-7 text-center">
                <Icon name="flag" className="mx-auto size-6 text-terracotta" />
                <p className="mt-3 font-display text-lg font-semibold">Your first story starts here.</p>
                <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-ink-soft">
                  Complete a quest and it will appear in this quiet little record of the day.
                </p>
              </div>
            ) : (
              <ul className="mt-2 divide-y divide-ink/8">
                {[...completed].reverse().map((quest) => {
                  const meta = CATEGORY_META[quest.category];
                  return (
                    <li key={quest.id}>
                      <button
                        type="button"
                        onClick={() => onInspect(quest.id)}
                        className="flex min-h-16 w-full items-center gap-3 py-2.5 text-left"
                      >
                        <span
                          className="flex size-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
                        >
                          <Icon name={meta.icon} className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display font-semibold">{quest.name}</span>
                          <span className="block truncate text-xs text-ink-soft">{quest.place}</span>
                        </span>
                        <Icon name="check" className="size-5 text-forest" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

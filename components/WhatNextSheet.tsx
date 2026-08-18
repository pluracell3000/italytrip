"use client";

import { CATEGORY_META } from "@/data/quests";
import { cn, formatDelta } from "@/lib/utils";
import type { Recommendation } from "@/types/game";

type WhatNextSheetProps = {
  recommendations: Recommendation[];
  onStart: (questId: string) => void;
  onInspect: (questId: string) => void;
  onClose: () => void;
};

export default function WhatNextSheet({
  recommendations,
  onStart,
  onInspect,
  onClose,
}: WhatNextSheetProps) {
  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="Close recommendations"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] animate-fade-in"
      />

      <section
        aria-label="Recommended quests"
        className="absolute inset-x-0 bottom-0 animate-slide-up"
      >
        <div className="mx-auto max-w-md rounded-t-3xl bg-parchment px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_40px_-12px_rgb(59_46_34/0.5)]">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15" />

          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              What next?
            </h2>
            <span className="text-xs font-medium text-ink-soft">
              from Borgo Mocale · right now
            </span>
          </div>

          <ul className="mt-3 space-y-2.5">
            {recommendations.map(({ quest, reason }, index) => {
              const meta = CATEGORY_META[quest.category];
              const gains = quest.energyDelta > 0;
              return (
                <li key={quest.id}>
                  <article
                    className="rounded-2xl bg-cream p-4 shadow-chip animate-pop-in"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => onInspect(quest.id)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-wide">
                            {quest.name}
                          </h3>
                          <p className="text-sm font-medium text-ink-soft">
                            {quest.place}
                          </p>
                        </div>
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                          style={{
                            backgroundColor: `${meta.color}22`,
                            color: meta.color,
                          }}
                          aria-hidden
                        >
                          {meta.glyph}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] italic text-ink-soft">
                        {reason}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-ink-soft">
                        🚗 {quest.driveMinutes} min ·{" "}
                        {quest.chips.join(" · ")} · ⏱ {quest.durationLabel}
                      </p>
                    </button>

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold tabular-nums text-cream",
                          gains ? "bg-olive" : "bg-terracotta",
                        )}
                      >
                        ⚡ {formatDelta(quest.energyDelta)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onStart(quest.id)}
                        className="rounded-full bg-ink px-5 py-2 font-display text-xs font-bold uppercase tracking-widest text-cream transition-transform active:scale-95"
                      >
                        Start quest
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-2xl border-2 border-ink/15 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink-soft transition-transform active:scale-[0.98]"
          >
            Explore map
          </button>
        </div>
      </section>
    </div>
  );
}

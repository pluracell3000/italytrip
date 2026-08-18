"use client";

import EnergyBar from "@/components/EnergyBar";
import { CATEGORY_META } from "@/data/quests";
import type { Quest } from "@/types/game";

type QuestCompleteOverlayProps = {
  quest: Quest;
  energyBefore: number;
  energyAfter: number;
  onWhatNext: () => void;
  onDismiss: () => void;
};

export default function QuestCompleteOverlay({
  quest,
  energyBefore,
  energyAfter,
  onWhatNext,
  onDismiss,
}: QuestCompleteOverlayProps) {
  const meta = CATEGORY_META[quest.category];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade-in"
      />

      <section
        aria-label="Quest complete"
        className="relative w-full max-w-xs rounded-3xl bg-cream p-6 text-center shadow-card animate-pop-in"
      >
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: `${meta.color}22` }}
          aria-hidden
        >
          {meta.glyph}
        </span>

        <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.25em] text-olive">
          Quest complete
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
          {quest.name} ✓
        </h2>
        <p className="text-sm font-medium text-ink-soft">{quest.place}</p>

        <div className="mt-5 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
            <span className="uppercase tracking-wide">⚡ Energy</span>
            <span className="tabular-nums">
              {energyBefore} → <span className="text-ink">{energyAfter}</span>
            </span>
          </div>
          <EnergyBar value={energyAfter} className="mt-1.5 h-2" />
        </div>

        <button
          type="button"
          onClick={onWhatNext}
          className="mt-6 w-full rounded-2xl bg-terracotta py-3.5 font-display text-sm font-bold uppercase tracking-widest text-cream shadow-card transition-transform active:scale-[0.98]"
        >
          What next?
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full py-2 text-sm font-semibold text-ink-soft"
        >
          Keep exploring
        </button>
      </section>
    </div>
  );
}

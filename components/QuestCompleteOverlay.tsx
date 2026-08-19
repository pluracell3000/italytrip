"use client";

import EnergyBar from "@/components/EnergyBar";
import Icon from "@/components/Icon";
import { CATEGORY_META } from "@/data/quests";
import useDialog from "@/hooks/useDialog";
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
  const dialogRef = useDialog<HTMLElement>(onDismiss);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-5">
      <button
        type="button"
        aria-label="Dismiss completion message"
        onClick={onDismiss}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in"
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="complete-title"
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-cream p-6 text-center shadow-card animate-pop-in"
      >
        <div className="completion-rays pointer-events-none absolute inset-x-0 top-0 h-32 opacity-40" />
        <span
          className="relative mx-auto flex size-[4.5rem] items-center justify-center rounded-[1.5rem] shadow-chip"
          style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
        >
          <Icon name={meta.icon} className="size-8" />
          <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-forest text-cream ring-4 ring-cream">
            <Icon name="check" className="size-4" />
          </span>
        </span>

        <p className="relative mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-forest">
          Added to your journey
        </p>
        <h2 id="complete-title" className="relative mt-1 text-balance font-display text-2xl font-semibold leading-tight">
          {quest.name}
        </h2>
        <p className="relative mt-1 text-sm font-medium text-ink-soft">{quest.place}</p>

        <div className="relative mt-5 rounded-2xl bg-parchment/70 p-4 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
            <span className="flex items-center gap-1.5 uppercase tracking-[0.12em]">
              <Icon name="zap" className="size-3.5 text-olive" />
              Energy
            </span>
            <span className="tabular-nums">
              {energyBefore} → <strong className="text-ink">{energyAfter}</strong>
            </span>
          </div>
          <EnergyBar value={energyAfter} className="mt-2 h-2" />
        </div>

        <button
          type="button"
          onClick={onWhatNext}
          className="primary-button relative mt-5 w-full bg-terracotta hover:bg-terracotta-deep"
        >
          <Icon name="sparkles" />
          Find the next stop
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="relative mt-2 min-h-11 w-full rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-sand/50"
        >
          Back to the map
        </button>
      </section>
    </div>
  );
}

"use client";

import Icon from "@/components/Icon";

type MapControlsProps = {
  completed: number;
  total: number;
  active: boolean;
  onHome: () => void;
  onShowAll: () => void;
  onOpenJourney: () => void;
};

export default function MapControls({
  completed,
  total,
  active,
  onHome,
  onShowAll,
  onOpenJourney,
}: MapControlsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-20 flex items-start justify-between px-4 transition-[top] duration-300 ${
        active
          ? "top-[calc(max(0.75rem,env(safe-area-inset-top))+8.75rem)]"
          : "top-[calc(max(0.75rem,env(safe-area-inset-top))+4.75rem)]"
      }`}
    >
      <button
        type="button"
        onClick={onOpenJourney}
        className="pointer-events-auto flex min-h-11 items-center gap-2 rounded-full border border-ink/10 bg-cream/95 px-3.5 text-xs font-bold text-ink shadow-chip backdrop-blur transition hover:bg-cream active:scale-95"
        aria-label={`${completed} of ${total} quests completed. Open your journey.`}
      >
        <Icon name="flag" className="size-4 text-terracotta" />
        <span className="tabular-nums">{completed}/{total}</span>
        <span className="hidden text-ink-soft min-[390px]:inline">explored</span>
      </button>

      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={onHome}
          className="flex size-11 items-center justify-center rounded-full border border-ink/10 bg-cream/95 text-ink shadow-chip backdrop-blur transition hover:bg-cream active:scale-95"
          aria-label="Center map on Borgo Mocale"
        >
          <Icon name="locate" />
        </button>
        <button
          type="button"
          onClick={onShowAll}
          className="flex size-11 items-center justify-center rounded-full border border-ink/10 bg-cream/95 text-ink shadow-chip backdrop-blur transition hover:bg-cream active:scale-95"
          aria-label="Show all places"
        >
          <Icon name="map" />
        </button>
      </div>
    </div>
  );
}

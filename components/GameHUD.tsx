"use client";

import { useEffect, useState } from "react";
import EnergyBar from "@/components/EnergyBar";

type GameHUDProps = {
  energy: number;
  hunger: number;
  onSearchClick: () => void;
};

// Phase 0: weather is a hardcoded mock. Live weather arrives in Phase 2.
const MOCK_TEMPERATURE = 33;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GameHUD({
  energy,
  hunger,
  onSearchClick,
}: GameHUDProps) {
  // Avoid a server/client hydration mismatch by filling the clock in an effect.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatTime(new Date()));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-cream/95 px-4 py-2.5 shadow-chip backdrop-blur">
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tabular-nums leading-tight">
            {time ?? "--:--"}
          </span>
          <span className="text-[11px] font-medium text-ink-soft">
            ☀️ {MOCK_TEMPERATURE}°C
          </span>
        </div>

        <div className="h-8 w-px bg-ink/10" />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="uppercase tracking-wide text-ink-soft">
              ⚡ Energy
            </span>
            <span className="tabular-nums">{energy}</span>
          </div>
          <EnergyBar value={energy} />
        </div>

        <div className="h-8 w-px bg-ink/10" />

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            🍝
          </span>
          <span className="text-sm font-semibold tabular-nums">{hunger}</span>
        </div>

        <div className="h-8 w-px bg-ink/10" />

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search quests"
          className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-base transition-transform active:scale-90"
        >
          🔍
        </button>
      </div>
    </header>
  );
}

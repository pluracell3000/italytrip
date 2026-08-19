"use client";

import { useEffect, useState } from "react";
import EnergyBar from "@/components/EnergyBar";
import Icon from "@/components/Icon";
import { weatherIcon } from "@/lib/weather";
import type { WeatherSnapshot } from "@/types/game";

type GameHUDProps = {
  energy: number;
  hunger: number;
  onSearchClick: () => void;
  weather: WeatherSnapshot | null;
  weatherStatus: "loading" | "live" | "unavailable";
};

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
  weather,
  weatherStatus,
}: GameHUDProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatTime(new Date()));
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
      <div className="pointer-events-auto flex min-h-14 w-full max-w-[550px] items-center gap-2 rounded-[1.15rem] border border-ink/10 bg-cream/95 px-3 py-2 shadow-chip backdrop-blur-xl sm:gap-3 sm:px-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ink text-cream">
            <Icon name="compass" className="size-[19px]" />
          </span>
          <div className="hidden min-w-0 min-[390px]:block">
            <p className="truncate font-display text-sm font-bold leading-tight">Mocale Quest</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
              Upper Valdarno
            </p>
          </div>
        </div>

        <div className="h-8 w-px shrink-0 bg-ink/10" />

        <div className="flex min-w-[64px] items-center gap-2">
          <Icon
            name={weather ? weatherIcon(weather.weatherCode, weather.isDay) : "cloud-sun"}
            className="size-[18px] text-water"
          />
          <div>
            <p className="text-sm font-bold tabular-nums leading-tight">
              {weather ? `${weather.temperature}°` : time ?? "--:--"}
            </p>
            <p className="max-w-[72px] truncate text-[10px] font-medium text-ink-soft">
              {weather
                ? weather.label
                : weatherStatus === "loading"
                  ? "Updating"
                  : "Local time"}
            </p>
          </div>
        </div>

        <div className="h-8 w-px shrink-0 bg-ink/10" />

        <div className="flex min-w-[78px] flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1 uppercase tracking-[0.1em] text-ink-soft">
              <Icon name="zap" className="size-3 text-olive" />
              Energy
            </span>
            <span className="tabular-nums">{energy}</span>
          </div>
          <EnergyBar value={energy} />
        </div>

        <div
          className="hidden min-w-9 flex-col items-center rounded-xl bg-sand/70 px-2 py-1 min-[430px]:flex"
          aria-label={`Hunger ${hunger} out of 100`}
        >
          <Icon name="utensils" className="size-3.5 text-terracotta" />
          <span className="mt-0.5 text-[11px] font-bold tabular-nums">{hunger}</span>
        </div>

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search quests"
          className="-mr-1 flex size-11 shrink-0 items-center justify-center rounded-xl bg-sand/80 text-ink transition hover:bg-sand active:scale-95"
        >
          <Icon name="search" className="size-[19px]" />
        </button>
      </div>
    </header>
  );
}

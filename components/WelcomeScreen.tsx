"use client";

import Icon from "@/components/Icon";
import useDialog from "@/hooks/useDialog";
import { weatherIcon } from "@/lib/weather";
import type { WeatherSnapshot } from "@/types/game";

type WelcomeScreenProps = {
  weather: WeatherSnapshot | null;
  totalPlaces: number;
  onStart: () => void;
};

export default function WelcomeScreen({
  weather,
  totalPlaces,
  onStart,
}: WelcomeScreenProps) {
  const dialogRef = useDialog<HTMLDivElement>(onStart);

  return (
    <div
      className="absolute inset-0 z-[70] overflow-y-auto bg-parchment px-5 py-[max(1.5rem,env(safe-area-inset-top))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      ref={dialogRef}
    >
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col justify-between py-1 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-ink text-cream shadow-chip">
              <Icon name="compass" className="size-6" />
            </span>
            <div>
              <p className="font-display text-base font-bold leading-none">Mocale Quest</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Valdarno, Tuscany
              </p>
            </div>
          </div>
          <span className="rounded-full border border-ink/10 bg-cream/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Field guide
          </span>
        </div>

        <div className="py-5 sm:py-12">
          <div className="relative mb-5 h-36 overflow-hidden rounded-[1.65rem] bg-forest text-cream shadow-card sm:mb-8 sm:h-48 sm:rounded-[2rem]">
            <div className="welcome-landscape absolute inset-0" />
            <Icon
              name="sun"
              className="absolute right-7 top-6 size-8 text-gold sm:right-8 sm:top-7 sm:size-9"
              strokeWidth={1.4}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/90">
                Today around Borgo Mocale
              </p>
              <p className="mt-1 font-display text-lg font-semibold sm:text-xl">
                A whole valley, ready when you are.
              </p>
            </div>
          </div>

          <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta sm:mb-3 sm:text-xs">
            <Icon name="sparkles" className="size-4" />
            Travel by instinct
          </p>
          <h1
            id="welcome-title"
            className="max-w-sm text-balance font-display text-[2.25rem] font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-[2.65rem]"
          >
            Your day, one good idea at a time.
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-[16px]">
            No rigid itinerary. Open the map and get three thoughtful places that fit the weather, your energy and the hour.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-2.5">
            <div className="rounded-2xl border border-ink/8 bg-cream/80 p-2.5 sm:p-3">
              <Icon
                name={weather ? weatherIcon(weather.weatherCode, weather.isDay) : "cloud-sun"}
                className="size-5 text-water"
              />
              <p className="mt-2 font-display text-lg font-semibold tabular-nums sm:mt-3">
                {weather ? `${weather.temperature}°` : "Live"}
              </p>
              <p className="text-[11px] text-ink-soft">Local weather</p>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-cream/80 p-2.5 sm:p-3">
              <Icon name="map" className="size-5 text-forest" />
              <p className="mt-2 font-display text-lg font-semibold sm:mt-3">{totalPlaces}</p>
              <p className="text-[11px] text-ink-soft">Curated places</p>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-cream/80 p-2.5 sm:p-3">
              <Icon name="route" className="size-5 text-terracotta" />
              <p className="mt-2 font-display text-lg font-semibold sm:mt-3">0–40</p>
              <p className="text-[11px] text-ink-soft">Minutes away</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onStart}
            className="group flex min-h-14 w-full items-center justify-between rounded-2xl bg-terracotta px-5 py-4 text-left text-cream shadow-card transition hover:bg-terracotta-deep active:scale-[0.99]"
          >
            <span>
              <span className="block font-display text-base font-bold">Start exploring</span>
              <span className="mt-0.5 block text-xs text-cream/90">See what fits right now</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-cream/15 transition-transform group-hover:translate-x-0.5">
              <Icon name="chevron-right" />
            </span>
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-soft/80">
            No account needed. Your day is saved on this device.
          </p>
        </div>
      </div>
    </div>
  );
}

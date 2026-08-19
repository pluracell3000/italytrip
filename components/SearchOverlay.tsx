"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { CATEGORY_META } from "@/data/quests";
import useDialog from "@/hooks/useDialog";
import { searchQuests } from "@/lib/search";
import {
  estimateDriveMinutes,
  searchPlaces,
  type DiscoveredPlace,
} from "@/lib/webSearch";
import { cn, formatDelta } from "@/lib/utils";
import type { Quest, QuestMarkerState } from "@/types/game";

type SearchOverlayProps = {
  quests: Quest[];
  markerStates: Record<string, QuestMarkerState>;
  onSelect: (questId: string) => void;
  onDiscover: (place: DiscoveredPlace) => void;
  onClose: () => void;
};

type WebSearchState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "done"; query: string; results: DiscoveredPlace[] }
  | { status: "error"; query: string };

export default function SearchOverlay({
  quests,
  markerStates,
  onSelect,
  onDiscover,
  onClose,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [webSearch, setWebSearch] = useState<WebSearchState>({ status: "idle" });
  const dialogRef = useDialog<HTMLElement>(onClose);
  const results = useMemo(() => searchQuests(quests, query), [quests, query]);
  const trimmedQuery = query.trim();
  const webResultsStale =
    webSearch.status !== "idle" && webSearch.query !== trimmedQuery;

  const runWebSearch = async () => {
    const searchFor = trimmedQuery;
    if (searchFor.length < 3) return;

    setWebSearch({ status: "loading", query: searchFor });
    try {
      const places = await searchPlaces(searchFor);
      setWebSearch({ status: "done", query: searchFor, results: places });
    } catch {
      setWebSearch({ status: "error", query: searchFor });
    }
  };

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
      className="absolute inset-0 z-50 flex flex-col bg-parchment animate-fade-in"
    >
      <h2 id="search-title" className="sr-only">Search places</h2>

      <header className="mx-auto flex w-full max-w-2xl items-center gap-2.5 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
        <div className="flex min-h-12 flex-1 items-center gap-2 rounded-2xl border border-ink/10 bg-cream px-3 shadow-chip">
          <Icon name="search" className="size-[19px] text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gelato, forest, castle, Loro…"
            aria-label="Search places"
            className="min-w-0 flex-1 bg-transparent py-3 text-base font-medium text-ink outline-none placeholder:text-ink-soft/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-ink-soft transition hover:bg-sand/70 active:scale-95"
            >
              <Icon name="x" className="size-[18px]" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-cream shadow-chip transition hover:bg-ink/90 active:scale-95"
          aria-label="Close search"
        >
          <Icon name="x" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-2xl items-end justify-between px-5 pb-2 pt-1">
        <div>
          <p className="eyebrow text-terracotta">Explore the valley</p>
          <p className="mt-0.5 font-display text-lg font-semibold">
            {query ? "Matching places" : "All curated places"}
          </p>
        </div>
        <p className="text-xs font-semibold text-ink-soft tabular-nums">
          {results.length} {results.length === 1 ? "place" : "places"}
        </p>
      </div>

      <div className="search-scrollbar mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4">
        <ul className="space-y-2">
          {results.map((quest) => {
            const meta = CATEGORY_META[quest.category];
            const state = markerStates[quest.id] ?? "available";
            const completed = state === "completed";
            const closed = state === "closed";
            const gains = quest.energyDelta > 0;

            return (
              <li key={quest.id}>
                <button
                  type="button"
                  onClick={() => onSelect(quest.id)}
                  className={cn(
                    "group flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-ink/8 bg-cream p-3 text-left shadow-chip transition hover:border-ink/15 hover:bg-white active:scale-[0.99]",
                    closed && "opacity-[0.65]",
                  )}
                >
                  <span
                    className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
                  >
                    <Icon name={meta.icon} className="size-[21px]" />
                    {completed && (
                      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-forest text-cream ring-2 ring-cream">
                        <Icon name="check" className="size-3" strokeWidth={2.5} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-display text-[15px] font-semibold leading-tight">{quest.name}</span>
                      {closed && (
                        <span className="rounded-full bg-stone/[0.12] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
                          Check ahead
                        </span>
                      )}
                      {quest.isDiscovery && (
                        <span className="rounded-full border border-dashed border-water/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-water">
                          Discovery
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-ink-soft">{quest.place}</span>
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
                      <Icon name="route" className="size-3.5" />
                      {quest.driveMinutes} min
                      <span className="mx-1 size-1 rounded-full bg-ink/20" />
                      {quest.durationLabel}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold tabular-nums text-cream",
                      gains ? "bg-olive" : "bg-terracotta",
                    )}
                  >
                    <Icon name="zap" className="size-3" />
                    {formatDelta(quest.energyDelta)}
                  </span>
                  <Icon name="chevron-right" className="size-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            );
          })}

          {results.length === 0 && (
            <li className="rounded-2xl border border-dashed border-ink/15 bg-cream/55 px-5 py-8 text-center">
              <Icon name="search" className="mx-auto size-7 text-terracotta" />
              <p className="mt-3 font-display text-lg font-semibold">No curated place matches “{query}”.</p>
              <p className="mt-1 text-sm text-ink-soft">Try gelato, forest, castle or a village name.</p>
            </li>
          )}
        </ul>

        {trimmedQuery.length >= 3 && (
          <section className="mt-5 border-t border-ink/10 pt-4" aria-labelledby="wider-map-title">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="eyebrow text-water">Beyond the guide</p>
                <h3 id="wider-map-title" className="mt-0.5 font-display text-base font-semibold">Search the wider map</h3>
              </div>
              <span className="rounded-full border border-dashed border-ink/20 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                Unverified
              </span>
            </div>

            {(webSearch.status === "idle" ||
              webSearch.status === "error" ||
              webResultsStale) && (
              <button
                type="button"
                onClick={() => void runWebSearch()}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-water/25 bg-cream/65 px-4 py-3 text-sm font-bold text-water transition hover:border-water/45 hover:bg-white active:scale-[0.99]"
              >
                <Icon name="compass" className="size-[18px]" />
                Search nearby for “{trimmedQuery}”
              </button>
            )}

            <div aria-live="polite">
              {webSearch.status === "error" && !webResultsStale && (
                <p className="px-1 pt-2 text-xs font-medium text-terracotta">
                  The live map could not be reached. Check your connection and try again.
                </p>
              )}

              {webSearch.status === "loading" && !webResultsStale && (
                <p className="flex items-center justify-center gap-2 px-1 py-4 text-sm font-semibold text-ink-soft animate-pulse">
                  <Icon name="compass" className="size-[18px]" />
                  Searching OpenStreetMap…
                </p>
              )}
            </div>

            {webSearch.status === "done" && !webResultsStale && (
              <ul className="space-y-2">
                {webSearch.results.map((place) => {
                  const meta = CATEGORY_META[place.category];
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => onDiscover(place)}
                        className="group flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-cream/80 p-3 text-left shadow-chip transition hover:border-water/35 hover:bg-white active:scale-[0.99]"
                      >
                        <span
                          className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
                        >
                          <Icon name="locate" className="size-[21px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[15px] font-semibold leading-tight">{place.name}</span>
                          <span className="mt-0.5 block truncate text-xs font-medium text-ink-soft">
                            {place.kind}{place.locality ? ` · ${place.locality}` : ""}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="flex items-center justify-end gap-1 text-[11px] font-semibold text-ink-soft tabular-nums">
                            <Icon name="route" className="size-3.5" />
                            ~{estimateDriveMinutes(place.distanceKm)} min
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1 font-display text-[10px] font-bold uppercase tracking-widest text-water">
                            Pin it
                            <Icon name="chevron-right" className="size-3" />
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}

                {webSearch.results.length === 0 && (
                  <li className="rounded-2xl border border-dashed border-ink/15 bg-cream/55 px-4 py-5 text-center text-sm font-medium text-ink-soft">
                    Nothing nearby matched “{webSearch.query}”.
                  </li>
                )}
              </ul>
            )}

            <p className="px-1 pb-1 pt-2 text-[10px] leading-relaxed text-ink-soft/70">
              Live results © OpenStreetMap contributors. Hours, quality and access have not been verified.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}

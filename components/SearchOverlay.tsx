"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_META } from "@/data/quests";
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
  const [webSearch, setWebSearch] = useState<WebSearchState>({
    status: "idle",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    <div className="absolute inset-0 z-50 flex flex-col bg-parchment animate-fade-in">
      <header className="flex items-center gap-2.5 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-cream px-4 py-3 shadow-chip">
          <span aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gelato, forest, castle, Loro…"
            aria-label="Search quests"
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-ink outline-none placeholder:text-ink-soft/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-sm font-bold text-ink-soft"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="py-2 font-display text-sm font-bold uppercase tracking-widest text-terracotta"
        >
          Close
        </button>
      </header>

      <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
        {query
          ? `${results.length} quest${results.length === 1 ? "" : "s"} found`
          : `All ${results.length} quests · nearest first`}
      </p>

      <div className="flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
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
                    "flex w-full items-center gap-3 rounded-2xl bg-cream p-3 text-left shadow-chip transition-transform active:scale-[0.99]",
                    (completed || closed) && "opacity-60",
                  )}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: `${meta.color}22` }}
                    aria-hidden
                  >
                    {meta.glyph}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] font-bold leading-tight">
                      {quest.name}
                      {completed && " ✓"}
                    </span>
                    <span className="block truncate text-xs font-medium text-ink-soft">
                      {quest.place}
                      {closed && " · closed"}
                      {quest.isDiscovery && " · discovery"}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-xs font-semibold text-ink-soft tabular-nums">
                      🚗 {quest.driveMinutes}m
                    </span>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums text-cream",
                        gains ? "bg-olive" : "bg-terracotta",
                      )}
                    >
                      ⚡ {formatDelta(quest.energyDelta)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-2 pt-4 text-center text-sm font-medium text-ink-soft">
              No quests match “{query}”.
            </li>
          )}
        </ul>

        {trimmedQuery.length >= 3 && (
          <section className="mt-4">
            <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
              From the web · unverified
            </p>

            {(webSearch.status === "idle" ||
              webSearch.status === "error" ||
              webResultsStale) && (
              <button
                type="button"
                onClick={runWebSearch}
                className="w-full rounded-2xl border-2 border-dashed border-ink/20 bg-cream/60 px-4 py-3.5 text-sm font-bold text-ink-soft transition-transform active:scale-[0.99]"
              >
                🌍 Search the wider map for “{trimmedQuery}”
              </button>
            )}

            {webSearch.status === "error" && !webResultsStale && (
              <p className="px-1 pt-2 text-xs font-medium text-terracotta">
                Couldn’t reach the map search service — check your connection
                and try again.
              </p>
            )}

            {webSearch.status === "loading" && (
              <p className="px-1 py-3 text-center text-sm font-semibold text-ink-soft animate-pulse">
                Searching the map…
              </p>
            )}

            {webSearch.status === "done" && !webResultsStale && (
              <ul className="space-y-2">
                {webSearch.results.map((place) => {
                  const meta = CATEGORY_META[place.category];
                  return (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => onDiscover(place)}
                        className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-cream/80 p-3 text-left shadow-chip transition-transform active:scale-[0.99]"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                          style={{ backgroundColor: `${meta.color}22` }}
                          aria-hidden
                        >
                          📍
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[15px] font-bold leading-tight">
                            {place.name}
                          </span>
                          <span className="block truncate text-xs font-medium text-ink-soft">
                            {place.kind}
                            {place.locality ? ` · ${place.locality}` : ""}
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-xs font-semibold text-ink-soft tabular-nums">
                          🚗 ~{estimateDriveMinutes(place.distanceKm)}m
                          <span className="mt-1 block font-display text-[10px] font-bold uppercase tracking-widest text-water">
                            Pin it →
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {webSearch.results.length === 0 && (
                  <li className="px-1 py-2 text-sm font-medium text-ink-soft">
                    Nothing found nearby for “{webSearch.query}”.
                  </li>
                )}
              </ul>
            )}

            <p className="px-1 pt-2 text-[10px] text-ink-soft/60">
              Web results © OpenStreetMap contributors. Unverified — hours,
              quality and access unknown.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

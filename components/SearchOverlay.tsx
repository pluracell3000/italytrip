"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_META } from "@/data/quests";
import { searchQuests } from "@/lib/search";
import { cn, formatDelta } from "@/lib/utils";
import type { Quest, QuestMarkerState } from "@/types/game";

type SearchOverlayProps = {
  quests: Quest[];
  markerStates: Record<string, QuestMarkerState>;
  onSelect: (questId: string) => void;
  onClose: () => void;
};

export default function SearchOverlay({
  quests,
  markerStates,
  onSelect,
  onClose,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchQuests(quests, query), [quests, query]);

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

      <ul className="flex-1 space-y-2 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
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
          <li className="px-2 pt-8 text-center text-sm font-medium text-ink-soft">
            No quests match “{query}”.
            <br />
            Try “gelato”, “forest”, “castle” or a village name.
          </li>
        )}
      </ul>
    </div>
  );
}

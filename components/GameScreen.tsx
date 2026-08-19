"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import ActiveQuestBanner from "@/components/ActiveQuestBanner";
import GameHUD from "@/components/GameHUD";
import Icon from "@/components/Icon";
import JourneySheet from "@/components/JourneySheet";
import MapControls from "@/components/MapControls";
import QuestBottomSheet from "@/components/QuestBottomSheet";
import QuestCompleteOverlay from "@/components/QuestCompleteOverlay";
import SearchOverlay from "@/components/SearchOverlay";
import WelcomeScreen from "@/components/WelcomeScreen";
import WhatNextButton from "@/components/WhatNextButton";
import WhatNextSheet from "@/components/WhatNextSheet";
import { QUESTS } from "@/data/quests";
import useWeather from "@/hooks/useWeather";
import { getRecommendations } from "@/lib/recommendations";
import { clampStat } from "@/lib/utils";
import { discoveryToQuest, type DiscoveredPlace } from "@/lib/webSearch";
import type { Quest, QuestMarkerState, RunState } from "@/types/game";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-parchment">
      <div className="flex flex-col items-center gap-3 text-ink-soft">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-cream shadow-chip animate-pulse">
          <Icon name="map" className="size-5" />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.18em]">Drawing the map</p>
      </div>
    </div>
  ),
});

type Completion = {
  questId: string;
  energyBefore: number;
  energyAfter: number;
};

const STORAGE_KEY = "mocale-quest.run.v1";
const ONBOARDING_KEY = "mocale-quest.onboarded.v1";

const INITIAL_RUN: RunState = {
  startedAt: 0,
  energy: 88,
  hunger: 35,
  activeQuestId: null,
  completedQuestIds: [],
};

function isStoredRun(value: unknown): value is RunState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RunState>;
  return (
    typeof candidate.energy === "number" &&
    typeof candidate.hunger === "number" &&
    Array.isArray(candidate.completedQuestIds) &&
    (candidate.activeQuestId === null || typeof candidate.activeQuestId === "string")
  );
}

export default function GameScreen() {
  const [run, setRun] = useState<RunState>(INITIAL_RUN);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [whatNextOpen, setWhatNextOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [completion, setCompletion] = useState<Completion | null>(null);
  // Live discoveries stay in this browser session and never alter the
  // researched catalog.
  const [webQuests, setWebQuests] = useState<Quest[]>([]);
  const [viewCommand, setViewCommand] = useState<{
    type: "home" | "all";
    nonce: number;
  }>({ type: "home", nonce: 0 });
  const { weather, status: weatherStatus } = useWeather();
  const allQuests = useMemo(() => [...QUESTS, ...webQuests], [webQuests]);

  useEffect(() => {
    try {
      const storedRun = window.localStorage.getItem(STORAGE_KEY);
      if (storedRun) {
        const parsed: unknown = JSON.parse(storedRun);
        if (isStoredRun(parsed)) {
          setRun({
            ...INITIAL_RUN,
            ...parsed,
            startedAt:
              typeof parsed.startedAt === "number" ? parsed.startedAt : 0,
            energy: clampStat(parsed.energy),
            hunger: clampStat(parsed.hunger),
            activeQuestId:
              parsed.activeQuestId &&
              QUESTS.some((quest) => quest.id === parsed.activeQuestId)
                ? parsed.activeQuestId
                : null,
            completedQuestIds: parsed.completedQuestIds.filter((id) =>
              typeof id === "string" && QUESTS.some((quest) => quest.id === id),
            ),
          });
        }
      }
      setWelcomeOpen(window.localStorage.getItem(ONBOARDING_KEY) !== "true");
    } catch {
      setWelcomeOpen(true);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
    } catch {
      // The app remains fully usable when storage is blocked.
    }
  }, [hydrated, run]);

  const recommendations = useMemo(
    () => getRecommendations(allQuests, run, weather),
    [allQuests, run, weather],
  );

  const markerStates = useMemo(() => {
    const recommendedIds = new Set(recommendations.map((item) => item.quest.id));
    const states: Record<string, QuestMarkerState> = {};
    for (const quest of allQuests) {
      if (run.completedQuestIds.includes(quest.id)) {
        states[quest.id] = "completed";
      } else if (quest.id === run.activeQuestId) {
        states[quest.id] = "active";
      } else if (recommendedIds.has(quest.id)) {
        states[quest.id] = "recommended";
      } else {
        states[quest.id] = quest.initialState ?? "available";
      }
    }
    return states;
  }, [allQuests, run, recommendations]);

  const findQuest = (id: string | null | undefined) =>
    id ? allQuests.find((quest) => quest.id === id) : undefined;

  const selectedQuest = findQuest(selectedQuestId) ?? null;
  const activeQuest = findQuest(run.activeQuestId) ?? null;
  const completedQuest = findQuest(completion?.questId) ?? null;
  const completedQuests = run.completedQuestIds
    .map((id) => findQuest(id))
    .filter((quest) => quest !== undefined);

  const handleSelectQuest = (questId: string | null) => {
    setSelectedQuestId(questId);
    if (questId) {
      setWhatNextOpen(false);
      setSearchOpen(false);
      setJourneyOpen(false);
    }
  };

  const handleStartQuest = (questId: string) => {
    setRun((previous) => ({
      ...previous,
      startedAt: previous.startedAt || Date.now(),
      activeQuestId: questId,
    }));
    setSelectedQuestId(null);
    setWhatNextOpen(false);
    setJourneyOpen(false);
  };

  const handleDiscover = (place: DiscoveredPlace) => {
    const quest = discoveryToQuest(place);
    setWebQuests((prev) =>
      prev.some((existing) => existing.id === quest.id)
        ? prev
        : [...prev, quest],
    );
    handleSelectQuest(quest.id);
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = findQuest(questId);
    if (!quest) return;

    setRun((previous) => {
      if (previous.completedQuestIds.includes(questId)) return previous;
      const energyAfter = clampStat(previous.energy + quest.energyDelta);
      const hungerAfter = clampStat(previous.hunger + (quest.hungerDelta ?? 8));
      setCompletion({ questId, energyBefore: previous.energy, energyAfter });
      return {
        ...previous,
        energy: energyAfter,
        hunger: hungerAfter,
        activeQuestId: null,
        completedQuestIds: [...previous.completedQuestIds, questId],
      };
    });
    setSelectedQuestId(null);
  };

  const handleWelcomeStart = () => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // A dismissed welcome screen does not depend on storage availability.
    }
    setRun((previous) => ({
      ...previous,
      startedAt: previous.startedAt || Date.now(),
    }));
    setWelcomeOpen(false);
    window.setTimeout(() => setWhatNextOpen(true), 260);
  };

  const contextLabel = weather
    ? `${weather.temperature}° and ${weather.label.toLowerCase()} around Borgo Mocale · updated live`
    : "Around Borgo Mocale · tuned to your energy and the time of day";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-parchment">
      <MapView
        quests={allQuests}
        markerStates={markerStates}
        selectedQuestId={selectedQuestId}
        activeQuestId={run.activeQuestId}
        viewCommand={viewCommand}
        onSelectQuest={handleSelectQuest}
      />

      <GameHUD
        energy={run.energy}
        hunger={run.hunger}
        onSearchClick={() => setSearchOpen(true)}
        weather={weather}
        weatherStatus={weatherStatus}
      />

      {activeQuest && (
        <ActiveQuestBanner
          quest={activeQuest}
          energy={run.energy}
          onComplete={handleCompleteQuest}
          onCancel={() => setRun((previous) => ({ ...previous, activeQuestId: null }))}
        />
      )}

      {!selectedQuest &&
        !whatNextOpen &&
        !journeyOpen &&
        !completion &&
        !searchOpen && (
        <MapControls
          completed={run.completedQuestIds.length}
          total={allQuests.length}
          active={Boolean(activeQuest)}
          onHome={() =>
            setViewCommand((previous) => ({ type: "home", nonce: previous.nonce + 1 }))
          }
          onShowAll={() =>
            setViewCommand((previous) => ({ type: "all", nonce: previous.nonce + 1 }))
          }
          onOpenJourney={() => setJourneyOpen(true)}
        />
      )}

      {!activeQuest &&
        !selectedQuest &&
        !whatNextOpen &&
        !journeyOpen &&
        !completion &&
        !searchOpen && (
        <WhatNextButton onClick={() => setWhatNextOpen(true)} />
      )}

      {searchOpen && (
        <SearchOverlay
          quests={allQuests}
          markerStates={markerStates}
          onSelect={handleSelectQuest}
          onDiscover={handleDiscover}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {selectedQuest && (
        <QuestBottomSheet
          quest={selectedQuest}
          state={markerStates[selectedQuest.id] ?? "available"}
          energy={run.energy}
          hasAnotherActiveQuest={Boolean(
            activeQuest && activeQuest.id !== selectedQuest.id,
          )}
          onStart={handleStartQuest}
          onComplete={handleCompleteQuest}
          onClose={() => setSelectedQuestId(null)}
        />
      )}

      {whatNextOpen && (
        <WhatNextSheet
          recommendations={recommendations}
          contextLabel={contextLabel}
          onStart={handleStartQuest}
          onInspect={handleSelectQuest}
          onClose={() => setWhatNextOpen(false)}
        />
      )}

      {journeyOpen && (
        <JourneySheet
          completed={completedQuests}
          activeQuest={activeQuest}
          total={allQuests.length}
          onInspect={handleSelectQuest}
          onClose={() => setJourneyOpen(false)}
        />
      )}

      {completion && completedQuest && (
        <QuestCompleteOverlay
          quest={completedQuest}
          energyBefore={completion.energyBefore}
          energyAfter={completion.energyAfter}
          onWhatNext={() => {
            setCompletion(null);
            setWhatNextOpen(true);
          }}
          onDismiss={() => setCompletion(null)}
        />
      )}

      {hydrated && welcomeOpen && (
        <WelcomeScreen
          weather={weather}
          totalPlaces={QUESTS.length}
          onStart={handleWelcomeStart}
        />
      )}
    </main>
  );
}

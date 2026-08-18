"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import ActiveQuestBanner from "@/components/ActiveQuestBanner";
import GameHUD from "@/components/GameHUD";
import QuestBottomSheet from "@/components/QuestBottomSheet";
import QuestCompleteOverlay from "@/components/QuestCompleteOverlay";
import WhatNextButton from "@/components/WhatNextButton";
import WhatNextSheet from "@/components/WhatNextSheet";
import { QUESTS, getQuestById } from "@/data/quests";
import { getMockRecommendations } from "@/lib/recommendations";
import { clampStat } from "@/lib/utils";
import type { QuestMarkerState, RunState } from "@/types/game";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-parchment">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-ink-soft animate-pulse">
        Preparing the map…
      </p>
    </div>
  ),
});

type Completion = {
  questId: string;
  energyBefore: number;
  energyAfter: number;
};

// Phase 0 starts mid-run so the HUD feels alive. The Start Now entry screen
// and localStorage persistence arrive in Phase 1.
const INITIAL_RUN: RunState = {
  startedAt: 0,
  energy: 88,
  hunger: 35,
  activeQuestId: null,
  completedQuestIds: [],
};

export default function GameScreen() {
  const [run, setRun] = useState<RunState>(INITIAL_RUN);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [whatNextOpen, setWhatNextOpen] = useState(false);
  const [completion, setCompletion] = useState<Completion | null>(null);

  const recommendations = useMemo(
    () => getMockRecommendations(QUESTS, run),
    [run],
  );

  const markerStates = useMemo(() => {
    const recommendedIds = new Set(recommendations.map((r) => r.quest.id));
    const states: Record<string, QuestMarkerState> = {};
    for (const quest of QUESTS) {
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
  }, [run, recommendations]);

  const selectedQuest = selectedQuestId ? getQuestById(selectedQuestId) : null;
  const activeQuest = run.activeQuestId
    ? getQuestById(run.activeQuestId)
    : null;
  const completedQuest = completion ? getQuestById(completion.questId) : null;

  const handleSelectQuest = (questId: string | null) => {
    setSelectedQuestId(questId);
    if (questId) setWhatNextOpen(false);
  };

  const handleStartQuest = (questId: string) => {
    setRun((prev) => ({ ...prev, activeQuestId: questId }));
    setSelectedQuestId(null);
    setWhatNextOpen(false);
  };

  const handleCancelQuest = () => {
    setRun((prev) => ({ ...prev, activeQuestId: null }));
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = getQuestById(questId);
    if (!quest) return;

    setRun((prev) => {
      const energyAfter = clampStat(prev.energy + quest.energyDelta);
      // Activity makes you hungry unless the quest itself was food.
      const hungerAfter = clampStat(prev.hunger + (quest.hungerDelta ?? 8));
      setCompletion({
        questId,
        energyBefore: prev.energy,
        energyAfter,
      });
      return {
        ...prev,
        energy: energyAfter,
        hunger: hungerAfter,
        activeQuestId: null,
        completedQuestIds: [...prev.completedQuestIds, questId],
      };
    });
    setSelectedQuestId(null);
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-parchment">
      <MapView
        quests={QUESTS}
        markerStates={markerStates}
        selectedQuestId={selectedQuestId}
        activeQuestId={run.activeQuestId}
        onSelectQuest={handleSelectQuest}
      />

      <GameHUD energy={run.energy} hunger={run.hunger} />

      {activeQuest && (
        <ActiveQuestBanner
          quest={activeQuest}
          energy={run.energy}
          onComplete={handleCompleteQuest}
          onCancel={handleCancelQuest}
        />
      )}

      {!selectedQuest && !whatNextOpen && !completion && (
        <WhatNextButton onClick={() => setWhatNextOpen(true)} />
      )}

      {selectedQuest && (
        <QuestBottomSheet
          quest={selectedQuest}
          state={markerStates[selectedQuest.id] ?? "available"}
          energy={run.energy}
          onStart={handleStartQuest}
          onComplete={handleCompleteQuest}
          onClose={() => setSelectedQuestId(null)}
        />
      )}

      {whatNextOpen && (
        <WhatNextSheet
          recommendations={recommendations}
          onStart={handleStartQuest}
          onInspect={handleSelectQuest}
          onClose={() => setWhatNextOpen(false)}
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
    </main>
  );
}

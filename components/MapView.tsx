"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map as MaplibreMap, Marker } from "maplibre-gl";
import { BASE_LOCATION } from "@/data/quests";
import { arcCoordinates } from "@/lib/geo";
import { MAP_STYLE } from "@/lib/mapStyle";
import type { Quest, QuestMarkerState } from "@/types/game";
import {
  createPlayerMarkerElement,
  createQuestMarkerElement,
  updateQuestMarkerElement,
} from "@/components/QuestMarker";

const ROUTE_SOURCE_ID = "quest-route";
const ROUTE_LAYER_ID = "quest-route-line";

type MapViewProps = {
  quests: Quest[];
  markerStates: Record<string, QuestMarkerState>;
  selectedQuestId: string | null;
  activeQuestId: string | null;
  onSelectQuest: (questId: string | null) => void;
};

export default function MapView({
  quests,
  markerStates,
  selectedQuestId,
  activeQuestId,
  onSelectQuest,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Record<string, HTMLElement>>({});
  const onSelectRef = useRef(onSelectQuest);
  onSelectRef.current = onSelectQuest;

  // Create the map + markers once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [11.6, 43.6],
      zoom: 10.1,
      minZoom: 8.5,
      maxZoom: 15.5,
      attributionControl: { compact: true },
      pitchWithRotate: false,
      dragRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    mapRef.current = map;

    map.on("click", () => onSelectRef.current(null));

    map.on("load", () => {
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#C4572E",
          "line-width": 4,
          "line-dasharray": [0.1, 1.8],
          "line-opacity": 0.9,
        },
      });
    });

    new Marker({ element: createPlayerMarkerElement() })
      .setLngLat([BASE_LOCATION.longitude, BASE_LOCATION.latitude])
      .addTo(map);

    const markerElements: Record<string, HTMLElement> = {};
    for (const quest of quests) {
      const element = createQuestMarkerElement(quest, (id) =>
        onSelectRef.current(id),
      );
      new Marker({ element })
        .setLngLat([quest.longitude, quest.latitude])
        .addTo(map);
      markerElements[quest.id] = element;
    }
    markersRef.current = markerElements;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // Quests are a static catalog in Phase 0.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect marker states + selection onto the DOM elements.
  useEffect(() => {
    for (const quest of quests) {
      const element = markersRef.current[quest.id];
      if (!element) continue;
      updateQuestMarkerElement(
        element,
        markerStates[quest.id] ?? "available",
        quest.id === selectedQuestId,
      );
    }
  }, [quests, markerStates, selectedQuestId]);

  // Ease the camera toward a selected quest, leaving room for the sheet.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedQuestId) return;
    const quest = quests.find((q) => q.id === selectedQuestId);
    if (!quest) return;
    map.easeTo({
      center: [quest.longitude, quest.latitude],
      offset: [0, -140],
      duration: 650,
    });
  }, [quests, selectedQuestId]);

  // Draw / clear the route trail for the active quest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyRoute = () => {
      const source = map.getSource(ROUTE_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;
      if (!source) return;

      const quest = activeQuestId
        ? quests.find((q) => q.id === activeQuestId)
        : undefined;

      if (!quest) {
        source.setData({ type: "FeatureCollection", features: [] });
        return;
      }

      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: arcCoordinates(BASE_LOCATION, quest),
        },
      });

      map.fitBounds(
        [
          [
            Math.min(BASE_LOCATION.longitude, quest.longitude),
            Math.min(BASE_LOCATION.latitude, quest.latitude),
          ],
          [
            Math.max(BASE_LOCATION.longitude, quest.longitude),
            Math.max(BASE_LOCATION.latitude, quest.latitude),
          ],
        ],
        { padding: { top: 140, bottom: 220, left: 60, right: 60 }, duration: 800 },
      );
    };

    if (map.isStyleLoaded()) {
      applyRoute();
    } else {
      map.once("load", applyRoute);
    }
  }, [quests, activeQuestId]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

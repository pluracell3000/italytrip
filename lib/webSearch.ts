import { BASE_LOCATION } from "@/data/quests";
import { haversineKm } from "@/lib/geo";
import type { Quest, QuestCategory } from "@/types/game";

// Live web discovery — the "easiest accessible" option: OpenStreetMap data
// via the free Photon geocoding API (photon.komoot.io). No API key, no
// backend, CORS-open, so it works from a static GitHub Pages site.
// Results are unverified leads: they become session-only "discovery" quests,
// never part of the curated catalog. Data © OpenStreetMap contributors.

export type DiscoveredPlace = {
  id: string;
  name: string;
  /** Human label derived from OSM tags, e.g. "restaurant", "viewpoint". */
  kind: string;
  locality: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  category: QuestCategory;
};

const PHOTON_ENDPOINT = "https://photon.komoot.io/api/";
/** Keep discoveries same-day-realistic; drop far-away geocoder noise. */
const MAX_DISTANCE_KM = 150;

function inferCategory(
  osmKey: string,
  osmValue: string,
  name: string,
): QuestCategory {
  const value = osmValue.toLowerCase();
  const lowerName = name.toLowerCase();

  if (value.includes("ice_cream") || lowerName.includes("gelat")) return "gelato";
  if (value === "pizzeria" || lowerName.includes("pizz")) return "pizza";

  switch (osmKey) {
    case "amenity":
      if (["restaurant", "fast_food", "food_court", "cafe", "bar", "pub", "biergarten"].includes(value))
        return "food";
      if (value === "fountain" || value === "drinking_water") return "water";
      return "village";
    case "tourism":
      if (value === "museum" || value === "gallery") return "rainsafe";
      if (value === "viewpoint") return "sunset";
      return "village";
    case "historic":
      return "village";
    case "natural":
      if (["water", "spring", "bay", "beach"].includes(value)) return "water";
      if (value === "peak" || value === "cliff") return "sunset";
      return "nature";
    case "waterway":
    case "water":
      return "water";
    case "leisure":
      if (["park", "nature_reserve", "garden"].includes(value)) return "nature";
      if (["swimming_pool", "water_park", "beach_resort"].includes(value)) return "water";
      return "nature";
    case "landuse":
      if (value === "forest" || value === "meadow") return "nature";
      if (value === "farmland" || value === "farmyard") return "farm";
      return "nature";
    case "shop":
      return ["bakery", "deli", "pastry", "confectionery", "wine"].includes(value)
        ? "food"
        : "village";
    case "place":
      return "village";
    default:
      return "village";
  }
}

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    osm_id?: number;
    osm_type?: string;
    name?: string;
    osm_key?: string;
    osm_value?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

/**
 * Searches OpenStreetMap for places matching the query, biased toward
 * Borgo Mocale, nearest first. Throws on network failure — callers show
 * a graceful "couldn't reach" state.
 */
export async function searchPlaces(query: string): Promise<DiscoveredPlace[]> {
  const url =
    `${PHOTON_ENDPOINT}?q=${encodeURIComponent(query)}` +
    `&lat=${BASE_LOCATION.latitude}&lon=${BASE_LOCATION.longitude}` +
    `&limit=10&lang=en`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Photon responded ${response.status}`);
  const data = (await response.json()) as { features?: PhotonFeature[] };

  const places: DiscoveredPlace[] = [];
  for (const feature of data.features ?? []) {
    const props = feature.properties ?? {};
    const coords = feature.geometry?.coordinates;
    if (!props.name || !coords) continue;

    const [longitude, latitude] = coords;
    const distanceKm = haversineKm(BASE_LOCATION, { latitude, longitude });
    if (distanceKm > MAX_DISTANCE_KM) continue;

    const osmKey = props.osm_key ?? "";
    const osmValue = props.osm_value ?? "";
    places.push({
      id: `web-${props.osm_type ?? "x"}-${props.osm_id ?? places.length}`,
      name: props.name,
      kind: (osmValue || osmKey || "place").replaceAll("_", " "),
      locality: [props.city ?? props.town ?? props.village, props.county ?? props.state]
        .filter(Boolean)
        .join(", "),
      latitude,
      longitude,
      distanceKm,
      category: inferCategory(osmKey, osmValue, props.name),
    });
  }

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Rough drive estimate for local winding roads (~40 km/h + overhead). */
export function estimateDriveMinutes(distanceKm: number): number {
  return Math.max(1, Math.round(3 + distanceKm * 1.5));
}

const DISCOVERY_ENERGY: Partial<Record<QuestCategory, number>> = {
  food: +20,
  pizza: +20,
  gelato: +10,
};
const DISCOVERY_HUNGER: Partial<Record<QuestCategory, number>> = {
  food: -50,
  pizza: -55,
  gelato: -15,
};

/** Converts a web discovery into a playable session-only quest. */
export function discoveryToQuest(place: DiscoveredPlace): Quest {
  const driveMinutes = estimateDriveMinutes(place.distanceKm);
  return {
    id: place.id,
    name: place.name,
    place: place.locality || `${place.distanceKm.toFixed(0)} km from base`,
    category: place.category,
    latitude: place.latitude,
    longitude: place.longitude,
    whyGo:
      "Discovered via live map search — no research has vetted this one. Scout it and judge for yourself.",
    chips: [place.kind, "Discovery"],
    note: "Unverified web discovery: hours, quality and access unknown. Drive time is a straight-line estimate.",
    driveMinutes,
    durationLabel: "Your call",
    effortLabel: "Unknown",
    bestTimeLabel: "Anytime",
    energyDelta: DISCOVERY_ENERGY[place.category] ?? -8,
    hungerDelta: DISCOVERY_HUNGER[place.category],
    rainCompatible: "partial",
    isDiscovery: true,
  };
}

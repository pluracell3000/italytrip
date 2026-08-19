import type { Quest } from "@/types/game";

// Live "Google Maps"-style enrichment: rating, review count, open-now and
// today's hours, via the Places API (New) — the version Google built for
// browser use with HTTP-referrer-restricted keys, so it works from a static
// site with no backend.
//
// The key ships in the client bundle by design (NEXT_PUBLIC_*); protect it
// in Google Cloud Console by restricting it to this site's origin and to
// the Places API only. Without a key the feature silently disables.

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY ?? "";

export const placesEnabled = API_KEY.length > 0;

export type PlaceLiveInfo = {
  rating?: number;
  ratingCount?: number;
  openNow?: boolean;
  /** Today's line from Google's weekday descriptions, e.g. "Monday: 10 AM–7 PM". */
  todayHours?: string;
  matchedName?: string;
};

type PlacesSearchResponse = {
  places?: {
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    currentOpeningHours?: { openNow?: boolean };
    regularOpeningHours?: { weekdayDescriptions?: string[] };
    businessStatus?: string;
  }[];
};

// Session cache: one lookup per quest per visit.
const cache = new Map<string, PlaceLiveInfo | null>();

function todayIndex(): number {
  // Google's weekdayDescriptions start on Monday; JS getDay() starts Sunday.
  return (new Date().getDay() + 6) % 7;
}

/**
 * Looks the quest up on Google and returns rating / open-now / today's
 * hours, or null when Google has no confident match. Never throws — a
 * failed lookup renders as "no live info".
 */
export async function fetchPlaceLiveInfo(
  quest: Quest,
): Promise<PlaceLiveInfo | null> {
  if (!placesEnabled || quest.category === "base") return null;
  const cached = cache.get(quest.id);
  if (cached !== undefined) return cached;

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": [
            "places.displayName",
            "places.rating",
            "places.userRatingCount",
            "places.currentOpeningHours.openNow",
            "places.regularOpeningHours.weekdayDescriptions",
            "places.businessStatus",
          ].join(","),
        },
        body: JSON.stringify({
          textQuery: quest.isDiscovery
            ? `${quest.name}, ${quest.place}`
            : quest.place,
          locationBias: {
            circle: {
              center: { latitude: quest.latitude, longitude: quest.longitude },
              radius: 3000,
            },
          },
          pageSize: 1,
          languageCode: "en",
        }),
      },
    );
    if (!response.ok) throw new Error(`Places responded ${response.status}`);

    const data = (await response.json()) as PlacesSearchResponse;
    const place = data.places?.[0];
    if (!place || place.businessStatus === "CLOSED_PERMANENTLY") {
      cache.set(quest.id, null);
      return null;
    }

    const info: PlaceLiveInfo = {
      rating: place.rating,
      ratingCount: place.userRatingCount,
      openNow: place.currentOpeningHours?.openNow,
      todayHours:
        place.regularOpeningHours?.weekdayDescriptions?.[todayIndex()],
      matchedName: place.displayName?.text,
    };
    // Nothing useful came back — treat as no match.
    const hasContent =
      info.rating !== undefined || info.openNow !== undefined;
    cache.set(quest.id, hasContent ? info : null);
    return hasContent ? info : null;
  } catch {
    // Network / quota / key problems: fail quiet, retry next card open.
    return null;
  }
}

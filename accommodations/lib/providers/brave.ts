import { z } from "zod";
import type { Provider } from "./types";
import { canonicalUrl } from "../domain";
import { validateUrl } from "./safe-fetch";
const responseSchema = z.object({
  web: z
    .object({
      results: z.array(z.object({ title: z.string(), url: z.string().url() })),
    })
    .optional(),
});
export const brave: Provider = {
  name: "Brave Search",
  capabilities: { discovery: true, details: false, datedOffers: false },
  async discoverCandidates(_config, query, baseId) {
    const key = process.env.BRAVE_SEARCH_API_KEY;
    if (!key) throw new Error("BRAVE_KEY_MISSING");
    if (process.env.BRAVE_STORAGE_RIGHTS_CONFIRMED !== "true")
      throw new Error("BRAVE_STORAGE_RIGHTS_REQUIRED");
    const u = new URL("https://api.search.brave.com/res/v1/web/search");
    u.searchParams.set("q", query);
    u.searchParams.set("count", "10");
    u.searchParams.set("country", "IT");
    u.searchParams.set("safesearch", "strict");
    const res = await fetch(u, {
      headers: { "X-Subscription-Token": key, Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("BRAVE_HTTP_" + res.status);
    const parsed = responseSchema.parse(await res.json());
    return (parsed.web?.results ?? []).flatMap((r) => {
      try {
        canonicalUrl(r.url);
        validateUrl(r.url);
        return [
          {
            name: r.title.replace(/<[^>]*>/g, "").slice(0, 160),
            url: r.url,
            baseId,
          },
        ];
      } catch {
        return [];
      }
    });
  },
  async fetchPropertyDetails() {
    return { outcome: "unsupported", facts: [] };
  },
  async checkDatedOffer() {
    return { outcome: "unsupported", availability: "unknown" };
  },
  async healthCheck() {
    return {
      configured: !!process.env.BRAVE_SEARCH_API_KEY,
      message: process.env.BRAVE_SEARCH_API_KEY
        ? "Configured; scan history establishes actual health"
        : "BRAVE_SEARCH_API_KEY missing",
    };
  },
};
export function queries(config: import("../config").Config, rotation: number) {
  const styles = [
    "appartamento terrazza cucina parcheggio",
    "self catering apartment private balcony parking",
    "agriturismo appartamento giardino privato",
    "apartment natural light ground floor heating",
  ];
  return Array.from({ length: config.queryLimit }, (_, i) => {
    const base = config.bases[i % config.bases.length];
    const n = Math.floor(i / config.bases.length) + rotation;
    return {
      baseId: base.id,
      query: `${base.towns[n % base.towns.length]} ${styles[n % styles.length]} within ${base.radiusKm} km Italia -site:tripadvisor.com -site:pinterest.com`,
    };
  });
}

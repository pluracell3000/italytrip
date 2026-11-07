import { load } from "cheerio";
import type { Provider, Detail } from "./types";
import { permittedPage } from "./safe-fetch";
const restricted = [
  "booking.com",
  "airbnb.com",
  "vrbo.com",
  "agriturismo.it",
  "expedia.com",
];
export function restrictedHost(url: string) {
  const host = new URL(url).hostname;
  return restricted.some((h) => host === h || host.endsWith("." + h));
}
export function extractDetails(html: string): Detail[] {
  const $ = load(html);
  const facts: Detail[] = [];
  // Only exact structured facts; property-level evidence never becomes unit amenities.
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      const visit = (node: any, depth = 0) => {
        if (depth > 8 || !node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          node.slice(0, 100).forEach((n) => visit(n, depth + 1));
          return;
        }
        const type = String(node["@type"] || "");
        if (
          /LodgingBusiness|Hotel|Apartment|VacationRental|Accommodation/.test(
            type,
          )
        ) {
          if (typeof node.name === "string")
            facts.push({
              field: "sourceName",
              value: node.name.slice(0, 160),
              scope: "property",
            });
          if (
            node.geo &&
            Number.isFinite(Number(node.geo.latitude)) &&
            Number.isFinite(Number(node.geo.longitude))
          )
            facts.push({
              field: "coordinates",
              value: {
                lat: Number(node.geo.latitude),
                lng: Number(node.geo.longitude),
              },
              scope: "property",
            });
          for (const amenity of (Array.isArray(node.amenityFeature)
            ? node.amenityFeature
            : []
          ).slice(0, 30))
            if (
              typeof amenity.name === "string" &&
              (typeof amenity.value === "boolean" ||
                typeof amenity.value === "string")
            )
              facts.push({
                field: "sourceAmenity",
                value: {
                  name: amenity.name.slice(0, 100),
                  value: amenity.value,
                },
                scope: "property",
              });
        }
        if (node["@graph"]) visit(node["@graph"], depth + 1);
      };
      visit(data);
    } catch {
      /* Invalid structured data is not evidence. */
    }
  });
  return facts.slice(0, 40);
}
export const publicWeb: Provider = {
  name: "Public owner websites",
  capabilities: { discovery: false, details: true, datedOffers: false },
  async discoverCandidates() {
    return [];
  },
  async fetchPropertyDetails(p) {
    if (restrictedHost(p.url)) return { outcome: "unsupported", facts: [] };
    try {
      const page = await permittedPage(p.url);
      if (
        [401, 403, 429].includes(page.status) ||
        /captcha|cf-chl-|verify you are human/i.test(page.text)
      )
        return { outcome: "blocked", facts: [] };
      if (page.status !== 200) return { outcome: "error", facts: [] };
      return { outcome: "success", facts: extractDetails(page.text) };
    } catch (e) {
      return {
        outcome: /ROBOTS|CRAWL_DELAY|UNSAFE|REDIRECT/.test(String(e))
          ? "blocked"
          : "error",
        facts: [],
      };
    }
  },
  async checkDatedOffer() {
    return { outcome: "unsupported", availability: "unknown" };
  },
  async healthCheck() {
    return {
      configured: true,
      message: "Public HTTPS pages only; robots respected; no dated inventory",
    };
  },
};

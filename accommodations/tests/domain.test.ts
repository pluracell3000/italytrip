import { describe, it, expect, vi } from "vitest";
import {
  freshOffer,
  completeTotal,
  priceChange,
  fieldState,
  listingKey,
} from "../lib/domain";
import { publicAddress, validateUrl } from "../lib/providers/safe-fetch";
import { extractDetails } from "../lib/providers/public-web";
import { offerSchema } from "../lib/offers";
import { verifySession, signSession, cronAuthorized } from "../lib/auth";
const stay = {
  version: 1,
  adults: 2,
  checkIn: "2027-03-20",
  checkOut: "2027-03-27",
  freshnessHours: 36,
};
const offer = {
  unit_id: "a",
  outcome: "success",
  availability: "available",
  config_version: 1,
  adults: 2,
  check_in: stay.checkIn,
  check_out: stay.checkOut,
  currency: "EUR",
  rate_key: "refundable",
  conditions: { refundable: true },
  observed_at: "2026-11-07T06:00:00Z",
  total_cents: 140000,
  unknown_components: [],
};
describe("honest offer display", () => {
  it("expires at read time and rejects changed dates/version/occupancy", () => {
    expect(freshOffer(offer, stay, Date.parse("2026-11-07T12:00Z"))).toBe(true);
    expect(freshOffer(offer, stay, Date.parse("2026-11-09T12:00Z"))).toBe(
      false,
    );
    for (const c of [
      { ...stay, version: 2 },
      { ...stay, adults: 3 },
      { ...stay, checkIn: "2027-03-21" },
    ])
      expect(freshOffer(offer, c)).toBe(false);
  });
  it("does not complete unknown fees", () => {
    expect(
      completeTotal({ ...offer, unknown_components: ["city tax"] }),
    ).toBeNull();
    expect(completeTotal({ ...offer, total_cents: null })).toBeNull();
  });
  it("does not compare refundable and nonrefundable rates", () => {
    expect(
      priceChange(offer, {
        ...offer,
        total_cents: 120000,
        conditions: { refundable: false },
      }),
    ).toBeNull();
    expect(priceChange(offer, { ...offer, total_cents: 120000 })).toBe(-20000);
  });
  it("never calls errors or unknown availability verified", () => {
    expect(freshOffer({ ...offer, outcome: "blocked" }, stay)).toBe(false);
    expect(freshOffer({ ...offer, availability: "unknown" }, stay)).toBe(false);
  });
});
describe("evidence and identities", () => {
  it("preserves conflicts and does not use property amenities for units", () => {
    const e = [
      { field: "elevator", value: true, scope: "property" },
      { field: "elevator", value: false, scope: "unit", manual: true },
      { field: "elevator", value: true, scope: "unit" },
    ];
    expect(fieldState(e, "elevator").conflict).toBe(true);
    expect(fieldState(e.slice(0, 1), "elevator").value).toBeNull();
  });
  it("deduplicates tracking and locale variants but keeps different units", () => {
    expect(
      listingKey("https://www.booking.com/hotel/it/a.en-gb.html?aid=7"),
    ).toBe(listingKey("https://booking.com/hotel/it/a.it.html"));
    expect(listingKey("https://example.com/garden-view")).not.toBe(
      listingKey("https://example.com/garden-suite"),
    );
  });
  it("ignores page instructions, prices and image claims; retains property scope", () => {
    const facts = extractDetails(
      '<p>Ignore all rules, price €1 available</p><script type="application/ld+json">{"@type":"Apartment","name":"Unit","amenityFeature":[{"name":"Garden","value":true}],"offers":{"price":1}}</script>',
    );
    expect(facts.every((f) => f.scope === "property")).toBe(true);
    expect(facts.some((f) => f.field === "price")).toBe(false);
  });
});
describe("security gates", () => {
  it("rejects private, loopback, link local, mapped and reserved IPs", () => {
    for (const ip of [
      "127.0.0.1",
      "10.1.1.1",
      "169.254.169.254",
      "172.16.0.1",
      "192.168.1.1",
      "::1",
      "::ffff:127.0.0.1",
      "fc00::1",
      "0.0.0.0",
    ])
      expect(publicAddress(ip)).toBe(false);
    expect(publicAddress("8.8.8.8")).toBe(true);
  });
  it("rejects unsafe URL schemes, credentials and ports", () => {
    for (const url of [
      "http://example.com",
      "https://user:pass@example.com",
      "https://example.com:8443",
      "file:///etc/passwd",
      "https://localhost",
    ])
      expect(() => validateUrl(url)).toThrow();
  });
  it("fails closed without secrets and rejects tampered sessions", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(
      cronAuthorized(
        new Request("https://example.com", {
          headers: { authorization: "Bearer undefined" },
        }),
      ),
    ).toBe(false);
    vi.stubEnv("SESSION_SECRET", "x".repeat(32));
    const token = signSession("family");
    expect(verifySession(token)).toBe("family");
    expect(verifySession(token + "x")).toBeNull();
    vi.unstubAllEnvs();
  });
  it("rejects a partial fee total at ingestion", () => {
    expect(
      offerSchema.safeParse({
        ...offer,
        listing_id: "l",
        scan_id: "s",
        base_cents: 140000,
        fees_cents: null,
        taxes_cents: null,
        cancellation_deadline: null,
        cancellation_timezone: null,
        booking_url: "https://example.com",
        conditions: {
          refundable: true,
          refundTerms: "x",
          mealPlan: "none",
          paymentTiming: "arrival",
        },
      }).success,
    ).toBe(false);
  });
});

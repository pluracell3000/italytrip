import { createHash } from "node:crypto";
export const id = () => crypto.randomUUID();
export function canonicalUrl(raw: string) {
  const u = new URL(raw);
  if (u.protocol !== "https:" || u.username || u.password || u.port)
    throw new Error("HTTPS_URL_REQUIRED");
  u.hash = "";
  for (const key of [...u.searchParams.keys()])
    if (/^(utm_|fbclid|gclid|aid$|label$)/i.test(key))
      u.searchParams.delete(key);
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
  u.pathname = u.pathname.replace(/\/$/, "") || "/";
  u.searchParams.sort();
  return u.toString();
}
export function listingKey(raw: string) {
  const u = new URL(canonicalUrl(raw));
  const booking =
    u.hostname === "booking.com" &&
    u.pathname.match(/\/hotel\/([^/]+)\/([^/.]+)/);
  if (booking) return `booking:${booking[1]}:${booking[2]}`;
  const air = u.hostname === "airbnb.com" && u.pathname.match(/\/rooms\/(\d+)/);
  if (air) return `airbnb:${air[1]}`;
  return canonicalUrl(raw);
}
export function stableId(raw: string) {
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}
export const nights = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
export function completeTotal(o: any): number | null {
  return o && o.total_cents != null && o.unknown_components?.length === 0
    ? Number(o.total_cents)
    : null;
}
export function freshOffer(
  o: any,
  c: {
    version: number;
    adults: number;
    checkIn: string;
    checkOut: string;
    freshnessHours: number;
  },
  now = Date.now(),
) {
  return (
    !!o &&
    o.outcome === "success" &&
    o.availability === "available" &&
    o.config_version === c.version &&
    o.adults === c.adults &&
    dateKey(o.check_in) === c.checkIn &&
    dateKey(o.check_out) === c.checkOut &&
    now - Date.parse(o.observed_at) <= c.freshnessHours * 3600000 &&
    now >= Date.parse(o.observed_at)
  );
}
function dateKey(v: any) {
  return v instanceof Date
    ? v.toISOString().slice(0, 10)
    : String(v).slice(0, 10);
}
function stable(v: any): string {
  return v && typeof v === "object"
    ? Array.isArray(v)
      ? "[" + v.map(stable).join(",") + "]"
      : "{" +
        Object.keys(v)
          .sort()
          .map((k) => JSON.stringify(k) + ":" + stable(v[k]))
          .join(",") +
        "}"
    : JSON.stringify(v);
}
export function equivalent(a: any, b: any) {
  return (
    [
      "unit_id",
      "check_in",
      "check_out",
      "adults",
      "currency",
      "rate_key",
      "config_version",
    ].every((k) => String(a[k]) === String(b[k])) &&
    stable(a.conditions) === stable(b.conditions)
  );
}
export function priceChange(a: any, b: any) {
  const x = completeTotal(a),
    y = completeTotal(b);
  return equivalent(a, b) &&
    a.outcome === "success" &&
    b.outcome === "success" &&
    x !== null &&
    y !== null
    ? y - x
    : null;
}
export function fieldState(evidence: any[], field: string) {
  const e = evidence.filter((e) => e.field === field && e.scope === "unit");
  const values = [...new Set(e.map((x) => JSON.stringify(x.value)))];
  return {
    value: values.length === 1 ? e[0].value : null,
    conflict: values.length > 1,
    evidence: e,
  };
}
export function suitability(evidence: any[]) {
  return Object.entries({
    privateOutdoor: 20,
    daylight: 10,
    kitchen: 15,
    heating: 10,
    airConditioning: 5,
    parking: 10,
    manageableAccess: 15,
  }).reduce(
    (sum, [field, weight]) =>
      sum + (fieldState(evidence, field).value === true ? weight : 0),
    0,
  );
}

export function geography(
  evidence: any[],
  base: { lat: number; lng: number; radiusKm: number },
) {
  const values = [
    ...new Set(
      evidence
        .filter((e) => e.field === "coordinates" && e.scope === "property")
        .map((e) => stable(e.value)),
    ),
  ];
  if (values.length !== 1) return { fit: "unknown", distanceKm: null };
  const point = JSON.parse(values[0]);
  if (
    typeof point.lat !== "number" ||
    typeof point.lng !== "number" ||
    Math.abs(point.lat) > 90 ||
    Math.abs(point.lng) > 180
  )
    return { fit: "unknown", distanceKm: null };
  const rad = (n: number) => (n * Math.PI) / 180,
    a =
      Math.sin(rad(point.lat - base.lat) / 2) ** 2 +
      Math.cos(rad(base.lat)) *
        Math.cos(rad(point.lat)) *
        Math.sin(rad(point.lng - base.lng) / 2) ** 2;
  const distanceKm =
    6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return {
    fit:
      point.lat >= 43.77 || distanceKm > base.radiusKm ? "outside" : "within",
    distanceKm: Math.round(distanceKm * 10) / 10,
  };
}
export function rankReasons(
  evidence: any[],
  verified: boolean,
  total: number | null,
  stayNights: number,
  budget: number,
  refundable: boolean,
  geo: { fit: string },
) {
  const criteria: [string, string, number][] = [
    ["privateOutdoor", "שטח חוץ פרטי", 20],
    ["daylight", "אור טבעי", 10],
    ["kitchen", "מטבח מאובזר", 15],
    ["heating", "חימום", 10],
    ["airConditioning", "מיזוג", 5],
    ["parking", "חניה", 10],
    ["manageableAccess", "גישה נוחה", 15],
  ];
  const reasons = criteria
    .filter(([field]) => fieldState(evidence, field).value === true)
    .map(([, label, points]) => ({ label, points }));
  const floor = fieldState(evidence, "floor").value;
  if (typeof floor === "number" && floor >= 0 && floor <= 3)
    reasons.push({ label: "קומה בין קרקע לשלישית", points: 10 });
  if (verified)
    reasons.push({ label: "הצעה מאומתת לתאריכים ולהרכב האורחים", points: 30 });
  if (total !== null && total / stayNights <= budget * 100)
    reasons.push({ label: "מחיר מלא בתוך התקציב", points: 10 });
  if (verified && refundable)
    reasons.push({ label: "תעריף עם אפשרות להחזר", points: 5 });
  if (geo.fit === "within")
    reasons.push({ label: "קואורדינטות המקור בתוך רדיוס הבסיס", points: 20 });
  if (geo.fit === "outside")
    reasons.push({ label: "מיקום המקור מחוץ לאזור המבוקש", points: -50 });
  return reasons;
}

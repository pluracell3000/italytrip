import { z } from "zod";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
  );
export const baseSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1).max(100),
    checkIn: date,
    checkOut: date,
    radiusKm: z.number().min(1).max(80),
    towns: z.array(z.string().min(1).max(70)).min(1).max(12),
    lat: z.number().min(35).max(43.77),
    lng: z.number().min(8).max(19),
    description: z.string().max(600),
    locationSource: z
      .string()
      .url()
      .refine((u) => new URL(u).protocol === "https:"),
  })
  .refine((b) => b.checkOut > b.checkIn, "Check-out must follow check-in");
export const configSchema = z
  .object({
    adults: z.number().int().min(1).max(6),
    yearConfirmed: z.boolean(),
    budgetNightly: z.number().min(1).max(2000),
    preferredNightly: z.number().min(0).max(2000),
    paused: z.boolean(),
    freshnessHours: z.number().min(1).max(72),
    queryLimit: z.number().int().min(1).max(12),
    detailLimit: z.number().int().min(0).max(30),
    offerLimit: z.number().int().min(0).max(15),
    dailyCapMicrousd: z.number().int().min(0).max(1000000),
    monthlyCapMicrousd: z.number().int().min(0).max(10000000),
    requirements: z.array(z.string().max(150)).max(25),
    bases: z.array(baseSchema).length(3),
  })
  .refine(
    (c) =>
      c.bases.every((b, i) => i === 0 || c.bases[i - 1].checkOut === b.checkIn),
    "Bases must be consecutive",
  )
  .refine(
    (c) => new Set(c.bases.map((b) => b.id)).size === 3,
    "Unique bases required",
  );
export type Config = z.infer<typeof configSchema>;
export const defaults: Config = {
  adults: 2,
  yearConfirmed: false,
  budgetNightly: 350,
  preferredNightly: 150,
  paused: false,
  freshnessHours: 36,
  queryLimit: 12,
  detailLimit: 12,
  offerLimit: 15,
  dailyCapMicrousd: 100000,
  monthlyCapMicrousd: 2500000,
  requirements: [
    "דירה שלמה או יחידה עצמאית",
    "מרפסת פרטית, גינה פרטית או טרסה שימושית",
    "אור טבעי",
    "קומת קרקע עד קומה שלישית; בירור מדרגות ומעלית",
    "מטבח מאובזר, חימום ומיזוג",
    "בירור חניה, כביסה, מדיח ו־Wi-Fi",
  ],
  bases: [
    {
      id: "orvieto",
      name: "אורבייטו",
      checkIn: "2027-03-20",
      checkOut: "2027-03-27",
      radiusKm: 20,
      towns: ["Orvieto", "Orvieto Scalo", "Porano"],
      lat: 42.7186,
      lng: 12.1107,
      description:
        "פתיחה באומבריה: לבחור בין העיר ההיסטורית לבין בסיס נגיש יותר בעמק. בעיר חשוב במיוחד לברר מדרגות, חניה וגישה עם המזוודות.",
      locationSource:
        "https://www.openstreetmap.org/?mlat=42.7186&mlon=12.1107#map=13/42.7186/12.1107",
    },
    {
      id: "pienza",
      name: "פיינצה · ואל ד׳אורצ׳ה",
      checkIn: "2027-03-27",
      checkOut: "2027-04-03",
      radiusKm: 25,
      towns: [
        "Pienza",
        "Monticchiello",
        "San Quirico d’Orcia",
        "Castiglione d’Orcia",
      ],
      lat: 43.0775,
      lng: 11.6789,
      description:
        "שבוע של כפרים ונוף כפרי. יחידת אגריטוריזמו עשויה להתאים לשהייה רגועה; יש לברר אם צריך לנסוע לארוחות ולקניות.",
      locationSource:
        "https://www.openstreetmap.org/?mlat=43.0775&mlon=11.6789#map=12/43.0775/11.6789",
    },
    {
      id: "siena",
      name: "סיינה והסביבה",
      checkIn: "2027-04-03",
      checkOut: "2027-04-10",
      radiusKm: 20,
      towns: ["Siena", "Monteriggioni", "Sovicille"],
      lat: 43.3188,
      lng: 11.3308,
      description:
        "מסיימים באזור סיינה. דירה בעיר מתאימה ליציאה ברגל; בסביבה הכפרית יש לבדוק חניה, כניסה לעיר ונגישות יומיומית.",
      locationSource:
        "https://www.openstreetmap.org/?mlat=43.3188&mlon=11.3308#map=12/43.3188/11.3308",
    },
  ],
};
export async function loadConfig(db: import("./db").DB) {
  const [trip] = await db.query("SELECT * FROM trips WHERE id=$1", ["italy"]);
  if (!trip) throw new Error("DATABASE_NOT_SEEDED");
  return {
    version: trip.version as number,
    config: configSchema.parse(trip.config),
  };
}

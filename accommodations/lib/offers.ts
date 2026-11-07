import { json } from "./db";
import { z } from "zod";
import type { DB } from "./db";
import { id, priceChange } from "./domain";
const cents = z.number().int().nonnegative().nullable();
export const offerSchema = z
  .object({
    unit_id: z.string(),
    listing_id: z.string(),
    scan_id: z.string(),
    config_version: z.number().int(),
    check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.number().int().positive(),
    currency: z.literal("EUR"),
    rate_key: z.string().min(1),
    conditions: z.object({
      refundable: z.boolean().nullable(),
      refundTerms: z.string(),
      mealPlan: z.string(),
      paymentTiming: z.string(),
    }),
    availability: z.enum(["available", "unavailable", "unknown"]),
    outcome: z.enum(["success", "blocked", "error", "unsupported"]),
    base_cents: cents,
    fees_cents: cents,
    taxes_cents: cents,
    total_cents: cents,
    unknown_components: z.array(z.string()),
    cancellation_deadline: z.string().datetime().nullable(),
    cancellation_timezone: z.string().nullable(),
    booking_url: z
      .string()
      .url()
      .refine((u) => new URL(u).protocol === "https:")
      .nullable(),
  })
  .superRefine((o, ctx) => {
    if (
      o.outcome !== "success" &&
      (o.availability !== "unknown" || o.total_cents !== null)
    )
      ctx.addIssue({
        code: "custom",
        message: "Failed checks cannot assert availability or current price",
      });
    if (
      o.total_cents !== null &&
      (o.unknown_components.length ||
        [o.base_cents, o.fees_cents, o.taxes_cents].some((v) => v === null) ||
        (o.base_cents ?? 0) + (o.fees_cents ?? 0) + (o.taxes_cents ?? 0) !==
          o.total_cents)
    )
      ctx.addIssue({
        code: "custom",
        message: "Complete totals require reconciled explicit components",
      });
    if (o.availability === "available" && !o.booking_url)
      ctx.addIssue({ code: "custom", message: "Exact offer source required" });
  });
// Adapters with authorized dated inventory must use this gate. No current adapter claims this capability.
export async function persistOffer(db: DB, input: unknown) {
  const o = offerSchema.parse(input);
  return db.transaction(async (tx) => {
    const [trip] = await tx.query(
      "SELECT * FROM trips WHERE id='italy' FOR UPDATE",
    );
    if (trip.version !== o.config_version) throw new Error("CONFIG_CHANGED");
    const [unit] = await tx.query(
      "SELECT u.*,p.base_id FROM units u JOIN properties p ON p.id=u.property_id WHERE u.id=$1",
      [o.unit_id],
    );
    const base = trip.config.bases.find((b: any) => b.id === unit?.base_id);
    if (
      !unit?.identity_confirmed ||
      !base ||
      o.check_in !== base.checkIn ||
      o.check_out !== base.checkOut ||
      o.adults !== trip.config.adults
    )
      throw new Error("EXACT_UNIT_STAY_REQUIRED");
    const [listing] = await tx.query(
      "SELECT unit_id FROM listings WHERE id=$1",
      [o.listing_id],
    );
    if (listing?.unit_id !== o.unit_id)
      throw new Error("LISTING_UNIT_MISMATCH");
    const [run] = await tx.query(
      "SELECT config_version,status FROM scans WHERE id=$1",
      [o.scan_id],
    );
    if (run?.config_version !== o.config_version || run?.status !== "running")
      throw new Error("ACTIVE_SCAN_REQUIRED");
    const [old] = await tx.query(
      "SELECT * FROM offers WHERE unit_id=$1 AND rate_key=$2 AND config_version=$3 AND outcome='success' ORDER BY observed_at DESC LIMIT 1",
      [o.unit_id, o.rate_key, o.config_version],
    );
    const keys = Object.keys(o);
    await tx.query(
      `INSERT INTO offers(id,${keys.join(",")}) VALUES($1,${keys.map((_, i) => "$" + (i + 2)).join(",")})`,
      [
        id(),
        ...keys.map((k) =>
          k === "conditions" ? json(o.conditions) : o[k as keyof typeof o],
        ),
      ],
    );
    if (o.outcome === "success") {
      const delta = old ? priceChange(old, o) : null;
      const kind =
        !old && o.availability === "available"
          ? "verified"
          : old && old.availability !== o.availability
            ? "availability"
            : delta !== null && delta !== 0
              ? "price"
              : null;
      if (kind)
        await tx.query(
          "INSERT INTO changes(id,scan_id,config_version,unit_id,kind,message) VALUES($1,$2,$3,$4,$5,$6)",
          [
            id(),
            o.scan_id,
            o.config_version,
            o.unit_id,
            kind,
            kind === "price"
              ? `שינוי במחיר של אותו תעריף: ${(delta! / 100).toFixed(2)} EUR`
              : kind === "verified"
                ? "נמצאה הצעה מאומתת לתאריכים ולהרכב האורחים"
                : "זמינות ההצעה השתנתה",
          ],
        );
    }
  });
}

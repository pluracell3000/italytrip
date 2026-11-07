import { json } from "./db";
import { z } from "zod";
import { database } from "./db";
import { configSchema } from "./config";
import { canonicalUrl, id, stableId, listingKey } from "./domain";
import { validateUrl } from "./providers/safe-fetch";
const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("unit"),
    unitId: z.string(),
    name: z.string().min(1).max(160),
    identityConfirmed: z.boolean(),
    uncertainties: z.array(z.string().max(500)).max(12),
    sourceUrl: z.string().url(),
    attribution: z.string().min(5).max(200),
  }),
  z.object({
    type: z.literal("linkProperties"),
    sourceId: z.string(),
    targetId: z.string(),
    attribution: z.string().min(5).max(300),
  }),
  z.object({
    type: z.literal("favorite"),
    unitId: z.string(),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal("select"),
    unitId: z.string(),
    booked: z.boolean().optional(),
  }),
  z.object({ type: z.literal("unselect"), unitId: z.string() }),
  z.object({
    type: z.literal("note"),
    unitId: z.string(),
    body: z.string().min(1).max(2000),
  }),
  z.object({
    type: z.literal("config"),
    version: z.number().int(),
    config: configSchema,
  }),
  z.object({
    type: z.literal("property"),
    propertyId: z.string(),
    hidden: z.boolean(),
    pinned: z.boolean(),
    style: z.enum(["city", "village", "countryside", "unknown"]),
  }),
  z.object({
    type: z.literal("add"),
    url: z.string().url(),
    name: z.string().min(1).max(160),
    baseId: z.string(),
  }),
  z.object({
    type: z.literal("evidence"),
    unitId: z.string(),
    field: z.enum([
      "privateOutdoor",
      "outdoor",
      "daylight",
      "floor",
      "stairs",
      "elevator",
      "kitchen",
      "heating",
      "airConditioning",
      "laundry",
      "dishwasher",
      "wifi",
      "parking",
      "parkingDistance",
      "drivingRequired",
      "manageableAccess",
    ]),
    value: z.union([z.string().min(1).max(300), z.boolean(), z.number()]),
    sourceUrl: z.string().url(),
    attribution: z.string().min(1).max(200),
    scope: z.enum(["property", "unit"]),
  }),
]);
export async function mutate(input: unknown, role: "admin" | "family") {
  const a = actionSchema.parse(input);
  const admin = [
    "config",
    "property",
    "add",
    "evidence",
    "linkProperties",
    "unit",
  ].includes(a.type);
  if (admin && role !== "admin") throw new Error("UNAUTHORIZED");
  const db = await database();
  await db.transaction(async (tx) => {
    const [trip] = await tx.query(
      "SELECT * FROM trips WHERE id='italy' FOR UPDATE",
    );
    if (a.type === "linkProperties") {
      if (a.sourceId === a.targetId)
        throw new Error("DISTINCT_PROPERTIES_REQUIRED");
      const [source] = await tx.query("SELECT * FROM properties WHERE id=$1", [
        a.sourceId,
      ]);
      const [target] = await tx.query("SELECT * FROM properties WHERE id=$1", [
        a.targetId,
      ]);
      if (!source || !target || source.base_id !== target.base_id)
        throw new Error("MATCHING_BASE_REQUIRED");
      const group = target.group_id || target.id;
      await tx.query(
        "INSERT INTO property_groups(id,name) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [group, target.name],
      );
      await tx.query(
        "UPDATE properties SET group_id=$1 WHERE id=$2 OR id=$3 OR ($4::text IS NOT NULL AND group_id=$4)",
        [group, source.id, target.id, source.group_id],
      );
      await tx.query(
        "INSERT INTO property_associations(id,source_id,target_id,attribution) VALUES($1,$2,$3,$4)",
        [id(), source.id, target.id, a.attribution],
      );
      return;
    }
    if (a.type === "config") {
      if (a.version !== trip.version) throw new Error("CONFIG_CONFLICT");
      if (a.config.bases.some((b, i) => b.id !== trip.config.bases[i].id))
        throw new Error("BASE_IDS_IMMUTABLE");
      await tx.query(
        "UPDATE trips SET config=$1,version=version+1,updated_at=now() WHERE id='italy'",
        [json(a.config)],
      );
      for (const [i, b] of a.config.bases.entries())
        await tx.query(
          "UPDATE bases SET name=$2,config=$3,position=$4 WHERE id=$1",
          [b.id, b.name, json(b), i],
        );
      await tx.query(
        "INSERT INTO changes(id,config_version,kind,message) VALUES($1,$2,$3,$4)",
        [
          id(),
          trip.version + 1,
          "configuration",
          "הגדרות המסע השתנו; הצעות מהגרסה הקודמת אינן מוצגות כמחיר עדכני.",
        ],
      );
      return;
    }
    if (a.type === "property") {
      await tx.query(
        "UPDATE properties SET hidden=$2,pinned=$3,style=$4 WHERE id=$1",
        [a.propertyId, a.hidden, a.pinned, a.style],
      );
      return;
    }
    if (a.type === "add") {
      validateUrl(a.url);
      const url = canonicalUrl(a.url),
        pid = stableId(listingKey(url)),
        uid = stableId(listingKey(url) + ":unknown-unit");
      await tx.query(
        "INSERT INTO properties(id,name,base_id,canonical_url) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
        [pid, a.name, a.baseId, url],
      );
      await tx.query(
        "INSERT INTO units(id,property_id,name) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
        [uid, pid, "יחידה טרם זוהתה"],
      );
      await tx.query(
        "INSERT INTO listings(id,property_id,unit_id,provider,original_url) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
        [pid, pid, uid, new URL(url).hostname, url],
      );
      return;
    }
    const [u] = await tx.query(
      "SELECT u.*,p.base_id FROM units u JOIN properties p ON p.id=u.property_id WHERE u.id=$1",
      [a.unitId],
    );
    if (!u) throw new Error("UNIT_NOT_FOUND");
    if (a.type === "unit") {
      validateUrl(a.sourceUrl);
      await tx.query(
        "UPDATE units SET name=$2,identity_confirmed=$3,uncertainties=$4 WHERE id=$1",
        [a.unitId, a.name, a.identityConfirmed, a.uncertainties],
      );
      await tx.query(
        "INSERT INTO evidence(id,unit_id,property_id,field,value,scope,source_url,retrieved_at,confidence,attribution,manual) VALUES($1,$2,$3,$4,$5,$6,$7,now(),$8,$9,true)",
        [
          id(),
          a.unitId,
          u.property_id,
          "unitIdentity",
          json({ name: a.name, confirmed: a.identityConfirmed }),
          "unit",
          a.sourceUrl,
          "host-or-admin",
          a.attribution,
        ],
      );
      return;
    }
    if (a.type === "favorite") {
      if (a.value)
        await tx.query(
          "INSERT INTO favorites(unit_id) VALUES($1) ON CONFLICT DO NOTHING",
          [a.unitId],
        );
      else await tx.query("DELETE FROM favorites WHERE unit_id=$1", [a.unitId]);
    }
    if (a.type === "select") {
      const [old] = await tx.query(
        "SELECT * FROM selections WHERE base_id=$1",
        [u.base_id],
      );
      if (old?.booked && old.unit_id !== a.unitId)
        throw new Error("UNBOOK_BEFORE_REPLACING");
      await tx.query(
        "INSERT INTO selections(base_id,unit_id,booked) VALUES($1,$2,$3) ON CONFLICT(base_id) DO UPDATE SET unit_id=EXCLUDED.unit_id,booked=EXCLUDED.booked,updated_at=now()",
        [
          u.base_id,
          a.unitId,
          a.booked ?? (old?.unit_id === a.unitId ? old.booked : false),
        ],
      );
    }
    if (a.type === "unselect")
      await tx.query("DELETE FROM selections WHERE unit_id=$1", [a.unitId]);
    if (a.type === "note")
      await tx.query("INSERT INTO notes(id,unit_id,body) VALUES($1,$2,$3)", [
        id(),
        a.unitId,
        a.body,
      ]);
    if (a.type === "evidence") {
      validateUrl(a.sourceUrl);
      await tx.query(
        "INSERT INTO evidence(id,unit_id,property_id,field,value,scope,source_url,retrieved_at,confidence,attribution,manual) VALUES($1,$2,$3,$4,$5,$6,$7,now(),$8,$9,true)",
        [
          id(),
          a.scope === "unit" ? a.unitId : null,
          u.property_id,
          a.field,
          json(a.value),
          a.scope,
          a.sourceUrl,
          "host-or-admin",
          a.attribution,
        ],
      );
    }
  });
}

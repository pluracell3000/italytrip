import { setTimeout as delay } from "node:timers/promises";
import { json } from "./db";
import { database, type DB } from "./db";
import { loadConfig, type Config } from "./config";
import { id, stableId, listingKey } from "./domain";
import { brave, queries } from "./providers/brave";
import { publicWeb } from "./providers/public-web";
const QUERY_MICROUSD = 5000;
export async function acquireRun(db: DB, key: string, trigger: string) {
  return db.transaction(async (tx) => {
    await tx.query("SELECT id FROM trips WHERE id=$1 FOR UPDATE", ["italy"]);
    const { version, config } = await loadConfig(tx);
    const [existing] = await tx.query(
      "SELECT * FROM scans WHERE idempotency_key=$1",
      [key],
    );
    if (existing) return { existing };
    if (
      config.paused ||
      new Date().toISOString().slice(0, 10) >= config.bases.at(-1)!.checkOut
    )
      throw new Error("SCANS_PAUSED_OR_TRIP_ENDED");
    await tx.query(
      "UPDATE scans SET status='interrupted',finished_at=now(),error='Lease expired; previous observations preserved' WHERE trip_id='italy' AND status='running' AND lease_until<now()",
    );
    if (
      (
        await tx.query(
          "SELECT id FROM scans WHERE trip_id='italy' AND status='running'",
        )
      ).length
    )
      throw new Error("SCAN_ALREADY_RUNNING");
    const [spent] = await tx.query(
      `SELECT COALESCE(SUM(reserved_microusd) FILTER(WHERE started_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'),0) AS day,COALESCE(SUM(reserved_microusd),0) AS month FROM scans WHERE started_at>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`,
    );
    const reserve = config.queryLimit * QUERY_MICROUSD;
    if (
      Number(spent.day) + reserve > config.dailyCapMicrousd ||
      Number(spent.month) + reserve > config.monthlyCapMicrousd
    )
      throw new Error("SPENDING_CAP_REACHED");
    const runId = id();
    await tx.query(
      "INSERT INTO scans(id,trip_id,config_version,config_snapshot,idempotency_key,trigger,status,lease_until,reserved_microusd) VALUES($1,'italy',$2,$3,$4,$5,'running',now()+interval '6 minutes',$6)",
      [runId, version, json(config), key, trigger, reserve],
    );
    return { runId, version, config };
  });
}
async function publish(db: DB, version: number, fn: (tx: DB) => Promise<void>) {
  return db.transaction(async (tx) => {
    const [trip] = await tx.query(
      "SELECT version FROM trips WHERE id='italy' FOR UPDATE",
    );
    if (trip.version !== version) throw new Error("CONFIG_CHANGED");
    await fn(tx);
  });
}
export async function scan(trigger: "manual" | "cron", key: string) {
  if (process.env.SCANS_ENABLED !== "true") throw new Error("SCANS_DISABLED");
  if (process.env.VERCEL && process.env.VERCEL_ENV !== "production")
    throw new Error("PREVIEW_SCAN_FORBIDDEN");
  if (!process.env.BRAVE_SEARCH_API_KEY) throw new Error("BRAVE_KEY_MISSING");
  const db = await database();
  const acquired = await acquireRun(db, key, trigger);
  if ("existing" in acquired) return acquired.existing!;
  const { runId, version, config } = acquired;
  const deadline = Date.now() + 240000;
  let failures = 0;
  let truncated = false;
  const task = async (
    provider: string,
    kind: string,
    subject: string,
    outcome: string,
    error?: string,
  ) => {
    await db.query(
      "INSERT INTO provider_tasks(id,scan_id,provider,kind,subject,outcome,error) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [id(), runId, provider, kind, subject, outcome, error || null],
    );
    if (["blocked", "error"].includes(outcome)) failures++;
  };
  try {
    // Priority is persistent family choice, then favorites/pins, then least recently attempted.
    const listings = await db.query(
      `SELECT l.*,u.id AS uid FROM listings l LEFT JOIN units u ON u.id=l.unit_id JOIN properties p ON p.id=l.property_id LEFT JOIN favorites f ON f.unit_id=u.id LEFT JOIN selections s ON s.unit_id=u.id WHERE p.hidden=false ORDER BY (s.unit_id IS NOT NULL) DESC,(f.unit_id IS NOT NULL) DESC,p.pinned DESC,l.last_attempt ASC NULLS FIRST LIMIT $1`,
      [config.detailLimit],
    );
    const hostTails = new Map<string, Promise<void>>();
    const check = async (l: any) => {
      const host = new URL(l.original_url).host;
      const prior = hostTails.get(host);
      let release!: () => void;
      hostTails.set(
        host,
        new Promise<void>((r) => {
          release = r;
        }),
      );
      try {
        if (prior) {
          await prior;
          await delay(1000);
        }
        if (Date.now() > deadline - 15000) {
          truncated = true;
          return;
        }
        const result = await publicWeb.fetchPropertyDetails({
          url: l.original_url,
        });
        await publish(db, version, async (tx) => {
          await tx.query(
            "INSERT INTO observations(id,listing_id,scan_id,outcome) VALUES($1,$2,$3,$4)",
            [id(), l.id, runId, result.outcome],
          );
          await tx.query(
            "UPDATE listings SET last_attempt=now(),outcome=$2,last_success=CASE WHEN $2='success' THEN now() ELSE last_success END WHERE id=$1",
            [l.id, result.outcome],
          );
          for (const f of result.facts)
            await tx.query(
              "INSERT INTO evidence(id,unit_id,property_id,field,value,scope,source_url,retrieved_at,confidence,attribution,snippet) VALUES($1,$2,$3,$4,$5,$6,$7,now(),$8,$9,$10)",
              [
                id(),
                null,
                l.property_id,
                f.field,
                json(f.value),
                f.scope,
                l.original_url,
                "structured",
                "Public website JSON-LD",
                f.snippet || null,
              ],
            );
          await tx.query("UPDATE scans SET details=details+1 WHERE id=$1", [
            runId,
          ]);
        });
        await task("public-web", "details", l.original_url, result.outcome);
      } finally {
        release();
      }
    };
    const batch = async (items: any[]) => {
      const results = await Promise.allSettled(items.map(check));
      const failure = results.find((r) => r.status === "rejected");
      if (failure?.status === "rejected") throw failure.reason;
    };
    // Sequential requests by priority; total run is bounded, unfinished candidates rotate next day.
    for (let i = 0; i < listings.length; i += 3) {
      if (Date.now() > deadline - 135000) {
        truncated = true;
        break;
      }
      await batch(listings.slice(i, i + 3));
    }
    const [count] = await db.query("SELECT count(*)::integer AS n FROM scans");
    for (const query of queries(config, count.n)) {
      if (Date.now() > deadline - 15000) {
        truncated = true;
        break;
      }
      try {
        await db.query("UPDATE scans SET queries=queries+1 WHERE id=$1", [
          runId,
        ]);
        const candidates = await brave.discoverCandidates(
          config,
          query.query,
          query.baseId,
        );
        await publish(db, version, async (tx) => {
          for (const c of candidates) {
            const key = listingKey(c.url),
              pid = stableId(key),
              uid = stableId(key + ":unknown-unit");
            const [existing] = await tx.query(
              "SELECT id FROM listings WHERE id=$1 OR original_url=$2",
              [pid, c.url],
            );
            if (existing) continue;
            await tx.query(
              "INSERT INTO properties(id,name,base_id,canonical_url) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
              [pid, c.name, c.baseId, c.url],
            );
            await tx.query(
              "INSERT INTO units(id,property_id,name,uncertainties) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
              [
                uid,
                pid,
                "יחידה טרם זוהתה",
                [
                  "תוצאת חיפוש: יש לאמת שהקישור הוא נכס מתאים, את מיקומו ואת זהות היחידה.",
                ],
              ],
            );
            await tx.query(
              "INSERT INTO listings(id,property_id,unit_id,provider,original_url,source_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
              [pid, pid, uid, new URL(c.url).hostname, c.url, key],
            );
            await tx.query(
              "INSERT INTO changes(id,scan_id,config_version,unit_id,kind,message) VALUES($1,$2,$3,$4,$5,$6)",
              [
                id(),
                runId,
                version,
                uid,
                "candidate",
                "מועמד חדש מתוצאת חיפוש — התאמה וזמינות טרם נבדקו: " + c.name,
              ],
            );
            await tx.query(
              "UPDATE scans SET discovered=discovered+1 WHERE id=$1",
              [runId],
            );
          }
        });
        await task("brave", "discovery", query.query, "success");
      } catch (e) {
        if (String(e).includes("CONFIG_CHANGED")) throw e;
        await task("brave", "discovery", query.query, "error", safeError(e));
      }
    }
    const [progress] = await db.query("SELECT details FROM scans WHERE id=$1", [
      runId,
    ]);
    const remaining = Math.max(0, config.detailLimit - progress.details);
    if (remaining && Date.now() < deadline - 15000) {
      const fresh = await db.query(
        `SELECT l.* FROM listings l JOIN units u ON u.id=l.unit_id JOIN changes c ON c.unit_id=u.id WHERE c.scan_id=$1 AND l.last_attempt IS NULL LIMIT $2`,
        [runId, remaining],
      );
      for (let i = 0; i < fresh.length; i += 3) {
        if (Date.now() > deadline - 15000) {
          truncated = true;
          break;
        }
        await batch(fresh.slice(i, i + 3));
      }
    }
    await task(
      "inventory",
      "dated-offers",
      "Booking / Airbnb / Vrbo / Agriturismo / owner websites",
      "unsupported",
      "No authorized dated-inventory provider configured. All availability remains unknown.",
    );
    await db.query(
      "UPDATE scans SET status=$2,finished_at=now(),error=$3 WHERE id=$1",
      [
        runId,
        failures || truncated ? "partial" : "success",
        truncated ? "Time budget reached; remaining candidates rotate" : null,
      ],
    );
  } catch (e) {
    await db.query(
      "UPDATE scans SET status=$2,finished_at=now(),error=$3 WHERE id=$1",
      [
        runId,
        String(e).includes("CONFIG_CHANGED") ? "superseded" : "error",
        safeError(e),
      ],
    );
  }
  const [run] = await db.query("SELECT * FROM scans WHERE id=$1", [runId]);
  return run;
}
function safeError(e: unknown) {
  const s = String(e);
  return (
    [
      "CONFIG_CHANGED",
      "BRAVE_KEY_MISSING",
      "BRAVE_HTTP_401",
      "BRAVE_HTTP_403",
      "BRAVE_HTTP_429",
    ].find((x) => s.includes(x)) ||
    "Provider request failed or timed out; credentials and response omitted"
  );
}

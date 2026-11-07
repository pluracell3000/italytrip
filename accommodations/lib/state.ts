import { database } from "./db";
import { loadConfig } from "./config";
import {
  freshOffer,
  completeTotal,
  suitability,
  fieldState,
  nights,
} from "./domain";
interface UnitRow {
  id: string;
  property_id: string;
  name: string;
  identity_confirmed: boolean;
  uncertainties: string[];
  property_name: string;
  base_id: string;
  style: string;
  pinned: boolean;
  hidden: boolean;
  canonical_url: string;
  group_id: string | null;
}
export async function getState(admin = false) {
  const db = await database();
  return db.transaction(async (tx) => {
    const { config, version } = await loadConfig(tx);
    const properties = await tx.query<UnitRow>(
      `SELECT u.*,COALESCE(pg.name,p.name) AS property_name,p.base_id,p.style,p.pinned,p.hidden,p.canonical_url,p.group_id FROM units u JOIN properties p ON p.id=u.property_id LEFT JOIN property_groups pg ON pg.id=p.group_id ${admin ? "" : "WHERE p.hidden=false OR EXISTS(SELECT 1 FROM selections s WHERE s.unit_id=u.id) OR EXISTS(SELECT 1 FROM favorites f WHERE f.unit_id=u.id)"}`,
    );
    const identities = await tx.query(
      "SELECT id,COALESCE(group_id,id) AS canonical_id FROM properties",
    );
    const identityOf = (pid: string) =>
      identities.find((p) => p.id === pid)?.canonical_id || pid;
    const evidence = await tx.query(
      "SELECT * FROM evidence ORDER BY retrieved_at DESC",
    );
    const offers = await tx.query(
      "SELECT * FROM offers WHERE config_version=$1 ORDER BY observed_at DESC",
      [version],
    );
    const listings = await tx.query("SELECT * FROM listings");
    const favorites = await tx.query("SELECT * FROM favorites");
    const selections = await tx.query("SELECT * FROM selections");
    const notes = await tx.query(
      "SELECT * FROM notes ORDER BY created_at DESC",
    );
    const units = properties
      .map((u) => {
        const base = config.bases.find((b) => b.id === u.base_id)!;
        const facts = evidence.filter(
          (e) =>
            e.unit_id === u.id ||
            (identityOf(e.property_id) === identityOf(u.property_id) &&
              e.scope === "property"),
        );
        const offer = offers.find(
          (o) => o.unit_id === u.id && o.outcome === "success",
        );
        const verified = freshOffer(offer, {
          version,
          adults: config.adults,
          checkIn: base.checkIn,
          checkOut: base.checkOut,
          freshnessHours: config.freshnessHours,
        });
        const total = verified ? completeTotal(offer) : null;
        return {
          ...u,
          canonicalPropertyId: identityOf(u.property_id),
          associatedSources: identities.filter(
            (p) => p.canonical_id === identityOf(u.property_id),
          ).length,
          evidence: facts,
          offer: offer || null,
          verified,
          total,
          nightly:
            total === null ? null : total / nights(base.checkIn, base.checkOut),
          budgetFit:
            total === null
              ? "unknown"
              : total / nights(base.checkIn, base.checkOut) <=
                  config.budgetNightly * 100
                ? "within"
                : "over",
          score: suitability(facts),
          fields: Object.fromEntries(
            [
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
            ].map((f) => [f, fieldState(facts, f)]),
          ),
          listings: listings.filter(
            (l) =>
              l.unit_id === u.id ||
              (l.property_id === u.property_id && !l.unit_id),
          ),
          favorite: favorites.some((f) => f.unit_id === u.id),
          selection: selections.find((s) => s.unit_id === u.id) || null,
          notes: notes.filter((n) => n.unit_id === u.id),
        };
      })
      .sort(
        (a, b) =>
          Number(b.verified) - Number(a.verified) ||
          Number(b.pinned) - Number(a.pinned) ||
          b.score - a.score,
      );
    const runs = await tx.query(
      "SELECT * FROM scans ORDER BY started_at DESC LIMIT 30",
    );
    const changes = await tx.query(
      "SELECT * FROM changes WHERE config_version=$1 ORDER BY created_at DESC LIMIT 100",
      [version],
    );
    const tasks = admin
      ? await tx.query(
          "SELECT * FROM provider_tasks ORDER BY created_at DESC LIMIT 100",
        )
      : [];
    const [lastSuccess] = await tx.query(
      "SELECT finished_at FROM scans WHERE status='success' AND queries>0 ORDER BY finished_at DESC LIMIT 1",
    );
    const [lastDiscovery] = await tx.query(
      "SELECT created_at FROM provider_tasks WHERE provider='brave' AND kind='discovery' AND outcome='success' ORDER BY created_at DESC LIMIT 1",
    );
    const tomorrow = new Date();
    tomorrow.setUTCHours(6, 0, 0, 0);
    if (tomorrow.getTime() < Date.now())
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    return {
      config,
      version,
      units,
      changes,
      runs: admin ? runs : runs.slice(0, 1),
      tasks,
      lastSuccess: lastSuccess?.finished_at || null,
      lastDiscovery: lastDiscovery?.created_at || null,
      nextExpected: tomorrow.toISOString(),
      tripEnded:
        new Date().toISOString().slice(0, 10) >= config.bases.at(-1)!.checkOut,
      overdue:
        !lastDiscovery ||
        Date.now() - new Date(lastDiscovery.created_at).getTime() >
          36 * 3600000,
      providers: {
        brave: !!process.env.BRAVE_SEARCH_API_KEY,
        inventory: false,
      },
      scansEnabled: process.env.SCANS_ENABLED === "true",
      admin,
    };
  });
}
export type AppState = Awaited<ReturnType<typeof getState>>;

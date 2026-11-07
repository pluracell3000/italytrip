import { beforeAll, describe, it, expect, vi } from "vitest";
import { readFile, readdir } from "node:fs/promises";
vi.stubEnv("DATABASE_URL", process.env.TEST_DATABASE_URL || "pglite:");
const { database } = await import("../lib/db");
const { seed } = await import("../lib/seed");
const { mutate } = await import("../lib/actions");
const { getState } = await import("../lib/state");
const { acquireRun, scan } = await import("../lib/scan");
const { brave } = await import("../lib/providers/brave");
const { publicWeb } = await import("../lib/providers/public-web");
let db: Awaited<ReturnType<typeof database>>;
beforeAll(async () => {
  db = await database();
  for (const file of (await readdir("migrations"))
    .filter((n) => n.endsWith(".sql"))
    .sort()) {
    const sql = await readFile("migrations/" + file, "utf8");
    for (const statement of sql.match(/(?:\$\$[\s\S]*?\$\$|[^;])+;/g) || [])
      await db.query(statement);
  }
  await seed();
}, 30000);
describe.sequential(
  "database invariants (isolated Postgres WASM, no production assertions)",
  () => {
    it("preserves separate Il Casalino units and imports no prices", async () => {
      const s = await getState();
      expect(
        s.units.filter((u) => u.property_name === "Il Casalino"),
      ).toHaveLength(2);
      expect(s.units.every((u) => u.total === null && !u.verified)).toBe(true);
    });
    it("persists shared favorites, selection and notes across reads", async () => {
      const u = (await getState()).units[0];
      await mutate({ type: "favorite", unitId: u.id, value: true }, "family");
      await mutate({ type: "select", unitId: u.id }, "family");
      await mutate(
        { type: "note", unitId: u.id, body: "Please verify the stairs" },
        "family",
      );
      const saved = (await getState()).units.find((x) => x.id === u.id)!;
      expect(saved.favorite).toBe(true);
      expect(saved.selection?.booked).toBe(false);
      expect(saved.notes[0].body).toContain("stairs");
    });
    it("rejects unauthorized configuration edits and preserves chosen properties", async () => {
      const s = await getState();
      await expect(
        mutate(
          { type: "config", version: s.version, config: s.config },
          "family",
        ),
      ).rejects.toThrow("UNAUTHORIZED");
      await mutate(
        {
          type: "config",
          version: s.version,
          config: { ...s.config, yearConfirmed: true },
        },
        "admin",
      );
      expect((await getState()).version).toBe(s.version + 1);
      expect((await getState()).units.some((u) => u.selection)).toBe(true);
    });
    it("retains conflicting manual elevator evidence", async () => {
      const u = (await getState()).units[0];
      for (const value of [true, false])
        await mutate(
          {
            type: "evidence",
            unitId: u.id,
            field: "elevator",
            value,
            sourceUrl: u.canonical_url,
            attribution: "Test confirmation",
            scope: "unit",
          },
          "admin",
        );
      expect(
        (await getState()).units.find((x) => x.id === u.id)!.fields.elevator
          .conflict,
      ).toBe(true);
      await expect(
        db.query("UPDATE evidence SET value='true'::jsonb"),
      ).rejects.toThrow("immutable");
    });
    it("deduplicates delivery and excludes concurrent runs", async () => {
      const first = await acquireRun(db, "integration-run", "manual");
      const repeated = await acquireRun(db, "integration-run", "manual");
      expect("existing" in repeated).toBe(true);
      await expect(acquireRun(db, "different-run", "manual")).rejects.toThrow(
        "ALREADY_RUNNING",
      );
      if ("runId" in first)
        await db.query(
          "UPDATE scans SET status='success',finished_at=now() WHERE id=$1",
          [first.runId],
        );
    });
    it("enforces spending caps on manual runs", async () => {
      await expect(acquireRun(db, "cap-run", "manual")).rejects.toThrow(
        "SPENDING_CAP",
      );
    });
    it("partial failures retain earlier success and new discovery without redeployment", async () => {
      const s = await getState(true);
      await mutate(
        {
          type: "config",
          version: s.version,
          config: { ...s.config, queryLimit: 3, dailyCapMicrousd: 1000000 },
        },
        "admin",
      );
      vi.stubEnv("SCANS_ENABLED", "true");
      vi.stubEnv("BRAVE_SEARCH_API_KEY", "test-only-key");
      vi.spyOn(publicWeb, "fetchPropertyDetails").mockResolvedValue({
        outcome: "blocked",
        facts: [],
      });
      let call = 0;
      vi.spyOn(brave, "discoverCandidates").mockImplementation(async () => {
        if (++call === 2) throw new Error("blocked");
        return [
          {
            name: "TEST ONLY candidate",
            url: "https://example.com/test-apartment",
            baseId: "orvieto",
          },
        ];
      });
      const result = await scan("manual", "partial-test");
      expect(result.status).toBe("partial");
      expect(result.discovered).toBe(1);
      expect(
        (await getState()).units.some(
          (u) => u.property_name === "TEST ONLY candidate",
        ),
      ).toBe(true);
      expect(
        (
          await db.query("SELECT * FROM listings WHERE outcome='blocked'")
        ).every((l) => !l.last_success),
      ).toBe(true);
      expect((await getState()).units.some((u) => u.selection)).toBe(true);
      vi.restoreAllMocks();
    });
    it("old inflight scans cannot publish after configuration changes", async () => {
      vi.spyOn(publicWeb, "fetchPropertyDetails").mockResolvedValue({
        outcome: "unsupported",
        facts: [],
      });
      vi.spyOn(brave, "discoverCandidates").mockImplementation(async () => {
        const s = await getState();
        await mutate(
          { type: "config", version: s.version, config: s.config },
          "admin",
        );
        return [
          {
            name: "MUST NOT PUBLISH",
            url: "https://example.com/old-config",
            baseId: "siena",
          },
        ];
      });
      const result = await scan("manual", "superseded-test");
      expect(result.status).toBe("superseded");
      expect(
        (await getState()).units.some(
          (u) => u.property_name === "MUST NOT PUBLISH",
        ),
      ).toBe(false);
      vi.restoreAllMocks();
    });

    it("persists exact offers, preserves success on blocked checks, and invalidates after changed dates", async () => {
      const { persistOffer } = await import("../lib/offers");
      const state = await getState();
      const unit = state.units[0];
      const base = state.config.bases.find((b) => b.id === unit.base_id)!;
      await db.query("UPDATE units SET identity_confirmed=true WHERE id=$1", [
        unit.id,
      ]);
      const [listing] = await db.query(
        "SELECT id FROM listings WHERE unit_id=$1",
        [unit.id],
      );
      const acquired = await acquireRun(db, "dated-offer-test", "manual");
      if (!("runId" in acquired)) throw new Error("Expected new run");
      const offer = {
        unit_id: unit.id,
        listing_id: listing.id,
        scan_id: acquired.runId,
        config_version: state.version,
        check_in: base.checkIn,
        check_out: base.checkOut,
        adults: 2,
        currency: "EUR",
        rate_key: "refundable",
        conditions: {
          refundable: true,
          refundTerms: "Full refund before deadline",
          mealPlan: "none",
          paymentTiming: "arrival",
        },
        availability: "available",
        outcome: "success",
        base_cents: 120000,
        fees_cents: 10000,
        taxes_cents: 10000,
        total_cents: 140000,
        unknown_components: [],
        cancellation_deadline: null,
        cancellation_timezone: null,
        booking_url: "https://example.com/dated-offer",
      };
      await persistOffer(db, offer);
      const first = (await getState()).units.find((u) => u.id === unit.id)!;
      expect(first.verified).toBe(true);
      expect(first.total).toBe(140000);
      await persistOffer(db, {
        ...offer,
        outcome: "blocked",
        availability: "unknown",
        base_cents: null,
        fees_cents: null,
        taxes_cents: null,
        total_cents: null,
        unknown_components: ["all"],
      });
      const after = (await getState()).units.find((u) => u.id === unit.id)!;
      expect(String(after.offer?.observed_at)).toBe(
        String(first.offer?.observed_at),
      );
      expect(after.total).toBe(140000);
      const shifted = state.config.bases.map((b) => ({
        ...b,
        checkIn: new Date(Date.parse(b.checkIn) + 86400000)
          .toISOString()
          .slice(0, 10),
        checkOut: new Date(Date.parse(b.checkOut) + 86400000)
          .toISOString()
          .slice(0, 10),
      }));
      await mutate(
        {
          type: "config",
          version: state.version,
          config: { ...state.config, bases: shifted },
        },
        "admin",
      );
      const changed = (await getState()).units.find((u) => u.id === unit.id)!;
      expect(changed.verified).toBe(false);
      expect(changed.total).toBeNull();
      expect(
        (await db.query("SELECT id FROM offers WHERE unit_id=$1", [unit.id]))
          .length,
      ).toBe(2);
      await db.query(
        "UPDATE scans SET status='success',finished_at=now() WHERE id=$1",
        [acquired.runId],
      );
    });
    it("serializes simultaneous duplicate delivery into a single run", async () => {
      const pair = await Promise.all([
        acquireRun(db, "concurrent-duplicate", "cron"),
        acquireRun(db, "concurrent-duplicate", "cron"),
      ]);
      expect(pair.filter((r) => "runId" in r)).toHaveLength(1);
      expect(pair.filter((r) => "existing" in r)).toHaveLength(1);
      const [run] = await db.query(
        "SELECT id FROM scans WHERE idempotency_key='concurrent-duplicate'",
      );
      await db.query(
        "UPDATE scans SET lease_until=now()-interval '1 second' WHERE id=$1",
        [run.id],
      );
      await acquireRun(db, "after-expired-lease", "cron");
      const [old] = await db.query("SELECT status FROM scans WHERE id=$1", [
        run.id,
      ]);
      expect(old.status).toBe("interrupted");
    });

    it("links confirmed cross-platform property identity without merging units or choices", async () => {
      const state = await getState();
      const pair = state.units
        .filter((u) => u.base_id === "orvieto")
        .slice(0, 2);
      const before = state.units.length;
      await mutate(
        {
          type: "linkProperties",
          sourceId: pair[0].property_id,
          targetId: pair[1].property_id,
          attribution: "Test-only host identity confirmation",
        },
        "admin",
      );
      const after = await getState();
      expect(after.units).toHaveLength(before);
      const a = after.units.find((u) => u.id === pair[0].id)!,
        b = after.units.find((u) => u.id === pair[1].id)!;
      expect(a.canonicalPropertyId).toBe(b.canonicalPropertyId);
      expect(a.id).not.toBe(b.id);
      expect(a.associatedSources).toBe(2);
    });
  },
);

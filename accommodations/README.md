# Three homes in Italy · שלושה בתים באיטליה

A private Hebrew/RTL family accommodation guide, built with Next.js App Router, TypeScript, Tailwind/CSS, Postgres and server-side provider adapters. Family favorites, selections, booked flags and notes are database-backed. Booking takes place on the original provider's website.

## Delivery status — 7 November 2026

**Implemented and locally tested; not deployed and not scanning in production.**

- Vercel's connected API can read the account, but creating `italy-family-stays` returned **403 forbidden**. There is no independent CLI credential or usable connected browser tool in this workspace. The existing `bloom` project was not changed.
- No production Postgres connection or Brave Search API key is configured. A search adapter is implemented against Brave's documented API, but **no real production discovery request or successful production scan has been performed**.
- The named PDF was not attached in accessible workspace files and an exact-name Drive search found no match. Seed data comes only from the user's supplied research summary, dated **6 November 2026**. No PDF prices or screenshots have been imported.
- No authorized dated-inventory provider is connected. All seeded or search-discovered candidates have **unknown availability**. This is intentional, not a claim that properties are unavailable.
- No automatic scheduler invocation has been observed. `vercel.json` contains the proposed schedule; it is not deployed scheduler evidence.

The app lives in the isolated `accommodations/` directory on branch `feat/italy-family-stays` in the existing repository because GitHub's integration could not create a new private repository. No existing app files or workflows were changed, and the branch was not merged into the published app.

## Run locally

Node 24 is tested. Install dependencies using the committed lockfile:

```sh
npm ci
cp .env.example .env.local
```

Use a dedicated Postgres database and set `DATABASE_URL`, `FAMILY_PASSWORD`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `APP_ORIGIN=http://localhost:3000`. Keep the two passwords distinct and at least 16 characters; use at least 32 random characters for each machine secret. Do not commit `.env.local`.

```sh
node --env-file=.env.local --import tsx scripts/migrate.ts
node --env-file=.env.local --import tsx scripts/seed.ts
npm run dev
```

The seed import is idempotent and does not overwrite existing trip configuration or family selections. For disposable unit tests only, `DATABASE_URL=pglite:` uses an in-memory Postgres-compatible engine. Browser testing and application development should use real Postgres. PGlite is explicitly forbidden on Vercel; local files are never production persistence.

## Access

The root page requires the shared family password or the separate administrator password. The browser receives an HttpOnly, SameSite=Strict cookie, Secure in production, valid for seven days. Credentials never appear in share URLs. Family access can change favorites, selections, booked flags and notes. Only administrators can change configuration, evidence, property visibility and scans. APIs enforce these permissions independently of the interface. There is no registration or password reset service.

Once deployed, distribute the ordinary site URL and the family password separately through your own trusted channel. Do not share the administrator password. Rotate `SESSION_SECRET` to invalidate all sessions after a password change or suspected disclosure. See [operations](docs/OPERATIONS.md).

## Architecture

- `app/`: Hebrew layout, private entry page, authenticated API routes, daily cron handler.
- `components/`: guide, shortlist cards, comparison, family view, administration and evidence UI.
- `lib/config.ts`: validated editable defaults; fixed base IDs, configurable dates, towns, centers, radii, budget, requirements and spending limits.
- `lib/db.ts`, `migrations/`: parameterized SQL, explicit JSON parameters, migrations and persistent entities.
- `lib/providers/`: capability-declared Brave discovery and conservative owner-page structured-data extraction.
- `lib/scan.ts`: bounded scan runner, spending reservation, run lease, idempotency, coverage and version-checked publication.
- `lib/offers.ts`, `lib/domain.ts`: exact dated-offer ingestion gate, fee completeness, freshness, comparison and evidence conflicts.
- `tests/`, `e2e/`: isolated domain/integration tests and mobile browser acceptance flows.

No LLM is used. Search result text is not trusted as amenity, availability or pricing evidence. No accommodation photos are fabricated; current cards have labeled neutral illustrations because reuse rights have not been established.

## Quality checks

```sh
npm run check
npm test
npm run build
# Set TEST_DATABASE_URL to a freshly migrated and seeded, isolated Postgres DB:
npm run test:e2e
```

`playwright.config.ts` uses `/usr/bin/chromium` when present; otherwise install Playwright Chromium with `npx playwright install chromium`. The optional CI template is `docs/check-workflow.template.yml`; it is not installed into the unrelated repository's workflows. See [verification](docs/VERIFICATION.md) for the exact tests and limits of the evidence. Fixture API responses are used only in isolated tests and never count as live discovery.

## Deployment and maintenance

Follow [the production runbook](docs/OPERATIONS.md), [provider coverage and costs](docs/PROVIDERS.md), and [data invariants](docs/DATA.md). Required remaining external setup is listed in the runbook. Do not enable scans or report production success until a real scan persists new provider tasks and its results are visible through the deployed app without rebuilding.

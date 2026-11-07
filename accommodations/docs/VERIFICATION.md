# Verification record

Checked 7 November 2026 in an isolated workspace. This document distinguishes implementation tests from live-service evidence.

## Passed locally

- TypeScript strict check and production Next.js build.
- 23 domain/database tests against disposable Postgres-compatible WASM, repeated successfully against **real Postgres 17** in a dedicated Docker database.
- Three Chromium mobile browser scenarios, 390 × 844 CSS pixels, backed by **real Postgres**, including two separate authenticated browser contexts.
- Production dependency audit: zero reported vulnerabilities at this check.

Domain/database coverage: 36-hour expiry at read time; exact date/version/occupancy requirements; unknown fees; refundable/nonrefundable rate separation; blocked/error handling; unit-vs-property evidence; contradictory elevator claims; URL and platform-ID deduplication without merging different unit paths; untrusted page content; private/loopback/link-local/mapped-address rejection; unsafe schemes/ports/credentials; missing cron secrets and tampered cookies; incomplete total rejection; distinct Il Casalino units; persistent choices/notes; family/admin authorization; immutable evidence; idempotency and run exclusion; manual-run caps; partial failures with retained results; old in-flight configuration publication rejection; persisted exact offers invalidated by actual date edits; failed-offer success preservation; simultaneous duplicate delivery; expired lease recovery; human-confirmed cross-platform property grouping without unit merging.

Browser coverage: Hebrew `lang`/RTL; no viewport overflow on overview, shortlist or comparison; unknown totals and availability labels; favorites and selections shared between independent browser contexts; notes read back in the other browser; comparison; unauthorized read/admin/cron/manual scan rejection; cross-origin mutation rejection; administrator year confirmation persisted across reload; historical elevator uncertainty visible. Screenshots are generated locally by Playwright and are not accommodation photographs.

The browser run initially found an origin mismatch in development and a Postgres JSON double-encoding defect that the WASM test path did not expose. Both were fixed and the browser suite passed against real Postgres. Screenshot review also led to explicit LTR isolation for the SVG map and euro budget range.

## Not established

- No Vercel production deployment exists for this app: project creation returned 403.
- No permanent production database has been configured or migrated.
- No real Brave search API request has been performed; no credential is available.
- No real production scan, newly discovered real property, exact-date offer, provider spending observation, deployed cron invocation or automatic daily invocation has been observed.
- Browser tests use desktop Chromium with a mobile viewport, not a physical iPhone/Safari device.
- No original PDF import or photo-use rights verification was possible without the attachment/permission evidence.

The isolated scan integration tests stub provider methods and deliberately use `example.com` candidates. These never enter the seed, production data, screenshots of production results, or any claimed live-discovery report.

## Rerun

Use a newly created test database for integration tests (the schema setup intentionally does not destroy existing data):

```sh
TEST_DATABASE_URL=postgres://.../dedicated_empty_integration_db npm test
```

For browser tests, create a different fresh database, run migrations/seed with its URL, then set `TEST_DATABASE_URL` when invoking `npm run test:e2e`. Test passwords are deliberately test-only constants in Playwright configuration; never reuse them in production. Repeat browser test setup with a fresh database so assertions do not depend on prior choices/rate-limit counters.

Complete the real production acceptance steps in [OPERATIONS.md](OPERATIONS.md) once the owner supplies access. Add actual scan IDs, task coverage and verified source URLs here then; do not replace the missing evidence with fixture counts or HTTP status alone.

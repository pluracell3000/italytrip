# Production runbook

## External setup required

The implementation is ready to connect, but these steps remain blocked by external access:

1. **Vercel project creation/deployment access.** Creating `italy-family-stays` in `Dima's projects` (`dima-s-projects-b1e0`) returned 403 forbidden through the connected integration. Provide a correctly scoped Vercel credential through secure environment settings, or create the project in that team and grant this integration write/deployment access to it. Do not point this app at the existing unrelated `bloom` project.
2. **Permanent Postgres.** Create a dedicated database (Neon free is one option) and supply its pooled, TLS-required application `DATABASE_URL` through secure environment settings. Supply a migration-owner connection separately if needed. Use a permanent owned project, not an unclaimed expiring database. No paid plan is necessary for initial setup, subject to provider limits.
3. **Brave Web Search key.** Supply `BRAVE_SEARCH_API_KEY` from a plan permitting persistent result storage through secure environment settings, and confirm the storage entitlement. At the researched rate, 12 queries/day for 30 days costs $1.80 before credits. Brave requires a card to establish its API account; no card submission or purchase has been performed by the agent. Set provider spending controls before enabling scans.
4. **Original PDF.** Attach `Italy_Apartments_Spring_2027_HE.pdf` or supply its accessible Drive URL. Its absence does not prevent live discovery once the other setup is complete, but it prevents a faithful PDF import and evidence audit.

Never paste secrets in chat, a repository issue, a PR description or a share URL. No family/admin production password has been generated or distributed yet.

## Isolated deployment

Repository: `pluracell3000/italytrip`; branch: `feat/italy-family-stays`; app root: `accommodations`. The existing root app and GitHub Pages deployment must stay unchanged. Prefer a separate private repository if the owner later provides repository-creation access; otherwise configure a separate Vercel project explicitly with this root directory and branch. Do not change the existing repository's default branch or merge this branch merely to deploy it.

Create the new Vercel project with Next.js framework, Node 24, Fluid Compute enabled, and root directory `accommodations`. For Git integration set this app's production branch explicitly, or deploy the branch commit explicitly via CLI/API. Keep source visibility private in Vercel. If Vercel Deployment Protection also protects production, ensure the family can reach the login page through the chosen access policy; do not distribute temporary bypass-token URLs as family access.

Use the CLI only after confirming the project/team link from the intended app directory:

```sh
vercel project inspect --non-interactive
```

Set production-only environment variables:

| Name                   | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`         | Restricted application role, TLS required, pooled Postgres        |
| `BRAVE_SEARCH_API_KEY` | Production Web Search API key                                     |
| `BRAVE_STORAGE_RIGHTS_CONFIRMED` | `true` only after verifying the subscribed plan permits persistent storage |
| `FAMILY_PASSWORD`      | Shared family passphrase, >=16 characters                         |
| `ADMIN_PASSWORD`       | Different administrator passphrase, >=16 characters               |
| `SESSION_SECRET`       | Random >=32 characters; rotation revokes sessions                 |
| `CRON_SECRET`          | Different random >=32 characters; scheduler authentication        |
| `APP_ORIGIN`           | Exact stable HTTPS production origin without trailing slash       |
| `SCANS_ENABLED`        | Initially `false`; set to `true` only for real scan commissioning |

Generate secrets with a password manager or `openssl rand -hex 32`, directly into the secure settings workflow. Do not print them in deployment logs. Keep `MIGRATION_DATABASE_URL` in the operator environment rather than the runtime. No variable is prefixed `NEXT_PUBLIC_`.

Use different preview/test databases and passwords. Do not copy the production search key to previews. `VERCEL_ENV !== production` is rejected by both scan entry points even if a preview accidentally has credentials. Cron production-only behavior adds another guard.

Run migrations and historical seed import once using the operator's private env file:

```sh
npm ci
node --env-file=.env.local --import tsx scripts/migrate.ts
node --env-file=.env.local --import tsx scripts/seed.ts
npm run check
npm test
npm run build
vercel deploy --prod
```

Run migrations explicitly before the first production app start; they are not an automatic side effect of an HTTP request or build. The migration runner keeps a ledger and a transaction lock. Do not use the public site as an admin bootstrap endpoint.

## Commission the first real scan

1. Confirm HTTPS, noindex headers, password login and unauthorized API rejection on the deployed URL. Test family persistence from two devices or independent browser contexts.
2. Set `SCANS_ENABLED=true` in the production environment and redeploy once for the environment change. Keep the trip pause flag false.
3. Sign in as administrator and trigger one scan. A real success requires nonzero Brave query tasks with successful provider responses, persisted candidate URLs, and source outcomes. An HTTP 200, seed import or mocked provider test is insufficient.
4. Record scan ID, configuration version, start/end, real search queries, source task outcomes, count of new candidates and traceable original URLs. Review discovered directory/irrelevant results before recommending them to family. Report zero results honestly if that is what the API returned.
5. Open the site in a second browser. Confirm the results appear from the database **without a code redeployment**.
6. Confirm a repeated manual request using the same idempotency key returns the same scan. The database prevents overlapping runs and enforces shared daily/monthly caps.
7. Verify scheduler configuration in the deployed project and invoke the cron endpoint with its secret in the Authorization header. Keep it out of URLs and logs. Record this separately as **configured and manually tested**. Only a later platform-triggered execution plus its Vercel invocation log establishes **automatic scheduling observed**.

No steps in this section have been completed in production yet.

## Schedule and runtime

`vercel.json` specifies `0 6 * * *` on `/api/cron`: daily at **06:00 UTC**. Jerusalem local time is **08:00 in winter, 09:00 in summer**. Traditional Vercel Cron uses UTC; this is not a timezone-aware schedule. On Hobby, invocation can occur anywhere during the scheduled hour. Do not promise exact-minute execution.

Verified official references:

- [Cron usage/pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing): Hobby once daily, per-hour precision; Cron invocation uses normal function allowances.
- [Cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs): `CRON_SECRET` becomes a Bearer authorization header.
- [Function limits](https://vercel.com/docs/functions/limitations): with Fluid Compute, Hobby max/default 300 seconds; the app sets route `maxDuration=300`.

Work is awaited within the request. No `waitUntil`, detached promise or work after an HTTP response is used. The worker budgets 240 seconds, stops starting a detail/search request with less than 15 seconds left, and records partial results. HTTP search has a 10-second timeout. Owner robots/page work shares a 12-second timeout; transient 502/503/504 page responses get at most one 250 ms-backoff retry within that same timeout. Paid search requests are not retried automatically. Each body is capped, requests per host are serialized, and overall detail concurrency is three. A six-minute database lease outlives the 300-second function. Fatal deployment termination leaves an interrupted/expired run visible; acquisition recovers it without deleting history.

The initial small workload does not require a durable queue. If authorized live inventory or larger caps make the measured workload exceed this envelope, add a durable worker/checkpointed workflow before expanding it. Do not increase caps and assume Vercel will continue background work beyond the function limit.

## Everyday administration

- Sign in with the admin password and open **ניהול**.
- Change adults, dates, budget, radius or confirm the year in the main form. Advanced JSON edits include town rotation, requirements, base names/centers and spending caps. Dates must be real, consecutive and increasing. Base IDs remain fixed so family selections retain their relationships.
- Add a property URL with its name and base. It becomes an unverified candidate and is eligible for later detail checks, subject to restrictions.
- Pin/hide a property or edit its style. Hiding never deletes history or changes family selections.
- Record host confirmations with the precise field, actual unit or property scope, source URL and attribution. Conflicting claims remain visible. Use `true`/`false` for boolean facts and numbers for floor.
- Pause/resume via **השהיית סריקות / חידוש סריקות**. `SCANS_ENABLED=false` is a separate server kill switch. Acquisition also stops at the final base's checkout date; update the date if the trip changes.
- View last attempt, last successful discovery, full successful run, next expected window, overdue warning and per-provider tasks. Details-blocked is not equivalent to unavailable. No email, WhatsApp or host messages are sent.

## Failure recovery

- **BRAVE_KEY_MISSING / SCANS_DISABLED / database missing:** fix secure environment settings; redeploy to apply environment changes. No source results are synthesized.
- **401/403 from a provider:** stop using that access path; verify authorized credentials. Do not solve by scraping login pages or bypassing a block.
- **Spending cap:** review UTC daily/monthly reserved totals; manual runs also count. Increase only with the owner's cost approval, or wait for the next period.
- **Partial:** use successful results and inspect failed tasks. Old prices remain dated observations, not current prices. New queries rotate by run count and low-priority detail candidates by oldest attempt.
- **Expired running lease:** UI derives interrupted status. The next authorized scan acquisition marks the old row interrupted and proceeds after expiry. Do not delete it to reclaim spend.
- **CONFIG_CHANGED:** the old scan is superseded; rerun under the new version within caps. No old offer is reused for new dates.

## Backup, export and rollback

Enable the database provider's available backups/PITR within the selected plan. For an independent backup, use `pg_dump --format=custom` with credentials supplied by a secure connection service/private env, not a command printed in logs. Store the archive encrypted outside Git. Export family choices using `COPY`/a trusted database console; include trips, bases, units, listings, favorites, selections and notes. Full archival backups should also retain immutable evidence, offers, scans and tasks. Test restoration into a separate database before relying on a backup.

Rollback application code using Vercel's previous known-good deployment. Pause scans first. Migrations are additive; do not run destructive down-migrations on the live database. If the schema must be restored, restore a backup into a new database, validate choices/history, then deliberately switch `DATABASE_URL` and redeploy. Never replace a family selection automatically as part of recovery.

No raw HTML/provider response is retained. Structured evidence/history is retained for the trip and should be exported/archived after it ends. To meet provider retention terms or delete family data, use a reviewed owner-only maintenance migration/archive procedure; the runtime role cannot delete immutable history. Do not silently disable immutability triggers in application code.

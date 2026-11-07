# Data and trust invariants

## Separate entities

`trips` holds a versioned JSON configuration; `bases` holds named base records. Properties, accommodation units, provider listings, dated offers, field evidence, scan runs, provider tasks, favorites, selections and notes each have separate tables. `observations` records check outcome separately from availability. `property_groups` and immutable `property_associations` record human-confirmed cross-platform property identity without merging units. `changes` is the family-facing timeline. `rate_limits` is shared across serverless instances.

The two Il Casalino units share a property but remain distinct units. The supplied Airbnb link has **no assumed mapping** to Funaro or another property. It remains an additional unverified link. Tobruk and Porta Pispini remain reconsideration candidates, with no carry-forward assertion of unavailability. Seed timestamps describe supplied historical research, not a live check or a confirmed exact time of research.

## Immutable history

Database triggers reject UPDATE/DELETE on offers, evidence and observations. A failed/blocked check appends a new observation and changes `last_attempt`/`outcome`, never `last_success`. Prior evidence is not removed. Manual host confirmations are attributed and appended rather than overwritten. Distinct unit-level claims for the same field expose a conflict; property evidence cannot resolve a unit conflict.

A current offer must pass all of these read-time checks: success, available, current configuration version, exact dates, exact adults, age at most 36 hours (editable), and a nonfuture timestamp. Offer ingestion additionally requires an explicitly identified unit and matching listing. A failed scan cannot extend freshness. A complete total requires all mandatory components known and reconciled; otherwise total and budget fit remain unknown. No universal VAT/city-tax rule exists.

Price changes compare unit, dates, adults, currency, rate key, configuration and canonicalized rate conditions. Refundable and nonrefundable conditions cannot generate a price-drop event against each other. Manual booked flags are not provider booking confirmations.

## Publication and concurrency

Configuration edits lock the trip row and increment the version. Publication takes the same row lock and rejects an older scan version. A scan can retain already-published old-version history, but that history is filtered from the new trip's offers and changes. Family selections never change during scanning. Booked selections cannot be silently replaced by choosing another unit; unmark them first.

A scan transaction locks the trip row, checks its unique idempotency key, expires abandoned running leases, checks for an active scan and reserves gross API spend. A partial unique index allows only one running scan per trip. Leases expire after six minutes, longer than the 300-second Vercel function limit. Daily cron keys use the UTC date; manual keys use a client-generated UUID. Retrying the same key returns the same run rather than starting paid work again. Expired leases retain all previous observations and spend; the next acquisition marks them interrupted, and the UI derives interruption immediately from expiry.

## Geography and ranking limitations

Town-center locations link to OpenStreetMap. The route is explicitly schematic, approximate, and not a navigation or driving-time claim. New candidates are assigned the base of the query, not asserted to fall within its radius. The site does not invent property coordinates. Ranking uses explicit unit-scoped amenities/access/floor, source-backed property coordinates, exact-date freshness, known complete cost and refundability. Missing/conflicting coordinates receive no geographic bonus; outside-radius/north-of-Florence coordinates are flagged. The breakdown is visible per card. Most candidates have no positive amenity score until reviewed. Verified offers, when a future authorized adapter provides them, precede unverified candidates. The interface exposes missing facts instead of treating a zero score as proof of unsuitability.

## Database privileges

Use separate dedicated production and preview databases. Use a migration owner role only for migrations and seed import. Create an application role using your database provider's secure role manager, then grant only table operations needed by the app; do not grant schema creation, trigger management or role management.

Run the following as the migration owner after creating `italy_app` securely (no password literals in source):

```sql
GRANT CONNECT ON DATABASE your_database TO italy_app;
GRANT USAGE ON SCHEMA public TO italy_app;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO italy_app;
GRANT INSERT ON trips, bases, properties, units, listings, evidence, scans,
  provider_tasks, observations, offers, favorites, selections, notes, changes,
  rate_limits, property_groups, property_associations TO italy_app;
GRANT UPDATE ON trips, bases, properties, units, listings, scans, selections,
  rate_limits TO italy_app;
GRANT DELETE ON favorites, selections, rate_limits TO italy_app;
```

Do not grant UPDATE/DELETE on immutable tables to the app role. The application also needs SELECT on `schema_migrations` only for operational diagnostics; it does not run DDL on requests. Set the runtime `DATABASE_URL` to the restricted role's TLS-required pooled connection. Set `MIGRATION_DATABASE_URL` only in the operator/CI migration environment; it need not exist in Vercel functions. Neither is sent to the client.

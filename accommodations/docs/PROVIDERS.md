# Provider coverage and cost

Research checked 7 November 2026 against official pages. No consumer platform login or interactive assistant tool is used as a production integration.

| Source                 | Production discovery path                                                 | Details                                                         | Exact dated offers                                                                       |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Brave Search           | Implemented authenticated Web Search API; requires `BRAVE_SEARCH_API_KEY` | Never establishes amenities or price                            | No capability                                                                            |
| Booking.com            | Candidate links from Brave                                                | Consumer site fetching deliberately unsupported                 | Requires managed affiliate agreement, API token and affiliate ID; not connected          |
| Airbnb                 | Candidate links from Brave                                                | Consumer site fetching deliberately unsupported                 | No generally available consumer inventory API established; not connected                 |
| Vrbo                   | Candidate links from Brave                                                | Consumer site fetching deliberately unsupported                 | Expedia Rapid/partner access must be separately approved and implemented; not connected  |
| Agriturismo.it         | Candidate links from Brave                                                | Consumer site fetching deliberately unsupported                 | No public traveler-inventory API established; not connected                              |
| Owner/manager websites | Candidate links from Brave, or administrator adds a URL                   | Public HTTPS JSON-LD only, robots/access restrictions respected | None currently; static prices/offers are deliberately not interpreted as dated inventory |

## Official references

- [Brave API pricing](https://brave.com/search/api/): Search currently lists **$5 per 1,000 requests**, prepaid credits; the page advertises free monthly credits, but their amount/eligibility can vary. Signup requires a credit card even for credits. The same pricing FAQ permits storage only with a plan including storage rights. The operator must verify those rights before setting `BRAVE_STORAGE_RIGHTS_CONFIRMED=true`; the app fails closed otherwise. $1.80 is the gross query estimate at the listed Search rate, not a quote for a different storage-enabled contract. No signup, purchase or upgrade was performed.
- [Brave authentication](https://api-dashboard.search.brave.com/documentation/guides/authentication) and [Web Search](https://api-dashboard.search.brave.com/app/documentation/web-search): server-side `X-Subscription-Token` on `https://api.search.brave.com/res/v1/web/search`.
- [Booking prerequisites](https://developers.booking.com/demand/docs/getting-started/prerequisites) and [authentication](https://developers.booking.com/demand/docs/development-guide/authentication): managed affiliate access is distinct from an ordinary Booking account.
- [Airbnb API terms](https://www.airbnb.com/help/article/3418): governed API programs and partner scopes; no invented public endpoint is provided here.
- [Expedia Rapid](https://developers.expediagroup.com/rapid): investigate access and supported Vrbo inventory with the provider before implementing.
- [Agriturismo platform explanation](https://en.agriturismo.it/how-the-platform-works): supplier APIs/feeds do not establish public traveler API access.
- [Neon pricing](https://neon.com/pricing): a permanent free plan is available, subject to limits; no account or database has been provisioned for this app.

## Budgets

Defaults: 12 discovery queries/run, **12 detail checks/run** (editable up to 30), up to 15 dated checks (currently **zero**, because no adapter declares that capability), concurrency 3 for detail checks, sequential search calls. The smaller initial detail cap leaves room for new discoveries within a single Vercel function.

At $0.005/query, a full run reserves $0.06. Thirty such runs cost **$1.80 gross** before any provider credits. The application defaults to a **$0.10/day** and **$2.50/month** API cap, measured on UTC calendar boundaries. One full manual run can consume the day's allowance enough to prevent the scheduled run; the UI shows that failure explicitly. Reserved spend is never refunded after crashes or partial runs, so the cap is conservative. No automatic paid search retries occur. Update the documented unit cost and tests before changing Brave plans.

These caps cover the implemented paid search calls, not Vercel or Postgres usage. Configure provider-side prepaid limits and hosting/database spending controls separately. Vercel Hobby and a small Neon free database may cover this private family workload within their current limits; no promise of zero total cost is made. No paid plans were enabled.

## Evidence and retrieval policy

1. A Brave result creates a **candidate URL**, not proof that it is an entire apartment or even a single property page. Names come from the result title and remain subject to review. General directory results may need to be hidden by the administrator.
2. Queries rotate towns and English/Italian wording; configurable radius is included in the query but is **not a verified distance filter**. Geography remains uncertain until source coordinates are obtained. Custom requirements are stored for review; the deterministic query rotation covers outdoor space, kitchen, access, light, parking and heating. It does not translate arbitrary Hebrew requirement text automatically.
3. Page details preserve source URL, timestamp, field, scope and attribution. Generic JSON-LD amenities are property-scoped, even if schema calls the object an Apartment, because mapping it to the actual bookable unit is not established. No unit-level positive amenity is inferred from the page title, photo or search snippet.
4. Marketplace pages are not fetched. Owner websites are fetched only over HTTPS after resolving every DNS address to a public address and pinning the connection to a validated address. Private/reserved/mapped addresses, credentials, nonstandard ports and cross-origin redirects are rejected. Redirects are bounded. Robots restrictions fail closed; crawl-delay requires operator review. No CAPTCHA/authentication bypass occurs.
5. Detail calls to the same hostname are serialized with a one-second gap; concurrency across hosts is capped at three. Lower-priority listings rotate by oldest last attempt. HTML is capped at 1.5 MB and discarded after extraction. No raw provider response or page body is stored. No external images, scripts or raw HTML are rendered.
6. Evidence snippets are capped at 300 characters; the current extractor stores structured facts without snippets. Search titles/URLs are retained only as candidate identity, not as a cached search-results product. Review the subscribed provider's terms before enabling a new API or persisting additional fields. Do not republish licensed source content beyond its permitted uses.

## Adding a provider

Implement all four methods in `lib/providers/types.ts` and declare truthful capabilities. Add server-only env names to `.env.example` and deployment settings. Include health status and provider task records. Never call a discovery-only adapter's result a verified offer.

A dated adapter must have explicit, authorized responses for exact unit ID, check-in/out, adults, EUR currency, rate plan and payment/cancellation terms. Confirm the listing-to-unit mapping separately. Use `persistOffer()`; it validates configuration version, exact stay, identified unit, listing mapping, fee completeness and an active scan. Integrate provider-specific rate checks into the bounded runner with per-request spending reservations before enabling capability flags. There is currently no inventory adapter, automated unit-name matcher or real availability check.

Cross-platform listing URLs are deduplicated conservatively by platform ID/canonical URL. Distinct units such as Garden View and Garden Suite are never automatically merged. Cross-platform property identity needs a human-confirmed association; automatic fuzzy-name merging is intentionally absent. The admin UI provides an attributed property-identity association. It groups a confirmed property across platforms while preserving every unit, offer, selection and source record. It does not equate units across those platforms.

A public Overpass API alternative was evaluated but not selected: its [operator guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html) recommends operating a separate instance for app backends. A bounded test request also timed out. It is not used as an undocumented free substitute for production web search.

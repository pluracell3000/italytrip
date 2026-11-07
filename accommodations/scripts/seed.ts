import { seed } from "../lib/seed";
await seed();
console.log(
  "Historical user-supplied shortlist imported. PDF not imported; no live offers.",
);
process.exit(0);

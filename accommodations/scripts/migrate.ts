import { readFile, readdir } from "node:fs/promises";
if (process.env.MIGRATION_DATABASE_URL)
  process.env.DATABASE_URL = process.env.MIGRATION_DATABASE_URL;
const { database } = await import("../lib/db");
const db = await database();
await db.query(
  "CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY,applied_at timestamptz DEFAULT now())",
);
for (const name of (await readdir("migrations"))
  .filter((n) => n.endsWith(".sql"))
  .sort()) {
  await db.transaction(async (tx) => {
    await tx.query("LOCK TABLE schema_migrations IN EXCLUSIVE MODE");
    if (
      (
        await tx.query("SELECT name FROM schema_migrations WHERE name=$1", [
          name,
        ])
      ).length
    )
      return;
    const sql = await readFile("migrations/" + name, "utf8");
    for (const s of splitSQL(sql)) await tx.query(s);
    await tx.query("INSERT INTO schema_migrations(name) VALUES($1)", [name]);
  });
  console.log("Migration ready:", name);
}
function splitSQL(sql: string) {
  return sql.match(/(?:\$\$[\s\S]*?\$\$|[^;])+;/g) || [];
}
process.exit(0);

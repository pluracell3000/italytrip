import postgres from "postgres";
export interface DB {
  query<T = Record<string, any>>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(fn: (db: DB) => Promise<T>): Promise<T>;
}
export function json(value: unknown) {
  return { __sqlJson: true, value };
}
function isJson(p: any) {
  return p && typeof p === "object" && p.__sqlJson === true;
}
let instance: DB | undefined;
export async function database(): Promise<DB> {
  if (instance) return instance;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  if (url.startsWith("pglite:")) {
    if (process.env.VERCEL) throw new Error("LOCAL_DATABASE_FORBIDDEN");
    const { PGlite } = await import("@electric-sql/pglite");
    const client = new PGlite(url.slice(7) || undefined);
    const wrap = (c: any): DB => ({
      query: async (s, p) =>
        (
          await c.query(
            s,
            (p || []).map((x: any) =>
              isJson(x) ? JSON.stringify(x.value) : x,
            ),
          )
        ).rows,
      transaction: (fn) => c.transaction((t: any) => fn(wrap(t))),
    });
    instance = wrap(client);
  } else {
    const client = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      connection: { statement_timeout: 15000 },
    });
    const wrap = (c: any): DB => ({
      query: async (s, p = []) =>
        Array.from(
          await c.unsafe(
            s,
            p.map((x: any) => (isJson(x) ? c.json(x.value) : x)),
          ),
        ),
      transaction: (fn) => c.begin((t: any) => fn(wrap(t))),
    });
    instance = wrap(client);
  }
  return instance!;
}
export async function q<T = Record<string, any>>(
  sql: string,
  params: any[] = [],
) {
  return (await database()).query<T>(sql, params);
}

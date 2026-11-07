import {
  createHmac,
  timingSafeEqual,
  scryptSync,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";
import { q } from "./db";
export type Role = "family" | "admin";
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function passwordMatches(input: string, expected: string | undefined) {
  if (!expected || expected.length < 16) return false;
  return timingSafeEqual(
    scryptSync(input, "italy-access-v1", 32),
    scryptSync(expected, "italy-access-v1", 32),
  );
}
export function signSession(role: Role) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_MISSING");
  const body = Buffer.from(
    JSON.stringify({
      role,
      exp: Date.now() + 7 * 86400000,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return (
    body + "." + createHmac("sha256", secret).update(body).digest("base64url")
  );
}
export function verifySession(token: string | undefined): Role | null {
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret || secret.length < 32) return null;
  const [body, sig] = token.split(".");
  if (
    !sig ||
    !equal(sig, createHmac("sha256", secret).update(body).digest("base64url"))
  )
    return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    return p.exp > Date.now() && ["family", "admin"].includes(p.role)
      ? p.role
      : null;
  } catch {
    return null;
  }
}
export async function role() {
  return verifySession((await cookies()).get("italy_session")?.value);
}
export async function requireRole(admin = false) {
  const r = await role();
  if (!r || (admin && r !== "admin")) throw new Error("UNAUTHORIZED");
  return r;
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || origin !== (process.env.APP_ORIGIN || new URL(req.url).origin))
    throw new Error("BAD_ORIGIN");
}
export async function rateLimit(key: string, limit: number, minutes = 10) {
  const [r] = await q(
    `INSERT INTO rate_limits(key,count,expires_at) VALUES($1,1,now()+($2||' minutes')::interval) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<now() THEN 1 ELSE rate_limits.count+1 END,expires_at=CASE WHEN rate_limits.expires_at<now() THEN now()+($2||' minutes')::interval ELSE rate_limits.expires_at END RETURNING count`,
    [key, String(minutes)],
  );
  if (r.count > limit) throw new Error("RATE_LIMITED");
}
export function cronAuthorized(req: Request) {
  return (
    !!process.env.CRON_SECRET &&
    process.env.CRON_SECRET.length >= 32 &&
    equal(
      req.headers.get("authorization") || "",
      `Bearer ${process.env.CRON_SECRET}`,
    )
  );
}

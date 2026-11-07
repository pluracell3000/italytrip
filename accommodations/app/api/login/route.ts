import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import {
  sameOrigin,
  rateLimit,
  passwordMatches,
  signSession,
} from "@/lib/auth";
import { errorResponse } from "@/lib/http";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    if (Number(req.headers.get("content-length") || 0) > 2048)
      throw new Error("INVALID_REQUEST");
    await rateLimit("login:global", 50);
    const ip =
      req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-forwarded-for") ||
      "local";
    await rateLimit(
      "login:" + createHash("sha256").update(ip.slice(0, 80)).digest("hex"),
      10,
    );
    const { password } = await req.json();
    if (typeof password !== "string" || password.length > 256)
      throw new Error("UNAUTHORIZED");
    const role = passwordMatches(password, process.env.ADMIN_PASSWORD)
      ? "admin"
      : passwordMatches(password, process.env.FAMILY_PASSWORD)
        ? "family"
        : null;
    if (!role) throw new Error("UNAUTHORIZED");
    (await cookies()).set("italy_session", signSession(role), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 86400,
    });
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

import { cronAuthorized } from "@/lib/auth";
import { scan } from "@/lib/scan";
import { errorResponse } from "@/lib/http";
export const maxDuration = 300;
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  if (!cronAuthorized(req))
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    if (process.env.VERCEL_ENV !== "production")
      throw new Error("PRODUCTION_ONLY");
    return Response.json(
      await scan("cron", "daily:" + new Date().toISOString().slice(0, 10)),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

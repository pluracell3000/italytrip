import { requireRole, sameOrigin, rateLimit } from "@/lib/auth";
import { scan } from "@/lib/scan";
import { errorResponse } from "@/lib/http";
export const maxDuration = 300;
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    await requireRole(true);
    await rateLimit("manual-scan", 2, 60);
    const key = req.headers.get("idempotency-key");
    if (!key || !/^[a-zA-Z0-9-]{16,80}$/.test(key))
      throw new Error("IDEMPOTENCY_KEY_REQUIRED");
    return Response.json(await scan("manual", "manual:" + key));
  } catch (e) {
    return errorResponse(e);
  }
}

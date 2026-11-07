import { requireRole, sameOrigin, rateLimit } from "@/lib/auth";
import { mutate } from "@/lib/actions";
import { errorResponse } from "@/lib/http";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const role = await requireRole();
    await rateLimit("mutation:" + role, 120);
    if (Number(req.headers.get("content-length") || 0) > 32000)
      throw new Error("INVALID_REQUEST");
    await mutate(await req.json(), role);
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

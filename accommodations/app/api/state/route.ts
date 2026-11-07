import { requireRole } from "@/lib/auth";
import { getState } from "@/lib/state";
import { errorResponse } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const role = await requireRole();
    return Response.json(await getState(role === "admin"), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}

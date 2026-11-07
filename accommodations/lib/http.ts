export function errorResponse(e: unknown) {
  const msg = e instanceof Error ? e.message : "";
  const code =
    msg === "UNAUTHORIZED"
      ? 401
      : msg === "BAD_ORIGIN"
        ? 403
        : msg === "RATE_LIMITED"
          ? 429
          : /CONFLICT|ALREADY_RUNNING|UNBOOK/.test(msg)
            ? 409
            : /MISSING|NOT_CONFIGURED|NOT_SEEDED|DISABLED/.test(msg)
              ? 503
              : 400;
  const safe = /^[A-Z_]+$/.test(msg) ? msg : "REQUEST_FAILED";
  console.error(JSON.stringify({ event: "request_failed", code: safe }));
  return Response.json(
    { error: safe },
    { status: code, headers: { "Cache-Control": "no-store" } },
  );
}

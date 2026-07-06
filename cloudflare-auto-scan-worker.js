export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runAutoScan(env, event.cron));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/run") {
      return new Response("1-Trade auto scan worker", { status: 200 });
    }

    const result = await runAutoScan(env, "manual");
    return Response.json(result, {
      headers: { "cache-control": "no-store" },
    });
  },
};

async function runAutoScan(env, round) {
  if (!env.ONE_TRADE_SCAN_URL) {
    return { ok: false, message: "Missing ONE_TRADE_SCAN_URL" };
  }

  const endpoint = new URL(env.ONE_TRADE_SCAN_URL);
  endpoint.searchParams.set("round", round || "cron");

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-auto-scan-secret": env.AUTO_SCAN_SECRET || "",
    },
  });

  const payload = await response.json().catch(() => ({}));
  return {
    ok: response.ok && payload.ok !== false,
    status: response.status,
    round,
    sent: payload.sent === true,
    candidates: payload.candidates?.length || 0,
    top: payload.candidates?.[0]?.ticker || payload.ranked?.[0]?.ticker || "",
  };
}


import { normalizeSocialNote, readSocialNotes, writeSocialNotes } from "../_shared/social.js";

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store",
      ...init.headers,
    },
  });
}

function isAuthorized(request, env) {
  if (!env.AUTO_SCAN_SECRET) return true;
  return request.headers.get("x-auto-scan-secret") === env.AUTO_SCAN_SECRET;
}

export async function onRequestGet(context) {
  const notes = await readSocialNotes(context.env);
  return json({
    ok: true,
    configured: Boolean(context.env.SOCIAL_NOTES),
    notes,
  });
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, message: "invalid_json" }, { status: 400 });
  }

  const saved = await readSocialNotes(context.env);
  const next = [normalizeSocialNote(body), ...saved].slice(0, 80);
  const stored = await writeSocialNotes(context.env, next);
  return json({
    ok: true,
    stored,
    note: next[0],
    notes: next,
  });
}


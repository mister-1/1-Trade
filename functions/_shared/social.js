export function normalizeSocialNote(note = {}) {
  const symbols = Array.isArray(note.symbols)
    ? note.symbols.map((symbol) => String(symbol).trim().toUpperCase()).filter(Boolean)
    : String(note.symbols || "")
        .split(",")
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean);

  return {
    id: note.id || crypto.randomUUID(),
    source: String(note.source || "manual").trim().slice(0, 40),
    title: String(note.title || "Social note").trim().slice(0, 160),
    note: String(note.note || "").trim().slice(0, 800),
    url: String(note.url || "").trim().slice(0, 500),
    symbols,
    sentiment: Number.isFinite(Number(note.sentiment)) ? Math.max(-1, Math.min(1, Number(note.sentiment))) : 0,
    createdAt: note.createdAt || new Date().toISOString(),
  };
}

export async function readSocialNotes(env) {
  if (!env.SOCIAL_NOTES) return [];
  const saved = await env.SOCIAL_NOTES.get("notes", "json").catch(() => null);
  return Array.isArray(saved) ? saved : [];
}

export async function writeSocialNotes(env, notes) {
  if (!env.SOCIAL_NOTES) return false;
  await env.SOCIAL_NOTES.put("notes", JSON.stringify(notes.slice(0, 80)));
  return true;
}


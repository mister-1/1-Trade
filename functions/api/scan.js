import { rankSignals, summarizeBacktest } from "../_shared/signal-engine.js";
import { buildTelegramMessage, sendTelegram } from "../_shared/telegram.js";
import { SCAN_UNIVERSE } from "../_shared/universe.js";
import { readSocialNotes } from "../_shared/social.js";

const DATA_BATCH_SIZE = 60;
const HIGH_CONFIDENCE_MIN = 74;

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store, max-age=0",
      ...init.headers,
    },
  });
}

function getOrigin(request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function getRound(request) {
  const url = new URL(request.url);
  return url.searchParams.get("round") || "auto";
}

function isAuthorized(request, env) {
  if (!env.AUTO_SCAN_SECRET) return true;
  return request.headers.get("x-auto-scan-secret") === env.AUTO_SCAN_SECRET;
}

async function fetchDataPayload(context) {
  const symbols = SCAN_UNIVERSE.map((asset) => asset.ticker).join(",");
  const endpoint = new URL("/api/data", getOrigin(context.request));
  endpoint.searchParams.set("symbols", symbols);
  endpoint.searchParams.set("liveLimit", String(DATA_BATCH_SIZE));
  endpoint.searchParams.set("offset", "0");
  endpoint.searchParams.set("news", "1");

  const response = await fetch(endpoint.toString(), {
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`data_api_${response.status}`);
  return response.json();
}

async function readJournal(env) {
  if (!env.SIGNAL_JOURNAL) return [];
  const saved = await env.SIGNAL_JOURNAL.get("entries", "json").catch(() => null);
  return Array.isArray(saved) ? saved : [];
}

async function writeJournal(env, entries) {
  if (!env.SIGNAL_JOURNAL) return false;
  await env.SIGNAL_JOURNAL.put("entries", JSON.stringify(entries.slice(-500)));
  return true;
}

function buildJournalEntries(signals, round) {
  return signals.slice(0, 8).map((signal) => ({
    id: `${new Date().toISOString()}-${round}-${signal.ticker}`,
    ticker: signal.ticker,
    signal: signal.signal,
    confidence: signal.confidence,
    price: signal.price,
    entry: signal.setup.entry,
    target1: signal.setup.targets[0],
    target2: signal.setup.targets[1],
    stop: signal.setup.stop,
    outcome: "open",
    createdAt: new Date().toISOString(),
    round,
  }));
}

function getMarketMood(dataPayload) {
  const assets = Array.isArray(dataPayload.assets) ? dataPayload.assets : [];
  const positive = assets.filter((asset) => Number(asset.change) > 0).length;
  const ratio = assets.length ? positive / assets.length : 0.5;
  return {
    riskOn: ratio >= 0.52,
    techLeading: true,
    vixCalm: true,
  };
}

async function runScan(context) {
  const round = getRound(context.request);
  const dataPayload = await fetchDataPayload(context);
  const socialNotes = await readSocialNotes(context.env);
  const assets = Array.isArray(dataPayload.assets) ? dataPayload.assets : [];
  const ranked = rankSignals(assets, {
    news: dataPayload.news || [],
    socialNotes,
    marketMood: getMarketMood(dataPayload),
  });
  const candidates = ranked.filter((signal) => signal.confidence >= HIGH_CONFIDENCE_MIN).slice(0, 8);
  const journal = await readJournal(context.env);
  const backtest = summarizeBacktest(journal);
  const message = buildTelegramMessage(candidates, {
    title: "1-Trade Auto Scanner",
    round,
    updatedAt: dataPayload.updatedAt,
    mode: dataPayload.mode,
    freshCount: dataPayload.freshness?.fresh || 0,
    staleCount: dataPayload.freshness?.stale || 0,
  });

  return {
    round,
    mode: dataPayload.mode,
    updatedAt: dataPayload.updatedAt,
    provider: dataPayload.provider,
    freshness: dataPayload.freshness,
    candidates,
    ranked: ranked.slice(0, 15),
    socialNotes,
    backtest,
    message,
  };
}

export async function onRequestGet(context) {
  try {
    const payload = await runScan(context);
    return json({ ok: true, ...payload });
  } catch (error) {
    return json({ ok: false, message: error.message || "scan_failed" }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  try {
    const payload = await runScan(context);
    const journal = await readJournal(context.env);
    const stored = await writeJournal(context.env, [...journal, ...buildJournalEntries(payload.candidates, payload.round)]);
    const telegram = await sendTelegram(context.env, payload.message);

    return json({
      ok: telegram.ok,
      sent: telegram.ok,
      stored,
      telegram,
      ...payload,
    });
  } catch (error) {
    return json({ ok: false, message: error.message || "scan_failed" }, { status: 500 });
  }
}

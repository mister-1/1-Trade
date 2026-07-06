const POSITIVE_WORDS = [
  "beat",
  "upgrade",
  "strong",
  "growth",
  "breakout",
  "buyback",
  "guidance",
  "demand",
  "bullish",
  "record",
  "partnership",
  "launch",
];

const NEGATIVE_WORDS = [
  "miss",
  "downgrade",
  "lawsuit",
  "probe",
  "delay",
  "weak",
  "bearish",
  "cut",
  "risk",
  "recall",
  "selloff",
  "dilution",
];

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function seedNumber(ticker) {
  return ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function textScore(text = "") {
  const lower = String(text).toLowerCase();
  const positive = POSITIVE_WORDS.filter((word) => lower.includes(word)).length;
  const negative = NEGATIVE_WORDS.filter((word) => lower.includes(word)).length;
  return clamp(50 + positive * 7 - negative * 9, 0, 100);
}

function getFreshnessScore(asset) {
  if (asset.freshness === "stale") return 18;
  if (asset.freshness === "near_realtime") return 92;
  if (asset.live) return 78;
  return 48;
}

function getTechnicalScore(asset, index = 0) {
  const change = toNumber(asset.change);
  const seed = seedNumber(asset.ticker) + index * 11;
  const trend = clamp(56 + change * 7 + (seed % 21) - 8, 15, 95);
  const momentum = clamp(50 + Math.abs(change) * 8 + (seed % 17), 20, 92);
  const volatilityPenalty = Math.abs(change) > 4.5 ? 13 : Math.abs(change) > 2.5 ? 6 : 0;
  return clamp(Math.round(trend * 0.66 + momentum * 0.34 - volatilityPenalty), 0, 100);
}

function getMarketScore(asset, marketMood = {}) {
  const theme = String(asset.theme || "").toLowerCase();
  const riskOn = marketMood.riskOn ?? true;
  const techLeading = marketMood.techLeading ?? true;
  const vixCalm = marketMood.vixCalm ?? true;
  let score = 56;
  if (riskOn) score += 10;
  if (vixCalm) score += 8;
  if (techLeading && /(ai|chip|cloud|software|semiconductor|data)/.test(theme)) score += 10;
  if (!riskOn && /(gold|energy|healthcare)/.test(theme)) score += 5;
  return clamp(score, 0, 100);
}

function getNewsScore(asset, news = []) {
  const related = news.filter((item) => {
    const body = `${item.ticker || ""} ${item.title || ""} ${item.summary || ""}`.toUpperCase();
    return body.includes(asset.ticker) || body.includes(String(asset.name || "").toUpperCase().split(" ")[0]);
  });
  if (!related.length) return 52;
  const scores = related.map((item) => textScore(`${item.title || ""} ${item.summary || ""} ${item.impact || ""}`));
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getSocialScore(asset, socialNotes = []) {
  const related = socialNotes.filter((item) => {
    const symbols = Array.isArray(item.symbols) ? item.symbols : [];
    const body = `${item.title || ""} ${item.note || ""} ${item.url || ""}`.toUpperCase();
    return symbols.map((symbol) => String(symbol).toUpperCase()).includes(asset.ticker) || body.includes(asset.ticker);
  });
  if (!related.length) return 50;
  const scores = related.map((item) => {
    if (Number.isFinite(Number(item.sentiment))) return clamp(50 + Number(item.sentiment) * 50, 0, 100);
    return textScore(`${item.title || ""} ${item.note || ""}`);
  });
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getRiskScore(asset, freshnessScore, technicalScore) {
  const change = Math.abs(toNumber(asset.change));
  let score = 78;
  if (change > 4) score -= 18;
  else if (change > 2.5) score -= 10;
  if (freshnessScore < 60) score -= 22;
  if (technicalScore < 45) score -= 9;
  if (asset.tradable === false) score -= 12;
  return clamp(score, 0, 100);
}

function getSetup(asset) {
  const price = Math.max(0.01, toNumber(asset.price, 1));
  const volatility = asset.ticker === "XAUUSD" ? 0.008 : 0.026;
  const change = toNumber(asset.change);
  const entry = price * (1 + (change >= 0 ? 0.0018 : 0.0065));
  return {
    entry,
    targets: [entry * (1 + volatility * 1.18), entry * (1 + volatility * 2.05)],
    stop: entry * (1 - volatility * 1.04),
  };
}

export function scoreAsset(asset, context = {}, index = 0) {
  const freshnessScore = getFreshnessScore(asset);
  const technicalScore = getTechnicalScore(asset, index);
  const marketScore = getMarketScore(asset, context.marketMood);
  const newsScore = getNewsScore(asset, context.news);
  const socialScore = getSocialScore(asset, context.socialNotes);
  const riskScore = getRiskScore(asset, freshnessScore, technicalScore);
  const confidence = Math.round(
    technicalScore * 0.28 +
      marketScore * 0.18 +
      newsScore * 0.16 +
      socialScore * 0.1 +
      freshnessScore * 0.16 +
      riskScore * 0.12,
  );
  const tradableFresh = freshnessScore >= 70 && asset.freshness !== "stale";
  const signal = confidence >= 76 && tradableFresh ? "BUY WATCH" : confidence >= 68 ? "WAIT" : confidence <= 52 ? "AVOID" : "WATCH";
  const setup = getSetup(asset);

  return {
    ...asset,
    confidence,
    signal,
    setup,
    scores: {
      technical: technicalScore,
      market: marketScore,
      news: newsScore,
      social: socialScore,
      freshness: freshnessScore,
      risk: riskScore,
    },
    reasons: [
      `Technical ${technicalScore}/100`,
      `Market ${marketScore}/100`,
      `News ${newsScore}/100`,
      `Social ${socialScore}/100`,
      `Freshness ${freshnessScore}/100`,
      `Risk control ${riskScore}/100`,
    ],
  };
}

export function rankSignals(assets, context = {}) {
  return assets
    .map((asset, index) => scoreAsset(asset, context, index))
    .sort((a, b) => b.confidence - a.confidence || Math.abs(toNumber(b.change)) - Math.abs(toNumber(a.change)));
}

export function summarizeBacktest(entries = []) {
  const closed = entries.filter((entry) => entry.outcome && entry.outcome !== "open");
  const wins = closed.filter((entry) => entry.outcome === "win").length;
  const losses = closed.filter((entry) => entry.outcome === "loss").length;
  const open = entries.length - closed.length;
  return {
    total: entries.length,
    closed: closed.length,
    wins,
    losses,
    open,
    winRate: closed.length ? Math.round((wins / closed.length) * 100) : null,
  };
}

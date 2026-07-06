const SCAN_UNIVERSE = [
  { ticker: "XAUUSD", name: "Gold Spot / US Dollar", price: 2356.4, change: 0.46 },
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 194.83, change: -1.39 },
  { ticker: "MSFT", name: "Microsoft Corporation", price: 493.46, change: 1.02 },
  { ticker: "AAPL", name: "Apple Inc.", price: 214.83, change: 0.44 },
  { ticker: "AMZN", name: "Amazon.com, Inc.", price: 221.3, change: 0.72 },
  { ticker: "META", name: "Meta Platforms, Inc.", price: 713.5, change: 1.1 },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 179.2, change: 0.38 },
  { ticker: "TSLA", name: "Tesla, Inc.", price: 246.12, change: -1.34 },
  { ticker: "AVGO", name: "Broadcom Inc.", price: 173.4, change: 1.42 },
  { ticker: "AMD", name: "Advanced Micro Devices", price: 161.58, change: 1.74 },
  { ticker: "NFLX", name: "Netflix, Inc.", price: 678.2, change: 0.63 },
  { ticker: "COST", name: "Costco Wholesale", price: 884.5, change: 0.22 },
  { ticker: "PLTR", name: "Palantir Technologies", price: 27.8, change: 2.35 },
  { ticker: "ARM", name: "Arm Holdings", price: 126.4, change: -0.48 },
  { ticker: "MU", name: "Micron Technology", price: 138.7, change: 1.96 },
  { ticker: "QCOM", name: "QUALCOMM Incorporated", price: 196.1, change: 0.84 },
  { ticker: "INTC", name: "Intel Corporation", price: 31.2, change: -0.92 },
  { ticker: "ORCL", name: "Oracle Corporation", price: 141.6, change: 0.57 },
  { ticker: "CRM", name: "Salesforce, Inc.", price: 257.9, change: 0.31 },
  { ticker: "NOW", name: "ServiceNow, Inc.", price: 749.2, change: 0.66 },
  { ticker: "ADBE", name: "Adobe Inc.", price: 533.6, change: -0.28 },
  { ticker: "PANW", name: "Palo Alto Networks", price: 321.4, change: 1.17 },
  { ticker: "CRWD", name: "CrowdStrike Holdings", price: 388.5, change: 1.26 },
  { ticker: "SNOW", name: "Snowflake Inc.", price: 131.8, change: -0.54 },
  { ticker: "SHOP", name: "Shopify Inc.", price: 68.9, change: 1.08 },
  { ticker: "COIN", name: "Coinbase Global", price: 225.1, change: 2.42 },
  { ticker: "MSTR", name: "MicroStrategy Incorporated", price: 1518.7, change: 2.86 },
  { ticker: "JPM", name: "JPMorgan Chase", price: 207.5, change: 0.25 },
  { ticker: "BAC", name: "Bank of America", price: 39.4, change: -0.18 },
  { ticker: "V", name: "Visa Inc.", price: 276.2, change: 0.33 },
  { ticker: "MA", name: "Mastercard Incorporated", price: 462.9, change: 0.41 },
  { ticker: "PYPL", name: "PayPal Holdings", price: 63.7, change: 0.79 },
  { ticker: "XOM", name: "Exxon Mobil", price: 114.6, change: -0.24 },
  { ticker: "CVX", name: "Chevron Corporation", price: 156.8, change: -0.31 },
  { ticker: "OXY", name: "Occidental Petroleum", price: 60.1, change: -0.62 },
  { ticker: "LLY", name: "Eli Lilly and Company", price: 905.4, change: 0.71 },
  { ticker: "UNH", name: "UnitedHealth Group", price: 492.2, change: -0.43 },
  { ticker: "JNJ", name: "Johnson & Johnson", price: 148.7, change: 0.14 },
  { ticker: "PFE", name: "Pfizer Inc.", price: 28.5, change: -0.36 },
  { ticker: "NKE", name: "NIKE, Inc.", price: 94.2, change: 0.22 },
  { ticker: "SBUX", name: "Starbucks Corporation", price: 82.9, change: 0.64 },
  { ticker: "MCD", name: "McDonald's Corporation", price: 289.8, change: 0.19 },
  { ticker: "WMT", name: "Walmart Inc.", price: 68.4, change: 0.51 },
  { ticker: "HD", name: "Home Depot", price: 356.7, change: 0.27 },
  { ticker: "DIS", name: "The Walt Disney Company", price: 101.5, change: -0.44 },
  { ticker: "BA", name: "Boeing Company", price: 184.2, change: -0.83 },
  { ticker: "CAT", name: "Caterpillar Inc.", price: 342.1, change: 0.52 },
  { ticker: "GE", name: "GE Aerospace", price: 159.4, change: 0.68 },
  { ticker: "UBER", name: "Uber Technologies", price: 71.6, change: 1.22 },
  { ticker: "ABNB", name: "Airbnb, Inc.", price: 146.3, change: 0.73 },
  { ticker: "SMCI", name: "Super Micro Computer", price: 812.5, change: 2.04 },
];

const DEFAULT_SYMBOLS = SCAN_UNIVERSE.map((asset) => asset.ticker);
const MAX_FREE_BATCH = 8;
const MARKET_DATA_STALE_MS = 2 * 60 * 1000;
const TWELVE_SYMBOL_MAP = {
  XAUUSD: "XAU/USD",
};
const FINNHUB_SYMBOL_MAP = {
  XAUUSD: "OANDA:XAU_USD",
};

const DEMO_ASSETS = SCAN_UNIVERSE.map((asset) => ({ ...asset, live: false, source: "fallback", sourceLabel: "Fallback Data" }));

const DEMO_NEWS = [
  {
    ticker: "GOLD",
    title: "ทองคำได้แรงหนุนจากความไม่แน่นอนของ macro",
    summary: "นักลงทุนยังจับตาดอกเบี้ย ค่าเงินดอลลาร์ และความเสี่ยงภูมิรัฐศาสตร์ หากดอลลาร์อ่อนหรือ bond yield ลดลง ทองคำมีโอกาสได้แรงซื้อระยะสั้น",
    impact: "บวกปานกลาง",
    source: "1-Trade Demo",
  },
  {
    ticker: "NVDA",
    title: "แรงซื้อหุ้น AI chip ยังแข็งแรง",
    summary: "กลุ่ม semiconductor ได้แรงหนุนจากความต้องการชิป AI และการลงทุน data center ต่อเนื่อง ส่งผลบวกต่อหุ้นที่มี momentum อยู่แล้ว",
    impact: "บวกสูง",
    source: "1-Trade Demo",
  },
];

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store, max-age=0",
      ...init.headers,
    },
  });
}

function getSymbols(request) {
  const url = new URL(request.url);
  const symbols = url.searchParams
    .get("symbols")
    ?.split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);

  return symbols?.length ? symbols.slice(0, 60) : DEFAULT_SYMBOLS;
}

function getLiveBatch(symbols, request) {
  const url = new URL(request.url);
  const liveLimit = Math.max(1, Math.min(MAX_FREE_BATCH, Number(url.searchParams.get("liveLimit")) || MAX_FREE_BATCH));
  const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0) % symbols.length;
  const rotated = [...symbols.slice(offset), ...symbols.slice(0, offset)];
  const batchSymbols = rotated.slice(0, liveLimit);
  const nextOffset = (offset + liveLimit) % symbols.length;

  return { batchSymbols, liveLimit, offset, nextOffset };
}

function toNumber(value) {
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function getIsoTimestamp(value) {
  if (!value) return "";
  if (typeof value === "number") {
    const milliseconds = value > 1e15 ? Math.floor(value / 1e6) : value > 1e12 ? Math.floor(value) : value * 1000;
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date.toISOString() : "";
  }

  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}

function getAgeMs(sourceTimestamp, receivedAt) {
  const timestamp = sourceTimestamp || receivedAt;
  if (!timestamp) return null;
  const age = Date.now() - new Date(timestamp).getTime();
  return Number.isFinite(age) ? Math.max(0, age) : null;
}

function getFreshness(sourceTimestamp, receivedAt, realtimeCapable = false) {
  const ageMs = getAgeMs(sourceTimestamp, receivedAt);
  if (ageMs === null) return realtimeCapable ? "near_realtime" : "unknown";
  if (ageMs > MARKET_DATA_STALE_MS) return "stale";
  return realtimeCapable ? "near_realtime" : "fresh";
}

function normalizeMarketAsset(ticker, quote) {
  const receivedAt = quote.receivedAt || new Date().toISOString();
  const sourceTimestamp = getIsoTimestamp(quote.sourceTimestamp);
  const ageMs = getAgeMs(sourceTimestamp, receivedAt);
  const freshness = getFreshness(sourceTimestamp, receivedAt, quote.realtimeCapable);
  const bid = quote.bid ?? null;
  const ask = quote.ask ?? null;
  const hasBidAsk = Number.isFinite(bid) && Number.isFinite(ask) && bid > 0 && ask > 0;

  return {
    ticker,
    name: quote.name || quote.symbol || ticker,
    price: quote.price,
    bid,
    ask,
    change: quote.change ?? 0,
    currency: quote.currency || "USD",
    source: quote.source,
    sourceLabel: quote.sourceLabel,
    sourceTimestamp,
    receivedAt,
    ageMs,
    freshness,
    tradable: freshness !== "stale" && quote.price > 0 && hasBidAsk,
    live: freshness !== "stale",
  };
}

function normalizeTwelveQuote(ticker, quote) {
  const price = toNumber(quote.close || quote.price);
  const change = toNumber(quote.percent_change || quote.change_percent || quote.percentChange);
  if (price === null) return null;

  return normalizeMarketAsset(ticker, {
    name: quote.name || quote.symbol || ticker,
    price,
    bid: toNumber(quote.bid),
    ask: toNumber(quote.ask),
    change: change ?? 0,
    currency: quote.currency || "USD",
    source: "twelvedata",
    sourceLabel: "Twelve Data",
    sourceTimestamp: quote.datetime || quote.timestamp,
    receivedAt: new Date().toISOString(),
    realtimeCapable: true,
  });
}

function pickTwelveQuote(data, sourceSymbol) {
  if (!data || typeof data !== "object") return null;
  if (data.status === "error") return null;
  if (data[sourceSymbol]) return data[sourceSymbol];
  if (sourceSymbol === "XAU/USD" && data["XAU/USD"]) return data["XAU/USD"];
  return data;
}

async function fetchTwelveData(symbols, apiKey) {
  if (!apiKey) return [];

  const sourceSymbols = symbols.map((symbol) => TWELVE_SYMBOL_MAP[symbol] || symbol);
  const endpoint = new URL("https://api.twelvedata.com/quote");
  endpoint.searchParams.set("symbol", sourceSymbols.join(","));
  endpoint.searchParams.set("apikey", apiKey);

  const response = await fetch(endpoint.toString(), {
    headers: { accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Twelve Data ${response.status}`);
  const data = await response.json();

  return symbols
    .map((ticker, index) => normalizeTwelveQuote(ticker, pickTwelveQuote(data, sourceSymbols[index])))
    .filter(Boolean);
}

async function fetchFinnhubData(symbols, apiKey) {
  if (!apiKey) return [];

  const settled = await Promise.allSettled(
    symbols.map(async (ticker) => {
      const sourceSymbol = FINNHUB_SYMBOL_MAP[ticker] || ticker;
      const endpoint = new URL("https://finnhub.io/api/v1/quote");
      endpoint.searchParams.set("symbol", sourceSymbol);
      endpoint.searchParams.set("token", apiKey);

      const response = await fetch(endpoint.toString(), {
        headers: { accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Finnhub ${response.status}`);
      const data = await response.json();
      const price = toNumber(data.c);
      if (price === null || price <= 0) return null;

      return normalizeMarketAsset(ticker, {
        name: ticker,
        price,
        change: toNumber(data.dp) ?? 0,
        source: "finnhub",
        sourceLabel: "Finnhub",
        sourceTimestamp: toNumber(data.t),
        receivedAt: new Date().toISOString(),
        realtimeCapable: true,
      });
    }),
  );

  return settled.flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []));
}

async function fetchPolygonData(symbols, apiKey) {
  if (!apiKey) return [];

  const stockSymbols = symbols.filter((symbol) => symbol !== "XAUUSD");
  const settled = await Promise.allSettled(
    stockSymbols.map(async (ticker) => {
      const endpoint = new URL(`https://api.polygon.io/v2/last/trade/${encodeURIComponent(ticker)}`);
      endpoint.searchParams.set("apiKey", apiKey);

      const response = await fetch(endpoint.toString(), {
        headers: { accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Polygon ${response.status}`);
      const data = await response.json();
      const result = data.results || {};
      const price = toNumber(result.p);
      if (price === null || price <= 0) return null;

      return normalizeMarketAsset(ticker, {
        name: ticker,
        price,
        change: 0,
        source: "polygon",
        sourceLabel: "Polygon",
        sourceTimestamp: toNumber(result.t || result.y || result.f),
        receivedAt: new Date().toISOString(),
        realtimeCapable: true,
      });
    }),
  );

  return settled.flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []));
}

function getConfiguredMarketProviders(env) {
  const polygonKey = env.POLYGON_API_KEY || env.MASSIVE_API_KEY;
  return [
    { key: "finnhub", label: "Finnhub", apiKey: env.FINNHUB_API_KEY, fetcher: fetchFinnhubData },
    { key: "polygon", label: "Polygon", apiKey: polygonKey, fetcher: fetchPolygonData },
    { key: "twelvedata", label: "Twelve Data", apiKey: env.TWELVE_DATA_API_KEY, fetcher: fetchTwelveData },
  ].filter((provider) => provider.apiKey);
}

function pickBetterAsset(current, candidate) {
  if (!current) return candidate;
  if (current.freshness === "stale" && candidate.freshness !== "stale") return candidate;
  if (Number.isFinite(candidate.bid) && Number.isFinite(candidate.ask) && (!Number.isFinite(current.bid) || !Number.isFinite(current.ask))) return candidate;
  if ((candidate.ageMs ?? Infinity) < (current.ageMs ?? Infinity)) return candidate;
  return current;
}

async function fetchMarketData(symbols, env) {
  const providers = getConfiguredMarketProviders(env);
  if (!providers.length) {
    return { assets: [], providerNames: [], warnings: ["market_provider_not_configured"] };
  }

  const settled = await Promise.allSettled(
    providers.map(async (provider) => ({
      provider,
      assets: await provider.fetcher(symbols, provider.apiKey),
    })),
  );

  const byTicker = new Map();
  const providerNames = [];
  const warnings = [];

  settled.forEach((result) => {
    if (result.status === "rejected") {
      warnings.push("market_provider_failed");
      return;
    }

    if (result.value.assets.length) providerNames.push(result.value.provider.key);
    result.value.assets.forEach((asset) => {
      byTicker.set(asset.ticker, pickBetterAsset(byTicker.get(asset.ticker), asset));
    });
  });

  return {
    assets: [...byTicker.values()],
    providerNames,
    warnings,
  };
}

function getImpact(score) {
  if (!Number.isFinite(score)) return "กลาง";
  if (score >= 0.35) return "บวกสูง";
  if (score > 0.05) return "บวกปานกลาง";
  if (score <= -0.35) return "ลบสูง";
  if (score < -0.05) return "ลบปานกลาง";
  return "กลาง";
}

function getArticleTicker(article, fallback) {
  const entity = article.entities?.find((item) => item.symbol) || article.entities?.[0];
  return entity?.symbol || fallback || "MARKET";
}

function normalizeNewsArticle(article, fallbackTicker) {
  const entity = article.entities?.[0];
  const score = toNumber(entity?.sentiment_score);
  const description = article.description || article.snippet || "มีข่าวใหม่ที่ควรติดตามก่อนตัดสินใจลงทุน";

  return {
    ticker: getArticleTicker(article, fallbackTicker),
    title: article.title || "Market update",
    summary: `สรุปข่าว: ${description}`,
    impact: getImpact(score),
    source: article.source || "Marketaux",
    url: article.url || "",
    publishedAt: article.published_at || "",
  };
}

async function fetchMarketaux(symbols, apiKey) {
  if (!apiKey) return [];

  const stockSymbols = symbols.filter((symbol) => symbol !== "XAUUSD");
  if (!stockSymbols.length) return [];

  const endpoint = new URL("https://api.marketaux.com/v1/news/all");
  endpoint.searchParams.set("api_token", apiKey);
  endpoint.searchParams.set("symbols", stockSymbols.join(","));
  endpoint.searchParams.set("filter_entities", "true");
  endpoint.searchParams.set("must_have_entities", "true");
  endpoint.searchParams.set("language", "en");
  endpoint.searchParams.set("countries", "us");
  endpoint.searchParams.set("limit", "6");

  const response = await fetch(endpoint.toString(), {
    headers: { accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Marketaux ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.data) ? data.data.map((article) => normalizeNewsArticle(article)) : [];
}

export async function onRequestGet(context) {
  const symbols = getSymbols(context.request);
  const liveBatch = getLiveBatch(symbols, context.request);
  const now = new Date().toISOString();

  const [marketResult, newsResult] = await Promise.allSettled([
    fetchMarketData(liveBatch.batchSymbols, context.env),
    fetchMarketaux(liveBatch.batchSymbols, context.env.MARKETAUX_API_KEY),
  ]);

  const marketPayload = marketResult.status === "fulfilled" ? marketResult.value : { assets: [], providerNames: [], warnings: ["market_data_unavailable"] };
  const liveAssets = marketPayload.assets;
  const liveNews = newsResult.status === "fulfilled" ? newsResult.value : [];
  const mode = liveAssets.length > 0 ? "live" : liveNews.length > 0 ? "partial" : "demo";
  const demoAssets = DEMO_ASSETS.filter((asset) => symbols.includes(asset.ticker));
  const liveByTicker = new Map(liveAssets.map((asset) => [asset.ticker, asset]));
  const mergedAssets = demoAssets.map((asset) => liveByTicker.get(asset.ticker) || asset);
  const freshness = {
    fresh: liveAssets.filter((asset) => asset.freshness !== "stale").length,
    stale: liveAssets.filter((asset) => asset.freshness === "stale").length,
    tradable: liveAssets.filter((asset) => asset.tradable).length,
  };

  return json({
    mode,
    updatedAt: now,
    universeSize: symbols.length,
    liveBatch: {
      offset: liveBatch.offset,
      nextOffset: liveBatch.nextOffset,
      size: liveBatch.batchSymbols.length,
      symbols: liveBatch.batchSymbols,
    },
    nextOffset: liveBatch.nextOffset,
    provider: {
      market: marketPayload.providerNames[0] || "demo",
      marketProviders: marketPayload.providerNames,
      news: liveNews.length > 0 ? "marketaux" : "demo",
    },
    freshness,
    assets: mergedAssets,
    news: liveNews.length > 0 ? liveNews : DEMO_NEWS,
    warnings: [
      ...(marketResult.status === "rejected" ? ["market_data_unavailable"] : marketPayload.warnings),
      ...(newsResult.status === "rejected" ? ["news_unavailable"] : []),
    ],
  });
}

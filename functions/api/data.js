const DEFAULT_SYMBOLS = ["XAUUSD", "NVDA", "TSLA", "AAPL", "MSFT", "AMD"];
const TWELVE_SYMBOL_MAP = {
  XAUUSD: "XAU/USD",
};

const DEMO_ASSETS = [
  { ticker: "XAUUSD", name: "Gold Spot", price: 2356.4, change: 0.46 },
  { ticker: "NVDA", name: "NVIDIA Corporation", price: 128.74, change: 2.18 },
  { ticker: "TSLA", name: "Tesla, Inc.", price: 246.12, change: -1.34 },
  { ticker: "AAPL", name: "Apple Inc.", price: 214.83, change: 0.44 },
  { ticker: "MSFT", name: "Microsoft Corporation", price: 493.46, change: 1.02 },
  { ticker: "AMD", name: "Advanced Micro Devices", price: 161.58, change: 1.74 },
];

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
      "cache-control": "public, max-age=45",
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

  return symbols?.length ? symbols.slice(0, 12) : DEFAULT_SYMBOLS;
}

function toNumber(value) {
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function normalizeQuote(ticker, quote) {
  const price = toNumber(quote.close || quote.price);
  const change = toNumber(quote.percent_change || quote.change_percent || quote.percentChange);
  if (price === null) return null;

  return {
    ticker,
    name: quote.name || quote.symbol || ticker,
    price,
    change: change ?? 0,
    currency: quote.currency || "USD",
    source: "twelvedata",
    sourceLabel: "Twelve Data",
  };
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
    .map((ticker, index) => normalizeQuote(ticker, pickTwelveQuote(data, sourceSymbols[index])))
    .filter(Boolean);
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
  const now = new Date().toISOString();

  const [assetResult, newsResult] = await Promise.allSettled([
    fetchTwelveData(symbols, context.env.TWELVE_DATA_API_KEY),
    fetchMarketaux(symbols, context.env.MARKETAUX_API_KEY),
  ]);

  const liveAssets = assetResult.status === "fulfilled" ? assetResult.value : [];
  const liveNews = newsResult.status === "fulfilled" ? newsResult.value : [];
  const hasLiveData = liveAssets.length > 0 || liveNews.length > 0;
  const demoAssets = DEMO_ASSETS.filter((asset) => symbols.includes(asset.ticker));

  return json({
    mode: hasLiveData ? "live" : "demo",
    updatedAt: now,
    provider: {
      market: liveAssets.length > 0 ? "twelvedata" : "demo",
      news: liveNews.length > 0 ? "marketaux" : "demo",
    },
    assets: liveAssets.length > 0 ? liveAssets : demoAssets,
    news: liveNews.length > 0 ? liveNews : DEMO_NEWS,
    warnings: [
      ...(assetResult.status === "rejected" ? ["market_data_unavailable"] : []),
      ...(newsResult.status === "rejected" ? ["news_unavailable"] : []),
    ],
  });
}

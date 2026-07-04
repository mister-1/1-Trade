const SCAN_UNIVERSE = [
  { ticker: "XAUUSD", name: "Gold Spot / US Dollar", theme: "Gold" },
  { ticker: "NVDA", name: "NVIDIA Corporation", theme: "AI Chip" },
  { ticker: "MSFT", name: "Microsoft Corporation", theme: "Cloud AI" },
  { ticker: "AAPL", name: "Apple Inc.", theme: "Mega Cap" },
  { ticker: "AMZN", name: "Amazon.com, Inc.", theme: "Cloud Commerce" },
  { ticker: "META", name: "Meta Platforms, Inc.", theme: "Ads AI" },
  { ticker: "GOOGL", name: "Alphabet Inc.", theme: "Search AI" },
  { ticker: "TSLA", name: "Tesla, Inc.", theme: "EV Momentum" },
  { ticker: "AVGO", name: "Broadcom Inc.", theme: "AI Infra" },
  { ticker: "AMD", name: "Advanced Micro Devices", theme: "AI Chip" },
  { ticker: "NFLX", name: "Netflix, Inc.", theme: "Streaming" },
  { ticker: "COST", name: "Costco Wholesale", theme: "Consumer" },
  { ticker: "PLTR", name: "Palantir Technologies", theme: "AI Software" },
  { ticker: "ARM", name: "Arm Holdings", theme: "Semiconductor" },
  { ticker: "MU", name: "Micron Technology", theme: "Memory" },
  { ticker: "QCOM", name: "QUALCOMM Incorporated", theme: "Mobile Chip" },
  { ticker: "INTC", name: "Intel Corporation", theme: "Semiconductor" },
  { ticker: "ORCL", name: "Oracle Corporation", theme: "Cloud" },
  { ticker: "CRM", name: "Salesforce, Inc.", theme: "SaaS" },
  { ticker: "NOW", name: "ServiceNow, Inc.", theme: "Enterprise SaaS" },
  { ticker: "ADBE", name: "Adobe Inc.", theme: "Creative AI" },
  { ticker: "PANW", name: "Palo Alto Networks", theme: "Cybersecurity" },
  { ticker: "CRWD", name: "CrowdStrike Holdings", theme: "Cybersecurity" },
  { ticker: "SNOW", name: "Snowflake Inc.", theme: "Data Cloud" },
  { ticker: "SHOP", name: "Shopify Inc.", theme: "Ecommerce" },
  { ticker: "COIN", name: "Coinbase Global", theme: "Crypto Beta" },
  { ticker: "MSTR", name: "MicroStrategy Incorporated", theme: "Bitcoin Proxy" },
  { ticker: "JPM", name: "JPMorgan Chase", theme: "Banking" },
  { ticker: "BAC", name: "Bank of America", theme: "Banking" },
  { ticker: "V", name: "Visa Inc.", theme: "Payments" },
  { ticker: "MA", name: "Mastercard Incorporated", theme: "Payments" },
  { ticker: "PYPL", name: "PayPal Holdings", theme: "Fintech" },
  { ticker: "XOM", name: "Exxon Mobil", theme: "Energy" },
  { ticker: "CVX", name: "Chevron Corporation", theme: "Energy" },
  { ticker: "OXY", name: "Occidental Petroleum", theme: "Energy" },
  { ticker: "LLY", name: "Eli Lilly and Company", theme: "Healthcare" },
  { ticker: "UNH", name: "UnitedHealth Group", theme: "Healthcare" },
  { ticker: "JNJ", name: "Johnson & Johnson", theme: "Healthcare" },
  { ticker: "PFE", name: "Pfizer Inc.", theme: "Healthcare" },
  { ticker: "NKE", name: "NIKE, Inc.", theme: "Consumer" },
  { ticker: "SBUX", name: "Starbucks Corporation", theme: "Consumer" },
  { ticker: "MCD", name: "McDonald's Corporation", theme: "Consumer" },
  { ticker: "WMT", name: "Walmart Inc.", theme: "Retail" },
  { ticker: "HD", name: "Home Depot", theme: "Retail" },
  { ticker: "DIS", name: "The Walt Disney Company", theme: "Media" },
  { ticker: "BA", name: "Boeing Company", theme: "Aerospace" },
  { ticker: "CAT", name: "Caterpillar Inc.", theme: "Industrial" },
  { ticker: "GE", name: "GE Aerospace", theme: "Industrial" },
  { ticker: "UBER", name: "Uber Technologies", theme: "Mobility" },
  { ticker: "ABNB", name: "Airbnb, Inc.", theme: "Travel" },
  { ticker: "SMCI", name: "Super Micro Computer", theme: "AI Server" },
];

function seedNumber(ticker) {
  return ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function createSeedStock(asset, index) {
  const seed = seedNumber(asset.ticker);
  const price = asset.ticker === "XAUUSD" ? 2356.4 : 42 + ((seed * 7 + index * 13) % 560);
  const change = ((seed % 61) - 30) / 14;
  const technical = Math.max(42, Math.min(88, 56 + (seed % 33) + Math.round(change * 2)));
  const news = Math.max(40, Math.min(86, 54 + ((seed + index) % 31)));
  const market = Math.max(45, Math.min(86, 58 + ((seed + index * 2) % 25)));
  const riskScore = Math.max(38, Math.min(84, 70 - Math.abs(Math.round(change * 7)) + (index % 8)));
  const score = Math.max(30, Math.min(94, Math.round((technical + news + market + riskScore) / 4)));
  const signal = score >= 78 ? "buy" : score <= 58 ? "risk" : "watch";
  const risk = score <= 58 ? "สูง" : riskScore >= 74 ? "ต่ำ-ปานกลาง" : "ปานกลาง";
  const base = {
    ticker: asset.ticker,
    name: asset.name,
    price,
    change,
    signal,
    score,
    risk,
    reason: `อยู่ใน universe สแกน 50 หุ้นสหรัฐสำหรับธีม ${asset.theme} ระบบจะทยอยอัปเดตราคาจริงตามรอบ API ฟรี`,
    technical,
    news,
    market,
    riskScore,
    live: false,
  };
  const setup = getTradingSetup(base, price, change);
  return { ...base, ...setup };
}

let stocks = [];

let newsItems = [
  {
    ticker: "GOLD",
    title: "ทองคำได้แรงหนุนจากความไม่แน่นอนของ macro",
    summary: "นักลงทุนยังจับตาทิศทางดอกเบี้ย ค่าเงินดอลลาร์ และความเสี่ยงภูมิรัฐศาสตร์ หากดอลลาร์อ่อนหรือ bond yield ลดลง ทองคำมีโอกาสได้แรงซื้อระยะสั้น",
    impact: "บวกปานกลาง",
  },
  {
    ticker: "NVDA",
    title: "แรงซื้อหุ้น AI chip ยังแข็งแรง",
    summary: "กลุ่ม semiconductor ได้แรงหนุนจากความต้องการชิป AI และการลงทุน data center ต่อเนื่อง ส่งผลบวกต่อหุ้นที่มี momentum อยู่แล้ว",
    impact: "บวกสูง",
  },
  {
    ticker: "TSLA",
    title: "นักลงทุนจับตา margin และยอดส่งมอบ",
    summary: "ตลาดให้ความสำคัญกับแนวโน้มกำไรต่อคันและการแข่งขันด้านราคา ทำให้สัญญาณเทคนิคฝั่งซื้อยังต้องรอการยืนยัน",
    impact: "ลบปานกลาง",
  },
  {
    ticker: "MARKET",
    title: "Nasdaq ยังเป็นตัวนำตลาด",
    summary: "หุ้นเทคโนโลยีขนาดใหญ่ยังคงประคองดัชนี แต่ความเสี่ยงจากตัวเลขเศรษฐกิจและท่าที Fed ยังต้องติดตามใกล้ชิด",
    impact: "กลางถึงบวก",
  },
];

let selectedTicker = "NVDA";
let activeFilter = "all";
let liveDataMode = false;
let scanBatchOffset = 0;
let liveBatchText = "0/51";
const LIVE_BATCH_SIZE = 8;
let scanState = {
  batchIndex: 0,
  totalBatches: Math.ceil(SCAN_UNIVERSE.length / LIVE_BATCH_SIZE),
  progress: 0,
  symbols: [],
  updatedAt: "",
};
const SETTINGS_KEY = "oneTradeSettings";
const FAVORITES_KEY = "oneTradeFavorites";
const appSettings = loadSettings();
let favoriteTickers = loadFavorites();

const stockTable = document.querySelector("#stockTable");
const newsFeed = document.querySelector("#newsFeed");
const toast = document.querySelector("#toast");
const scanBatchLabel = document.querySelector("#scanBatchLabel");
const scanUpdatedLabel = document.querySelector("#scanUpdatedLabel");
const scanProgressBar = document.querySelector("#scanProgressBar");
const scanBatchSymbols = document.querySelector("#scanBatchSymbols");

function formatUsd(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "$--";
  return `$${numeric.toFixed(2)}`;
}

function signalLabel(signal) {
  if (signal === "buy") return "น่าเข้า";
  if (signal === "risk") return "เสี่ยงสูง";
  return "รอจังหวะ";
}

function loadSettings() {
  try {
    const saved = window.localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function loadFavorites() {
  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    const tickers = saved ? JSON.parse(saved) : ["NVDA", "AAPL", "XAUUSD"];
    return new Set(Array.isArray(tickers) ? tickers : []);
  } catch {
    return new Set(["NVDA", "AAPL", "XAUUSD"]);
  }
}

function saveFavorites() {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteTickers]));
}

function hasValue(value) {
  return Boolean(String(value || "").trim());
}

function getTradingSetup(stock, price, change) {
  const volatility = stock.ticker === "XAUUSD" ? 0.008 : 0.026;
  const trendBoost = Math.max(-4, Math.min(5, Number(change) || 0));
  const entry = price * (1 + (trendBoost >= 0 ? 0.002 : 0.008));
  const firstTarget = entry * (1 + volatility * 1.2);
  const secondTarget = entry * (1 + volatility * 2.05);
  const stop = entry * (1 - volatility * 1.05);
  const technical = Math.max(35, Math.min(92, Math.round(stock.technical + trendBoost * 3)));
  const score = Math.max(30, Math.min(94, Math.round((technical + stock.news + stock.market + stock.riskScore) / 4)));
  const signal = score >= 78 ? "buy" : score <= 58 ? "risk" : "watch";
  const risk = score <= 58 ? "สูง" : stock.riskScore >= 74 ? "ต่ำ-ปานกลาง" : "ปานกลาง";

  return {
    entry,
    targets: [firstTarget, secondTarget],
    stop,
    technical,
    score,
    signal,
    risk,
  };
}

stocks = SCAN_UNIVERSE.map(createSeedStock);

function mergeLiveAssets(assets, updatedAt) {
  assets.forEach((asset) => {
    let stock = stocks.find((item) => item.ticker === asset.ticker);
    const price = Number(asset.price);
    const change = Number(asset.change);
    if (!Number.isFinite(price)) return;
    if (!stock) {
      const seedAsset = { ticker: asset.ticker, name: asset.name || asset.ticker, theme: "Scanner" };
      stock = createSeedStock(seedAsset, stocks.length);
      stocks.push(stock);
    }

    const setup = getTradingSetup(stock, price, change);
    stock.name = asset.name || stock.name;
    stock.price = price;
    stock.change = Number.isFinite(change) ? change : stock.change;
    stock.entry = setup.entry;
    stock.targets = setup.targets;
    stock.stop = setup.stop;
    stock.technical = setup.technical;
    stock.score = setup.score;
    stock.signal = setup.signal;
    stock.risk = setup.risk;
    stock.live = asset.live !== false;
    if (stock.live) stock.updatedAt = updatedAt;
    stock.reason = `${asset.sourceLabel || "Live data"} อัปเดตราคา ${formatUsd(price)} (${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}%) ระบบสแกน 50 ตัวและทยอยอัปเดต live batch ละ ${LIVE_BATCH_SIZE} ตัวเพื่อให้เหมาะกับ API ฟรี พร้อมใช้ข่าวประกอบก่อนตัดสินใจ`;
  });
}

function setDataMode(mode, updatedAt, meta = {}) {
  const badge = document.querySelector("#dataModeBadge");
  if (!badge) return;

  if (mode === "live") {
    const batchText = meta.batchText || liveBatchText;
    badge.textContent = updatedAt ? `Live Data ${batchText} · ${updatedAt}` : `Live Data ${batchText}`;
    badge.classList.add("ready");
    return;
  }

  if (mode === "partial") {
    badge.textContent = updatedAt ? `Partial Live · ${updatedAt}` : "Partial Live";
    badge.classList.remove("ready");
    return;
  }

  badge.textContent = mode === "error" ? "Fallback Data" : "Standby Data";
  badge.classList.remove("ready");
}

function normalizeUpdatedAt(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getBatchProgress(payload) {
  const size = payload.liveBatch?.size || LIVE_BATCH_SIZE;
  const universeSize = payload.universeSize || SCAN_UNIVERSE.length;
  const offset = payload.liveBatch?.offset || 0;
  const batchIndex = Math.floor(offset / size) + 1;
  const totalBatches = Math.ceil(universeSize / size);
  const scannedCount = Math.min(universeSize, offset + size);

  return {
    batchIndex,
    totalBatches,
    progress: Math.max(0, Math.min(100, (scannedCount / universeSize) * 100)),
    symbols: payload.liveBatch?.symbols || [],
    updatedAt: normalizeUpdatedAt(payload.updatedAt),
  };
}

function renderScanStatus() {
  if (!scanBatchLabel || !scanProgressBar || !scanBatchSymbols) return;

  scanBatchLabel.textContent = scanState.batchIndex
    ? `กำลังสแกนชุด ${scanState.batchIndex}/${scanState.totalBatches}`
    : "กำลังเตรียมสแกน";
  scanUpdatedLabel.textContent = scanState.updatedAt ? `อัปเดต ${scanState.updatedAt}` : "รอข้อมูล";
  scanProgressBar.style.width = `${scanState.progress}%`;
  scanBatchSymbols.textContent = scanState.symbols.length
    ? `Batch ปัจจุบัน: ${scanState.symbols.join(", ")}`
    : "ระบบจะทยอยสแกนตามข้อจำกัด API ฟรี";
}

function formatStockUpdatedAt(value) {
  return value ? `Updated ${value}` : "Waiting";
}

function getStockScanClass(stock) {
  if (stock.live) return " live";
  if (stock.updatedAt) return " updated";
  return "";
}

function getStockScanText(stock) {
  if (stock.live) return "Live now";
  return formatStockUpdatedAt(stock.updatedAt);
}

function getTickerLengthClass(ticker) {
  if (ticker.length >= 5) return " is-long";
  if (ticker.length <= 1) return " is-short";
  return "";
}

async function loadLiveData({ manual = false } = {}) {
  try {
    const symbols = SCAN_UNIVERSE.map((asset) => asset.ticker).join(",");
    const response = await fetch(`/api/data?symbols=${encodeURIComponent(symbols)}&liveLimit=${LIVE_BATCH_SIZE}&offset=${scanBatchOffset}`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const payload = await response.json();
    liveDataMode = payload.provider?.market === "twelvedata";
    scanState = getBatchProgress(payload);
    scanBatchOffset = Number.isFinite(payload.nextOffset) ? payload.nextOffset : (scanBatchOffset + LIVE_BATCH_SIZE) % SCAN_UNIVERSE.length;
    liveBatchText = payload.liveBatch?.size ? `${payload.liveBatch.size}/${payload.universeSize || SCAN_UNIVERSE.length}` : `0/${SCAN_UNIVERSE.length}`;

    if (Array.isArray(payload.assets) && payload.assets.length > 0) {
      mergeLiveAssets(payload.assets, scanState.updatedAt);
    }

    if (Array.isArray(payload.news) && payload.news.length > 0) {
      newsItems = payload.news;
    }

    setDataMode(payload.mode, normalizeUpdatedAt(payload.updatedAt), { batchText: liveBatchText });
    renderScanStatus();
    renderStocks();
    renderNews();
    renderSelectedStock();

    if (manual) {
      showToast(liveDataMode ? `สแกนข้อมูลจริง batch ${liveBatchText} แล้ว` : "ยังไม่ได้ตั้งค่า API secret จึงใช้ข้อมูลสำรอง");
    }
  } catch (error) {
    liveDataMode = false;
    setDataMode("error");
    renderScanStatus();
    if (manual) showToast("ยังเชื่อม API จริงไม่ได้ ระบบใช้ข้อมูลตัวอย่างต่อไป");
  }
}

function renderStocks() {
  const filtered = stocks
    .filter((stock) => {
      if (activeFilter === "favorite") return favoriteTickers.has(stock.ticker);
      return activeFilter === "all" || stock.signal === activeFilter;
    })
    .slice()
    .sort((a, b) => Number(favoriteTickers.has(b.ticker)) - Number(favoriteTickers.has(a.ticker)) || b.score - a.score || Math.abs(b.change) - Math.abs(a.change));
  stockTable.innerHTML = filtered
    .map((stock) => {
      const active = stock.ticker === selectedTicker ? " active" : "";
      const direction = stock.change >= 0 ? "up" : "down";
      const favorite = favoriteTickers.has(stock.ticker);
      return `
        <button class="stock-row${active}" type="button" data-ticker="${stock.ticker}">
          <span class="stock-title">
            <span class="ticker-chip"><span class="ticker-symbol${getTickerLengthClass(stock.ticker)}">${stock.ticker}</span></span>
            <span>
              <strong>${stock.name}</strong>
              <span class="stock-meta">
                <span class="scan-pill${getStockScanClass(stock)}">${getStockScanText(stock)}</span>
                <span>Holding 1-3 วัน</span>
              </span>
            </span>
          </span>
          <span class="favorite-cell">
            <span class="favorite-toggle${favorite ? " active" : ""}" data-favorite="${stock.ticker}" role="button" aria-label="${favorite ? "เอาออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}" title="${favorite ? "เอาออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}">★</span>
          </span>
          <span class="price-cell">
            <strong>${formatUsd(stock.price)}</strong>
            <span class="${direction}">${stock.change > 0 ? "+" : ""}${stock.change.toFixed(2)}%</span>
          </span>
          <span class="score-cell">
            <strong>${stock.score}</strong>
            <span class="stock-meta">score</span>
          </span>
          <span class="signal-cell">
            <span class="signal-badge signal-${stock.signal}">${signalLabel(stock.signal)}</span>
          </span>
        </button>
      `;
    })
    .join("") || `<div class="empty-state">ยังไม่มีรายการโปรด กดดาวบนหุ้นที่สนใจเพื่อเพิ่มเข้ารายการ</div>`;
}

function renderNews() {
  newsFeed.innerHTML = newsItems
    .map((item) => `
      <article class="news-item">
        <header>
          <strong>${item.ticker} · ${item.title}</strong>
          <span class="impact">${item.impact}</span>
        </header>
        <p>${item.summary}</p>
      </article>
    `)
    .join("");
}

function renderSelectedStock() {
  const stock = stocks.find((item) => item.ticker === selectedTicker) || stocks[0];
  document.querySelector("#selectedTicker").textContent = stock.ticker;
  document.querySelector("#selectedName").textContent = stock.name;
  document.querySelector("#scoreValue").textContent = stock.score;
  document.querySelector("#entryValue").textContent = formatUsd(stock.entry);
  document.querySelector("#targetValue").textContent = `${formatUsd(stock.targets[0])} / ${formatUsd(stock.targets[1])}`;
  document.querySelector("#stopValue").textContent = formatUsd(stock.stop);
  document.querySelector("#riskValue").textContent = stock.risk;
  document.querySelector("#setupReason").textContent = stock.reason;
  document.querySelector("#technicalBar").style.width = `${stock.technical}%`;
  document.querySelector("#newsBar").style.width = `${stock.news}%`;
  document.querySelector("#marketBar").style.width = `${stock.market}%`;
  document.querySelector("#riskBar").style.width = `${stock.riskScore}%`;
  document.querySelector("#telegramPreview").textContent = buildTelegramMessage(stock);
}

function buildTelegramMessage(stock) {
  const directionIcon = stock.change >= 0 ? "🟢" : "🔴";
  const signalIcon = stock.signal === "buy" ? "🚀" : stock.signal === "risk" ? "⚠️" : "👀";
  const riskIcon = stock.risk === "สูง" ? "🔥" : "🛡️";
  const changeText = `${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}%`;

  return `📈 1-Trade Alert | ${stock.ticker}
${signalIcon} ${signalLabel(stock.signal)} · Score ${stock.score}/100
${directionIcon} Price: ${formatUsd(stock.price)} (${changeText})

━━━━━━━━━━━━━━
🎯 แผนเทรด 1-3 วัน
• Entry / จุดเข้า: ${formatUsd(stock.entry)}
• Take Profit / ขายทำกำไร: ${formatUsd(stock.targets[0])} / ${formatUsd(stock.targets[1])}
• Stop Loss / ตัดขาดทุน: ${formatUsd(stock.stop)}
• Risk / ความเสี่ยง: ${riskIcon} ${stock.risk}

🧠 เหตุผลหลัก
${stock.reason}

⚖️ หมายเหตุ: ใช้เป็นข้อมูลช่วยวิเคราะห์เท่านั้น ไม่ใช่การรับประกันผลตอบแทน`;
}

function simulateTick() {
  if (liveDataMode) return;

  stocks.forEach((stock) => {
    const drift = (Math.random() - 0.48) * 0.42;
    stock.price = Math.max(5, stock.price * (1 + drift / 100));
    stock.change += drift;
    stock.score = Math.max(25, Math.min(96, Math.round(stock.score + (Math.random() - 0.5) * 4)));
  });

  const nasdaq = 19840.22 * (1 + (Math.random() - 0.45) / 700);
  const sp = 6210.44 * (1 + (Math.random() - 0.48) / 900);
  const vix = 14.92 * (1 + (Math.random() - 0.52) / 120);
  const gold = 2356.4 * (1 + (Math.random() - 0.48) / 420);
  document.querySelector("#nasdaqValue").textContent = nasdaq.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.querySelector("#spValue").textContent = sp.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.querySelector("#vixValue").textContent = vix.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.querySelector("#goldValue").textContent = `$${gold.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

  renderStocks();
  renderSelectedStock();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

stockTable.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();
    const ticker = favoriteButton.dataset.favorite;
    if (favoriteTickers.has(ticker)) {
      favoriteTickers.delete(ticker);
      showToast(`นำ ${ticker} ออกจากรายการโปรดแล้ว`);
    } else {
      favoriteTickers.add(ticker);
      showToast(`เพิ่ม ${ticker} ในรายการโปรดแล้ว`);
    }
    saveFavorites();
    renderStocks();
    return;
  }

  const row = event.target.closest(".stock-row");
  if (!row) return;
  selectedTicker = row.dataset.ticker;
  renderStocks();
  renderSelectedStock();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderStocks();
  });
});

document.querySelector("#refreshButton").addEventListener("click", () => {
  loadLiveData({ manual: true });
});

document.querySelector("#telegramButton").addEventListener("click", () => {
  const stock = stocks.find((item) => item.ticker === selectedTicker) || stocks[0];
  fetch("/api/telegram", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ text: buildTelegramMessage(stock) }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.ok) {
        showToast(`ส่ง Telegram alert สำหรับ ${stock.ticker} แล้ว`);
        return;
      }

      const localReady = hasValue(appSettings.telegramToken) && hasValue(appSettings.telegramChatId);
      showToast(localReady ? "ตั้งค่าในเครื่องแล้ว แต่ production secret ยังไม่พร้อม" : "ยังไม่ได้ตั้งค่า Telegram secret บน Cloudflare");
    })
    .catch(() => {
      const localReady = hasValue(appSettings.telegramToken) && hasValue(appSettings.telegramChatId);
      showToast(localReady ? `Telegram config พร้อมสำหรับ ${stock.ticker}` : "ยังไม่ได้ตั้งค่า Telegram Token และ Chat ID");
    });
});

renderStocks();
renderNews();
renderSelectedStock();
setDataMode("demo");
renderScanStatus();
loadLiveData();
window.setInterval(simulateTick, 4200);
window.setInterval(loadLiveData, 90000);

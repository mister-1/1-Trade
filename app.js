let stocks = [
  {
    ticker: "XAUUSD",
    name: "Gold Spot",
    price: 2356.4,
    change: 0.46,
    signal: "buy",
    score: 78,
    entry: 2358,
    targets: [2372, 2388],
    stop: 2339,
    risk: "ปานกลาง",
    reason: "ทองคำยืนเหนือแนวรับระยะสั้น ขณะที่ความเสี่ยง macro และค่าเงินดอลลาร์ยังเป็นตัวแปรสำคัญ",
    technical: 77,
    news: 76,
    market: 71,
    riskScore: 68,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 128.74,
    change: 2.18,
    signal: "buy",
    score: 86,
    entry: 128.5,
    targets: [133, 136],
    stop: 124.8,
    risk: "ปานกลาง",
    reason: "ราคาอยู่เหนือ EMA20/50, volume สูงกว่าค่าเฉลี่ย และข่าว AI demand ยังหนุนกลุ่ม semiconductor",
    technical: 88,
    news: 84,
    market: 78,
    riskScore: 74,
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 246.12,
    change: -1.34,
    signal: "risk",
    score: 54,
    entry: 251.4,
    targets: [258.2, 264],
    stop: 239.9,
    risk: "สูง",
    reason: "ราคาแกว่งกว้างและข่าว margin ยังเป็นแรงกดดัน ระบบให้รอราคายืนเหนือแนวต้านก่อน",
    technical: 52,
    news: 44,
    market: 62,
    riskScore: 38,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 214.83,
    change: 0.44,
    signal: "watch",
    score: 69,
    entry: 216.2,
    targets: [219.5, 223],
    stop: 211.7,
    risk: "ต่ำ-ปานกลาง",
    reason: "แนวโน้มเริ่มฟื้น แต่ volume ยังไม่ชัด รอ breakout พร้อมแรงซื้อจากตลาดรวม",
    technical: 70,
    news: 64,
    market: 72,
    riskScore: 76,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 493.46,
    change: 1.02,
    signal: "buy",
    score: 81,
    entry: 494.2,
    targets: [502.5, 509.4],
    stop: 485.6,
    risk: "ปานกลาง",
    reason: "แรงซื้อในกลุ่ม cloud และ AI ยังหนุน momentum ระยะสั้น แต่ต้องดู Nasdaq ประกอบ",
    technical: 82,
    news: 79,
    market: 80,
    riskScore: 71,
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    price: 161.58,
    change: 1.74,
    signal: "watch",
    score: 73,
    entry: 163.1,
    targets: [168.2, 171.5],
    stop: 157.4,
    risk: "ปานกลาง",
    reason: "หุ้นเริ่มมีแรงซื้อจาก sector rotation แต่ยังต้องรอ volume ยืนยันเหนือแนวต้าน",
    technical: 75,
    news: 70,
    market: 78,
    riskScore: 65,
  },
];

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
const SETTINGS_KEY = "oneTradeSettings";
const appSettings = loadSettings();

const stockTable = document.querySelector("#stockTable");
const newsFeed = document.querySelector("#newsFeed");
const toast = document.querySelector("#toast");

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

function mergeLiveAssets(assets) {
  assets.forEach((asset) => {
    const stock = stocks.find((item) => item.ticker === asset.ticker);
    const price = Number(asset.price);
    const change = Number(asset.change);
    if (!stock || !Number.isFinite(price)) return;

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
    stock.reason = `${asset.sourceLabel || "Live data"} อัปเดตราคา ${formatUsd(price)} (${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}%) ระบบคำนวณจุดเข้า/ขาย/ตัดขาดทุนใหม่จาก momentum ระยะสั้น พร้อมใช้ข่าวประกอบก่อนตัดสินใจ`;
  });
}

function setDataMode(mode, updatedAt) {
  const badge = document.querySelector("#dataModeBadge");
  if (!badge) return;

  if (mode === "live") {
    badge.textContent = updatedAt ? `Live Data · ${updatedAt}` : "Live Data";
    badge.classList.add("ready");
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

async function loadLiveData({ manual = false } = {}) {
  try {
    const response = await fetch("/api/data?symbols=XAUUSD,NVDA,TSLA,AAPL,MSFT,AMD", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const payload = await response.json();
    liveDataMode = payload.mode === "live";

    if (Array.isArray(payload.assets) && payload.assets.length > 0) {
      mergeLiveAssets(payload.assets);
    }

    if (Array.isArray(payload.news) && payload.news.length > 0) {
      newsItems = payload.news;
    }

    setDataMode(payload.mode, normalizeUpdatedAt(payload.updatedAt));
    renderStocks();
    renderNews();
    renderSelectedStock();

    if (manual) {
      showToast(liveDataMode ? "ดึงข้อมูลจริงล่าสุดแล้ว" : "ยังไม่ได้ตั้งค่า API secret จึงใช้ข้อมูลตัวอย่าง");
    }
  } catch (error) {
    liveDataMode = false;
    setDataMode("error");
    if (manual) showToast("ยังเชื่อม API จริงไม่ได้ ระบบใช้ข้อมูลตัวอย่างต่อไป");
  }
}

function renderStocks() {
  const filtered = stocks.filter((stock) => activeFilter === "all" || stock.signal === activeFilter);
  stockTable.innerHTML = filtered
    .map((stock) => {
      const active = stock.ticker === selectedTicker ? " active" : "";
      const direction = stock.change >= 0 ? "up" : "down";
      return `
        <button class="stock-row${active}" type="button" data-ticker="${stock.ticker}">
          <span class="stock-title">
            <span class="ticker-chip">${stock.ticker}</span>
            <span>
              <strong>${stock.name}</strong>
              <span class="stock-meta">${stock.ticker} · Holding 1-3 วัน</span>
            </span>
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
    .join("");
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
loadLiveData();
window.setInterval(simulateTick, 4200);
window.setInterval(loadLiveData, 90000);

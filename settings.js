const SETTINGS_KEY = "oneTradeSettings";
let appSettings = loadSettings();

const toast = document.querySelector("#toast");

function loadSettings() {
  try {
    const saved = window.localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSettings(nextSettings) {
  appSettings = { ...appSettings, ...nextSettings };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
  renderSettings();
}

function hasValue(value) {
  return Boolean(String(value || "").trim());
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setStatusText(id, text, ready) {
  const element = document.querySelector(id);
  element.textContent = text;
  element.classList.toggle("ready", ready);
  element.classList.toggle("warning", !ready);
}

function renderSettings() {
  document.querySelector("#telegramToken").value = appSettings.telegramToken || "";
  document.querySelector("#telegramChatId").value = appSettings.telegramChatId || "";
  document.querySelector("#telegramChannel").value = appSettings.telegramChannel || "";
  document.querySelector("#marketProvider").value = appSettings.marketProvider || "mock";
  document.querySelector("#marketApiKey").value = appSettings.marketApiKey || "";
  document.querySelector("#goldApiKey").value = appSettings.goldApiKey || "";
  document.querySelector("#newsApiKey").value = appSettings.newsApiKey || "";
  document.querySelector("#aiApiKey").value = appSettings.aiApiKey || "";

  const telegramReady = hasValue(appSettings.telegramToken) && hasValue(appSettings.telegramChatId);
  const marketReady = appSettings.marketProvider && appSettings.marketProvider !== "mock" && hasValue(appSettings.marketApiKey);
  const goldReady = hasValue(appSettings.goldApiKey);
  const newsReady = hasValue(appSettings.newsApiKey);

  setStatusText("#backendStatus", "พร้อมรับ Cloudflare Secrets", true);
  setStatusText("#telegramStatus", telegramReady ? "พร้อมส่ง Alert" : "ยังไม่ตั้งค่า", telegramReady);
  setStatusText("#marketStatus", marketReady ? `${appSettings.marketProvider} พร้อมใช้` : "Mock Data", marketReady);
  setStatusText("#goldStatus", goldReady ? "พร้อมดึง XAUUSD" : "Mock Data", goldReady);
  setStatusText("#newsStatus", newsReady ? "Marketaux พร้อมใช้" : "Mock News", newsReady);

  const liveReady = marketReady || goldReady || newsReady;
  document.querySelector("#dataModeBadge").textContent = liveReady ? "Configured" : "Mock Data";
  document.querySelector("#settingsStatus").textContent = liveReady ? "READY" : "LOCAL";
}

document.querySelector("#telegramForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveSettings({
    telegramToken: document.querySelector("#telegramToken").value.trim(),
    telegramChatId: document.querySelector("#telegramChatId").value.trim(),
    telegramChannel: document.querySelector("#telegramChannel").value.trim(),
  });
  showToast("บันทึกการตั้งค่า Telegram แล้ว");
});

document.querySelector("#apiForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveSettings({
    marketProvider: document.querySelector("#marketProvider").value,
    marketApiKey: document.querySelector("#marketApiKey").value.trim(),
    goldApiKey: document.querySelector("#goldApiKey").value.trim(),
    newsApiKey: document.querySelector("#newsApiKey").value.trim(),
    aiApiKey: document.querySelector("#aiApiKey").value.trim(),
  });
  showToast("บันทึก API settings แล้ว");
});

document.querySelector("#checkTelegramButton").addEventListener("click", () => {
  const token = document.querySelector("#telegramToken").value.trim();
  const chatId = document.querySelector("#telegramChatId").value.trim();
  showToast(token && chatId ? "Telegram config รูปแบบพร้อมใช้งาน" : "กรุณาใส่ Bot Token และ Chat ID ให้ครบ");
});

document.querySelector("#clearSettingsButton").addEventListener("click", () => {
  window.localStorage.removeItem(SETTINGS_KEY);
  appSettings = {};
  renderSettings();
  showToast("ล้างค่าหลังบ้านเรียบร้อยแล้ว");
});

renderSettings();

const toast = document.querySelector("#toast");

function setStatusText(id, text, ready) {
  const element = document.querySelector(id);
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("ready", ready);
  element.classList.toggle("warning", !ready);
}

function setMode(text, ready) {
  const badge = document.querySelector("#dataModeBadge");
  const status = document.querySelector("#settingsStatus");
  if (badge) {
    badge.textContent = text;
    badge.classList.toggle("ready", ready);
  }
  if (status) {
    status.textContent = ready ? "READY" : "CHECK";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

async function checkDataStatus() {
  try {
    const response = await fetch("/api/data?liveLimit=8&offset=0", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`API ${response.status}`);

    const payload = await response.json();
    const marketProviders = payload.provider?.marketProviders || [];
    const marketReady = marketProviders.length > 0;
    const newsReady = payload.provider?.news === "marketaux";
    const ready = marketReady && newsReady;
    const marketLabel = marketProviders.length ? marketProviders.join(" + ") : "Fallback Data";
    const freshCount = payload.freshness?.fresh || 0;
    const staleCount = payload.freshness?.stale || 0;

    setStatusText("#backendStatus", "Cloudflare Functions พร้อม", true);
    setStatusText("#marketStatus", marketReady ? `${marketLabel} · fresh ${freshCount} stale ${staleCount}` : "Fallback Data", marketReady);
    setStatusText("#newsStatus", newsReady ? "Marketaux Live" : "Fallback News", newsReady);
    setStatusText("#scannerStatus", `${payload.universeSize || 0} รายการ · batch ${payload.liveBatch?.size || 0}`, true);
    setMode(ready ? "Production Live" : "Partial Live", ready);
  } catch {
    setStatusText("#backendStatus", "เปิดจาก local/static", false);
    setStatusText("#marketStatus", "ตรวจบน production URL", false);
    setStatusText("#newsStatus", "ตรวจบน production URL", false);
    setStatusText("#scannerStatus", "รอ Cloudflare Functions", false);
    setMode("Local Preview", false);
  }
}

async function checkTelegramStatus() {
  try {
    const response = await fetch("/api/telegram", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Telegram ${response.status}`);

    const payload = await response.json();
    setStatusText("#telegramTokenStatus", payload.hasToken ? "พร้อม" : "ยังไม่พบ", payload.hasToken);
    setStatusText("#telegramChatStatus", payload.hasChatId ? "พร้อม" : "ยังไม่พบ", payload.hasChatId);
    setStatusText("#telegramStatus", payload.configured ? "พร้อมส่ง Alert" : "ต้องตั้ง Secret", payload.configured);
  } catch {
    setStatusText("#telegramTokenStatus", "ตรวจบน production URL", false);
    setStatusText("#telegramChatStatus", "ตรวจบน production URL", false);
    setStatusText("#telegramStatus", "ใช้ production เพื่อตรวจ", false);
  }
}

Promise.all([checkDataStatus(), checkTelegramStatus()]).catch(() => {
  showToast("ยังตรวจสถานะ production ไม่สำเร็จ");
});

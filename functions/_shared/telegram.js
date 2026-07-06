function formatUsd(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "$--";
  return `$${numeric.toFixed(2)}`;
}

function formatChange(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00%";
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}%`;
}

export function buildTelegramMessage(signals, meta = {}) {
  const topSignals = signals.slice(0, meta.limit || 5);
  const title = meta.title || "1-Trade Auto Scanner";
  const round = meta.round || "auto";
  const updatedAt = meta.updatedAt || new Date().toISOString();
  const lines = [
    `${title}`,
    `Round: ${round} | ${updatedAt}`,
    `Mode: ${meta.mode || "scan"} | Fresh: ${meta.freshCount ?? 0} | Stale: ${meta.staleCount ?? 0}`,
    "",
  ];

  if (!topSignals.length) {
    lines.push("No high quality setup passed the current filters.");
  }

  topSignals.forEach((signal, index) => {
    lines.push(`${index + 1}. ${signal.ticker} | ${signal.signal} | Confidence ${signal.confidence}/100`);
    lines.push(`Price ${formatUsd(signal.price)} (${formatChange(signal.change)})`);
    lines.push(`Entry ${formatUsd(signal.setup.entry)} | TP ${formatUsd(signal.setup.targets[0])}/${formatUsd(signal.setup.targets[1])} | SL ${formatUsd(signal.setup.stop)}`);
    lines.push(signal.reasons.join(" | "));
    lines.push("");
  });

  lines.push("Use as analysis support only. Confirm price with broker and control risk before trading.");
  return lines.join("\n").slice(0, 3900);
}

export async function sendTelegram(env, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, mode: "not_configured" };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
  const result = await response.json().catch(() => ({}));
  return {
    ok: response.ok && result.ok !== false,
    status: response.status,
    description: result.description || "",
  };
}


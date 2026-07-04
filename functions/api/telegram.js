function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store",
      ...init.headers,
    },
  });
}

function safeText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 3500);
}

export async function onRequestGet(context) {
  const hasToken = Boolean(context.env.TELEGRAM_BOT_TOKEN);
  const hasChatId = Boolean(context.env.TELEGRAM_CHAT_ID);

  return json({
    ok: true,
    configured: hasToken && hasChatId,
    hasToken,
    hasChatId,
  });
}

export async function onRequestPost(context) {
  const token = context.env.TELEGRAM_BOT_TOKEN;
  const chatId = context.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return json(
      {
        ok: false,
        mode: "not_configured",
        message: "ยังไม่ได้ตั้งค่า TELEGRAM_BOT_TOKEN และ TELEGRAM_CHAT_ID บน Cloudflare",
      },
      { status: 200 },
    );
  }

  let body = {};
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, message: "รูปแบบข้อความไม่ถูกต้อง" }, { status: 400 });
  }

  const text = safeText(body.text, "1-Trade test alert");
  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const result = await response.json().catch(() => ({}));

  return json({
    ok: response.ok && result.ok !== false,
    mode: "live",
    status: response.status,
    description: result.description || "",
  });
}

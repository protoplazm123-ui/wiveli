import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const update = await request.json();

    const message = update?.message;

    if (!message?.text || !message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();

    // Нас интересует только /start
    if (!text.startsWith("/start")) {
      return NextResponse.json({ ok: true });
    }

    const parts = text.split(" ");
    const connectCode = parts[1];

    // Обычный /start без кода
    if (!connectCode) {
      await sendTelegramMessage(
        message.chat.id,
        "Welcome to WIVELI ♡\n\nOpen your WIVELI account and choose Connect Telegram."
      );

      return NextResponse.json({ ok: true });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      throw new Error("Supabase is not configured.");
    }

    // Ищем одноразовый код
    const connectionResponse = await fetch(
      `${supabaseUrl}/rest/v1/telegram_connections?connect_code=eq.${encodeURIComponent(
        connectCode
      )}&connected=eq.false&select=*`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!connectionResponse.ok) {
      throw new Error("Could not read Telegram connection.");
    }

    const connections = await connectionResponse.json();
    const connection = connections?.[0];

    if (!connection) {
      await sendTelegramMessage(
        message.chat.id,
        "This connection link is invalid or has already been used."
      );

      return NextResponse.json({ ok: true });
    }

    // Привязываем Telegram
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/telegram_connections?id=eq.${connection.id}`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegram_chat_id: message.chat.id,
          telegram_user_id: message.from?.id || null,
          telegram_username: message.from?.username || null,

          connected: true,
          connected_at: new Date().toISOString(),

          // Код больше нельзя использовать
          connect_code: null,
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error("Telegram connection update:", error);

      throw new Error("Could not save Telegram connection.");
    }

    await sendTelegramMessage(
      message.chat.id,
      "Telegram connected ♡\n\nYour WIVELI account can now send you gift updates and notifications."
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    // Telegram лучше всегда отвечать 200,
    // иначе он будет повторно присылать update.
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("Telegram bot token is missing.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    }
  );

  const data = await response.json();

  if (!data.ok) {
    console.error("Telegram send error:", data);
  }

  return data;
}

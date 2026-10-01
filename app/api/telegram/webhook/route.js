import { NextResponse } from "next/server";

const WIVELI_URL = "https://wiveli.vercel.app";

export async function POST(request) {
  try {
    const update = await request.json();
    const message = update?.message;

    if (!message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    // =========================
    // /START
    // =========================

    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const connectCode = parts[1];

      // Если пришли из WIVELI через персональную ссылку
      if (connectCode) {
        const connected = await connectAccount(
          connectCode,
          message
        );

        if (!connected) {
          await sendMessage(
            chatId,
            "This connection link is invalid or has already been used."
          );

          return NextResponse.json({ ok: true });
        }

        await sendMainMenu(
          chatId,
          "Telegram connected ♡\n\nWelcome to WIVELI. Your account is now connected."
        );

        return NextResponse.json({ ok: true });
      }

      // Обычный /start
      await sendMainMenu(
        chatId,
        "Welcome to WIVELI ♡\n\nMeaningful gifts, memories and experiences — made for someone special."
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // MY GIFTS
    // =========================

    if (text === "🎁 My Gifts") {
      await sendMessage(
        chatId,
        "🎁 <b>My Gifts</b>\n\nYour WIVELI gifts and their delivery status will appear here.",
        {
          inline_keyboard: [
            [
              {
                text: "Open My Account",
                url: `${WIVELI_URL}/account`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // CREATE A GIFT
    // =========================

    if (text === "✨ Create a Gift") {
      await sendMessage(
        chatId,
        "✨ <b>Create a Gift</b>\n\nChoose an experience and turn it into something made just for them.",
        {
          inline_keyboard: [
            [
              {
                text: "Create on WIVELI →",
                url: `${WIVELI_URL}/#ideas`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // UNIQUE GIFT
    // =========================

    if (text === "💎 Unique Gift") {
      await sendMessage(
        chatId,
        "💎 <b>WIVELI BESPOKE</b>\n\n<b>Your wish. Our creation.</b>\n\nTell us about someone special and the experience you want to give them. Our team will help turn your idea into a completely unique gift.",
        {
          inline_keyboard: [
            [
              {
                text: "✨ Tell Us Your Idea",
                url: `${WIVELI_URL}/experiences/unique-gift`,
              },
            ],
            [
              {
                text: "💬 Contact WIVELI Team",
                callback_data: "contact_team",
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // CONTACT TEAM
    // =========================

    if (text === "💬 Contact WIVELI Team") {
      await sendMessage(
        chatId,
        "💬 <b>WIVELI Concierge</b>\n\nNeed help, have an idea or want to create something completely unique?\n\nChoose how you'd like to contact us:",
        {
          inline_keyboard: [
            [
              {
                text: "✉️ Write to the Team",
                callback_data: "contact_team",
              },
            ],
            [
              {
                text: "✨ Unique Gift Request",
                url: `${WIVELI_URL}/experiences/unique-gift`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // PAYMENTS
    // =========================

    if (text === "💳 Payments & Orders") {
      await sendMessage(
        chatId,
        "💳 <b>Payments & Orders</b>\n\nView your orders, payment status and purchase history in your WIVELI account.",
        {
          inline_keyboard: [
            [
              {
                text: "View Orders →",
                url: `${WIVELI_URL}/account`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // ACCOUNT
    // =========================

    if (text === "👤 My Account") {
      await sendMessage(
        chatId,
        "👤 <b>My WIVELI</b>\n\nManage your profile, gifts, orders and notifications.",
        {
          inline_keyboard: [
            [
              {
                text: "Open My Account →",
                url: `${WIVELI_URL}/account`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // =========================
    // OPEN WIVELI
    // =========================

    if (text === "🌐 Open WIVELI") {
      await sendMessage(
        chatId,
        "Open WIVELI ♡",
        {
          inline_keyboard: [
            [
              {
                text: "Open WIVELI →",
                url: WIVELI_URL,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // Неизвестное сообщение
    await sendMainMenu(
      chatId,
      "Choose what you'd like to do ♡"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return NextResponse.json({ ok: true });
  }
}


// =====================================================
// CALLBACK BUTTONS
// =====================================================

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "WIVELI Telegram Bot",
  });
}


// =====================================================
// CONNECT TELEGRAM ACCOUNT
// =====================================================

async function connectAccount(connectCode, message) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error("Could not read Telegram connection.");
  }

  const connections = await response.json();
  const connection = connections?.[0];

  if (!connection) {
    return false;
  }

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

        connect_code: null,
      }),
    }
  );

  if (!updateResponse.ok) {
    throw new Error("Could not save Telegram connection.");
  }

  return true;
}


// =====================================================
// MAIN BOT MENU
// =====================================================

async function sendMainMenu(chatId, text) {
  return sendTelegram({
    chat_id: chatId,

    text,

    parse_mode: "HTML",

    reply_markup: {
      keyboard: [
        [
          {
            text: "🎁 My Gifts",
          },
          {
            text: "✨ Create a Gift",
          },
        ],

        [
          {
            text: "💎 Unique Gift",
          },
        ],

        [
          {
            text: "💬 Contact WIVELI Team",
          },
        ],

        [
          {
            text: "💳 Payments & Orders",
          },
          {
            text: "👤 My Account",
          },
        ],

        [
          {
            text: "🌐 Open WIVELI",
          },
        ],
      ],

      resize_keyboard: true,
      is_persistent: true,
    },
  });
}


// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage(
  chatId,
  text,
  inlineKeyboard = null
) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };

  if (inlineKeyboard) {
    payload.reply_markup = inlineKeyboard;
  }

  return sendTelegram(payload);
}


// =====================================================
// TELEGRAM API
// =====================================================

async function sendTelegram(payload) {
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

      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!data.ok) {
    console.error("Telegram API error:", data);
  }

  return data;
}

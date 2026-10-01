import { NextResponse } from "next/server";

const WIVELI_URL = "https://wiveli.vercel.app";

export async function POST(request) {
  try {
    const update = await request.json();
console.log("TELEGRAM UPDATE:", JSON.stringify(update));
    // INLINE BUTTONS
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return NextResponse.json({ ok: true });
    }

    const message = update?.message;

    if (!message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    // START
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const connectCode = parts[1];

      if (connectCode) {
        const connected = await connectAccount(connectCode, message);

        if (!connected) {
          await sendMessage(
            chatId,
            "This connection link is invalid or has already been used."
          );

          return NextResponse.json({ ok: true });
        }

        await sendMainMenu(
          chatId,
          "♡ <b>Welcome to WIVELI</b>\n\nYour account is connected.\nYour WIVELI Assistant is ready."
        );

        return NextResponse.json({ ok: true });
      }

      await sendMainMenu(
        chatId,
        "♡ <b>Welcome to WIVELI</b>\n\nYour personal assistant for meaningful gifts, memories and experiences."
      );

      return NextResponse.json({ ok: true });
    }

    // MY GIFTS
    if (text === "🎁 MY GIFTS") {
      await sendMessage(
        chatId,
        "🎁 <b>MY GIFTS</b>\n\nEverything you've created or received through WIVELI lives here.",
        {
          inline_keyboard: [
            [
              {
                text: "OPEN MY GIFTS →",
                url: `${WIVELI_URL}/account`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // CREATE
    if (text === "✦ CREATE") {
      await sendMessage(
        chatId,
        "✦ <b>CREATE A GIFT</b>\n\nChoose an experience and make it personal.",
        {
          inline_keyboard: [
            [
              {
                text: "EXPLORE EXPERIENCES →",
                url: `${WIVELI_URL}/#ideas`,
              },
            ],
            [
              {
                text: "✦ WIVELI BESPOKE",
                url: `${WIVELI_URL}/experiences/unique-gift`,
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // BESPOKE
    if (text === "💎 WIVELI BESPOKE") {
      await sendMessage(
        chatId,
        "💎 <b>WIVELI BESPOKE</b>\n\n<b>Your wish. Our creation.</b>\n\nTell us about someone special and what you want them to feel. Together with the WIVELI team, we'll turn your idea into a completely unique experience.",
        {
          inline_keyboard: [
            [
              {
                text: "✦ START YOUR REQUEST",
                url: `${WIVELI_URL}/experiences/unique-gift`,
              },
            ],
            [
              {
                text: "♡ TALK TO WIVELI",
                callback_data: "contact_team",
              },
            ],
          ],
        }
      );

      return NextResponse.json({ ok: true });
    }

    // MY WIVELI
    if (text === "♡ MY WIVELI") {
      await showMyWiveli(chatId);

      return NextResponse.json({ ok: true });
    }

    // FALLBACK
    await sendMainMenu(
      chatId,
      "What would you like to do? ♡"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "WIVELI Telegram Bot",
  });
}

/* -------------------------------- */
/* CALLBACK BUTTONS                 */
/* -------------------------------- */

async function handleCallback(callback) {
  const chatId = callback.message?.chat?.id;
  const data = callback.data;

  if (!chatId) return;

  await answerCallback(callback.id);

  // MY ACCOUNT
  if (data === "my_account") {
    await sendMessage(
      chatId,
      "♡ <b>MY ACCOUNT</b>\n\nManage your WIVELI profile and connected services.",
      {
        inline_keyboard: [
          [
            {
              text: "OPEN ACCOUNT →",
              url: `${WIVELI_URL}/account`,
            },
          ],
          [
            {
              text: "← BACK",
              callback_data: "my_wiveli",
            },
          ],
        ],
      }
    );

    return;
  }

  // ORDERS
  if (data === "orders") {
    await sendMessage(
      chatId,
      "◌ <b>ORDERS & PAYMENTS</b>\n\nView your purchases, payment status and gift history.",
      {
        inline_keyboard: [
          [
            {
              text: "VIEW ORDERS →",
              url: `${WIVELI_URL}/account`,
            },
          ],
          [
            {
              text: "← BACK",
              callback_data: "my_wiveli",
            },
          ],
        ],
      }
    );

    return;
  }

  // NOTIFICATIONS
  if (data === "notifications") {
    await sendMessage(
      chatId,
      "♢ <b>NOTIFICATIONS</b>\n\nWIVELI can send gift updates, delivery events and important account notifications directly here.",
      {
        inline_keyboard: [
          [
            {
              text: "← BACK",
              callback_data: "my_wiveli",
            },
          ],
        ],
      }
    );

    return;
  }

  // CONTACT TEAM
  if (data === "contact_team") {
    await sendMessage(
      chatId,
      "♡ <b>WIVELI CONCIERGE</b>\n\nTell us what you need help with.\n\nDirect conversation with the WIVELI team will live right here inside your assistant.",
      {
        inline_keyboard: [
          [
            {
              text: "✦ WIVELI BESPOKE",
              url: `${WIVELI_URL}/experiences/unique-gift`,
            },
          ],
          [
            {
              text: "← BACK",
              callback_data: "my_wiveli",
            },
          ],
        ],
      }
    );

    return;
  }

  // BACK TO MY WIVELI
  if (data === "my_wiveli") {
    await showMyWiveli(chatId);
  }
}

/* -------------------------------- */
/* MY WIVELI                        */
/* -------------------------------- */

async function showMyWiveli(chatId) {
  await sendMessage(
    chatId,
    "♡ <b>MY WIVELI</b>\n\nYour personal space for gifts, orders and support.",
    {
      inline_keyboard: [
        [
          {
            text: "♡ MY ACCOUNT",
            callback_data: "my_account",
          },
        ],
        [
          {
            text: "◌ ORDERS & PAYMENTS",
            callback_data: "orders",
          },
        ],
        [
          {
            text: "♢ NOTIFICATIONS",
            callback_data: "notifications",
          },
        ],
        [
          {
            text: "♡ CONTACT WIVELI TEAM",
            callback_data: "contact_team",
          },
        ],
        [
          {
            text: "OPEN WIVELI →",
            url: WIVELI_URL,
          },
        ],
      ],
    }
  );
}

/* -------------------------------- */
/* ACCOUNT CONNECTION               */
/* -------------------------------- */

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

  if (!connection) return false;

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

/* -------------------------------- */
/* MAIN MENU                        */
/* -------------------------------- */

async function sendMainMenu(chatId, text) {
  return sendTelegram({
    chat_id: chatId,

    text,

    parse_mode: "HTML",

    reply_markup: {
      keyboard: [
        [
          { text: "🎁 MY GIFTS" },
          { text: "✦ CREATE" },
        ],
        [
          { text: "💎 WIVELI BESPOKE" },
        ],
        [
          { text: "♡ MY WIVELI" },
        ],
      ],

      resize_keyboard: true,
      is_persistent: true,
    },
  });
}

/* -------------------------------- */
/* TELEGRAM                         */
/* -------------------------------- */

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

async function answerCallback(callbackQueryId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) return;

  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        callback_query_id: callbackQueryId,
      }),
    }
  );
}

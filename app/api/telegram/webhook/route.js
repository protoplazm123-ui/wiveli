import { giftPath } from "../../../lib/gift-links";
import { NextResponse } from "next/server";
import { sendOnce as sendGiftOnce } from "../../../lib/gift-telegram";

const WIVELI_URL = "https://wiveli.vercel.app";

export async function POST(request) {
  try {
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret && request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    const update = await request.json();

    /* ======================================== */
    /* INLINE BUTTONS                           */
    /* ======================================== */

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

    /* ======================================== */
    /* IGNORE GROUPS FOR NOW                    */
    /* ======================================== */

    if (
      message.chat.type === "group" ||
      message.chat.type === "supergroup"
    ) {
      return NextResponse.json({ ok: true });
    }

    // Remember Telegram chats independently from WIVELI accounts.
    // Receiving a private message means this person has already opened the bot.
    if (message.chat.type === "private" && message.from?.id === message.chat.id) {
      await supabaseRequest("/rest/v1/wiveli_telegram_contacts?on_conflict=telegram_chat_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          telegram_chat_id: message.chat.id,
          telegram_user_id: message.from.id,
          telegram_username: message.from.username || null,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    /* ======================================== */
    /* START                                    */
    /* ======================================== */

    if (text.startsWith("/start")) {
      const parts = text.split(/\s+/);
      const connectCode = parts[1];

      if (connectCode?.startsWith("gift_")) {
        const token = connectCode.slice(5);
        if (!/^[0-9a-f-]{36}$/i.test(token)) {
          await sendMessage(chatId, "This gift invitation is invalid.");
          return NextResponse.json({ ok: true });
        }
        const [recipient] = await supabaseRequest(
          `/rest/v1/gift_participants?claim_token=eq.${encodeURIComponent(token)}&role=eq.recipient&select=gift_id&limit=1`
        );
        if (!recipient) {
          await sendMessage(chatId, "This gift invitation is invalid or expired.");
          return NextResponse.json({ ok: true });
        }
        const giftId = recipient.gift_id;
        const [invitation] = await supabaseRequest(
          `/rest/v1/wiveli_gift_invitations?gift_id=eq.${encodeURIComponent(giftId)}&select=origin&limit=1`
        );
        const [gift] = await supabaseRequest(
          `/rest/v1/gifts?id=eq.${encodeURIComponent(giftId)}&gift_type=in.(love-coupons,wish-note,our-story,open-when)&select=gift_type,gift_data&limit=1`
        );
        if (!gift || !invitation?.origin) {
          await sendMessage(chatId, "Please ask the sender for a new invitation link.");
          return NextResponse.json({ ok: true });
        }
        await sendGiftOnce({
          key: `gift-invite:${giftId}:${chatId}`, giftId, userId: null,
          payload: {
            chat_id: chatId,
            text: `You received a WIVELI gift from ${String(gift.gift_data?.senderName || "someone special").slice(0,100)} ♡\n\nOpen your gift below — no registration needed.`,
            reply_markup: { inline_keyboard: [[{
              text: "OPEN YOUR GIFT ♡",
              url: `${invitation.origin}${giftPath(gift.gift_type, giftId)}?claim=${encodeURIComponent(token)}`,
            }]] },
          },
        });
        return NextResponse.json({ ok: true });
      }

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

    /* ======================================== */
    /* CHECK PENDING ACTION                     */
    /* ======================================== */

    const connection =
      await getTelegramConnectionByChat(chatId);

    if (
      connection?.pending_action &&
      connection?.pending_event_id &&
      text
    ) {
      const handled = await handlePendingAction(
        connection,
        text
      );

      if (handled) {
        return NextResponse.json({ ok: true });
      }
    }

    /* ======================================== */
    /* MAIN MENU                                */
    /* ======================================== */

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

    if (text === "💎 WIVELI BESPOKE") {
      await sendMessage(
        chatId,
        "💎 <b>WIVELI BESPOKE</b>\n\n<b>Your wish. Our creation.</b>\n\nTell us about someone special and what you want them to feel.",
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

    if (text === "♡ MY WIVELI") {
      await showMyWiveli(chatId);
      return NextResponse.json({ ok: true });
    }

    await sendMainMenu(
      chatId,
      "What would you like to do? ♡"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Telegram webhook error:",
      error
    );

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

/* ======================================== */
/* GET                                      */
/* ======================================== */

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "WIVELI Telegram Bot",
  });
}

/* ======================================== */
/* CALLBACKS                                */
/* ======================================== */

async function handleCallback(callback) {
  const chatId = callback.message?.chat?.id;
  const data = callback.data || "";

  if (!chatId) return;

  await answerCallback(callback.id);

  // START on the gift message opens the gift without creating a website account.
  if (data.startsWith("gift_start:")) {
    if (callback.message?.chat?.type !== "private" || callback.from?.id !== chatId) return;
    const giftId = data.slice("gift_start:".length);
    if (!/^[0-9a-f-]{36}$/i.test(giftId)) return;
    const [delivery] = await supabaseRequest(
      `/rest/v1/wiveli_telegram_messages?message_key=eq.${encodeURIComponent(`gift:${giftId}`)}&status=eq.sent&select=target_chat_id,delivery_origin`
    );
    if (!delivery || String(delivery.target_chat_id) !== String(chatId)) {
      await sendMessage(chatId, "This gift is not available in this chat yet. Please try again shortly.");
      return;
    }
    const [recipient] = await supabaseRequest(
      `/rest/v1/gift_participants?gift_id=eq.${encodeURIComponent(giftId)}&role=eq.recipient&select=claim_token&limit=1`
    );
    if (!recipient?.claim_token || !delivery.delivery_origin) return;
    const [gift] = await supabaseRequest(`/rest/v1/gifts?id=eq.${encodeURIComponent(giftId)}&gift_type=in.(love-coupons,wish-note,our-story,open-when)&select=gift_type&limit=1`);
    if (!gift) return;
    const giftUrl = `${delivery.delivery_origin}${giftPath(gift.gift_type, giftId)}?claim=${encodeURIComponent(recipient.claim_token)}`;
    await sendGiftOnce({
      key: `gift-open:${giftId}`, giftId, userId: null,
      payload: {
        chat_id: chatId,
        text: "Your WIVELI gift is ready ♡\n\nOpen it below — no registration needed.",
        reply_markup: { inline_keyboard: [[{ text: "OPEN YOUR GIFT ♡", url: giftUrl }]] },
      },
    });
    return;
  }

  /* ACCEPT INVITATION */

  if (data.startsWith("gift_accept:")) {
    const eventId = data.replace(
      "gift_accept:",
      ""
    );

    await acceptGiftEvent(
      eventId,
      chatId
    );

    return;
  }

  /* SUGGEST ANOTHER TIME */

  if (data.startsWith("gift_reschedule:")) {
    const eventId = data.replace(
      "gift_reschedule:",
      ""
    );

    await setPendingAction(
      chatId,
      "reschedule",
      eventId
    );

    await sendMessage(
      chatId,
      "♡ <b>SUGGEST ANOTHER TIME</b>\n\nSend the date, time or alternative you'd prefer.\n\nFor example:\n<code>October 14 · 7:30 PM</code>"
    );

    return;
  }

  /* REPLY TO GIFT MESSAGE */

  if (data.startsWith("gift_reply:")) {
    const eventId = data.replace(
      "gift_reply:",
      ""
    );

    await setPendingAction(
      chatId,
      "reply",
      eventId
    );

    await sendMessage(
      chatId,
      "♡ <b>WRITE YOUR REPLY</b>\n\nSend your message here and WIVELI will deliver it for you."
    );

    return;
  }

  /* MY WIVELI */

  if (data === "my_wiveli") {
    await showMyWiveli(chatId);
    return;
  }

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

  if (data === "notifications") {
    await sendMessage(
      chatId,
      "♢ <b>NOTIFICATIONS</b>\n\nGift updates, invitations and important WIVELI events can appear directly here.",
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

  if (data === "contact_team") {
    await sendMessage(
      chatId,
      "♡ <b>WIVELI CONCIERGE</b>\n\nDirect conversation with the WIVELI team is being prepared here.",
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
  }
}

/* ======================================== */
/* ACCEPT EVENT                             */
/* ======================================== */

async function acceptGiftEvent(
  eventId,
  chatId
) {
  const connection =
    await getTelegramConnectionByChat(chatId);

  if (!connection?.user_id) {
    await sendMessage(
      chatId,
      "Please connect your WIVELI account first ♡"
    );

    return;
  }

  const event = await getGiftEvent(eventId);

  if (!event) {
    await sendMessage(
      chatId,
      "This invitation could not be found."
    );

    return;
  }

  /* Security: only target can accept */

  if (
    event.target_user_id !==
    connection.user_id
  ) {
    await sendMessage(
      chatId,
      "This invitation isn't assigned to this account."
    );

    return;
  }

  await updateGiftEvent(eventId, {
    status: "accepted",
    responded_at:
      new Date().toISOString(),
  });

  await sendMessage(
    chatId,
    "♡ <b>IT'S A DATE</b>\n\nYour response has been sent."
  );

  await notifyOtherParticipant(
    event,
    connection.user_id,
    "♡ <b>IT'S A DATE</b>\n\nYour invitation was accepted."
  );
}

/* ======================================== */
/* PENDING TEXT RESPONSE                    */
/* ======================================== */

async function handlePendingAction(
  connection,
  text
) {
  const event =
    await getGiftEvent(
      connection.pending_event_id
    );

  if (!event) {
    await clearPendingAction(
      connection.id
    );

    return false;
  }

  /* Security */

  if (
    event.target_user_id !==
    connection.user_id
  ) {
    await clearPendingAction(
      connection.id
    );

    return false;
  }

  /* RESCHEDULE */

  if (
    connection.pending_action ===
    "reschedule"
  ) {
    await updateGiftEvent(event.id, {
      status: "reschedule_proposed",

      responded_at:
        new Date().toISOString(),

      data: {
        ...(event.data || {}),
        suggested_time: text,
      },
    });

    await notifyOtherParticipant(
      event,
      connection.user_id,
      `♡ <b>A NEW TIME WAS SUGGESTED</b>\n\n${escapeHtml(
        text
      )}`
    );

    await clearPendingAction(
      connection.id
    );

    await sendMessage(
      connection.telegram_chat_id,
      "♡ Your suggestion has been sent."
    );

    return true;
  }

  /* REPLY */

  if (
    connection.pending_action ===
    "reply"
  ) {
    await notifyOtherParticipant(
      event,
      connection.user_id,
      `♡ <b>FROM YOUR WIVELI GIFT</b>\n\n“${escapeHtml(
        text
      )}”`
    );

    await clearPendingAction(
      connection.id
    );

    await sendMessage(
      connection.telegram_chat_id,
      "♡ Your reply has been delivered."
    );

    return true;
  }

  return false;
}

/* ======================================== */
/* SEND TO OTHER PARTICIPANT                */
/* ======================================== */

async function notifyOtherParticipant(
  event,
  currentUserId,
  text
) {
  let otherUserId;

  if (
    currentUserId ===
    event.target_user_id
  ) {
    otherUserId =
      event.actor_user_id;
  } else {
    otherUserId =
      event.target_user_id;
  }

  if (!otherUserId) return false;

  const telegram =
    await getTelegramByUserId(
      otherUserId
    );

  if (
    !telegram?.telegram_chat_id ||
    !telegram?.connected
  ) {
    return false;
  }

  await sendMessage(
    telegram.telegram_chat_id,
    text
  );

  return true;
}

/* ======================================== */
/* MY WIVELI                               */
/* ======================================== */

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

/* ======================================== */
/* DATABASE HELPERS                         */
/* ======================================== */

async function getGiftEvent(eventId) {
  const rows = await supabaseRequest(
    `/rest/v1/gift_events?id=eq.${encodeURIComponent(
      eventId
    )}&select=*&limit=1`
  );

  return rows?.[0] || null;
}

async function updateGiftEvent(
  eventId,
  data
) {
  return supabaseRequest(
    `/rest/v1/gift_events?id=eq.${encodeURIComponent(
      eventId
    )}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

async function getTelegramConnectionByChat(
  chatId
) {
  const rows = await supabaseRequest(
    `/rest/v1/telegram_connections?telegram_chat_id=eq.${encodeURIComponent(
      chatId
    )}&connected=eq.true&select=*&limit=1`
  );

  return rows?.[0] || null;
}

async function getTelegramByUserId(
  userId
) {
  const rows = await supabaseRequest(
    `/rest/v1/telegram_connections?user_id=eq.${encodeURIComponent(
      userId
    )}&connected=eq.true&select=*&limit=1`
  );

  return rows?.[0] || null;
}

async function setPendingAction(
  chatId,
  action,
  eventId
) {
  return supabaseRequest(
    `/rest/v1/telegram_connections?telegram_chat_id=eq.${encodeURIComponent(
      chatId
    )}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        pending_action: action,
        pending_event_id: eventId,
      }),
    }
  );
}

async function clearPendingAction(
  connectionId
) {
  return supabaseRequest(
    `/rest/v1/telegram_connections?id=eq.${encodeURIComponent(
      connectionId
    )}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        pending_action: null,
        pending_event_id: null,
      }),
    }
  );
}

/* ======================================== */
/* ACCOUNT CONNECTION                       */
/* ======================================== */

async function connectAccount(
  connectCode,
  message
) {
  if (message.chat?.type !== "private" || !/^[a-f0-9]{48}$/.test(connectCode)) return false;
  return Boolean(await supabaseRequest("/rest/v1/rpc/wiveli_connect_telegram", {
    method: "POST", body: JSON.stringify({p_code: connectCode, p_chat_id: message.chat.id, p_telegram_user_id: message.from?.id || null, p_username: message.from?.username || null}),
  }));
}

/* ======================================== */
/* SUPABASE                                 */
/* ======================================== */

async function supabaseRequest(
  path,
  options = {}
) {
  const supabaseUrl =
    process.env.SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (
    !supabaseUrl ||
    !secretKey
  ) {
    throw new Error(
      "Supabase is not configured."
    );
  }

  const response = await fetch(
    `${supabaseUrl}${path}`,
    {
      ...options,

      headers: {
        apikey: secretKey,

        Authorization:
          `Bearer ${secretKey}`,

        "Content-Type":
          "application/json",

        Prefer:
          "return=representation",

        ...(options.headers || {}),
      },

      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error =
      await response.text();

    console.error(
      "Supabase error:",
      error
    );

    throw new Error(
      "Supabase request failed."
    );
  }

  const text =
    await response.text();

  if (!text) return [];

  return JSON.parse(text);
}

/* ======================================== */
/* MAIN MENU                                */
/* ======================================== */

async function sendMainMenu(
  chatId,
  text
) {
  return sendTelegram({
    chat_id: chatId,

    text,

    parse_mode: "HTML",

    reply_markup: {
      keyboard: [
        [
          {
            text: "🎁 MY GIFTS",
          },
          {
            text: "✦ CREATE",
          },
        ],
        [
          {
            text:
              "💎 WIVELI BESPOKE",
          },
        ],
        [
          {
            text: "♡ MY WIVELI",
          },
        ],
      ],

      resize_keyboard: true,
      is_persistent: true,
    },
  });
}

/* ======================================== */
/* TELEGRAM                                 */
/* ======================================== */

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
    payload.reply_markup =
      inlineKeyboard;
  }

  return sendTelegram(payload);
}

async function sendTelegram(payload) {
  const token =
    process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error(
      "Telegram bot token is missing."
    );
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(payload),
    }
  );

  const result =
    await response.json();

  if (!result.ok) {
    console.error(
      "Telegram API error:",
      result
    );
  }

  return result;
}

async function answerCallback(
  callbackQueryId
) {
  const token =
    process.env.TELEGRAM_BOT_TOKEN;

  if (!token) return;

  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        callback_query_id:
          callbackQueryId,
      }),
    }
  );
}

/* ======================================== */
/* HELPERS                                  */
/* ======================================== */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}






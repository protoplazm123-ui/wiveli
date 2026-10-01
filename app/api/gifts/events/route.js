import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      gift_id,
      event_type,
      actor_role,
      data = {},
    } = body;

    if (!gift_id || !event_type || !actor_role) {
      return NextResponse.json(
        {
          ok: false,
          error: "gift_id, event_type and actor_role are required",
        },
        { status: 400 }
      );
    }

    if (!["sender", "recipient"].includes(actor_role)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid actor_role",
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!supabaseUrl || !secretKey) {
      throw new Error("Supabase is not configured.");
    }

    /* -------------------------------- */
    /* GET GIFT PARTICIPANTS            */
    /* -------------------------------- */

    const participantsResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_participants?gift_id=eq.${gift_id}&select=*`,
      {
        headers: supabaseHeaders(secretKey),
        cache: "no-store",
      }
    );

    if (!participantsResponse.ok) {
      throw new Error("Could not load gift participants.");
    }

    const participants = await participantsResponse.json();

    const sender = participants.find(
      (participant) => participant.role === "sender"
    );

    const recipient = participants.find(
      (participant) => participant.role === "recipient"
    );

    const actor =
      actor_role === "sender"
        ? sender
        : recipient;

    const target =
      actor_role === "sender"
        ? recipient
        : sender;

    if (!target) {
      return NextResponse.json(
        {
          ok: false,
          error: "Target participant not found",
        },
        { status: 404 }
      );
    }

    /* -------------------------------- */
    /* CREATE EVENT                     */
    /* -------------------------------- */

    const eventResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_events`,
      {
        method: "POST",

        headers: {
          ...supabaseHeaders(secretKey),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },

        body: JSON.stringify({
          gift_id,

          actor_user_id:
            actor?.user_id || null,

          target_user_id:
            target?.user_id || null,

          event_type,

          status: "pending",

          data,
        }),
      }
    );

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();

      console.error(
        "Create gift event error:",
        errorText
      );

      throw new Error("Could not create gift event.");
    }

    const events = await eventResponse.json();
    const event = events?.[0];

    /* -------------------------------- */
    /* WEB NOTIFICATION                 */
    /* -------------------------------- */

    if (target?.user_id) {
      await createNotification({
        supabaseUrl,
        secretKey,

        giftId: gift_id,
        eventId: event?.id,

        userId: target.user_id,

        channel: "web",

        title: getEventTitle(event_type),

        message: getEventMessage(
          event_type,
          data
        ),

        status: "pending",
      });
    }

    /* -------------------------------- */
    /* TELEGRAM                         */
    /* -------------------------------- */

    let telegramSent = false;

    if (target?.user_id && telegramToken) {
      const telegramConnection =
        await getTelegramConnection({
          supabaseUrl,
          secretKey,
          userId: target.user_id,
        });

      if (
        telegramConnection?.connected &&
        telegramConnection?.telegram_chat_id
      ) {
        telegramSent =
          await sendTelegramEvent({
            token: telegramToken,

            chatId:
              telegramConnection.telegram_chat_id,

            giftId: gift_id,

            eventId: event?.id,

            eventType: event_type,

            data,
          });

        await createNotification({
          supabaseUrl,
          secretKey,

          giftId: gift_id,
          eventId: event?.id,

          userId: target.user_id,

          channel: "telegram",

          title: getEventTitle(event_type),

          message: getEventMessage(
            event_type,
            data
          ),

          status:
            telegramSent
              ? "sent"
              : "failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,

      event,

      delivered: {
        web: Boolean(target?.user_id),
        telegram: telegramSent,
      },
    });
  } catch (error) {
    console.error(
      "Gift event API error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/* ================================================= */
/* TELEGRAM CONNECTION                               */
/* ================================================= */

async function getTelegramConnection({
  supabaseUrl,
  secretKey,
  userId,
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/telegram_connections?user_id=eq.${userId}&connected=eq.true&select=*&limit=1`,
    {
      headers: supabaseHeaders(secretKey),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();

  return rows?.[0] || null;
}

/* ================================================= */
/* TELEGRAM EVENT                                    */
/* ================================================= */

async function sendTelegramEvent({
  token,
  chatId,
  giftId,
  eventId,
  eventType,
  data,
}) {
  let text = getEventMessage(
    eventType,
    data
  );

  let inline_keyboard = [];

  /* INVITATION */

  if (eventType === "invitation") {
    inline_keyboard = [
      [
        {
          text: "♡ ACCEPT",
          callback_data:
            `gift_accept:${eventId}`,
        },
      ],

      [
        {
          text: "SUGGEST ANOTHER TIME",
          callback_data:
            `gift_reschedule:${eventId}`,
        },
      ],
    ];
  }

  /* COUPON REDEEM */

  if (eventType === "coupon_redeemed") {
    inline_keyboard = [
      [
        {
          text: "OPEN WIVELI →",
          url:
            `https://wiveli.vercel.app/gift/${giftId}`,
        },
      ],
    ];
  }

  /* MESSAGE */

  if (eventType === "message") {
    inline_keyboard = [
      [
        {
          text: "♡ REPLY",
          callback_data:
            `gift_reply:${eventId}`,
        },
      ],
    ];
  }

  const payload = {
    chat_id: chatId,

    text,

    parse_mode: "HTML",
  };

  if (inline_keyboard.length) {
    payload.reply_markup = {
      inline_keyboard,
    };
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

  const result = await response.json();

  if (!result.ok) {
    console.error(
      "Telegram event error:",
      result
    );
  }

  return Boolean(result.ok);
}

/* ================================================= */
/* NOTIFICATION                                      */
/* ================================================= */

async function createNotification({
  supabaseUrl,
  secretKey,

  giftId,
  eventId,
  userId,

  channel,
  title,
  message,
  status,
}) {
  if (!userId) return;

  await fetch(
    `${supabaseUrl}/rest/v1/gift_notifications`,
    {
      method: "POST",

      headers: {
        ...supabaseHeaders(secretKey),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        gift_id: giftId,
        event_id: eventId,
        user_id: userId,

        channel,

        title,
        message,

        status,

        sent_at:
          status === "sent"
            ? new Date().toISOString()
            : null,
      }),
    }
  );
}

/* ================================================= */
/* EVENT TEXT                                        */
/* ================================================= */

function getEventTitle(eventType) {
  switch (eventType) {
    case "invitation":
      return "You've received an invitation ♡";

    case "coupon_redeemed":
      return "A Love Coupon was redeemed ♡";

    case "gift_opened":
      return "Your gift was opened ♡";

    case "message":
      return "A new WIVELI message ♡";

    default:
      return "A little WIVELI update ♡";
  }
}

function getEventMessage(
  eventType,
  data = {}
) {
  if (eventType === "invitation") {
    const date =
      data.date || "A date to be decided";

    const time =
      data.time || "";

    const place =
      data.place || "A special place";

    const message =
      data.message || "Let's do this again ♡";

    return (
      `♡ <b>YOU'VE RECEIVED AN INVITATION</b>\n\n` +
      `Someone wants to share another special moment with you.\n\n` +
      `📅 ${escapeHtml(date)}${time ? ` · ${escapeHtml(time)}` : ""}\n` +
      `📍 ${escapeHtml(place)}\n\n` +
      `💌 “${escapeHtml(message)}”`
    );
  }

  if (eventType === "coupon_redeemed") {
    const coupon =
      data.coupon_title ||
      "A Love Coupon";

    return (
      `♡ <b>A LITTLE WIVELI UPDATE</b>\n\n` +
      `Someone special just used\n` +
      `<b>${escapeHtml(coupon)}</b>\n\n` +
      `Looks like you have plans ✦`
    );
  }

  if (eventType === "gift_opened") {
    return (
      `♡ <b>YOUR GIFT WAS OPENED</b>\n\n` +
      `Someone special just opened the WIVELI experience you created for them.`
    );
  }

  if (eventType === "message") {
    const message =
      data.message || "";

    return (
      `♡ <b>FROM YOUR WIVELI GIFT</b>\n\n` +
      `“${escapeHtml(message)}”`
    );
  }

  return (
    `♡ <b>A LITTLE WIVELI UPDATE</b>\n\n` +
    `Something happened inside one of your gifts.`
  );
}

/* ================================================= */
/* HELPERS                                           */
/* ================================================= */

function supabaseHeaders(secretKey) {
  return {
    apikey: secretKey,
    Authorization:
      `Bearer ${secretKey}`,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

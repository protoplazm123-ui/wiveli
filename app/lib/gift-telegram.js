import { requireSession } from "./session";
import { couponIdeas } from "../experiences/love-coupons/coupons";

export class GiftError extends Error {
  constructor(message, status = 500) { super(message); this.status = status; }
}

export async function database(path, options = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new GiftError("Supabase is not configured.");
  const response = await fetch(url + "/rest/v1/" + path, {
    ...options, cache: "no-store",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json",
      Prefer: "return=representation", ...options.headers },
  });
  if (!response.ok) {
    console.error("Gift Telegram database request failed:", response.status);
    throw new GiftError("Could not save Telegram delivery. Check the database setup.");
  }
  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

export async function currentUser() {
  try { return (await requireSession()).user; }
  catch (error) { throw new GiftError(error.message, error.status || 500); }
}

export async function giftParticipants(id) {
  return database(`gift_participants?gift_id=eq.${encodeURIComponent(id)}&select=*`);
}

export async function requireParticipant(id, role) {
  const user = await currentUser();
  const participants = await giftParticipants(id);
  if (!participants.some(p => p.role === role && p.user_id === user.id)) {
    throw new GiftError(role === "recipient"
      ? "Open your original private gift link and sign in to claim this gift first."
      : "Only the sender can deliver this gift.", 403);
  }
  return { user, participants };
}

// The private gift link is a bearer credential. No recipient account is needed.
// Sender contact details and Telegram credentials are never returned by this check.
export async function requireGiftAccess(request, id, allowSender = false) {
  const token = request.headers.get("x-wiveli-gift-token");
  if (token) {
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(token)) {
      throw new GiftError("This private gift link is invalid.", 403);
    }
    const participants = await giftParticipants(id);
    if (!participants.some(p => p.role === "recipient" && p.claim_token === token)) {
      throw new GiftError("This private gift link is invalid or expired.", 403);
    }
    return { participants };
  }
  // Existing account-linked gifts continue working without a token.
  const user = await currentUser();
  const participants = await giftParticipants(id);
  if (!participants.some(p => p.user_id === user.id && (p.role === "recipient" || (allowSender && p.role === "sender")))) {
    throw new GiftError("Please open the original private gift link.", 403);
  }
  return { participants };
}

export async function connectionForUser(userId) {
  if (!userId) return null;
  const rows = await database(`telegram_connections?user_id=eq.${encodeURIComponent(userId)}&connected=eq.true&select=*&limit=1`);
  return rows[0] || null;
}

export async function telegram(method, payload = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new GiftError("WIVELI Telegram bot is not configured.");
  let response, result;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(12000),
    });
    result = await response.json();
  } catch {
    throw new GiftError("Telegram did not confirm delivery. Please check the bot chat before trying again.", 502);
  }
  if (!response.ok || !result.ok) {
    const error = new GiftError("Telegram could not deliver the message. Open the WIVELI bot, press Start and make sure it is not blocked.", 502);
    error.definitelyNotSent = true;
    throw error;
  }
  return result.result;
}

// A unique database key prevents double-clicks and automatic/manual reminders
// from sending the same message twice. Uncertain deliveries are not retried.
export async function sendOnce({ key, giftId, userId, payload, origin = null }) {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new GiftError("WIVELI Telegram bot is not configured.");
  let reserved = await database("wiveli_telegram_messages?on_conflict=message_key", {
    method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ message_key: key, gift_id: giftId, target_user_id: userId || null, target_chat_id: String(payload.chat_id), delivery_origin: origin, status: "sending" }),
  });
  const filter = `message_key=eq.${encodeURIComponent(key)}`;
  if (!reserved.length) {
    const [existing] = await database(`wiveli_telegram_messages?${filter}&select=status,target_user_id,target_chat_id`);
    const sameTarget = existing?.target_chat_id != null
      ? String(existing.target_chat_id) === String(payload.chat_id)
      : Boolean(userId) && existing?.target_user_id === userId;
    if (!sameTarget) throw new GiftError("This gift has already been addressed to another recipient.", 409);
    if (existing?.status === "sent") return { sent: true, alreadySent: true };
    if (existing?.status !== "failed") throw new GiftError("Delivery is processing or awaiting confirmation. Check the bot chat; a duplicate message will not be sent.", 409);
    reserved = await database(`wiveli_telegram_messages?${filter}&status=eq.failed`, {
      method: "PATCH", body: JSON.stringify({ status: "sending" }),
    });
    if (!reserved.length) throw new GiftError("Delivery is already processing.", 409);
  }
  let result;
  try {
    result = await telegram("sendMessage", payload);
  } catch (error) {
    try {
      await database(`wiveli_telegram_messages?${filter}`, {
        method: "PATCH", body: JSON.stringify({ status: error.definitelyNotSent ? "failed" : "unknown" }),
      });
    } catch { /* Keep sending state to prevent duplicate delivery. */ }
    throw error;
  }
  await database(`wiveli_telegram_messages?${filter}`, {
    method: "PATCH", body: JSON.stringify({ status: "sent", telegram_message_id: result.message_id, sent_at: new Date().toISOString() }),
  });
  return { sent: true, alreadySent: false };
}

export async function notifySender({ giftId, gift, redemption, origin }) {
  const participants = await giftParticipants(giftId);
  const sender = participants.find(p => p.role === "sender");
  const connection = await connectionForUser(sender?.user_id);
  if (!connection?.telegram_chat_id) throw new GiftError("The sender needs to connect Telegram in their WIVELI account first.", 409);
  const coupon = gift.customCoupons?.find(c => c.id === redemption.couponId)
    || couponIdeas.find(c => c.id === redemption.couponId);
  const text = `♡ WIVELI\n\n${String(gift.recipientName || "Your recipient").slice(0,100)} used a Love Coupon:\n${String(coupon?.title || "Love Coupon").slice(0,300)}\n\nCode: ${redemption.code}`;
  return sendOnce({
    key: `redeemed:${giftId}:${redemption.couponId}`, giftId, userId: sender.user_id,
    payload: { chat_id: connection.telegram_chat_id, text,
      reply_markup: { inline_keyboard: [[{ text: "OPEN WIVELI →", url: origin + "/account" }]] } },
  });
}

export async function notifyGiftOpened({ giftId, gift, origin }) {
  const participants = await giftParticipants(giftId);
  const sender = participants.find(p => p.role === "sender");
  const connection = await connectionForUser(sender?.user_id);
  if (!connection?.telegram_chat_id) throw new GiftError("The sender needs to connect Telegram first.", 409);
  return sendOnce({
    key: `opened:${giftId}`, giftId, userId: sender.user_id,
    payload: {
      chat_id: connection.telegram_chat_id,
      text: `♡ WIVELI\n\n${String(gift.recipientName || "Your recipient").slice(0,100)} opened your gift from ${String(gift.senderName || "you").slice(0,100)}.`,
      reply_markup: { inline_keyboard: [[{ text: "OPEN WIVELI →", url: origin + "/account" }]] },
    },
  });
}


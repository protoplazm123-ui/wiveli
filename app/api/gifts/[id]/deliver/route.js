import { NextResponse } from "next/server";
import { database, requireParticipant, telegram, sendOnce, GiftError } from "../../../../lib/gift-telegram";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { participants } = await requireParticipant(id, "sender");
    const recipient = participants.find(p => p.role === "recipient");
    if (!recipient?.claim_token || !/^[0-9a-f-]{36}$/i.test(recipient.claim_token)) {
      throw new GiftError("The private gift invitation is unavailable.", 409);
    }
    const [gift] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    if (!gift) throw new GiftError("Love Coupons gift not found.", 404);
    const bot = await telegram("getMe");
    if (!bot?.username) throw new GiftError("WIVELI bot username is unavailable.");
    // Persist the website origin server-side; never trust a URL supplied in a bot command.
    await database("wiveli_gift_invitations?on_conflict=gift_id", {
      method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ gift_id: id, origin: new URL(request.url).origin }),
    });
    const inviteUrl = `https://t.me/${bot.username}?start=gift_${recipient.claim_token}`;
    return NextResponse.json({ success: true, inviteUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not create invitation." }, { status: error.status || 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { participants } = await requireParticipant(id, "sender");
    const body = await request.json();
    const username = String(body.recipientUsername || "").trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{5,32}$/.test(username)) throw new GiftError("Enter the recipient's Telegram @username.", 400);
    const connections = await database(`wiveli_telegram_contacts?telegram_username=ilike.${encodeURIComponent(username.replaceAll("_", "\\_"))}&select=*&limit=2`);
    if (connections.length !== 1 || !connections[0].telegram_chat_id) {
      throw new GiftError("Ask the recipient to open @WIVELI_bot and press Start, then send again. No WIVELI account is needed.", 409);
    }
    const connection = connections[0];
    // Confirm the current username with Telegram; a cached username may change owners.
    const chat = await telegram("getChat", { chat_id: connection.telegram_chat_id });
    if (chat.type !== "private" || chat.username?.toLowerCase() !== username.toLowerCase()) {
      throw new GiftError("The recipient's Telegram username has changed. Ask them to press Start in @WIVELI_bot again.", 409);
    }
    const recipient = participants.find(p => p.role === "recipient");
    if (!recipient?.claim_token) {
      throw new GiftError("The private gift link is unavailable.", 409);
    }
    const [row] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    if (!row) throw new GiftError("Love Coupons gift not found.", 404);
    const gift = row.gift_data || {};
    const delivered = await sendOnce({
      key: `gift:${id}`, giftId: id, userId: null, origin: new URL(request.url).origin,
      payload: {
        chat_id: connection.telegram_chat_id,
        text: `♡ A gift from WIVELI\n\n${String(gift.senderName || "Someone special").slice(0,100)} sent you a gift.\nPress START to open your little surprise.`,
        reply_markup: { inline_keyboard: [[{ text: "START ♡", callback_data: `gift_start:${id}` }]] },
      },
    });
    return NextResponse.json({ success: true, ...delivered });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not deliver the gift." }, { status: error.status || 500 });
  }
}

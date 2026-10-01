import { NextResponse } from "next/server";
import { database, requireParticipant, telegram, sendOnce, GiftError } from "../../../../lib/gift-telegram";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { participants } = await requireParticipant(id, "sender");
    const body = await request.json();
    const username = String(body.recipientUsername || "").trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{5,32}$/.test(username)) throw new GiftError("Enter the recipient's Telegram @username.", 400);
    const connections = await database(`telegram_connections?telegram_username=ilike.${encodeURIComponent(username.replaceAll("_", "\\_"))}&connected=eq.true&select=*&limit=2`);
    if (connections.length !== 1 || !connections[0].telegram_chat_id) {
      throw new GiftError("The recipient must connect Telegram in their WIVELI account and press Start in the bot first.", 409);
    }
    const connection = connections[0];
    // Confirm the current username with Telegram; a cached username may change owners.
    const chat = await telegram("getChat", { chat_id: connection.telegram_chat_id });
    if (chat.type !== "private" || chat.username?.toLowerCase() !== username.toLowerCase()) {
      throw new GiftError("The recipient's Telegram username has changed. Ask them to reconnect Telegram.", 409);
    }
    const recipient = participants.find(p => p.role === "recipient");
    if (!recipient?.claim_token || (recipient.user_id && recipient.user_id !== connection.user_id)) {
      throw new GiftError("This gift is already claimed by another account or its private link is unavailable.", 409);
    }
    const [row] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    if (!row) throw new GiftError("Love Coupons gift not found.", 404);
    const gift = row.gift_data || {};
    const link = `${new URL(request.url).origin}/gift/love-coupons/${encodeURIComponent(id)}?claim=${encodeURIComponent(recipient.claim_token)}`;
    const delivered = await sendOnce({
      key: `gift:${id}`, giftId: id, userId: connection.user_id,
      payload: {
        chat_id: connection.telegram_chat_id,
        text: `♡ A gift from WIVELI\n\n${String(gift.senderName || "Someone special").slice(0,100)} made Love Coupons for ${String(gift.recipientName || "you").slice(0,100)}.\nOpen your little promises below.`,
        reply_markup: { inline_keyboard: [[{ text: "OPEN YOUR GIFT ♡", url: link }]] },
      },
    });
    return NextResponse.json({ success: true, ...delivered });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not deliver the gift." }, { status: error.status || 500 });
  }
}

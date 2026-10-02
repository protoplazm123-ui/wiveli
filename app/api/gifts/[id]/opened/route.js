import { NextResponse } from "next/server";
import { database, requireGiftAccess, currentUser, notifyGiftOpened, GiftError } from "../../../../lib/gift-telegram";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { participants } = await requireGiftAccess(request, id, true);
    // A signed-in sender preview is not a recipient opening.
    let viewer;
    try { viewer = await currentUser(); } catch { /* Guest recipient. */ }
    if (viewer && participants.some(p => p.role === "sender" && p.user_id === viewer.id)) {
      return NextResponse.json({ success: true, preview: true });
    }
    const [row] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    if (!row) throw new GiftError("Gift not found.", 404);
    const sender = participants.find(p => p.role === "sender");
    if (sender?.user_id) await database("wiveli_account_events?on_conflict=event_key", {
      method: "POST", headers: {Prefer: "resolution=ignore-duplicates,return=representation"},
      body: JSON.stringify({event_key: `opened:${id}`, user_id: sender.user_id, gift_id: id, kind: "opened"}),
    });
    let result;
    try { result = await notifyGiftOpened({ giftId: id, gift: row.gift_data || {}, origin: new URL(request.url).origin }); }
    catch { result = {sent: false, inboxSaved: true}; }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not notify the sender." }, { status: error.status || 500 });
  }
}


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
    const result = await notifyGiftOpened({ giftId: id, gift: row.gift_data || {}, origin: new URL(request.url).origin });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not notify the sender." }, { status: error.status || 500 });
  }
}

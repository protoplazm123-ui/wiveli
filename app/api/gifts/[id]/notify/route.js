import { NextResponse } from "next/server";
import { database, requireGiftAccess, notifySender, GiftError } from "../../../../lib/gift-telegram";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await requireGiftAccess(request, id);
    const { couponId } = await request.json();
    const [row] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    const gift = row?.gift_data;
    const redemption = gift?.redemptions?.find(r => r.couponId === couponId);
    if (!redemption) throw new GiftError("Redeem this coupon before notifying the sender.", 400);
    const result = await notifySender({ giftId: id, gift, redemption, origin: new URL(request.url).origin });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof GiftError ? error.message : "Could not notify the sender." }, { status: error.status || 500 });
  }
}

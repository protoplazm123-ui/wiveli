import { NextResponse } from "next/server";
import { requireSession } from "../../../lib/session";
import { database } from "../../../lib/gift-telegram";
import { giftDetails } from "../../../lib/account-gifts";

export async function GET(request) {
  try {
    const {user} = await requireSession();
    const rawOffset = Number(new URL(request.url).searchParams.get("offset") || 0);
    const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
    const rows = await database(`wiveli_account_events?user_id=eq.${encodeURIComponent(user.id)}&order=occurred_at.desc,event_key.asc&limit=51&offset=${offset}&select=event_key,gift_id,kind,coupon_id,occurred_at,read_at`);
    const page = rows.slice(0,50), ids = [...new Set(page.map(r => r.gift_id))];
    const gifts = ids.length ? await database(`gifts?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,gift_type,gift_data`) : [];
    const messages = page.map(row => {
      const gift = gifts.find(g => g.id === row.gift_id);
      const redemption = gift ? giftDetails(gift).redemptions.find(r => r.couponId === row.coupon_id) : null;
      const wish = gift?.gift_type === "wish-note" ? gift.gift_data?.wishes?.find(w=>w.id===row.coupon_id) : null;
      return {id: row.event_key, giftId: row.gift_id, readAt: row.read_at, date: row.occurred_at,
        title: row.kind === "opened" ? "Your gift was opened ♡" : row.kind === "wish-created" ? "A new wish for you ♡" : row.kind === "wish-completed" ? "A wish became a memory ♡" : "A coupon was used ♡",
        text: `${gift?.gift_data?.recipientName || "Your recipient"} ${row.kind === "opened" ? "opened your gift." : wish ? (row.kind === "wish-created" ? "made a wish." : "completed a wish.") : "used " + (redemption?.title || "a Love Coupon") + "."}`,
        redemption, wish: wish ? {text:wish.text,date:wish.date,time:wish.time,place:wish.place} : null};
    });
    return NextResponse.json({messages, nextOffset: rows.length > 50 ? offset + 50 : null}, {headers: {"Cache-Control": "private, no-store"}});
  } catch (error) { return NextResponse.json({error: error.message || "Could not load Inbox."}, {status: error.status || 500}); }
}
export async function PATCH(request) {
  try {
    const {user} = await requireSession();
    const {id} = await request.json();
    if (typeof id !== "string" || id.length > 300) return NextResponse.json({error: "Invalid message."}, {status: 400});
    await database(`wiveli_account_events?event_key=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&read_at=is.null`, {method: "PATCH", body: JSON.stringify({read_at: new Date().toISOString()})});
    return NextResponse.json({success: true});
  } catch (error) { return NextResponse.json({error: error.message}, {status: error.status || 500}); }
}


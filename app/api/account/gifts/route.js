import { NextResponse } from "next/server";
import { accountUser, accountRows, giftDetails, AccountError } from "../../../lib/account-gifts";

export async function GET() {
  try {
    const user = await accountUser();
    const ids = new Set();
    // Page participants so a growing account does not silently lose gifts.
    for (let offset = 0; ; offset += 200) {
      const rows = await accountRows(`gift_participants?user_id=eq.${encodeURIComponent(user.id)}&role=eq.sender&select=gift_id&order=gift_id&limit=200&offset=${offset}`);
      rows.forEach(row => ids.add(row.gift_id));
      if (rows.length < 200) break;
    }
    const allIds = [...ids];
    const gifts = [];
    for (let start = 0; start < allIds.length; start += 50) {
      const values = allIds.slice(start, start + 50).map(id => `"${String(id).replaceAll('"', '\\"')}"`).join(",");
      const rows = await accountRows(`gifts?id=in.(${encodeURIComponent(values)})&select=id,gift_type,gift_data`);
      for (const row of rows) {
        if (!ids.has(row.id)) continue;
        const { redemptions, unusedCoupons, wishes, ...summary } = giftDetails(row);
        gifts.push(summary);
      }
    }
    gifts.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
    return NextResponse.json({
      success: true,
      profile: {
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "WIVELI",
        email: user.email || "", avatar: user.user_metadata?.avatar_url || "",
      },
      gifts,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AccountError ? error.message : "Could not load your gifts." },
      { status: error.status || 500, headers: { "Cache-Control": "private, no-store" } });
  }
}


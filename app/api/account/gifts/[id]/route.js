import { NextResponse } from "next/server";
import { accountUser, accountRows, giftDetails, AccountError } from "../../../../lib/account-gifts";

export async function GET(request, { params }) {
  try {
    const user = await accountUser();
    const { id } = await params;
    const owners = await accountRows(`gift_participants?gift_id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&role=eq.sender&select=gift_id&limit=1`);
    if (!owners.length) throw new AccountError("Gift not found in your account.", 404);
    const rows = await accountRows(`gifts?id=eq.${encodeURIComponent(id)}&select=id,gift_type,gift_data&limit=1`);
    if (!rows.length) throw new AccountError("Gift not found.", 404);
    return NextResponse.json({ success: true, gift: giftDetails(rows[0]) },
      { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AccountError ? error.message : "Could not load gift history." },
      { status: error.status || 500, headers: { "Cache-Control": "private, no-store" } });
  }
}

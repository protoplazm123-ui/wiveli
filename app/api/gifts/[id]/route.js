import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/gifts?id=eq.${encodeURIComponent(
        id
      )}&select=id,gift_type,gift_data&limit=1`,
      {
        headers: {
          apikey: secretKey,
        },
        cache: "no-store",
      }
    );

    const rows = await response.json();

    if (!rows.length) {
      return NextResponse.json(
        { error: "Gift not found." },
        { status: 404 }
      );
    }

    const row = rows[0];
    const stored = row.gift_data || {};

    let publicGift;

    if (row.gift_type === "love-coupons") {
      publicGift = {
        senderName: stored.senderName || "",
        recipientName: stored.recipientName || "",
        couponIds: stored.couponIds || [],
        customCoupons: stored.customCoupons || [],
        dailyLimit: stored.dailyLimit ?? 3,
        redemptions: stored.redemptions || [],
        createdAt: stored.createdAt || null,
      };
    } else if (row.gift_type === "memory-box") {
      publicGift = {
        senderName: stored.senderName || "",
        recipientName: stored.recipientName || "",
        memories: stored.memories || [],
        finalMessage: stored.finalMessage || "",
        createdAt: stored.createdAt || null,
      };
    } else if (row.gift_type === "the-gift") {
      publicGift = {
        senderName: stored.senderName || "",
        recipientName: stored.recipientName || "",
        introMessage: stored.introMessage || "",
        steps: stored.steps || [],
        finalMessage: stored.finalMessage || "",
        createdAt: stored.createdAt || null,
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported gift." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: row.id,
      giftType: row.gift_type,
      giftData: publicGift,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not load gift." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const ALLOWED_GIFT_TYPES = [
  "love-coupons",
  "memory-box",
  "the-gift",
];

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Server is not configured." },
        { status: 500 }
      );
    }

    const { giftType, giftData } = await request.json();

    if (
      !ALLOWED_GIFT_TYPES.includes(giftType) ||
      !giftData ||
      typeof giftData !== "object"
    ) {
      return NextResponse.json(
        { error: "Invalid gift data." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/gifts`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          gift_type: giftType,
          gift_data: giftData,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not save gift." },
        { status: 500 }
      );
    }

    const rows = await response.json();

    return NextResponse.json({
      success: true,
      id: rows[0].id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not create gift." },
      { status: 500 }
    );
  }
}

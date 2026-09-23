import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Server is not configured." },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Gift ID is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/gifts?id=eq.${encodeURIComponent(
        id
      )}&gift_type=eq.love-coupons&select=id,gift_type,gift_data&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Supabase gift fetch failed:", response.status);

      return NextResponse.json(
        { error: "Could not load gift." },
        { status: 500 }
      );
    }

    const rows = await response.json();

    if (!rows.length) {
      return NextResponse.json(
        { error: "Gift not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: rows[0].id,
      giftType: rows[0].gift_type,
      giftData: rows[0].gift_data,
    });
  } catch (error) {
    console.error("Gift loading failed:", error);

    return NextResponse.json(
      { error: "Could not load gift." },
      { status: 500 }
    );
  }
}

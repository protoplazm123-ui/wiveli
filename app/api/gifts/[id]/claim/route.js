import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request, { params }) {
  try {
    const { id: giftId } = await params;

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !secretKey || !anonKey) {
      return NextResponse.json(
        { error: "Server is not configured." },
        { status: 500 }
      );
    }

    /* CURRENT USER */

    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("wiveli_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
        },
        { status: 401 }
      );
    }

    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
        },
        { status: 401 }
      );
    }

    const user = await userResponse.json();

    /* FIND RECIPIENT */

    const participantResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_participants?gift_id=eq.${encodeURIComponent(
        giftId
      )}&role=eq.recipient&select=*`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!participantResponse.ok) {
      throw new Error(
        "Could not load gift recipient."
      );
    }

    const participants =
      await participantResponse.json();

    const recipient = participants?.[0];

    if (!recipient) {
      return NextResponse.json(
        { error: "Gift recipient not found." },
        { status: 404 }
      );
    }

    /* ALREADY CLAIMED */

    if (recipient.user_id) {
      if (recipient.user_id === user.id) {
        return NextResponse.json({
          success: true,
          alreadyClaimed: true,
        });
      }

      return NextResponse.json(
        {
          error:
            "This gift already belongs to another WIVELI account.",
        },
        { status: 409 }
      );
    }

    /* CLAIM */

    const claimResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_participants?id=eq.${encodeURIComponent(
        recipient.id
      )}&user_id=is.null`,
      {
        method: "PATCH",

        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },

        body: JSON.stringify({
          user_id: user.id,
          email:
            recipient.email ||
            user.email ||
            null,
        }),
      }
    );

    if (!claimResponse.ok) {
      throw new Error(
        "Could not claim gift."
      );
    }

    const claimedRows =
      await claimResponse.json();

    /*
      Prevent two accounts claiming
      the same gift at the same moment.
    */

    if (!claimedRows?.length) {
      return NextResponse.json(
        {
          error:
            "This gift has already been claimed.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      giftId,
      recipientUserId: user.id,
    });
  } catch (error) {
    console.error(
      "Claim gift error:",
      error
    );

    return NextResponse.json(
      { error: "Could not claim gift." },
      { status: 500 }
    );
  }
}

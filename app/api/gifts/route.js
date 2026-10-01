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

    const body = await request.json();

    const {
      giftType,
      giftData,
      senderUserId = null,
      recipientUserId = null,
      senderEmail = null,
      recipientEmail = null,
    } = body;

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

    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    };

    /* ====================================== */
    /* CREATE GIFT                            */
    /* ====================================== */

    const giftResponse = await fetch(
      `${supabaseUrl}/rest/v1/gifts`,
      {
        method: "POST",

        headers: {
          ...headers,
          Prefer: "return=representation",
        },

        body: JSON.stringify({
          gift_type: giftType,
          gift_data: giftData,
        }),

        cache: "no-store",
      }
    );

    if (!giftResponse.ok) {
      const errorText = await giftResponse.text();

      console.error(
        "Could not save gift:",
        errorText
      );

      return NextResponse.json(
        { error: "Could not save gift." },
        { status: 500 }
      );
    }

    const rows = await giftResponse.json();
    const gift = rows?.[0];

    if (!gift?.id) {
      return NextResponse.json(
        { error: "Gift was created without an ID." },
        { status: 500 }
      );
    }

    /* ====================================== */
    /* PARTICIPANTS                           */
    /* ====================================== */

    const participants = [];

    // SENDER
    participants.push({
      gift_id: gift.id,
      user_id: senderUserId || null,
      role: "sender",
      email:
        senderEmail ||
        giftData.senderEmail ||
        null,
    });

    // RECIPIENT
    participants.push({
      gift_id: gift.id,
      user_id: recipientUserId || null,
      role: "recipient",
      email:
        recipientEmail ||
        giftData.recipientEmail ||
        null,
    });

    const participantResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_participants`,
      {
        method: "POST",

        headers: {
          ...headers,
          Prefer: "return=representation",
        },

        body: JSON.stringify(participants),

        cache: "no-store",
      }
    );

    if (!participantResponse.ok) {
      const errorText =
        await participantResponse.text();

      console.error(
        "Could not save gift participants:",
        errorText
      );

      /*
       * Gift уже создан.
       * Не говорим клиенту, что всё успешно,
       * если связь участников не сохранилась.
       */
      return NextResponse.json(
        {
          error:
            "Gift was created, but participants could not be saved.",
          id: gift.id,
        },
        { status: 500 }
      );
    }

    /* ====================================== */
    /* SUCCESS                                */
    /* ====================================== */

    return NextResponse.json({
      success: true,
      id: gift.id,
    });
  } catch (error) {
    console.error(
      "Create gift error:",
      error
    );

    return NextResponse.json(
      { error: "Could not create gift." },
      { status: 500 }
    );
  }
}

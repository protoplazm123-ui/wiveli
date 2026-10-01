import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ALLOWED_GIFT_TYPES = [
  "love-coupons",
  "memory-box",
  "the-gift",
  "our-story",
  "open-when",
];

export async function POST(request) {
  try {
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

    /* ===================================== */
    /* CURRENT WIVELI USER                   */
    /* ===================================== */

    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get(
        "wiveli_access_token"
      )?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Please sign in before creating a gift.",
        },
        { status: 401 }
      );
    }

    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: anonKey,
          Authorization:
            `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Your session has expired. Please sign in again.",
        },
        { status: 401 }
      );
    }

    const user =
      await userResponse.json();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Could not identify user." },
        { status: 401 }
      );
    }

    /* ===================================== */
    /* REQUEST                               */
    /* ===================================== */

    const {
      giftType,
      giftData,
      recipientEmail = null,
    } = await request.json();

    if (
      !ALLOWED_GIFT_TYPES.includes(
        giftType
      ) ||
      !giftData ||
      typeof giftData !== "object"
    ) {
      return NextResponse.json(
        { error: "Invalid gift data." },
        { status: 400 }
      );
    }

    const serviceHeaders = {
      apikey: secretKey,
      Authorization:
        `Bearer ${secretKey}`,
      "Content-Type":
        "application/json",
    };

    /* ===================================== */
    /* CREATE GIFT                           */
    /* ===================================== */

    const giftResponse = await fetch(
      `${supabaseUrl}/rest/v1/gifts`,
      {
        method: "POST",

        headers: {
          ...serviceHeaders,
          Prefer:
            "return=representation",
        },

        body: JSON.stringify({
          gift_type: giftType,
          gift_data: giftData,
        }),

        cache: "no-store",
      }
    );

    if (!giftResponse.ok) {
      const errorText =
        await giftResponse.text();

      console.error(
        "Create gift error:",
        errorText
      );

      return NextResponse.json(
        { error: "Could not save gift." },
        { status: 500 }
      );
    }

    const rows =
      await giftResponse.json();

    const gift = rows?.[0];

    if (!gift?.id) {
      return NextResponse.json(
        {
          error:
            "Gift was created without an ID.",
        },
        { status: 500 }
      );
    }

    /* ===================================== */
    /* FIND RECIPIENT ACCOUNT                */
    /* ===================================== */

    let recipientUserId = null;

    const finalRecipientEmail =
      recipientEmail ||
      giftData.recipientEmail ||
      null;

    /*
      Recipient may not have a WIVELI
      account yet. That's completely OK.

      When they connect/claim the gift later,
      we'll attach their user_id.
    */

    /* ===================================== */
    /* SAVE PARTICIPANTS                     */
    /* ===================================== */

    const participants = [
      {
        gift_id: gift.id,

        user_id: user.id,

        role: "sender",

        email:
          user.email || null,
      },

      {
        gift_id: gift.id,

        user_id:
          recipientUserId,

        role: "recipient",

        email:
          finalRecipientEmail,
      },
    ];

    const participantsResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/gift_participants`,
        {
          method: "POST",

          headers: {
            ...serviceHeaders,
            Prefer:
              "return=representation",
          },

          body:
            JSON.stringify(
              participants
            ),

          cache: "no-store",
        }
      );

    if (!participantsResponse.ok) {
      const errorText =
        await participantsResponse.text();

      console.error(
        "Create participants error:",
        errorText
      );

      /*
        Roll back the gift so we don't
        leave a broken orphan gift.
      */

      await fetch(
        `${supabaseUrl}/rest/v1/gifts?id=eq.${encodeURIComponent(
          gift.id
        )}`,
        {
          method: "DELETE",
          headers: serviceHeaders,
        }
      );

      return NextResponse.json(
        {
          error:
            "Could not connect gift participants.",
        },
        { status: 500 }
      );
    }

    /* ===================================== */
    /* SUCCESS                               */
    /* ===================================== */

    return NextResponse.json({
      success: true,

      id: gift.id,

      sender: {
        userId: user.id,
      },

      recipient: {
        connected:
          Boolean(
            recipientUserId
          ),
      },
    });
  } catch (error) {
    console.error(
      "Create gift error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not create gift.",
      },
      { status: 500 }
    );
  }
}

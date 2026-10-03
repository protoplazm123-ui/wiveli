import { normalizeTheGift } from "../../lib/the-gift";
import { normalizeOpenWhen } from "../../lib/open-when";
import { normalizeStory } from "../../lib/our-story";
import { normalizeWishGift } from "../../lib/wish-note";
import { validateCouponAttachments } from "../../lib/coupon-attachments";
import { NextResponse } from "next/server";
import { requireSession } from "../../lib/session";

const ALLOWED_GIFT_TYPES = [
  "love-coupons",
  "wish-note",
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

    const { user } = await requireSession();

    /* ===================================== */
    /* REQUEST                               */
    /* ===================================== */

    let {
      giftType,
      giftData,
      recipientEmail = null,
    } = await request.json();

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

    if (giftType === "the-gift") giftData=normalizeTheGift(giftData,user.id);
    if (giftType === "open-when") giftData=normalizeOpenWhen(giftData,user.id);
    if (giftType === "our-story") giftData = normalizeStory(giftData,user.id);
    if (giftType === "wish-note") giftData = normalizeWishGift(giftData, user.id);
    if (giftType === "love-coupons") validateCouponAttachments(giftData, user.id);

    const serviceHeaders = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
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

    const rows = await giftResponse.json();
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
    /* RECIPIENT                             */
    /* ===================================== */

    const finalRecipientEmail =
      recipientEmail ||
      giftData.recipientEmail ||
      null;

    /*
      Recipient may not have a WIVELI
      account yet.

      user_id will be attached when
      the recipient claims the gift.
    */

    const recipientUserId = null;

    /* ===================================== */
    /* CLAIM TOKEN                           */
    /* ===================================== */

    const claimToken = crypto.randomUUID();

    /* ===================================== */
    /* PARTICIPANTS                          */
    /* ===================================== */

    const participants = [
      {
        gift_id: gift.id,

        user_id: user.id,

        role: "sender",

        email: user.email || null,

        claim_token: null,
      },

      {
        gift_id: gift.id,

        user_id: recipientUserId,

        role: "recipient",

        email: finalRecipientEmail,

        claim_token: claimToken,
      },
    ];

    const participantsResponse = await fetch(
      `${supabaseUrl}/rest/v1/gift_participants`,
      {
        method: "POST",

        headers: {
          ...serviceHeaders,
          Prefer: "return=representation",
        },

        body: JSON.stringify(participants),

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
        Remove the gift if participant
        creation failed.
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
    /* RECIPIENT LINK                        */
    /* ===================================== */

    const giftBaseUrl =
      ["love-coupons", "wish-note", "our-story", "open-when", "the-gift"].includes(giftType)
        ? `${new URL(request.url).origin}/gift/${giftType}/${encodeURIComponent(gift.id)}`
        : `https://wiveli.vercel.app/gift/${gift.id}`;

    const giftUrl = `${giftBaseUrl}?claim=${encodeURIComponent(claimToken)}`;

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
        connected: Boolean(recipientUserId),
      },

      claimToken,

      giftUrl,
    });
  } catch (error) {
    console.error(
      "Create gift error:",
      error
    );

    return NextResponse.json(
      {
        error: error.status === 401 || error.status === 400 ? error.message : "Could not create gift.",
      },
      { status: error.status || 500 }
    );
  }
}







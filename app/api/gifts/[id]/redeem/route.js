import { NextResponse } from "next/server";

function isValidTimeZone(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: value,
    }).format();

    return true;
  } catch {
    return false;
  }
}

function getDayKey(timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return `${values.year}-${values.month}-${values.day}`;
}

function createRedemptionCode(existingRedemptions) {
  const existingCodes = new Set(
    existingRedemptions.map((item) => item.code)
  );

  let code;

  do {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);

    const number =
      1000 + (values[0] % 9000);

    code = `LOVE-${number}`;
  } while (existingCodes.has(code));

  return code;
}

function makePublicGift(gift) {
  return {
    senderName: gift.senderName || "",
    recipientName: gift.recipientName || "",
    couponIds: gift.couponIds || [],
    customCoupons: gift.customCoupons || [],
    dailyLimit: gift.dailyLimit ?? 3,
    redemptions: gift.redemptions || [],
    createdAt: gift.createdAt || null,
  };
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const supabaseUrl =
      process.env.SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Server is not configured.",
        },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Gift ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const couponId = body?.couponId;
    const requestedTimeZone = body?.timeZone;

    if (
      !couponId ||
      typeof couponId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Coupon ID is required.",
        },
        { status: 400 }
      );
    }

    /*
      1. Load the real gift from the database.
    */

    const giftResponse = await fetch(
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

    if (!giftResponse.ok) {
      console.error(
        "Gift fetch failed:",
        giftResponse.status
      );

      return NextResponse.json(
        {
          success: false,
          error: "Could not load gift.",
        },
        { status: 500 }
      );
    }

    const rows = await giftResponse.json();

    if (!rows.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Gift not found.",
        },
        { status: 404 }
      );
    }

    const storedGift =
      rows[0].gift_data || {};

    /*
      2. Make sure this coupon actually
      belongs to this gift.
    */

    const readyMadeIds =
      storedGift.couponIds || [];

    const customIds = (
      storedGift.customCoupons || []
    )
      .map((coupon) => coupon?.id)
      .filter(Boolean);

    const allowedCouponIds = new Set([
      ...readyMadeIds,
      ...customIds,
    ]);

    if (!allowedCouponIds.has(couponId)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This coupon does not belong to this gift.",
        },
        { status: 400 }
      );
    }

    const redemptions =
      storedGift.redemptions || [];

    /*
      3. A coupon can only be redeemed once.
    */

    const alreadyRedeemed =
      redemptions.find(
        (item) =>
          item.couponId === couponId
      );

    if (alreadyRedeemed) {
      return NextResponse.json(
        {
          success: false,
          reason: "already-redeemed",
          redemption: alreadyRedeemed,
          giftData:
            makePublicGift(storedGift),
        },
        { status: 409 }
      );
    }

    /*
      4. Lock the gift to the recipient's
      timezone on the first redemption.

      This means the daily limit is based
      on the same timezone afterwards.
    */

    let redemptionTimeZone =
      storedGift.redemptionTimeZone;

    if (
      !isValidTimeZone(
        redemptionTimeZone
      )
    ) {
      redemptionTimeZone =
        isValidTimeZone(
          requestedTimeZone
        )
          ? requestedTimeZone
          : "UTC";
    }

    const today = getDayKey(
      redemptionTimeZone
    );

    const usedToday =
      redemptions.filter(
        (item) =>
          item.dayKey === today
      ).length;

    const unlimited =
      storedGift.dailyLimit ===
      "unlimited";

    const parsedLimit = Number(
      storedGift.dailyLimit
    );

    const dailyLimit =
      Number.isFinite(parsedLimit) &&
      parsedLimit > 0
        ? parsedLimit
        : 3;

    /*
      5. Enforce daily limit on the server.
    */

    if (
      !unlimited &&
      usedToday >= dailyLimit
    ) {
      return NextResponse.json(
        {
          success: false,
          reason: "daily-limit",
          usedToday,
          dailyLimit,
          giftData:
            makePublicGift(storedGift),
        },
        { status: 409 }
      );
    }

    /*
      6. Create the redemption on the server.
    */

    const redemption = {
      couponId,
      code:
        createRedemptionCode(
          redemptions
        ),
      redeemedAt:
        new Date().toISOString(),
      dayKey: today,
    };

    const updatedGift = {
      ...storedGift,

      redemptionTimeZone,

      redemptions: [
        ...redemptions,
        redemption,
      ],
    };

    /*
      7. Save it back to the database.
    */

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/gifts?id=eq.${encodeURIComponent(
        id
      )}&gift_type=eq.love-coupons`,
      {
        method: "PATCH",

        headers: {
          apikey: secretKey,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
        },

        body: JSON.stringify({
          gift_data: updatedGift,
        }),

        cache: "no-store",
      }
    );

    if (!updateResponse.ok) {
      console.error(
        "Redemption update failed:",
        updateResponse.status
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not save redemption.",
        },
        { status: 500 }
      );
    }

    const updatedRows =
      await updateResponse.json();

    if (!updatedRows.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Gift not found.",
        },
        { status: 404 }
      );
    }

    /*
      8. Return only recipient-safe data.
    */

    return NextResponse.json({
      success: true,
      redemption,
      giftData:
        makePublicGift(updatedGift),
    });
  } catch (error) {
    console.error(
      "Coupon redemption failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not redeem coupon.",
      },
      { status: 500 }
    );
  }
}

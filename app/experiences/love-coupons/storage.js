const STORAGE_KEY = "wiveli-love-coupons-gift";

export function createLoveCouponsGift({
  senderName,
  recipientName,
  selectedCouponIds,
  customCoupons = [],
  contactType,
  contact,
  dailyLimit,
}) {
  return {
    id: `love-${Date.now()}`,

    senderName: senderName.trim(),
    recipientName: recipientName.trim(),

    couponIds: selectedCouponIds,
    customCoupons,

    notifications: {
      type: contactType,
      contact: contact.trim(),
    },

    dailyLimit:
      dailyLimit === "unlimited"
        ? "unlimited"
        : Number(dailyLimit),

    redemptions: [],

    createdAt: new Date().toISOString(),
  };
}

export function saveLoveCouponsGift(gift) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(gift)
  );
}

export function loadLoveCouponsGift() {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createRedemptionCode(existingRedemptions = []) {
  const existingCodes = new Set(
    existingRedemptions.map((item) => item.code)
  );

  let code;

  do {
    let number;

    if (
      typeof crypto !== "undefined" &&
      crypto.getRandomValues
    ) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      number = 1000 + (values[0] % 9000);
    } else {
      number = Math.floor(1000 + Math.random() * 9000);
    }

    code = `LOVE-${number}`;
  } while (existingCodes.has(code));

  return code;
}

export function redeemLoveCoupon(couponId) {
  const gift = loadLoveCouponsGift();

  if (!gift) {
    return {
      ok: false,
      reason: "gift-not-found",
    };
  }

  const redemptions = gift.redemptions || [];

  const alreadyRedeemed = redemptions.find(
    (item) => item.couponId === couponId
  );

  if (alreadyRedeemed) {
    return {
      ok: false,
      reason: "already-redeemed",
      redemption: alreadyRedeemed,
      gift,
    };
  }

  const today = getLocalDayKey();

  const usedToday = redemptions.filter(
    (item) => item.dayKey === today
  ).length;

  const limit = gift.dailyLimit;

  if (
    limit !== "unlimited" &&
    usedToday >= Number(limit)
  ) {
    return {
      ok: false,
      reason: "daily-limit",
      gift,
      usedToday,
    };
  }

  const redemption = {
    couponId,
    code: createRedemptionCode(redemptions),
    redeemedAt: new Date().toISOString(),
    dayKey: today,
  };

  const updatedGift = {
    ...gift,
    redemptions: [
      ...redemptions,
      redemption,
    ],
  };

  saveLoveCouponsGift(updatedGift);

  return {
    ok: true,
    redemption,
    gift: updatedGift,
  };
}

export function clearLoveCouponsGift() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

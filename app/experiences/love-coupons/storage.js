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

export function clearLoveCouponsGift() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

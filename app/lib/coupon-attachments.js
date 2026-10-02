export const ATTACHMENT_BUCKET = "wiveli-coupon-attachments";
export const ATTACHMENT_TYPES = {
  photo: {"image/jpeg":"jpg", "image/png":"png", "image/webp":"webp"},
  video: {"video/mp4":"mp4", "video/webm":"webm", "video/quicktime":"mov"},
  voice: {"audio/mpeg":"mp3", "audio/mp4":"m4a", "audio/wav":"wav", "audio/ogg":"ogg", "audio/webm":"webm"},
  gift: {"application/pdf":"pdf", "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp"},
};
export function attachmentSpec(kind, mimeType, size) {
  const extension = Object.hasOwn(ATTACHMENT_TYPES, kind) && Object.hasOwn(ATTACHMENT_TYPES[kind], mimeType) && ATTACHMENT_TYPES[kind][mimeType];
  const maxSize = (kind === "video" ? 50 : kind === "voice" ? 20 : 10) * 1024 * 1024;
  if (!extension || !Number.isInteger(size) || size <= 0 || size > maxSize) throw Object.assign(new Error(`Choose a supported file up to ${maxSize / 1024 / 1024} MB.`), {status: 400});
  return {extension, maxSize};
}
export function validateAttachment(attachment, kind, userId) {
  const {extension} = attachmentSpec(kind, attachment?.mimeType, attachment?.size);
  const prefix = `${userId}/${kind}/`;
  if (typeof attachment.path !== "string" || !attachment.path.startsWith(prefix) || !new RegExp(`^[a-f0-9-]{36}\\.${extension}$`).test(attachment.path.slice(prefix.length))) throw Object.assign(new Error("This attachment does not belong to your account."), {status: 400});
  return {path: attachment.path, mimeType: attachment.mimeType, size: attachment.size, name: String(attachment.name || `Attachment.${extension}`).slice(0,180)};
}
export function validateCouponAttachments(gift, userId) {
  if (!Array.isArray(gift.customCoupons)) return;
  for (const coupon of gift.customCoupons) {
    if (!coupon.attachments) continue;
    if (typeof coupon.attachments !== "object" || Array.isArray(coupon.attachments)) throw Object.assign(new Error("Invalid coupon attachments."), {status: 400});
    coupon.attachments = Object.fromEntries(Object.entries(coupon.attachments).map(([kind, attachment]) => [kind, validateAttachment(attachment, kind, userId)]));
  }
}

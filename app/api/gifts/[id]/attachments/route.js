import { attachmentStorage, storageUrl } from "../../../../lib/coupon-attachment-storage";
import { NextResponse } from "next/server";
import { database, requireGiftAccess } from "../../../../lib/gift-telegram";
import { ATTACHMENT_BUCKET, validateAttachment } from "../../../../lib/coupon-attachments";

export async function GET(request, {params}) {
  try {
    const {id} = await params;
    const {participants} = await requireGiftAccess(request, id, true);
    const owner = participants.find(p => p.role === "sender")?.user_id;
    if (!owner) return NextResponse.json({error:"Gift sender not found."}, {status:404});
    const couponId = new URL(request.url).searchParams.get("couponId");
    const [row] = await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.love-coupons&select=gift_data&limit=1`);
    const coupon = row?.gift_data?.customCoupons?.find(c => c.id === couponId || c.originalId === couponId);
    if (!coupon) return NextResponse.json({error:"Coupon not found."}, {status:404});
    const attachments = {};
    for (const [kind, file] of Object.entries(coupon.attachments || {})) {
      try {
        const valid = validateAttachment(file, kind, owner);
        const signed = await attachmentStorage(`object/sign/${ATTACHMENT_BUCKET}/${valid.path}`, {expiresIn:3600});
        attachments[kind] = {...valid, url:storageUrl(signed.signedURL)};
      } catch { attachments[kind] = {error:"Could not load this attachment. Try again."}; }
    }
    return NextResponse.json({attachments}, {headers:{"Cache-Control":"private, no-store"}});
  } catch (error) { return NextResponse.json({error:error.message || "Could not load attachments."}, {status:error.status || 500}); }
}

import { attachmentStorage, storageUrl } from "../../lib/coupon-attachment-storage";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireSession } from "../../lib/session";
import { ATTACHMENT_BUCKET, attachmentSpec } from "../../lib/coupon-attachments";

export async function POST(request) {
  try {
    const {user} = await requireSession();
    const {kind, mimeType, size, name} = await request.json();
    const {extension} = attachmentSpec(kind, mimeType, size);
    const path = `${user.id}/${kind}/${randomUUID()}.${extension}`;
    const data = await attachmentStorage(`object/upload/sign/${ATTACHMENT_BUCKET}/${path}`, {});
    return NextResponse.json({uploadUrl: storageUrl(data.url), attachment: {path, mimeType, size, name: String(name || `Attachment.${extension}`).slice(0,180)}}, {headers:{"Cache-Control":"private, no-store"}});
  } catch (error) { return NextResponse.json({error:error.message}, {status:error.status || 500}); }
}

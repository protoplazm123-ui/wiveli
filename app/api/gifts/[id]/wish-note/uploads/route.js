import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { database, requireGiftAccess } from "../../../../../lib/gift-telegram";
import { ATTACHMENT_BUCKET, attachmentSpec } from "../../../../../lib/coupon-attachments";
import { attachmentStorage, storageUrl } from "../../../../../lib/coupon-attachment-storage";
export async function POST(request,{params}) {
  try {
    const {id}=await params;await requireGiftAccess(request,id);
    const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.wish-note&select=id&limit=1`);
    if(!row)return NextResponse.json({error:'Wish Note not found.'},{status:404});
    const {kind,mimeType,size,name}=await request.json();const {extension}=attachmentSpec(kind,mimeType,size);
    const path=`wish-${id}/${kind}/${randomUUID()}.${extension}`;
    const data=await attachmentStorage(`object/upload/sign/${ATTACHMENT_BUCKET}/${path}`,{});
    return NextResponse.json({uploadUrl:storageUrl(data.url),attachment:{path,mimeType,size,name:String(name||'Memory').slice(0,180),kind}},{headers:{'Cache-Control':'private, no-store'}});
  }catch(error){return NextResponse.json({error:error.message},{status:error.status||500});}
}

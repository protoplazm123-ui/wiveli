import { NextResponse } from "next/server";
import { requireSession } from "../../../lib/session";
import { ATTACHMENT_BUCKET, validateAttachment } from "../../../lib/coupon-attachments";
import { attachmentStorage, storageUrl } from "../../../lib/coupon-attachment-storage";
export async function POST(request) {
  try {
    const {user}=await requireSession();const {files}=await request.json();
    if(!Array.isArray(files)||files.length>4)return NextResponse.json({error:'Invalid attachments.'},{status:400});
    const attachments=await Promise.all(files.map(async file=>{const valid=validateAttachment(file,file.kind,user.id);const data=await attachmentStorage(`object/sign/${ATTACHMENT_BUCKET}/${valid.path}`,{expiresIn:3600});return {...valid,kind:file.kind,url:storageUrl(data.signedURL)};}));
    return NextResponse.json({attachments},{headers:{'Cache-Control':'private, no-store'}});
  }catch(error){return NextResponse.json({error:error.message},{status:error.status||500});}
}

import { NextResponse } from "next/server";
import { database, requireGiftAccess } from "../../../../../lib/gift-telegram";
import { ATTACHMENT_BUCKET, validateAttachment } from "../../../../../lib/coupon-attachments";
import { attachmentStorage, storageUrl } from "../../../../../lib/coupon-attachment-storage";
export async function GET(request,{params}) {
  try {
    const {id}=await params;const {participants}=await requireGiftAccess(request,id,true);
    const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.wish-note&select=gift_data&limit=1`);
    if(!row)return NextResponse.json({error:'Wish Note not found.'},{status:404});
    const wishId=new URL(request.url).searchParams.get('wishId');
    const owner=wishId?`wish-${id}`:participants.find(p=>p.role==='sender')?.user_id;
    const files=wishId?(row.gift_data.wishes||[]).find(w=>w.id===wishId)?.memory?.files||[]:Object.entries(row.gift_data.attachments||{}).map(([kind,f])=>({...f,kind}));
    const attachments=await Promise.all(files.map(async file=>{
      try {const clean=validateAttachment(file,file.kind,owner);const data=await attachmentStorage(`object/sign/${ATTACHMENT_BUCKET}/${clean.path}`,{expiresIn:3600});return {...clean,kind:file.kind,url:storageUrl(data.signedURL)};}
      catch{return {name:file.name,kind:file.kind,error:'Could not load this file.'};}
    }));
    return NextResponse.json({attachments},{headers:{'Cache-Control':'private, no-store'}});
  }catch(error){return NextResponse.json({error:error.message},{status:error.status||500});}
}

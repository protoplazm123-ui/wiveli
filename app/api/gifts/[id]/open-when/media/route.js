import {NextResponse} from 'next/server';
import {database,requireGiftAccess} from '../../../../../lib/gift-telegram';
import {validateAttachment,ATTACHMENT_BUCKET} from '../../../../../lib/coupon-attachments';
import {attachmentStorage,storageUrl} from '../../../../../lib/coupon-attachment-storage';
export async function GET(request,{params}){
 try{
 const {id}=await params;const {participants}=await requireGiftAccess(request,id,true);
 const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.open-when&select=gift_data&limit=1`);
 if(!row)return NextResponse.json({error:'Gift not found.'},{status:404});
 const owner=participants.find(p=>p.role==='sender')?.user_id;const data=row.gift_data;let failed=0;
 async function sign(file,kind){if(!file)return null;try{const a=validateAttachment(file,kind,owner);const r=await attachmentStorage(`object/sign/${ATTACHMENT_BUCKET}/${a.path}`,{expiresIn:3600});return storageUrl(r.signedURL);}catch{failed++;return null;}}
 const memories=[];const stored=data.moments||[];for(let start=0;start<stored.length;start+=5){const batch=await Promise.all(stored.slice(start,start+5).map(async memory=>{const m={...memory,giftMimeType:memory.gift?.mimeType};await Promise.all(['photo','video','voice','gift'].map(async k=>{m[k]=await sign(m[k],k);}));return m;}));memories.push(...batch);}
 const background=data.theme?.customBackground;const gift={...data,moments:memories,theme:{...data.theme,backgroundMimeType:background?.mimeType,customBackground:await sign(background,background?.mimeType?.startsWith('video/')?'video':'photo')}};
 return NextResponse.json({gift,failed},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return NextResponse.json({error:e.message},{status:e.status||500});}
}

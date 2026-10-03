import {NextResponse} from 'next/server';
import {database,requireGiftAccess} from '../../../../lib/gift-telegram';
import {publicTheGift,unlockedReward,REWARD_KINDS} from '../../../../lib/the-gift';
import {validateAttachment,ATTACHMENT_BUCKET} from '../../../../lib/coupon-attachments';
import {attachmentStorage,storageUrl} from '../../../../lib/coupon-attachment-storage';
const headers={'Cache-Control':'private, no-store'};
async function loadGift(request,params) {
 const {id}=await params;
 const {participants}=await requireGiftAccess(request,id,true);
 const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.the-gift&select=gift_data&limit=1`);
 if(!row)throw Object.assign(Error('Gift not found.'),{status:404});
 return {gift:row.gift_data,owner:participants.find(p=>p.role==='sender')?.user_id};
}
export async function GET(request,{params}) {
 try {const {gift}=await loadGift(request,params);return NextResponse.json({gift:publicTheGift(gift)},{headers});}
 catch(e){return NextResponse.json({error:e.message},{status:e.status||500,headers});}
}
export async function POST(request,{params}) {
 try {
  const {gift,owner}=await loadGift(request,params);
  const {stepId,answer}=await request.json();
  const reward=unlockedReward(gift,stepId,answer);
  if(!reward)return NextResponse.json({correct:false},{headers});
  if(reward.attachment) {
   const file=validateAttachment(reward.attachment,REWARD_KINDS[reward.rewardType],owner);
   const signed=await attachmentStorage(`object/sign/${ATTACHMENT_BUCKET}/${file.path}`,{expiresIn:3600});
   reward.rewardUrl=storageUrl(signed.signedURL);reward.mimeType=file.mimeType;
  }
  delete reward.attachment;
  return NextResponse.json({correct:true,reward},{headers});
 }catch(e){return NextResponse.json({error:e.message},{status:e.status||500,headers});}
}

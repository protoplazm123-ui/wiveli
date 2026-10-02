import {NextResponse} from 'next/server';
import {database,requireGiftAccess,currentUser,connectionForUser,sendOnce} from '../../../../../lib/gift-telegram';
import {applyLetterEvent} from '../../../../../lib/open-when';
export async function POST(request,{params}){
 try{
 const {id}=await params;const {participants}=await requireGiftAccess(request,id,true);let viewer;try{viewer=await currentUser();}catch{}
 if(viewer&&participants.some(p=>p.role==='sender'&&p.user_id===viewer.id))return NextResponse.json({preview:true});
 const body=await request.json();if(typeof body.momentId!=='string'||body.momentId.length>100)return NextResponse.json({error:'Invalid letter.'},{status:400});
 for(let attempt=0;attempt<3;attempt++){
  const [row]=await database(`gifts?id=eq.${encodeURIComponent(id)}&gift_type=eq.open-when&select=gift_data&limit=1`);if(!row)return NextResponse.json({error:'Gift not found.'},{status:404});
  const result=applyLetterEvent(row.gift_data,body);
  if(result.duplicate)return NextResponse.json({success:true,openedMoments:result.gift.openedMoments,responses:result.gift.responses},{headers:{'Cache-Control':'private, no-store'}});
  const key=`${result.kind}:${id}:${body.momentId}`;
  const saved=await database('rpc/wiveli_save_letter_event',{method:'POST',body:JSON.stringify({p_gift_id:id,p_expected:row.gift_data,p_updated:result.gift,p_event_key:key,p_kind:result.kind,p_moment_id:body.momentId})});
  if(!saved.length)continue;
  let telegramSent=false;
  try{const sender=participants.find(p=>p.role==='sender'),connection=sender?.user_id?await connectionForUser(sender.user_id):null;if(connection?.telegram_chat_id){const notification=await sendOnce({key,giftId:id,userId:sender.user_id,payload:{chat_id:connection.telegram_chat_id,text:`♡ WIVELI · Open When…\n\n${result.message}`,reply_markup:{inline_keyboard:[[{text:'OPEN YOUR ACCOUNT →',url:new URL(request.url).origin+'/account'}]]}}});telegramSent=!!notification.sent;}}catch{}
  return NextResponse.json({success:true,openedMoments:result.gift.openedMoments,responses:result.gift.responses,telegramSent},{headers:{'Cache-Control':'private, no-store'}});
 }
 return NextResponse.json({error:'Your gift changed. Please try again.'},{status:409});
 }catch(e){return NextResponse.json({error:e.message||'Could not save your response.'},{status:e.status||500});}
}
